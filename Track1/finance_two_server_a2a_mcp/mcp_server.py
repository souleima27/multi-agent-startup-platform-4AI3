import json
from pathlib import Path

import requests
from bs4 import BeautifulSoup
from ddgs import DDGS
from mcp.server.fastmcp import FastMCP

from shared.config import KB_PATH

mcp = FastMCP("finance-tools-server")

ALLOWED_KB_SECTIONS = {
    "wage_floor_rules",
    "employer_charge_rules",
    "salary_matching_data.generic_role_family_ranges_tnd_monthly",
    "salary_matching_data.sector_ranges_tnd_monthly",
}


def load_cost_kb() -> dict:
    with open(KB_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def get_nested_section(data: dict, path: str):
    current = data
    for part in path.split("."):
        if not isinstance(current, dict) or part not in current:
            return None
        current = current[part]
    return current


@mcp.tool(
    description="""
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
""".strip()
)
def get_cost_kb_section(section_name: str) -> dict:
    if section_name not in ALLOWED_KB_SECTIONS:
        return {
            "error": "invalid section_name",
            "allowed_section_names": sorted(list(ALLOWED_KB_SECTIONS)),
        }

    try:
        cost_kb = load_cost_kb()
    except Exception as e:
        return {
            "error": f"could not load cost kb: {str(e)}"
        }

    value = get_nested_section(cost_kb, section_name)

    if value is None:
        return {
            "error": "section not found",
            "section_name": section_name,
        }

    return {
        "section_name": section_name,
        "data": value,
    }


@mcp.tool(
    description="""
Search the web using a query string.
Returns the top 2 search results with title, url, and snippet.
""".strip()
)
def search_web(query: str) -> list[dict]:
    results = []

    try:
        with DDGS() as ddgs:
            search_results = ddgs.text(query, max_results=10)

            for item in search_results:
                result = {
                    "title": item.get("title", "").strip(),
                    "url": item.get("href", "").strip(),
                    "snippet": item.get("body", "").strip(),
                }

                if result["url"] and result not in results:
                    results.append(result)

                if len(results) == 2:
                    break

    except Exception:
        return []

    return results


@mcp.tool(
    description="""
Visit a webpage URL and return the readable text content.
""".strip()
)
def read_webpage(url: str) -> str:
    try:
        headers = {"User-Agent": "Mozilla/5.0"}

        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")

        for tag in soup(["script", "style", "noscript"]):
            tag.decompose()

        text = soup.get_text(separator=" ", strip=True)
        text = " ".join(text.split())

        if not text:
            return "ERROR: empty webpage"

        return text[:10000]

    except Exception as e:
        return f"ERROR: could not read webpage: {str(e)}"


@mcp.tool(
    description="""
Calculate expected monthly revenue from price per sale and sales target per month.
""".strip()
)
def calc_expected_monthly_revenue(price_per_sale: float, sales_target_per_month: float) -> float:
    if price_per_sale < 0 or sales_target_per_month < 0:
        return -1.0
    return float(price_per_sale * sales_target_per_month)


@mcp.tool(
    description="""
Calculate how many months it takes to recover the initial budget from monthly gain.
""".strip()
)
def calc_payback_months(initial_budget_tnd: float, monthly_gain: float) -> float:
    if initial_budget_tnd < 0 or monthly_gain <= 0:
        return -1.0
    return float(initial_budget_tnd / monthly_gain)



if __name__ == "__main__":
    mcp.run(transport="streamable-http")
