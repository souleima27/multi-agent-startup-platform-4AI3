from langchain_core.tools import tool

from shared.mcp_client import call_tool


@tool
def search_web(query: str) -> list[dict]:
    """
    Search the web using a query string.
    Returns the top search results with title, url, and snippet.
    """
    result = call_tool('lookup_search_web', {'query': query})
    return result if isinstance(result, list) else []


@tool
def read_webpage(url: str) -> str:
    """
    Visit a webpage URL and return the readable text content.
    """
    result = call_tool('lookup_read_webpage', {'url': url})
    return str(result)
