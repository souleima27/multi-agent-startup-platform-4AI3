from __future__ import annotations

import asyncio
import uuid

from fastapi import FastAPI
import uvicorn
from a2a.server.agent_execution import AgentExecutor, RequestContext
from a2a.server.apps import A2AStarletteApplication
from a2a.server.request_handlers import DefaultRequestHandler
from a2a.server.tasks import InMemoryTaskStore
from a2a.server.tasks.task_updater import TaskUpdater
from a2a.types import AgentCapabilities, AgentCard, AgentProvider, AgentSkill, Message, Part, Role, TextPart

from search_web_results_ag import invoke_search_web_results
from company_name_extractor_ag import invoke_extract_company_names
from company_description_short_ag import invoke_describe_company_from_url
from company_description_clear_ag import invoke_get_company_description_from_url
from search_company_ag import invoke_search_company_a2a

HOST = '127.0.0.1'
PORT = 8001
BASE_URL = f'http://{HOST}:{PORT}/a2a'


def _agent_message(text: str, task_id: str, context_id: str) -> Message:
    return Message(
        messageId=str(uuid.uuid4()),
        role=Role.agent,
        parts=[Part(root=TextPart(text=text))],
        taskId=task_id,
        contextId=context_id,
    )


class FunctionExecutor(AgentExecutor):
    def __init__(self, handler):
        self.handler = handler

    async def execute(self, context: RequestContext, event_queue) -> None:
        updater = TaskUpdater(event_queue, context.task_id, context.context_id)
        text = context.get_user_input()
        try:
            result = await asyncio.to_thread(self.handler, text)
            await updater.complete(_agent_message(result, context.task_id, context.context_id))
        except Exception as exc:
            await updater.failed(_agent_message(f'ERROR: {exc}', context.task_id, context.context_id))

    async def cancel(self, context: RequestContext, event_queue) -> None:
        updater = TaskUpdater(event_queue, context.task_id, context.context_id)
        await updater.failed(_agent_message('cancel not supported', context.task_id, context.context_id))


app = FastAPI(title='exist-sol-a2a-server')
provider = AgentProvider(organization='local', url=BASE_URL)


def mount_agent(path_name: str, skill_name: str, description: str, tags: list[str], handler) -> None:
    card = AgentCard(
        name=path_name,
        description=description,
        url=f'{BASE_URL}/{path_name}/',
        version='1.0.0',
        defaultInputModes=['text/plain'],
        defaultOutputModes=['text/plain'],
        capabilities=AgentCapabilities(streaming=False),
        skills=[
            AgentSkill(
                id=path_name,
                name=skill_name,
                description=description,
                tags=tags,
                inputModes=['text/plain'],
                outputModes=['text/plain'],
            )
        ],
        provider=provider,
    )
    handler_obj = DefaultRequestHandler(FunctionExecutor(handler), InMemoryTaskStore())
    a2a_app = A2AStarletteApplication(agent_card=card, http_handler=handler_obj)
    app.mount(f'/a2a/{path_name}', a2a_app.build())


mount_agent(
    'search_web_results_agent',
    'search_web_results',
    'Takes a startup description as input.',
    ['startup', 'companies', 'web', 'search'],
    invoke_search_web_results,
)
mount_agent(
    'extract_company_names_from_url_agent',
    'extract_company_names_from_url',
    'Takes a webpage URL and a startup description as input. Uses the webpage reader agent to extract only the company names from that page that match the startup description.',
    ['companies', 'webpage', 'extract'],
    invoke_extract_company_names,
)
mount_agent(
    'describe_company_from_url_agent',
    'describe_company_from_url',
    'Takes a company webpage URL as input. Uses the company description agent to return a short description of what the company does.',
    ['company', 'description', 'url'],
    invoke_describe_company_from_url,
)
mount_agent(
    'get_company_description_from_url_agent',
    'get_company_description_from_url',
    'Read one webpage URL and return a clear description of what the company does.',
    ['company', 'description', 'url'],
    invoke_get_company_description_from_url,
)
mount_agent(
    'search_company_agent',
    'search_company',
    'Return detailed information about a company by name.',
    ['company', 'lookup', 'search'],
    invoke_search_company_a2a,
)


if __name__ == '__main__':
    uvicorn.run(app, host=HOST, port=PORT)
