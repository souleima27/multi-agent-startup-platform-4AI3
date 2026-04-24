import uuid

from langchain.agents import create_agent
from langchain_core.tools import tool
from langchain_ollama import ChatOllama
from langgraph.checkpoint.memory import InMemorySaver

from a2a_tool_wrappers import research_web
from mcp_tool_wrappers import get_cost_kb_section
from shared.config import MODEL_NAME, OLLAMA_API_BASE


llm = ChatOllama(
    model=MODEL_NAME,
    base_url=OLLAMA_API_BASE,
    temperature=0.2,
)


cost_agent_prompt = """
You are a narrow cost worker for startups.

You receive one plain text message from the manager.
That message contains:
- the cost question
- the useful startup facts for that question
- any short follow-up clarification if the manager asks again

Tools:
- get_cost_kb_section(section_name)
- research_web(task)

What you do:
- employees wages
- tools costs
- materials costs
- operations costs
- monthly cost total as the sum total of all employees wages when enough info exists
- one-time cost total as the sum total cost of all tools and materials when enough info exists

What you do NOT do:
- break-even
- pricing strategy
- runway
- final finance decision
- tax advice

Rules:
- Answer only the request in the message.
- Prefer lean, realistic cost estimates appropriate for an early-stage startup.
- Use only the information in the message and tool results.
- For salaries or employer burden, use get_cost_kb_section.
- For tools, materials, or operations, use research_web only when needed.
- Keep web research small and focused.
- If something is missing, put it in missing_info.
- If something cannot be found, put it in not_found.
- Keep provided_info compact and directly useful for the manager.
- Return JSON only.

Return only the specific fields asked for from these:
{
  "request_understood": "",
  "provided_info": {
    "employees_and_wages": {},
    "tools_materials_operations_costs": {},
    "one_time_cost_total": {},
    "monthly_cost_total": {}
  },
  "not_found": [],
  "missing_info": []
}
"""

cost_agent_memory = InMemorySaver()

cost_agent = create_agent(
    model=llm,
    tools=[get_cost_kb_section, research_web],
    checkpointer=cost_agent_memory,
    system_prompt=cost_agent_prompt,
)


def build_cost_agent_message(message: str) -> str:
    return str(message).strip()


def invoke_cost_agent(message: str, thread_id: str | None = None) -> str:
    user_message = build_cost_agent_message(message)

    result = cost_agent.invoke(
        {
            "messages": [
                {
                    "role": "user",
                    "content": user_message,
                }
            ]
        },
        config={
            "configurable": {
                "thread_id": thread_id or f"cost-agent-{uuid.uuid4()}"
            }
        },
    )

    return str(result["messages"][-1].content).strip()


@tool
def ask_cost_agent(message: str) -> str:
    """
    Ask the cost worker with one plain text message only.
    The message should contain the exact cost request and only the useful startup facts.
    """
    return invoke_cost_agent(message=message)


def debug_cost_agent(message: str, thread_id: str | None = None) -> str:
    user_message = build_cost_agent_message(message)
    final_output = ""
    llm_call_count = 0
    tool_call_count = 0

    print("\n=== COST AGENT INPUT ===")
    print(user_message)

    for chunk in cost_agent.stream(
        {
            "messages": [
                {
                    "role": "user",
                    "content": user_message,
                }
            ]
        },
        config={
            "configurable": {
                "thread_id": thread_id or f"cost-agent-debug-{uuid.uuid4()}"
            }
        },
        stream_mode="updates",
    ):
        for step_name, step_data in chunk.items():
            message_obj = step_data["messages"][-1]

            if step_name == "model":
                llm_call_count += 1
                print(f"\n=== COST AGENT LLM CALL #{llm_call_count} ===")

                content_blocks = getattr(message_obj, "content_blocks", None)
                if content_blocks:
                    print(content_blocks)
                    text_blocks = [
                        block.get("text", "").strip()
                        for block in content_blocks
                        if block.get("type") == "text" and block.get("text", "").strip()
                    ]
                    if text_blocks:
                        final_output = "\n".join(text_blocks).strip()
                else:
                    print(message_obj.content)
                    if message_obj.content and str(message_obj.content).strip():
                        final_output = str(message_obj.content).strip()

            elif step_name == "tools":
                tool_call_count += 1
                print(f"\n=== COST AGENT TOOL CALL #{tool_call_count} ===")
                tool_name = getattr(message_obj, "name", "unknown_tool")
                print(f"Tool: {tool_name}")
                print(f"Output: {message_obj.content}")

    print("\n=== COST AGENT FINAL OUTPUT ===")
    print(final_output)
    print("\n=== COST AGENT DONE ===")
    print(f"Total cost agent LLM calls: {llm_call_count}")
    print(f"Total cost agent tool calls: {tool_call_count}")

    return final_output


if __name__ == "__main__":
    sample_message = """
Estimate wages and employer burden for the technical owner and device operations roles in Tunisia.
Also estimate costs for device management and inventory tracking tools.
Startup: IoT refrigerated box startup with a simple web dashboard in Tunisia.
""".strip()

    debug_cost_agent(sample_message)
