import json

from langchain_core.tools import tool

from shared.a2a_client import send_text


@tool
def search_web_results(startup_description: str) -> str:
    """
    Takes a startup description as input.
    """
    return send_text('search_web_results_agent', startup_description)


@tool
def extract_company_names_from_url(url: str, startup_description: str) -> str:
    """
    Takes a webpage URL and a startup description as input.
    Uses the webpage reader agent to extract only the company names from that page
    that match the startup description.
    """
    payload = f"""
Startup description:
{startup_description}

Webpage URL:
{url}

Extract only the company names from this webpage that match the startup description.
If none match, return an empty list.
"""
    return send_text('extract_company_names_from_url_agent', payload.strip())


@tool
def describe_company_from_url(url: str) -> str:
    """
    Takes a company webpage URL as input.
    Uses the company description agent to return a short description
    of what the company does.
    """
    payload = f"""
Webpage URL:
{url}

Read this page and return a short description of what the company does.
If it is not clearly a company page, return: unknown company description
"""
    return send_text('describe_company_from_url_agent', payload.strip())


@tool
def get_company_description_from_url(url: str) -> str:
    """
    Read one webpage URL and return a clear description of what the company does.
    """
    return send_text('get_company_description_from_url_agent', url)


@tool
def search_company(company_name: str) -> dict:
    """
    Return detailed information about a company by name.
    """
    text = send_text('search_company_agent', company_name)
    try:
        parsed = json.loads(text)
        if isinstance(parsed, dict):
            return parsed
    except Exception:
        pass
    return {
        'found': False,
        'company_name': company_name,
        'description': text,
    }
