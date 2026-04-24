import json
import uuid

from langchain.agents import create_agent
from langchain_ollama import ChatOllama
from langgraph.checkpoint.memory import InMemorySaver

from tools1 import search_web, get_company_description_from_url
from shared.config import MODEL_NAME, OLLAMA_API_BASE

llm = ChatOllama(
    model=MODEL_NAME,
    base_url=OLLAMA_API_BASE,
    temperature=0.2,
)

company_lookup_prompt = """
You are a company researcher.

Your task is to find what a company does.

Follow these steps exactly:
1. Use search_web with the company name as input.
2. Look at the returned search results.
3. Choose the 3 URLs that are most likely to be official company pages or the best pages to understand the company.
4. Call get_company_description_from_url on the first chosen URL.
5. If the result is not exactly 'unknown company description', return it immediately.
6. If the result is exactly 'unknown company description', call get_company_description_from_url on the second chosen URL.
7. If the result is not exactly 'unknown company description', return it immediately.
8. If the result is exactly 'unknown company description', call get_company_description_from_url on the third chosen URL.
9. If the result is not exactly 'unknown company description', return it immediately.
10. If all 3 URLs return exactly 'unknown company description', use the search result titles and snippets to infer the clearest possible company description.
11. Return only the final description.

Rules:
- Prefer the company's official domain.
- Prefer homepage, about page, or product page.
- Avoid directories, social media pages, news articles, marketplaces, and aggregators unless no better result exists.
- Use up to 3 URLs only.
- Try the URLs one by one, not all at once.
- If all URL reads fail, you must still return the best possible description from the search snippets.
- Return only the final description.
- The description must be clear and factual of everything you learned about it
- Do not explain your reasoning.
"""

company_lookup_memory = InMemorySaver()
company_lookup_agent = create_agent(
    model=llm,
    tools=[search_web, get_company_description_from_url],
    checkpointer=company_lookup_memory,
    system_prompt=company_lookup_prompt,
)


def invoke_search_company(company_name: str, thread_id: str | None = None) -> dict:
    result = company_lookup_agent.invoke(
        {
            'messages': [
                {
                    'role': 'user',
                    'content': company_name,
                }
            ]
        },
        config={'configurable': {'thread_id': thread_id or f'company-lookup-{uuid.uuid4()}'}},
    )
    description = result['messages'][-1].content.strip()
    return {
        'found': description.lower() != 'unknown company description',
        'company_name': company_name,
        'description': description,
    }


def invoke_search_company_a2a(message: str, thread_id: str | None = None) -> str:
    result = invoke_search_company(str(message).strip(), thread_id=thread_id)
    return json.dumps(result, ensure_ascii=False)
