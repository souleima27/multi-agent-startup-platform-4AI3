import json

import psycopg2
import requests
from bs4 import BeautifulSoup
from ddgs import DDGS
from mcp.server.fastmcp import FastMCP

from shared.config import DB_CONFIG, EMBED_MODEL, OLLAMA_EMBED_URL

mcp = FastMCP('exist-sol-tools-server')


def embed_text(text: str) -> list[float]:
    response = requests.post(
        OLLAMA_EMBED_URL,
        json={
            'model': EMBED_MODEL,
            'input': text,
        },
        timeout=120,
    )
    response.raise_for_status()
    data = response.json()
    return data['embeddings'][0]


def vector_literal(vec: list[float]) -> str:
    return '[' + ','.join(str(x) for x in vec) + ']'


@mcp.tool(description='Takes a startup description as input.Returns the top 2 most similar company names from the database.Use this tool when you want to check whether a startup idea already exists.')
def search_similar_companies(startup_description: str) -> list[str]:
    query_vector = embed_text(startup_description)

    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()

    cur.execute(
        """
        SELECT name
        FROM companies
        WHERE embedding IS NOT NULL
        ORDER BY embedding <=> %s::vector
        LIMIT 2;
        """,
        (vector_literal(query_vector),),
    )

    rows = cur.fetchall()

    cur.close()
    conn.close()

    return [row[0] for row in rows]


@mcp.tool(description='Search the web using a query string. Returns the top search results with title, url, and snippet.')
def finder_search_web(query: str) -> list[dict]:
    results = []

    for _ in range(3):
        run_results = []

        with DDGS() as ddgs:
            search_results = ddgs.text(query, max_results=10)

            for item in search_results:
                result = {
                    'title': item.get('title', '').strip(),
                    'url': item.get('href', '').strip(),
                    'snippet': item.get('body', '').strip(),
                }

                if result['url'] and result not in run_results:
                    run_results.append(result)

                if len(run_results) == 2:
                    break

        for result in run_results:
            if result['url'] and result not in results:
                results.append(result)

            if len(results) == 5:
                return results

    return results


@mcp.tool(description='Visit a webpage URL and return the readable text content.')
def finder_read_webpage(url: str) -> str:
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}

        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')

        for tag in soup(['script', 'style', 'noscript']):
            tag.decompose()

        text = soup.get_text(separator=' ', strip=True)
        text = ' '.join(text.split())

        return text[:8000]

    except Exception as e:
        return f'ERROR: could not read webpage: {str(e)}'


@mcp.tool(description='Search the web using a query string. Returns the top search results with title, url, and snippet.')
def lookup_search_web(query: str) -> list[dict]:
    results = []

    with DDGS() as ddgs:
        search_results = ddgs.text(query, max_results=10)

        for item in search_results:
            result = {
                'title': item.get('title', '').strip(),
                'url': item.get('href', '').strip(),
                'snippet': item.get('body', '').strip(),
            }

            if result['url'] and result not in results:
                results.append(result)

            if len(results) == 6:
                break

    return results


@mcp.tool(description='Visit a webpage URL and return the readable text content.')
def lookup_read_webpage(url: str) -> str:
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}

        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')

        for tag in soup(['script', 'style', 'noscript']):
            tag.decompose()

        text = soup.get_text(separator=' ', strip=True)
        text = ' '.join(text.split())

        return text[:10000]

    except Exception as e:
        return f'ERROR: could not read webpage: {str(e)}'


if __name__ == '__main__':
    mcp.run(transport='streamable-http')
