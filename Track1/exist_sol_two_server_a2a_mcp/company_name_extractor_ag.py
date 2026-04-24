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

webpage_reader_prompt = """
You are a company name extractor.

Your task is to extract a small number of the most plausible company names from a webpage.

Follow these rules:
1. Use read_webpage with the given URL
2. If the page is a company website, return that company name if it looks relevant.
3. If the page is a list, article, comparison, or directory page, containing many companies, return only up to 5 company names that seem most likely to match the startup description.
4. If no plausible company names are found or if the webpage is irrelevant to companies or to the description, return [].
5. Return only a Python list of company names.

Rules:
- Do not invent names.
- Return at most 5 names.
- Return [] if nothing looks relevant.
"""

webpage_reader_memory = InMemorySaver()
webpage_reader_agent = create_agent(
    model=llm,
    tools=[read_webpage],
    checkpointer=webpage_reader_memory,
    system_prompt=webpage_reader_prompt,
)


def invoke_extract_company_names(message: str, thread_id: str | None = None) -> str:
    result = webpage_reader_agent.invoke(
        {
            'messages': [
                {
                    'role': 'user',
                    'content': str(message).strip(),
                }
            ]
        },
        config={'configurable': {'thread_id': thread_id or f'webpage-reader-{uuid.uuid4()}'}},
    )
    return str(result['messages'][-1].content).strip()
