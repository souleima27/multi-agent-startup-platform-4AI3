from langchain_core.tools import tool

from shared.mcp_client import call_tool


# finance side
@tool
def get_cost_kb_section(section_name: str) -> dict:
    """
    Get one part of the cost knowledge base.

    What each name gives you:

    - wage_floor_rules
      Gives the legal minimum salaries in Tunisia.
      Example: minimum monthly salary, minimum hourly salary, agricultural daily minimum.

    - employer_charge_rules
      Gives the extra percentages the employer pays on top of salary.
      Example: employer social contribution, work accident range, other employer-side percentages.

    - salary_matching_data.generic_role_family_ranges_tnd_monthly
      Gives monthly salary ranges by job family.
      Example: tech, sales, admin, finance, engineering.

    - salary_matching_data.sector_ranges_tnd_monthly
      Gives monthly salary ranges by business sector.
      Example: software, banking, telecom, manufacturing, tourism, healthcare.

    Use this tool when you need salary numbers or employer-side salary extra costs.
    """
    return call_tool("get_cost_kb_section", {"section_name": section_name})


@tool
def search_web(query: str) -> list[dict]:
    """
    Search the web using a query string.
    Returns the top 2 search results with title, url, and snippet.
    """
    result = call_tool("search_web", {"query": query})
    return result if isinstance(result, list) else []


@tool
def read_webpage(url: str) -> str:
    """
    Visit a webpage URL and return the readable text content.
    """
    result = call_tool("read_webpage", {"url": url})
    return str(result)


@tool
def calc_expected_monthly_revenue(price_per_sale: float, sales_target_per_month: float) -> float:
    """
    Calculate expected monthly revenue from price per sale and sales target per month.
    """
    result = call_tool(
        "calc_expected_monthly_revenue",
        {
            "price_per_sale": price_per_sale,
            "sales_target_per_month": sales_target_per_month,
        },
    )
    return float(result)


@tool
def calc_payback_months(initial_budget_tnd: float, monthly_gain: float) -> float:
    """
    Calculate how many months it takes to recover the initial budget from monthly gain.
    """
    result = call_tool(
        "calc_payback_months",
        {"initial_budget_tnd": initial_budget_tnd, "monthly_gain": monthly_gain},
    )
    return float(result)


# exist-sol side
@tool
def search_similar_companies(startup_description: str) -> list[str]:
    """Takes a startup description as input.Returns the top 2 most similar company names from the database.Use this tool when you want to check whether a startup idea already exists."""
    result = call_tool("search_similar_companies", {"startup_description": startup_description})
    return result if isinstance(result, list) else []


@tool
def finder_search_web(query: str) -> list[dict]:
    """
    Search the web using a query string.
    Returns the top search results with title, url, and snippet.
    """
    result = call_tool("finder_search_web", {"query": query})
    return result if isinstance(result, list) else []


@tool
def finder_read_webpage(url: str) -> str:
    """
    Visit a webpage URL and return the readable text content.
    """
    result = call_tool("finder_read_webpage", {"url": url})
    return str(result)


@tool
def lookup_search_web(query: str) -> list[dict]:
    """
    Search the web using a query string.
    Returns the top search results with title, url, and snippet.
    """
    result = call_tool("lookup_search_web", {"query": query})
    return result if isinstance(result, list) else []


@tool
def lookup_read_webpage(url: str) -> str:
    """
    Visit a webpage URL and return the readable text content.
    """
    result = call_tool("lookup_read_webpage", {"url": url})
    return str(result)