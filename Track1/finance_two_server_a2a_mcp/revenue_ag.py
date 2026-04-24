import uuid

from langchain.agents import create_agent
from langchain_core.tools import tool
from langchain_ollama import ChatOllama
from langgraph.checkpoint.memory import InMemorySaver

from a2a_tool_wrappers import research_web
from mcp_tool_wrappers import (
    calc_expected_monthly_revenue,
    calc_payback_months,
)
from shared.config import MODEL_NAME, OLLAMA_API_BASE


llm = ChatOllama(
    model=MODEL_NAME,
    base_url=OLLAMA_API_BASE,
    temperature=0.2,
)


revenue_agent_prompt = """
You are a narrow revenue worker.

You receive one plain text message from the manager.
That message contains:
- the request
- the useful business inputs for that request
- any short follow-up clarification if the manager asks again

Tools:
- research_web(task)
- calc_expected_monthly_revenue(price_per_sale, sales_target_per_month)
- calc_payback_months(initial_budget_tnd, monthly_gain)

What you do:
- calculate expected monthly revenue
- calculate payback months
- use research_web to check for what the product or similar products price_per_sale is
- check if the price_per_sale is realistic compared to the results of research_web
- suggest a price range if research_web gives enough information

Rules:
- Answer only the request in the message.
- Use only numbers actually present in the message or returned by tools.
- Do not invent numeric inputs.
- Use math tools for calculations.
- If you need monthly gain, calculate expected monthly revenue first, then use gain_on_sale_pct from the message to derive monthly gain before calling calc_payback_months.
- Use research_web only to check whether price_per_sale looks realistic and to suggest a price range.
- Use research_web by giving him a short precise task of what you want him to search for
- If web search is weak or unclear, say price_realism is unclear and leave suggested_price_range empty.
- Do not do break-even, budget adequacy, timeline, or broad strategy.
- If something is missing, put it in missing_info.
- If something cannot be found, put it in not_found.
- Keep provided_info compact and directly useful for the manager.
- Return JSON only.

Return exactly:
{
  "request_understood": "",
  "provided_info": {
    "expected_monthly_revenue": 0,
    "payback_months": 0,
    "price_realism": "",
    "suggested_price_range": {}
  },
  "not_found": [],
  "missing_info": []
}
"""

revenue_agent_memory = InMemorySaver()

revenue_agent = create_agent(
    model=llm,
    tools=[
        research_web,
        calc_expected_monthly_revenue,
        calc_payback_months,
    ],
    checkpointer=revenue_agent_memory,
    system_prompt=revenue_agent_prompt,
)


def build_revenue_agent_message(message: str) -> str:
    return str(message).strip()


def invoke_revenue_agent(message: str, thread_id: str | None = None) -> str:
    user_message = build_revenue_agent_message(message)

    result = revenue_agent.invoke(
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
                "thread_id": thread_id or f"revenue-agent-{uuid.uuid4()}"
            }
        },
    )

    return str(result["messages"][-1].content).strip()


@tool
def ask_revenue_agent(message: str) -> str:
    """
    Ask the revenue worker with one plain text message only.
    The message should contain the exact revenue request and only the useful business facts.
    """
    return invoke_revenue_agent(message=message)


def debug_revenue_agent(message: str, thread_id: str | None = None) -> str:
    user_message = build_revenue_agent_message(message)
    final_output = ""
    llm_call_count = 0
    tool_call_count = 0

    print("\n=== REVENUE AGENT INPUT ===")
    print(user_message)

    for chunk in revenue_agent.stream(
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
                "thread_id": thread_id or f"revenue-agent-debug-{uuid.uuid4()}"
            }
        },
        stream_mode="updates",
    ):
        for step_name, step_data in chunk.items():
            message_obj = step_data["messages"][-1]

            if step_name == "model":
                llm_call_count += 1
                print(f"\n=== REVENUE AGENT LLM CALL #{llm_call_count} ===")

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
                print(f"\n=== REVENUE AGENT TOOL CALL #{tool_call_count} ===")
                tool_name = getattr(message_obj, "name", "unknown_tool")
                print(f"Tool: {tool_name}")
                print(f"Output: {message_obj.content}")

    print("\n=== REVENUE AGENT FINAL OUTPUT ===")
    print(final_output)
    print("\n=== REVENUE AGENT DONE ===")
    print(f"Total revenue agent LLM calls: {llm_call_count}")
    print(f"Total revenue agent tool calls: {tool_call_count}")

    return final_output


if __name__ == "__main__":
    sample_message = """
Check whether this price looks realistic and calculate expected monthly revenue and payback months.
Known inputs: price_per_sale 350, sales_target_per_month 20, gain_on_sale_pct 40, initial_budget_tnd 30000.
""".strip()

    debug_revenue_agent(sample_message)
