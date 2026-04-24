import json
import uuid
from pathlib import Path

from langchain.agents import create_agent
from langchain_ollama import ChatOllama
from langgraph.checkpoint.memory import InMemorySaver

from a2a_tool_wrappers import ask_cost_agent, ask_revenue_agent, research_web
from shared.config import MODEL_NAME, OLLAMA_API_BASE


llm = ChatOllama(
    model=MODEL_NAME,
    base_url=OLLAMA_API_BASE,
    temperature=0.2,
)

BASE_DIR = Path(__file__).resolve().parent
PROJECT_DIR = BASE_DIR.parent


def load_json_file(filename: str) -> dict:
    candidates = [
        BASE_DIR / filename,
        PROJECT_DIR / filename,
        Path(filename),
    ]

    for path in candidates:
        if path.exists():
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)

    raise FileNotFoundError(
        f"Could not find {filename}. Tried: " + ", ".join(str(p) for p in candidates)
    )


def build_ops_output_subset(ops_output: dict) -> dict:
    return {
        "minimum_roles_responsibilities": ops_output.get("minimum_roles_responsibilities", []),
        "materials_equipment": ops_output.get("materials_equipment", []),
        "tools_stack": ops_output.get("tools_stack", []),
    }


def build_manager_message(user_input: dict, ops_output: dict) -> str:
    ops_subset = build_ops_output_subset(ops_output)
    return (
        "Startup plan input:\n"
        f"{json.dumps(user_input, ensure_ascii=False, indent=2)}\n\n"
        "Operations info needed for finance work:\n"
        f"{json.dumps(ops_subset, ensure_ascii=False, indent=2)}"
    )


manager_prompt = """
You are the finance manager agent.

You receive a startup plan and a small operations summary.
Your job is to fill this finance output:
- employees_and_wages
- tools_materials_ops_costs
- monthly_costs
- one_time_costs
- suggested_price
- price_realism
- expected_monthly_revenue
- payback_months

Workers:
- ask_cost_agent(message): use for employees wages, tools and materials costs, monthly_cost_total, one_time_cost_total
- ask_revenue_agent(message): use for expected_monthly_revenue, payback_months, and checking if price_per_sale is realistic as price_realism, and suggesting a price range
- research_web(task): use only for one small public fact when needed, ask for one thing at a time.

How to use workers:
- decide which field is missing
- decide which worker can help
- Use only one worker at a time
- send one short plain text message only
- in that message, include only the useful startup facts for that request
- ask_revenue_agent needs price_per_sale, sales_target_per_month, gain_on_sale_pct, initial_budget_tnd, and an idea of what the product is
- if one field is still missing, you may ask again for that field specifically from the workers
- if a worker tells you there is missing info try to provide it for him if it is available and retry asking him again
- you have to get payback_months, expected_monthly_revenue and price_realism from ask_revenue_agent and not guess them yourself
- you have to use ask_cost_agent and ask_revenue_agent at least once, research_web is optional.
- do not ask more than 3 times if it keeps failing
- do not send dicts or JSON as tool arguments
- do not invent or estimate results on your own that you didn't get from workers
- merge results into the final output
- return JSON only

Return exactly:
{
  "employees_and_wages": {},
  "tools_materials_ops_costs": {},
  "monthly_costs": {},
  "one_time_costs": {},
  "suggested_price": {},
  "price_realism": {},
  "expected_monthly_revenue": {},
  "payback_months": {}
}
"""

manager_memory = InMemorySaver()

manager_agent = create_agent(
    model=llm,
    tools=[ask_cost_agent, ask_revenue_agent, research_web],
    checkpointer=manager_memory,
    system_prompt=manager_prompt,
)


def invoke_manager(user_input: dict, ops_output: dict, thread_id: str | None = None) -> str:
    user_message = build_manager_message(user_input, ops_output)

    result = manager_agent.invoke(
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
                "thread_id": thread_id or f"manager-agent-{uuid.uuid4()}"
            }
        },
    )

    return str(result["messages"][-1].content).strip()


def invoke_manager_debug(user_input: dict, ops_output: dict, thread_id: str | None = None) -> str:
    user_message = build_manager_message(user_input, ops_output)
    final_output = ""
    llm_call_count = 0
    tool_call_count = 0

    print("\n=== MANAGER INPUT MESSAGE ===")
    print(user_message)

    for chunk in manager_agent.stream(
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
                "thread_id": thread_id or f"manager-agent-debug-{uuid.uuid4()}"
            }
        },
        stream_mode="updates",
    ):
        for step_name, step_data in chunk.items():
            message = step_data["messages"][-1]

            if step_name == "model":
                llm_call_count += 1
                print(f"\n=== MANAGER LLM CALL #{llm_call_count} ===")

                content_blocks = getattr(message, "content_blocks", None)
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
                    print(message.content)
                    if message.content and str(message.content).strip():
                        final_output = str(message.content).strip()

            elif step_name == "tools":
                tool_call_count += 1
                print(f"\n=== MANAGER TOOL CALL #{tool_call_count} ===")
                tool_name = getattr(message, "name", "unknown_tool")
                print(f"Tool: {tool_name}")
                print(f"Output: {message.content}")

    print("\n=== MANAGER FINAL RAW OUTPUT ===")
    print(final_output)
    print("\n=== MANAGER DONE ===")
    print(f"Total manager LLM calls: {llm_call_count}")
    print(f"Total manager tool calls: {tool_call_count}")

    return final_output


if __name__ == "__main__":
    example_user_input = {
        "idea_description": "Smart refrigerated IoT box for same-day transport of perishable goods in Tunisia with a basic dashboard.",
        "problem": "Small food transport operations need better temperature safety during same-day delivery.",
        "target_customer": {
            "type": "B2B",
            "location": "Tunisia (city/region)",
            "notes": "Coastal cities first"
        },
        "industry": "logistics",
        "product_type": "service+software",
        "how_it_works_one_sentence": "A refrigerated connected box sends temperature alerts and is managed from a basic web dashboard.",
        "business_model": {
            "revenue_model": "subscription",
            "who_pays": "business",
            "when_paid": "recurring"
        },
        "price_per_sale": "350 TND per customer per month",
        "sales_target_per_month": 20,
        "gain_on_sale_pct": 40,
        "months": "6",
        "team": {
            "members": [
                {"role": "founder", "skills": "operations and sales"}
            ],
            
        },
        "initial_budget_tnd": 30000
    }

    ops_output = load_json_file("ops_output.json")

    final_text = invoke_manager_debug(example_user_input, ops_output)

    print("\n=== MANAGER RETURNED TEXT ===")
    print(final_text)
