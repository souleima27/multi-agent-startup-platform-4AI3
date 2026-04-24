import ast
import json
import re
from pathlib import Path

import httpx
from openai import OpenAI


BASE_DIR = Path(__file__).resolve().parent
OUTPUT_DIR = BASE_DIR / "outputs"

USER_INPUT_PATH = BASE_DIR / "user_input.json"
EXIST_SOL_PATH = OUTPUT_DIR / "exist_sol_output.txt"
FINANCE_PATH = OUTPUT_DIR / "finance_output.txt"
MVP_PATH = OUTPUT_DIR / "mvp_output.json"
OPS_PATH = OUTPUT_DIR / "ops_output.json"
LEGAL_PATH = OUTPUT_DIR / "legal_output.json"
FINAL_OUTPUT_PATH = OUTPUT_DIR / "final_master_report.json"

MAX_ATTEMPTS = 2


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8").strip()


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def clean_json_text(text: str) -> str:
    text = text.strip()

    if text.startswith("```json"):
        text = text[len("```json"):].strip()
    elif text.startswith("```"):
        text = text[len("```"):].strip()

    if text.endswith("```"):
        text = text[:-3].strip()

    return text.strip()


def extract_balanced_json_object(text: str) -> str | None:
    start = text.find("{")
    if start == -1:
        return None

    depth = 0
    in_string = False
    escape = False

    for idx in range(start, len(text)):
        ch = text[idx]

        if in_string:
            if escape:
                escape = False
            elif ch == "\\":
                escape = True
            elif ch == '"':
                in_string = False
            continue

        if ch == '"':
            in_string = True
        elif ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                return text[start : idx + 1]

    return None


def repair_json_text(text: str) -> str:
    repaired = text.strip()
    repaired = repaired.replace("“", '"').replace("”", '"').replace("’", "'")
    repaired = re.sub(r",\s*([}\]])", r"\1", repaired)
    repaired = re.sub(r"(?m)(^|[{,]\s*)([A-Za-z_][A-Za-z0-9_]*)(\s*:)", r'\1"\2"\3', repaired)
    return repaired


def parse_json_output(text: str) -> dict:
    cleaned = clean_json_text(text)
    if not cleaned:
        raise ValueError("Model returned empty output.")

    candidates: list[str] = []
    candidates.append(cleaned)

    extracted = extract_balanced_json_object(cleaned)
    if extracted and extracted not in candidates:
        candidates.append(extracted)

    repaired_cleaned = repair_json_text(cleaned)
    if repaired_cleaned not in candidates:
        candidates.append(repaired_cleaned)

    if extracted:
        repaired_extracted = repair_json_text(extracted)
        if repaired_extracted not in candidates:
            candidates.append(repaired_extracted)

    last_error: Exception | None = None

    for candidate in candidates:
        try:
            return json.loads(candidate)
        except Exception as e:
            last_error = e
        try:
            parsed = ast.literal_eval(candidate)
            if isinstance(parsed, dict):
                return parsed
        except Exception as e:
            last_error = e

    raise ValueError(f"Could not parse model output as JSON. Last error: {last_error}")


def ensure_object(value, value_key: str, default_value, uncertainty_key: str = "uncertainty_flag") -> dict:
    if isinstance(value, dict):
        return {
            value_key: value.get(value_key, default_value),
            uncertainty_key: value.get(uncertainty_key, ""),
        }

    if value in (None, "", {}, []):
        return {value_key: default_value, uncertainty_key: ""}

    return {value_key: value, uncertainty_key: ""}


def normalize_final_json(data: dict) -> dict:
    data = data if isinstance(data, dict) else {}

    data.setdefault("startup_summary", {})
    data.setdefault("market_existence", {})
    data.setdefault("mvp", {})
    data.setdefault("operations", {})
    data.setdefault("finance", {})
    data.setdefault("legal_and_compliance", {})
    data.setdefault("uncertainty_flags", [])
    data.setdefault("final_verdict", {})

    finance = data["finance"] if isinstance(data.get("finance"), dict) else {}
    data["finance"] = finance

    finance.setdefault("employees_and_wages", [])
    finance.setdefault("tools_materials_ops_costs", {})
    finance.setdefault("monthly_costs", {})
    finance.setdefault("one_time_costs", {})
    finance.setdefault("missing_or_uncertain_parts", [])

    finance["suggested_price"] = ensure_object(
        finance.get("suggested_price", {}),
        "range_tnd",
        "",
    )
    finance["price_realism"] = ensure_object(
        finance.get("price_realism", {}),
        "assessment",
        "",
    )
    finance["expected_monthly_revenue"] = ensure_object(
        finance.get("expected_monthly_revenue", {}),
        "value",
        0,
    )
    finance["payback_months"] = ensure_object(
        finance.get("payback_months", {}),
        "value",
        0,
    )

    return data


def build_system_prompt() -> str:
    return """
You are a senior startup analyst.

Merge the provided startup input and analysis outputs into one final structured JSON object.

Main rules:
- Keep the result practical, readable, and presentation-ready
- Preserve useful conclusions, but do not blindly copy inconsistent numbers
- If something seems uncertain, weak, contradictory, incomplete, startup-type-inconsistent, or numerically wrong, mark it as uncertain
- If evidence is weak, phrase conclusions carefully
- Finance sanity check is mandatory
- If finance numbers contradict each other, do not blindly trust them
- If a finance number looks obviously wrong, mark it as uncertain
- Do not perform new finance calculations
- Do not invent new business facts
- Return raw JSON only
- Do not use markdown or code fences

Return exactly this JSON structure:
{
  "startup_summary": {
    "idea": "",
    "problem": "",
    "target_customer": "",
    "how_it_works": "",
    "business_model": ""
  },
  "market_existence": {
    "status": "",
    "existence_risk_score": 0,
    "innovation_score": 0,
    "confidence": "",
    "summary": "",
    "relevant_existing_solutions": [
      {
        "company_name": "",
        "what_it_does": "",
        "similarity_to_startup": "",
        "relevance_confidence": ""
      }
    ],
    "uncertainty_notes": []
  },
  "mvp": {
    "mvp_summary": "",
    "must_haves": [],
    "user_journey": [],
    "acceptance_criteria": [],
    "out_of_scope": []
  },
  "operations": {
    "minimum_roles_responsibilities": [
      {
        "role": "",
        "responsibility_or_description": ""
      }
    ],
    "materials_equipment": [],
    "tools_stack": [],
    "important_operational_notes": []
  },
  "finance": {
    "employees_and_wages": [
      {
        "role": "",
        "salary_or_range": "",
        "why_needed": "",
        "necessity_level": ""
      }
    ],
    "tools_materials_ops_costs": {},
    "monthly_costs": {},
    "one_time_costs": {},
    "suggested_price": {
      "range_tnd": "",
      "uncertainty_flag": ""
    },
    "price_realism": {
      "assessment": "",
      "uncertainty_flag": ""
    },
    "expected_monthly_revenue": {
      "value": 0,
      "uncertainty_flag": ""
    },
    "payback_months": {
      "value": 0,
      "uncertainty_flag": ""
    },
    "missing_or_uncertain_parts": []
  },
  "legal_and_compliance": {
    "risk_level": "",
    "legal_compliance_checklist": [],
    "trust_requirements": [],
    "special_operational_constraints": [],
    "filtered_summary": []
  },
  "uncertainty_flags": [],
  "final_verdict": {
    "is_startup_promising": "",
    "is_feasible": "",
    "main_strengths": [],
    "main_weaknesses": [],
    "recommended_next_steps": []
  }
}

Rules:
- market_existence.status must be one of: "already exists", "partially exists", "appears original", "uncertain"
- existence_risk_score and innovation_score must be integers from 0 to 100
- confidence must be one of: "low", "medium", "high"
- necessity_level must be one of: "critical", "important", "useful", "uncertain"
- expected_monthly_revenue must always be an object with keys: value, uncertainty_flag
- payback_months must always be an object with keys: value, uncertainty_flag
- price_realism must always be an object with keys: assessment, uncertainty_flag
- suggested_price must always be an object with keys: range_tnd, uncertainty_flag
- If operations roles use "description" or "responsibilities", map them into "responsibility_or_description"
- Keep tools_stack concise and readable
- legal_and_compliance.filtered_summary should be a short cleaned list for presentation
- uncertainty_flags should be short presentation-ready warnings
- Startup-type consistency is mandatory:
  if the startup is software / SaaS, do not keep hardware, device, packaging, warehouse, or physical-unit costs unless the inputs clearly support them
  if the startup is hardware / IoT / logistics / rental, do not remove justified physical costs
  if finance content clearly belongs to a different startup type, do not keep it as normal output; mark it as uncertain instead
""".strip()


def build_repair_prompt(raw_output: str) -> str:
    return f"""
Fix the following malformed JSON so it becomes valid JSON and matches the exact target schema.
Do not add markdown.
Do not add explanations.
Return raw JSON only.

Malformed output:
{raw_output}
""".strip()


def main() -> None:
    user_input = read_json(USER_INPUT_PATH)
    exist_sol_output = read_text(EXIST_SOL_PATH)
    finance_output = read_text(FINANCE_PATH)
    mvp_output = read_json(MVP_PATH)
    ops_output = read_json(OPS_PATH)
    legal_output = read_json(LEGAL_PATH)

    http_client = httpx.Client(verify=False)

    client = OpenAI(
        api_key="not_so_fast",
        base_url="https://tokenfactory.esprit.tn/api",
        http_client=http_client,
    )

    system_prompt = build_system_prompt()

    user_prompt = f"""
FULL USER INPUT:
{json.dumps(user_input, ensure_ascii=False, indent=2)}

EXISTING-SOLUTION / INNOVATION OUTPUT:
{exist_sol_output}

MVP OUTPUT:
{json.dumps(mvp_output, ensure_ascii=False, indent=2)}

OPERATIONS OUTPUT:
{json.dumps(ops_output, ensure_ascii=False, indent=2)}

LEGAL OUTPUT:
{json.dumps(legal_output, ensure_ascii=False, indent=2)}

FINANCE OUTPUT:
{finance_output}
""".strip()

    raw_output = ""
    parsed: dict | None = None
    last_error: Exception | None = None

    for attempt in range(1, MAX_ATTEMPTS + 1):
        if attempt == 1:
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ]
        else:
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": build_repair_prompt(raw_output)},
            ]

        response = client.chat.completions.create(
            model="hosted_vllm/Llama-3.1-70B-Instruct",
            messages=messages,
            temperature=0.2,
            max_tokens=4000,
            top_p=0.9,
            frequency_penalty=0.0,
            presence_penalty=0.0,
        )

        raw_output = response.choices[0].message.content.strip()

        try:
            parsed = parse_json_output(raw_output)
            break
        except Exception as e:
            last_error = e

    if parsed is None:
        raise ValueError(f"final_reporter.py failed to produce valid JSON after {MAX_ATTEMPTS} attempts. Last error: {last_error}")

    final_json = normalize_final_json(parsed)

    FINAL_OUTPUT_PATH.write_text(
        json.dumps(final_json, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    print(f"Final JSON report written to: {FINAL_OUTPUT_PATH}")


if __name__ == "__main__":
    main()
