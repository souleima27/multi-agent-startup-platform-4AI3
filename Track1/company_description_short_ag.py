import uuid

from langchain.agents import create_agent
from langchain_ollama import ChatOllama
from langgraph.checkpoint.memory import InMemorySaver

from tools import read_webpage
from shared.config import MODEL_NAME, OLLAMA_API_BASE

llm = ChatOllama(
    model=MODEL_NAME,
    base_url=OLLAMA_API_BASE,
    temperature=0.2,
)

company_description_prompt = """
You are a company description extractor.

Your task is to read a company webpage and return a description of what the company does.

Follow these rules:
1. Use read_webpage with the given URL.
2. Read the webpage content.
3. Identify what the company does, who it serves, and what kind of product or service it offers.
4. Return a short, useful description.

Rules:
- Do not invent information.
- Use only the webpage content.
- Return a short description only.
- If the page is not clearly a company page, return: unknown company description
"""

company_description_memory = InMemorySaver()
company_description_agent = create_agent(
    model=llm,
    tools=[read_webpage],
    checkpointer=company_description_memory,
    system_prompt=company_description_prompt,
)


def invoke_describe_company_from_url(message: str, thread_id: str | None = None) -> str:
    result = company_description_agent.invoke(
        {
            'messages': [
                {
                    'role': 'user',
                    'content': str(message).strip(),
                }
            ]
        },
        config={'configurable': {'thread_id': thread_id or f'company-description-{uuid.uuid4()}'}},
    )
    return str(result['messages'][-1].content).strip()
