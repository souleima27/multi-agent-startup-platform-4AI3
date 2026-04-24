from __future__ import annotations

import uuid

from fastapi import FastAPI
import uvicorn
from a2a.server.agent_execution import AgentExecutor, RequestContext
from a2a.server.apps import A2AStarletteApplication
from a2a.server.request_handlers import DefaultRequestHandler
from a2a.server.tasks import InMemoryTaskStore
from a2a.server.tasks.task_updater import TaskUpdater
from a2a.types import AgentCapabilities, AgentCard, AgentProvider, AgentSkill, Message, Part, Role, TextPart
import asyncio
from cost_ag import invoke_cost_agent
from revenue_ag import invoke_revenue_agent
from research_ag import invoke_research_agent
from webpage_reader_ag import invoke_webpage_reader

HOST = "127.0.0.1"
PORT = 8001
BASE_URL = f"http://{HOST}:{PORT}/a2a"


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
            await updater.failed(_agent_message(f"ERROR: {exc}", context.task_id, context.context_id))

    async def cancel(self, context: RequestContext, event_queue) -> None:
        updater = TaskUpdater(event_queue, context.task_id, context.context_id)
        await updater.failed(_agent_message("cancel not supported", context.task_id, context.context_id))


app = FastAPI(title="finance-a2a-server")
provider = AgentProvider(organization="local", url=BASE_URL)


def mount_agent(path_name: str, description: str, tags: list[str], handler) -> None:
    card = AgentCard(
        name=path_name,
        description=description,
        url=f"{BASE_URL}/{path_name}/",
        version="1.0.0",
        defaultInputModes=["text/plain"],
        defaultOutputModes=["text/plain"],
        capabilities=AgentCapabilities(streaming=False),
        skills=[
            AgentSkill(
                id=path_name,
                name=path_name,
                description=description,
                tags=tags,
                inputModes=["text/plain"],
                outputModes=["text/plain"],
            )
        ],
        provider=provider,
    )
    handler_obj = DefaultRequestHandler(FunctionExecutor(handler), InMemoryTaskStore())
    a2a_app = A2AStarletteApplication(agent_card=card, http_handler=handler_obj)
    app.mount(f"/a2a/{path_name}", a2a_app.build())


mount_agent(
    "cost_agent",
    "Narrow cost worker for startup cost questions.",
    ["cost", "wages", "materials"],
    invoke_cost_agent,
)
mount_agent(
    "revenue_agent",
    "Narrow revenue worker for pricing, revenue, and payback questions.",
    ["revenue", "pricing", "payback"],
    invoke_revenue_agent,
)
mount_agent(
    "research_agent",
    "Small web research worker for focused factual lookup.",
    ["research", "web"],
    invoke_research_agent,
)
mount_agent(
    "webpage_reader_agent",
    "Reads one webpage and extracts only the information needed for a research task.",
    ["webpage", "reader"],
    invoke_webpage_reader,
)


if __name__ == "__main__":
    uvicorn.run(app, host=HOST, port=PORT)
