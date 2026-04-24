import json
import re
from pathlib import Path
from typing import Any, Dict

from langchain_ollama import ChatOllama
from langchain.agents import create_agent
from langgraph.checkpoint.memory import InMemorySaver


BASE_DIR = Path(__file__).parent
KNOWLEDGE_DIR = BASE_DIR / "knowledge"
OUTPUT_DIR = BASE_DIR / "outputs"
OUTPUT_DIR.mkdir(exist_ok=True)

MVP_BLUEPRINTS_PATH = KNOWLEDGE_DIR / "mvp_blueprints.json"
OPS_NEEDS_PATH = KNOWLEDGE_DIR / "ops_needs.json"
LEGAL_SIGNALS_PATH = KNOWLEDGE_DIR / "legal_signals.json"


llm = ChatOllama(
    model="qwen2.5:7b",
    temperature=0.2,
)


startup_input = {
    "idea_description": "A smart cold-chain rental network for Tunisian fishermen, food producers, and small distributors that provides connected refrigerated boxes and pickup lockers to reduce spoilage during same-day transport.",
    "problem": "Small food businesses often lose money because they cannot maintain a reliable cold chain during transport and temporary storage, especially for fish, dairy, and fresh produce.",
    "target_customer": {
        "type": "B2B",
        "location": "Tunisia (city/region)",
        "notes": "Fishermen, small food producers, and local distributors in coastal Tunisian cities who move perishable products without strong cold-chain infrastructure."
    },
    "industry": "logistics / transport / mobility",
    "product_type": "hardware-enabled product / IoT",
    "business_model": {
        "revenue_model": "subscription",
        "who_pays": "business",
        "when_paid": "recurring"
    },
    "team": {
        "members": [
            {
                "role": "founder",
                "skills": "operations, logistics partnerships, B2B sales"
            },
            {
                "role": "technical cofounder",
                "skills": "hardware systems, IoT connectivity, backend development"
            }
        ]
    }
}


def load_mvp_blueprint(product_type: str) -> dict:
    data = json.loads(MVP_BLUEPRINTS_PATH.read_text(encoding="utf-8"))
    for item in data.get("blueprints", []):
        if item.get("product_type") == product_type:
            return item
    raise ValueError(f"No MVP blueprint found for product_type: {product_type}")


def load_ops_needs(product_type: str) -> dict:
    data = json.loads(OPS_NEEDS_PATH.read_text(encoding="utf-8"))
    for item in data:
        if item.get("product_type") == product_type:
            return item
    raise ValueError(f"No ops needs found for product_type: {product_type}")


def load_legal_signals(industry: str) -> dict:
    data = json.loads(LEGAL_SIGNALS_PATH.read_text(encoding="utf-8"))
    for item in data:
        if item.get("industry") == industry:
            return item
    raise ValueError(f"No legal signals found for industry: {industry}")


def extract_text_from_message(message) -> str:
    content_blocks = getattr(message, "content_blocks", None)
    if content_blocks:
        texts = []
        for block in content_blocks:
            if block.get("type") == "text":
                texts.append(block.get("text", ""))
        return "\n".join(texts).strip()
    return str(message.content).strip()


def clean_model_output(text: str) -> str:
    text = text.strip()

    if text.startswith("```json"):
        text = text[len("```json"):].strip()
    elif text.startswith("```"):
        text = text[len("```"):].strip()

    if text.endswith("```"):
        text = text[:-3].strip()

    return text.strip()


def parse_json_output(text: str) -> Dict[str, Any]:
    cleaned = clean_model_output(text)

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        match = re.search(r'(\{.*\}|\[.*\])', cleaned, flags=re.DOTALL)
        if match:
            return json.loads(match.group(1))
        raise


mvp_system_prompt = """
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
- Do not create a name for the startup or the product
- Do not invent specific values or policies.
- Do not invent prices, percentages, payment timing, verification methods, review systems, notification channels, response times, or operating rules.
- Keep product_type exactly as given.
- Keep product_type_description exactly as given.
- Do not invent numbers, percentages, dates, or time windows.
- acceptance_criteria should describe what must work in the product.
- Return raw JSON only.
- Do not use markdown fences.
"""

ops_system_prompt = """
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

legal_system_prompt = """
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

final_system_prompt = """
You are a startup report writer, your goal is to help the creator understand its needs, its legal risks, and the needed mvp.

You receive from other agents:
- the startup input
- the MVP 
- the ops and needs 
- the legal signals 

Write one final startup report in clear markdown.

Your job:
- introduce the startup clearly
- explain the MVP in a practical way
- explain the minimum business needs and operations
- highlight legal and compliance warnings in an advisory tone
- avoid repeating the same information across sections

Rules:
- Do not create a name for the startup or product
- If the same idea appears in multiple agent outputs, mention it once in the best section instead of repeating it.
- If the same informations or ideas feels repeated from the agent outputs, try to not repeat it.
- Keep the report practical and readable.
- Do not invent new business facts.
- Treat legal points as warning signals and baseline compliance areas, not final legal advice.
- Use these sections exactly:
  1. Startup overview
  2. Recommended MVP
  3. Operations and business needs
  4. Legal and compliance watchouts
  5. Recommended next steps
"""


def run_agent(system_prompt: str, user_message: str, thread_id: str) -> str:
    memory = InMemorySaver()
    agent = create_agent(
        model=llm,
        tools=[],
        checkpointer=memory,
        system_prompt=system_prompt,
    )

    final_output = None

    for chunk in agent.stream(
        {
            "messages": [
                {
                    "role": "user",
                    "content": user_message
                }
            ]
        },
        config={
            "configurable": {
                "thread_id": thread_id
            }
        },
        stream_mode="updates",
    ):
        for step_name, step_data in chunk.items():
            message = step_data["messages"][-1]
            if step_name == "model":
                final_output = extract_text_from_message(message)

    return final_output or ""


def build_mvp_input(startup_input: dict) -> dict:
    blueprint = load_mvp_blueprint(startup_input["product_type"])
    return {
        "startup_input": {
            "idea_description": startup_input["idea_description"],
            "problem": startup_input["problem"],
            "target_customer": startup_input["target_customer"],
            "product_type": startup_input["product_type"],
            "product_type_description": blueprint.get("product_type_description", ""),
            "business_model": startup_input["business_model"]
        },
        "blueprint": blueprint["minimum_requirements"],
        "return_json_with": [
            "mvp_summary",
            "mvp_must_haves",
            "out_of_scope",
            "user_journey",
            "acceptance_criteria"
        ]
    }


def build_ops_input(startup_input: dict) -> dict:
    ops_needs = load_ops_needs(startup_input["product_type"])
    return {
        "startup_input": {
            "idea_description": startup_input["idea_description"],
            "problem": startup_input["problem"],
            "target_customer": startup_input["target_customer"],
            "product_type": startup_input["product_type"],
            "product_type_description": ops_needs.get("product_type_description", ""),
            "business_model": startup_input["business_model"],
            "team": startup_input.get("team", {})
        },
        "ops_needs": {
            "minimum_team_roles": ops_needs.get("minimum_team_roles", []),
            "minimum_tools": ops_needs.get("minimum_tools", []),
            "minimum_physical_materials": ops_needs.get("minimum_physical_materials", []),
            "minimum_daily_operations": ops_needs.get("minimum_daily_operations", [])
        },
        "return_json_with": [
            "minimum_roles_responsibilities",
            "operational_needs",
            "materials_equipment",
            "physical_presence_needs",
            "tools_stack"
        ]
    }


def build_legal_input(startup_input: dict) -> dict:
    legal_signals = load_legal_signals(startup_input["industry"])
    return {
        "startup_input": {
            "idea_description": startup_input["idea_description"],
            "problem": startup_input["problem"],
            "target_customer": startup_input["target_customer"],
            "industry": startup_input["industry"],
            "product_type": startup_input["product_type"],
            "business_model": startup_input["business_model"]
        },
        "risk_level": legal_signals.get("risk_level", ""),
        "legal_signals": {
            "legal_compliance_checklist": legal_signals.get("legal_compliance_checklist", []),
            "trust_requirements": legal_signals.get("trust_requirements", []),
            "special_operational_constraints": legal_signals.get("special_operational_constraints", [])
        },
        "return_json_with": [
            "risk_level",
            "legal_compliance_checklist",
            "trust_requirements",
            "special_operational_constraints"
        ]
    }


def save_json(path: Path, data: Dict[str, Any]) -> None:
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def main() -> None:
    mvp_user_message = json.dumps(build_mvp_input(startup_input), ensure_ascii=False, indent=2)
    ops_user_message = json.dumps(build_ops_input(startup_input), ensure_ascii=False, indent=2)
    legal_user_message = json.dumps(build_legal_input(startup_input), ensure_ascii=False, indent=2)

    mvp_raw = run_agent(mvp_system_prompt, mvp_user_message, "mvp-agent")
    ops_raw = run_agent(ops_system_prompt, ops_user_message, "ops-agent")
    legal_raw = run_agent(legal_system_prompt, legal_user_message, "legal-agent")

    mvp_output = parse_json_output(mvp_raw)
    ops_output = parse_json_output(ops_raw)
    legal_output = parse_json_output(legal_raw)

    save_json(OUTPUT_DIR / "mvp_output.json", mvp_output)
    save_json(OUTPUT_DIR / "ops_output.json", ops_output)
    save_json(OUTPUT_DIR / "legal_output.json", legal_output)

    final_payload = {
        "startup_input": startup_input,
        "mvp_output": mvp_output,
        "ops_output": ops_output,
        "legal_output": legal_output
    }

    final_raw = run_agent(
        final_system_prompt,
        json.dumps(final_payload, ensure_ascii=False, indent=2),
        "final-report-agent"
    )

    final_report = clean_model_output(final_raw)
    (OUTPUT_DIR / "final_report.md").write_text(final_report, encoding="utf-8")

    print("\n=== MVP OUTPUT ===")
    print(json.dumps(mvp_output, ensure_ascii=False, indent=2))

    print("\n=== OPS OUTPUT ===")
    print(json.dumps(ops_output, ensure_ascii=False, indent=2))

    print("\n=== LEGAL OUTPUT ===")
    print(json.dumps(legal_output, ensure_ascii=False, indent=2))

    print("\n=== FINAL REPORT ===")
    print(final_report)

    print("\n=== FILES WRITTEN ===")
    print(OUTPUT_DIR / "mvp_output.json")
    print(OUTPUT_DIR / "ops_output.json")
    print(OUTPUT_DIR / "legal_output.json")
    print(OUTPUT_DIR / "final_report.md")


if __name__ == "__main__":
    main()
