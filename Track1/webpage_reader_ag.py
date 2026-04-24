import uuid

from langchain.agents import create_agent
from langchain_ollama import ChatOllama
from langgraph.checkpoint.memory import InMemorySaver

from mcp_tool_wrappers import read_webpage
from shared.config import MODEL_NAME, OLLAMA_API_BASE

llm = ChatOllama(
    model=MODEL_NAME,
    base_url=OLLAMA_API_BASE,
    temperature=0.2,
)

webpage_reader_prompt = """
You are a webpage research reader.

Your task is to read one webpage and extract only the information needed for the research task.

Follow these steps exactly:
1. Use read_webpage with the given URL.
2. Read the webpage content.
3. Check whether the page contains information relevant to the research task.
4. If the page contains useful relevant information, return a short factual answer.
5. If the page does not contain useful relevant information, return exactly:
no results found

Rules:
- Do not invent information.
- Use only the webpage content.
- Return only the final answer.
- If the page is unreadable, irrelevant, or does not answer the task, return exactly:
no results found
"""

webpage_reader_memory = InMemorySaver()

webpage_reader_agent = create_agent(
    model=llm,
    tools=[read_webpage],
    checkpointer=webpage_reader_memory,
    system_prompt=webpage_reader_prompt,
)


def invoke_webpage_reader(message: str, thread_id: str | None = None) -> str:
    result = webpage_reader_agent.invoke(
        {
            "messages": [
                {
                    "role": "user",
                    "content": str(message).strip(),
                }
            ]
        },
        config={"configurable": {"thread_id": thread_id or f"webpage-reader-{uuid.uuid4()}"}},
    )

    return str(result["messages"][-1].content).strip()
