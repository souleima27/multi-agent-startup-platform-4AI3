import json
from pathlib import Path

from langchain_ollama import ChatOllama
from langchain.agents import create_agent
from langgraph.checkpoint.memory import InMemorySaver


llm = ChatOllama(
    model="qwen2.5:7b",
    temperature=0.2,
)


OPS_NEEDS_PATH = Path(__file__).parent / "knowledge" / "ops_needs.json"


startup_input = {
  "idea_description": "A B2B software platform that helps Tunisian pharmacies predict stockout risk for fast-moving medicines and automatically generate reorder suggestions before shelves go empty.",
  "problem": "Many pharmacies still track demand manually and react too late, causing stockouts, lost sales, and urgent supplier calls.",
  "target_customer": {
    "type": "B2B",
    "location": "Tunisia (city/region)",
    "notes": "Independent pharmacies and small pharmacy groups in Tunis that reorder inventory several times per week."
  },
  "product_type": "software tool / SaaS",
  "business_model": {
    "revenue_model": "subscription",
    "who_pays": "business",
    "when_paid": "recurring"
  },
  "team": {
    "members": [
      {
        "role": "founder",
        "skills": "operations, pharmacy partnerships, sales"
      },
      {
        "role": "technical cofounder",
        "skills": "full-stack development, product engineering, data workflows"
      }
    ]
  }
}


def load_ops_needs(product_type: str) -> dict:
    with open(OPS_NEEDS_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    for item in data:
        if item.get("product_type") == product_type:
            return item

    raise ValueError(f"No ops needs found for product_type: {product_type}")


system_prompt = """
You are an ops and needs builder.

Your job is to define what the business needs in order to operate.

Use the ops needs record as the base structure.
Adapt it to the startup idea, problem, target customer, business model, and team.
Do not restate the ops record.
Keep the result practical, lean, and usable.

Rules:
- Keep product_type exactly as given.
- Keep product_type_description exactly as given.
- If a detail is missing, keep it generic.
- Do not invent specific vendors, prices, headcount numbers, policies, or operating rules unless they are clearly supported by the startup input.
- minimum_roles_responsibilities should describe the minimum roles needed to operate this startup well.
- operational_needs should describe recurring business needs like onboarding, support, fulfillment, coordination, communication, or daily monitoring.
- materials_equipment should describe what is physically needed to operate, if anything.
- physical_presence_needs should describe whether the startup needs a physical site, storage, field presence, or can operate remotely.
- tools_stack should describe the minimum tools or systems needed.
- Return raw JSON only.
- Do not use markdown fences.
"""


memory = InMemorySaver()

agent = create_agent(
    model=llm,
    tools=[],
    checkpointer=memory,
    system_prompt=system_prompt,
)


def extract_text_from_message(message) -> str:
    content_blocks = getattr(message, "content_blocks", None)
    if content_blocks:
        texts = []
        for block in content_blocks:
            if block.get("type") == "text":
                texts.append(block.get("text", ""))
        return "\n".join(texts).strip()

    return str(message.content).strip()


def build_agent_input(startup_input: dict) -> dict:
    ops_needs = load_ops_needs(startup_input["product_type"])

    return {
        "idea_description": startup_input["idea_description"],
        "problem": startup_input["problem"],
        "target_customer": startup_input["target_customer"],
        "product_type": startup_input["product_type"],
        "product_type_description": ops_needs.get("product_type_description", ""),
        "business_model": startup_input["business_model"],
        "team": startup_input["team"],
        "ops_needs": {
            "minimum_team_roles": ops_needs.get("minimum_team_roles", []),
            "minimum_tools": ops_needs.get("minimum_tools", []),
            "minimum_physical_materials": ops_needs.get("minimum_physical_materials", []),
            "minimum_daily_operations": ops_needs.get("minimum_daily_operations", [])
        }
    }


def build_user_message(agent_input: dict) -> str:
    payload = {
        "startup_input": {
            "idea_description": agent_input["idea_description"],
            "problem": agent_input["problem"],
            "target_customer": agent_input["target_customer"],
            "product_type": agent_input["product_type"],
            "product_type_description": agent_input["product_type_description"],
            "business_model": agent_input["business_model"],
            "team": agent_input["team"]
        },
        "ops_needs": agent_input["ops_needs"],
        "return_json_with": [
            "minimum_roles_responsibilities",
            "operational_needs",
            "materials_equipment",
            "physical_presence_needs",
            "tools_stack",
        ]
    }

    return json.dumps(payload, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    agent_input = build_agent_input(startup_input)

    llm_call_count = 0
    tool_call_count = 0
    final_output = None

    for chunk in agent.stream(
        {
            "messages": [
                {
                    "role": "user",
                    "content": build_user_message(agent_input)
                }
            ]
        },
        config={
            "configurable": {
                "thread_id": "ops-needs-agent-test-1"
            }
        },
        stream_mode="updates",
    ):
        for step_name, step_data in chunk.items():
            message = step_data["messages"][-1]

            if step_name == "model":
                llm_call_count += 1
                print(f"\n=== LLM CALL #{llm_call_count} ===")
                final_output = extract_text_from_message(message)
                print(final_output)

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
