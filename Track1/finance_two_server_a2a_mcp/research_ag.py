import uuid

from langchain.agents import create_agent
from langchain_core.tools import tool
from langchain_ollama import ChatOllama
from langgraph.checkpoint.memory import InMemorySaver

from a2a_tool_wrappers import read_webpage_for_task
from mcp_tool_wrappers import search_web
from shared.config import MODEL_NAME, OLLAMA_API_BASE


llm = ChatOllama(
    model=MODEL_NAME,
    base_url=OLLAMA_API_BASE,
    temperature=0.2,
)


research_prompt = """
You are a web research agent.

Your task is to do a very small web research process for the user's task.

Follow these steps exactly one step at a time:
1. Generate exactly 2 short search queries for the research task.
2. Use search_web on the first query.
3. Use search_web on the second query.
4. Collect the returned results.
5. Keep only up to 4 results total:
   - top 2 from the first query
   - top 2 from the second query
6. Look at the 4 results using their title, url, and snippet.
7. Choose the single best result that looks most relevant to the task.
8. If none of the 4 results looks good or relevant enough, return exactly:
no results found
9. Use read_webpage_for_task with the chosen url and the full task.
10. If the webpage reader returns exactly:
no results found
you may try one backup result only if another result clearly looks useful.
11. If no inspected result gives a useful answer, return exactly:
no results found
12. Otherwise return only the final factual answer.

Rules:
- Do all steps in order.
- Use one tool at a time.
- Do not invent facts.
- Do not invent search results.
- Do not choose more than one final result unless the first chosen result fails.
- If results are weak, irrelevant, or unclear, return exactly:
no results found
- Return only the final answer.
- Either return the results found or the answer , or no results found, not both.
"""

research_memory = InMemorySaver()

research_agent = create_agent(
    model=llm,
    tools=[search_web, read_webpage_for_task],
    checkpointer=research_memory,
    system_prompt=research_prompt,
)


@tool
def research_web(task: str) -> str:
    """
    Do small web research according to the given task.
    Return a short factual answer or exactly: no results found
    """
    result = research_agent.invoke(
        {
            "messages": [
                {
                    "role": "user",
                    "content": task
                }
            ]
        },
        config={"configurable": {"thread_id": f"cost-research-{uuid.uuid4()}"}}
    )

    return result["messages"][-1].content.strip()


def invoke_research_agent(task: str, thread_id: str | None = None) -> str:
    result = research_agent.invoke(
        {"messages": [{"role": "user", "content": task}]},
        config={"configurable": {"thread_id": thread_id or f"research-agent-{uuid.uuid4()}"}},
    )
    return str(result["messages"][-1].content).strip()


if __name__ == "__main__":
    research_task = """
Find the monthly price of a basic project management tool.
"""

    llm_call_count = 0
    tool_call_count = 0
    final_output = None

    for chunk in research_agent.stream(
        {
            "messages": [
                {
                    "role": "user",
                    "content": research_task
                }
            ]
        },
        config={
            "configurable": {
                "thread_id": "web-research-test-1"
            }
        },
        stream_mode="updates",
    ):
        for step_name, step_data in chunk.items():
            message = step_data["messages"][-1]

            if step_name == "model":
                llm_call_count += 1
                print(f"\n=== LLM CALL #{llm_call_count} ===")

                content_blocks = getattr(message, "content_blocks", None)
                if content_blocks:
                    print(content_blocks)
                    for block in content_blocks:
                        if block.get("type") == "text":
                            final_output = block.get("text")
                else:
                    print(message.content)
                    final_output = message.content

            elif step_name == "tools":
                tool_call_count += 1
                print(f"\n=== TOOL CALL #{tool_call_count} ===")

                tool_name = getattr(message, "name", "unknown_tool")
                print(f"Tool: {tool_name}")
                print(f"Output: {message.content}")

    print("\n=== FINAL OUTPUT ===")
    print(final_output)

    print("\n=== DONE ===")
    print(f"Total LLM calls: {llm_call_count}")
    print(f"Total tool calls: {tool_call_count}")
