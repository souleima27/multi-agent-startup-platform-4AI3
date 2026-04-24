import uuid

from langchain.agents import create_agent
from langchain_ollama import ChatOllama
from langgraph.checkpoint.memory import InMemorySaver

from tools import search_web, extract_company_names_from_url, describe_company_from_url
from shared.config import MODEL_NAME, OLLAMA_API_BASE

llm = ChatOllama(
    model=MODEL_NAME,
    base_url=OLLAMA_API_BASE,
    temperature=0.2,
)

system_prompt = """
You are a companies finder.

Your task is to search the web for companies that may do the same thing as the startup description given by the user.

Follow these steps exactly one step at a time:
1. Use search_web once with a very short one phrase specific query based on the startup description.
2. Look at the returned search results and URLs.
3. For each result URL, use extract_company_names_from_url to get company names from that webpage.
4. Collect the company names found and remove duplicates.
5. For each company name, use search_web again with that company name to find its most likely main page or official page.
6. Choose the best result for each company.
7. Use describe_company_from_url on that chosen URL to get a short description of what the company does.
8. Compare each company description to the startup description.
9. Keep only the company names that actually match the startup description at least slightly.
10. Return the list of matching company names.

Rules:
- Do the steps in order.
- Do not go back to previous steps.
- Do not repeat steps.
- Do not invent company names or information.
- Use search_web first.
- Use extract_company_names_from_url on the returned URLs.
- Use describe_company_from_url only after choosing one best URL for a company.
- Return only company names that match the description slightly.
- Use one tool at a time
Output format:
- Return ONLY the list of company names.
- Do NOT include explanations, reasoning, notes, introductions, conclusions, or numbering.
- If really no matching companies are found, return an empty list
"""

memory_web = InMemorySaver()
agent = create_agent(
    model=llm,
    tools=[search_web, extract_company_names_from_url, describe_company_from_url],
    checkpointer=memory_web,
    system_prompt=system_prompt,
)


def invoke_search_web_results(message: str, thread_id: str | None = None) -> str:
    final_output = None
    for chunk in agent.stream(
        {
            'messages': [
                {
                    'role': 'user',
                    'content': str(message).strip(),
                }
            ]
        },
        config={'configurable': {'thread_id': thread_id or f'web-search-agent-{uuid.uuid4()}'}},
        stream_mode='updates',
    ):
        for step_name, step_data in chunk.items():
            message_obj = step_data['messages'][-1]
            if step_name == 'model':
                content_blocks = getattr(message_obj, 'content_blocks', None)
                if content_blocks:
                    for block in content_blocks:
                        if block.get('type') == 'text':
                            final_output = block.get('text')
                else:
                    final_output = message_obj.content
    return str(final_output).strip() if final_output is not None else ''
