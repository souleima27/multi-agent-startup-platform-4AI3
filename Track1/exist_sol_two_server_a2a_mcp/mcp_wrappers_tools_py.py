from langchain_core.tools import tool

from shared.mcp_client import call_tool


@tool
def search_similar_companies(startup_description: str) -> list[str]:
    """Takes a startup description as input.Returns the top 3 most similar company names from the database.Use this tool when you want to check whether a startup idea already exists."""
    result = call_tool('search_similar_companies', {'startup_description': startup_description})
    return result if isinstance(result, list) else []


@tool
def search_web(query: str) -> list[dict]:
    """
    Search the web using a query string.
    Returns the top search results with title, url, and snippet.
    """
    result = call_tool('finder_search_web', {'query': query})
    return result if isinstance(result, list) else []


@tool
def read_webpage(url: str) -> str:
    """
    Visit a webpage URL and return the readable text content.
    """
    result = call_tool('finder_read_webpage', {'url': url})
    return str(result)
