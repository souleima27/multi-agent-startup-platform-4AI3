from langchain_core.tools import tool

from shared.a2a_client import send_text


@tool
def ask_cost_agent(message: str) -> str:
    """
    Ask the cost worker with one plain text message only.
    The message should contain the exact cost request and only the useful startup facts.
    """
    return send_text("cost_agent", message)


@tool
def ask_revenue_agent(message: str) -> str:
    """
    Ask the revenue worker with one plain text message only.
    The message should contain the exact revenue request and only the useful business facts.
    """
    return send_text("revenue_agent", message)


@tool
def research_web(task: str) -> str:
    """
    Do small web research according to the given task.
    Return a short factual answer or exactly: no results found
    """
    return send_text("research_agent", task)


@tool
def read_webpage_for_task(url: str, task: str) -> str:
    """
    Read one webpage URL for one research task.
    Return a short factual answer if relevant info is found.
    Otherwise return exactly: no results found
    """
    payload = f"""
Research task:
{task}

Webpage URL:
{url}

Extract only the information needed for the research task.
If the page does not clearly contain the answer, return exactly:
no results found
"""
    return send_text("webpage_reader_agent", payload.strip())
