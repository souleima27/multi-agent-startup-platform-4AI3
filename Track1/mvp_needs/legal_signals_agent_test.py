import json
from pathlib import Path

from langchain_ollama import ChatOllama
from langchain.agents import create_agent
from langgraph.checkpoint.memory import InMemorySaver


llm = ChatOllama(
    model="qwen2.5:7b",
    temperature=0.2,
)


LEGAL_SIGNALS_PATH = Path(__file__).parent / "knowledge" / "legal_signals.json"


startup_input = {
  "idea_description": "A B2B software platform that helps Tunisian pharmacies predict stockout risk for fast-moving medicines and automatically generate reorder suggestions before shelves go empty.",
  "problem": "Many pharmacies still track demand manually and react too late, causing stockouts, lost sales, and urgent supplier calls.",
  "target_customer": {
    "type": "B2B",
    "location": "Tunisia (city/region)",
    "notes": "Independent pharmacies and small pharmacy groups in Tunis that reorder inventory several times per week."
  },
  "industry": "technology",
  "product_type": "software tool / SaaS",
  "business_model": {
    "revenue_model": "subscription",
    "who_pays": "business",
    "when_paid": "recurring"
  }
}


def load_legal_signals(industry: str) -> dict:
    with open(LEGAL_SIGNALS_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    for item in data:
        if item.get("industry") == industry:
            return item

    raise ValueError(f"No legal signals found for industry: {industry}")


system_prompt = """
You are a legal signals builder.

Your job is to define the main legal and compliance signals for the startup using the matched legal signals record.

Use the legal signals record as the base structure.
Adapt it to the startup idea, problem, target customer, product type, and business model.
Do not restate the legal signals record.
Keep the result practical, lean, and usable.

Rules:
- Keep risk_level exactly as given.
- If a detail is missing, keep it generic.
- Do not invent laws, regulators, permits, fees, filing deadlines, legal thresholds, or approval steps unless they are clearly supported by the startup input or the matched legal signals record.
- legal_compliance_checklist should describe the main compliance areas this startup should pay attention to.
- trust_requirements should describe what users, customers, or partners need to trust from a legal or risk point of view.
- special_operational_constraints should describe sector constraints that can affect how the startup operates.
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
        return "\\n".join(texts).strip()

    return str(message.content).strip()


def build_agent_input(startup_input: dict) -> dict:
    legal_signals = load_legal_signals(startup_input["industry"])

    return {
        "idea_description": startup_input["idea_description"],
        "problem": startup_input["problem"],
        "target_customer": startup_input["target_customer"],
        "industry": startup_input["industry"],
        "product_type": startup_input["product_type"],
        "business_model": startup_input["business_model"],
        "risk_level": legal_signals.get("risk_level", ""),
        "legal_signals": {
            "legal_compliance_checklist": legal_signals.get("legal_compliance_checklist", []),
            "trust_requirements": legal_signals.get("trust_requirements", []),
            "special_operational_constraints": legal_signals.get("special_operational_constraints", [])
        }
    }


def build_user_message(agent_input: dict) -> str:
    payload = {
        "startup_input": {
            "idea_description": agent_input["idea_description"],
            "problem": agent_input["problem"],
            "target_customer": agent_input["target_customer"],
            "industry": agent_input["industry"],
            "product_type": agent_input["product_type"],
            "business_model": agent_input["business_model"]
        },
        "risk_level": agent_input["risk_level"],
        "legal_signals": agent_input["legal_signals"],
        "return_json_with": [
            "risk_level",
            "legal_compliance_checklist",
            "trust_requirements",
            "special_operational_constraints"
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
                "thread_id": "legal-signals-agent-test-1"
            }
        },
        stream_mode="updates",
    ):
        for step_name, step_data in chunk.items():
            message = step_data["messages"][-1]

            if step_name == "model":
                llm_call_count += 1
                print(f"\\n=== LLM CALL #{llm_call_count} ===")
                final_output = extract_text_from_message(message)
                print(final_output)

            elif step_name == "tools":
                tool_call_count += 1
                print(f"\\n=== TOOL CALL #{tool_call_count} ===")
                tool_name = getattr(message, "name", "unknown_tool")
                print(f"Tool: {tool_name}")
                print(f"Output: {message.content}")

    print("\\n=== FINAL OUTPUT ===")
    print(final_output)

    print("\\n=== DONE ===")
    print(f"Total LLM calls: {llm_call_count}")
    print(f"Total tool calls: {tool_call_count}")
