import json
from pathlib import Path

from langchain_ollama import ChatOllama
from langchain.agents import create_agent
from langgraph.checkpoint.memory import InMemorySaver


llm = ChatOllama(
    model="qwen2.5:7b",
    temperature=0.2,
)


MVP_BLUEPRINTS_PATH = Path(__file__).parent / "knowledge" / "mvp_blueprints.json"


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

}


def load_mvp_blueprint(product_type: str) -> dict:
    with open(MVP_BLUEPRINTS_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    blueprints = data.get("blueprints", [])

    for item in blueprints:
        if item.get("product_type") == product_type:
            return item

    raise ValueError(f"No MVP blueprint found for product_type: {product_type}")


system_prompt = """
You are an MVP builder.

Build the smallest practical MVP from the startup input and the matched blueprint.

Use the blueprint as the structure of the MVP.
Adapt it to the startup idea, problem, target customer, and business model.
Do not restate the blueprint.
Do not copy blueprint wording directly unless it clearly fits the startup input.

Keep the MVP:
- small
- practical
- concrete
- testable
- centered on one clear end-to-end workflow

Rules:
- Do not invent specific values or policies.
- Do not invent prices, percentages, payment timing, verification methods, review systems, notification channels, response times, or operating rules.
- Keep product_type exactly as given.
- Keep product_type_description exactly as given.
- Do not invent numbers, percentages, dates, or time windows.
- acceptance_criteria should describe what must work in the product.
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
    blueprint = load_mvp_blueprint(startup_input["product_type"])

    return {
        "idea_description": startup_input["idea_description"],
        "problem": startup_input["problem"],
        "target_customer": startup_input["target_customer"],
        "product_type": startup_input["product_type"],
        "product_type_description": blueprint.get("product_type_description", ""),
        "business_model": startup_input["business_model"],
        "mvp_blueprint": blueprint["minimum_requirements"]
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
        },
        "blueprint": agent_input["mvp_blueprint"],
        "return_json_with": [
            "mvp_summary",
            "mvp_must_haves",
            "out_of_scope",
            "user_journey",
            "acceptance_criteria",
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
                "thread_id": "mvp-builder-agent-test-1"
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
