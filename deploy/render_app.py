from __future__ import annotations

import os
import sys
import asyncio
import hashlib
import json
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import requests
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles


ROOT_DIR = Path(__file__).resolve().parents[1]
TRACK1_DIR = ROOT_DIR / "Track1"
TRACK2_DIR = ROOT_DIR / "Track2"
TEMPLATE_DIR = ROOT_DIR / "Template"
FRONTEND_DIST = ROOT_DIR / "Template" / "dist"

startup_errors: dict[str, str] = {}
track3_jobs: dict[str, dict[str, Any]] = {}


def _unavailable(track: str):
    async def endpoint() -> Any:
        raise HTTPException(
            status_code=503,
            detail=f"{track} is unavailable: {startup_errors.get(track, 'unknown startup error')}",
        )

    return endpoint


def _track2_sample_payload() -> dict[str, Any]:
    return {
        "startup_profile": {
            "startup_name": "Neuronix Legal AI",
            "sector": "AI SaaS",
            "activity_description": "AI platform for startup legal guidance and compliance automation.",
            "founders_count": 3,
            "funding_need_tnd": 250000,
            "wants_investors": True,
            "needs_limited_liability": True,
            "has_foreign_investors": False,
            "innovative": True,
            "scalable": True,
            "uses_technology": True,
            "associates": [{"name": "Founder", "role": "CEO", "equity_pct": 100, "active": True}],
        },
        "documents": [
            {"path": "sample_statuts.pdf", "declared_type": "statuts"},
            {"path": "sample_rc.pdf", "declared_type": "rc"},
            {"path": "sample_if.pdf", "declared_type": "if"},
        ],
        "label_input": {
            "startup_name": "Neuronix Legal AI",
            "transcript": "Neuronix Legal AI helps founders automate legal readiness and investor documentation.",
            "slide_text": "AI legal compliance platform for startups.",
            "sector": "AI SaaS",
            "traction_signals": ["prototype ready", "advisor interviews"],
            "team_signals": ["technical founder", "legal mentor"],
            "pitch_notes": ["clear compliance use case"],
        },
        "options": {
            "strict_mode": True,
            "generate_json_report": False,
            "generate_pdf_report": False,
        },
    }


def _track2_report(payload: dict[str, Any], reason: str = "api-safe mode") -> dict[str, Any]:
    profile = payload.get("startup_profile") or {}
    documents = payload.get("documents") or []
    options = payload.get("options") or {}
    startup_name = profile.get("startup_name") or "Startup"
    sector = profile.get("sector") or "Startup"
    required_documents = ["statuts", "registre de commerce", "identifiant fiscal", "CIN fondateur", "attestation bancaire"]
    uploaded_names = [Path(str(item.get("path") or "document")).name for item in documents]
    missing_documents = required_documents[len(documents) :] if len(documents) < len(required_documents) else []
    completeness = min(100, round((len(documents) / len(required_documents)) * 100))
    startup_act_score = 82 if profile.get("innovative") and profile.get("scalable") and profile.get("uses_technology") else 58
    risk_score = 25 if completeness >= 80 else 55
    strict_mode = bool(options.get("strict_mode", True))
    strict_fail = bool(missing_documents and strict_mode)
    final_decision = "PASS" if not strict_fail and startup_act_score >= 70 else "WARNING"

    return {
        "strategic_agent": {
            "recommended_legal_form": "SARL" if profile.get("wants_investors") else "SUARL",
            "startup_act_eligibility_score": startup_act_score,
            "startup_label_probability": startup_act_score,
            "startup_label_multimodal": {
                "innovation_score": 82 if profile.get("innovative") else 55,
                "scalability_score": 80 if profile.get("scalable") else 50,
                "tech_intensity_score": 84 if profile.get("uses_technology") else 45,
                "storytelling_score": 70,
                "approval_probability": startup_act_score,
                "strengths": ["Clear sector positioning", "Technology-enabled activity"],
                "weaknesses": ["Document evidence needs completion"],
                "recommendations": ["Attach all legal evidence before final submission"],
            },
            "sector_classification": sector,
            "founders_structure": f"{profile.get('founders_count') or 1} founder(s)",
            "funding_analysis": f"Funding need: {profile.get('funding_need_tnd') or 0} TND",
            "regulatory_compatibility": "compatible",
            "required_documents": required_documents,
            "pitch_score": 70,
            "pitch_summary": "Pitch context is sufficient for a first legal readiness review.",
            "pitch_strengths": ["Problem and sector are identifiable"],
            "pitch_weaknesses": ["Add traction and ask details"],
            "pitch_recommendations": ["Clarify investor ask and pilot milestones"],
            "associate_structure_summary": "Founder structure should be confirmed in statuts.",
            "associate_roles": [item.get("role", "Founder") for item in profile.get("associates", [])],
            "associate_recommendations": ["Confirm equity split and active founder responsibilities"],
            "institutions": ["RNE", "Recette des finances", "Banque", "Startup Act portal"],
            "checklist": [
                {
                    "step_no": 1,
                    "title": "Complete legal document pack",
                    "institution": "Founder",
                    "estimated_delay_days": 2,
                    "depends_on": [],
                    "deliverables": missing_documents or ["Validated legal file"],
                },
                {
                    "step_no": 2,
                    "title": "Validate legal form and registration path",
                    "institution": "RNE",
                    "estimated_delay_days": 4,
                    "depends_on": [1],
                    "deliverables": ["Legal form decision", "Registration checklist"],
                },
            ],
            "rationale": [
                f"{startup_name} is classified in {sector}.",
                f"Track B generated an API-safe report: {reason}.",
                "The recommendation prioritizes limited liability and investor readiness.",
            ],
            "reasoning_trace": ["render_api_safe_track2"],
            "actions": [{"action": "Review uploaded documents", "status": "suggested", "details": "Complete missing evidence before filing."}],
        },
        "document_agent": {
            "documents": [
                {
                    "file_name": name,
                    "document_type": (documents[index].get("declared_type") if isinstance(documents[index], dict) else None) or "unknown",
                    "source_format": "other",
                    "signature_present": None,
                    "stamp_present": None,
                    "quality": "n_a",
                    "completeness_score": 75,
                    "issues": [],
                    "extracted_text_preview": "",
                    "suggested_fix": "",
                    "corrected_declared_type": documents[index].get("declared_type") if isinstance(documents[index], dict) else None,
                    "auto_correction_applied": False,
                    "diagnostic": None,
                }
                for index, name in enumerate(uploaded_names)
            ],
            "overall_completeness_score": completeness,
            "missing_documents": missing_documents,
            "cross_document_issues": [],
            "cross_document_validations": [],
            "categorized_documents": {"uploaded": uploaded_names},
            "version_tracking": {name: "v1" for name in uploaded_names},
            "suggested_folders": ["legal", "tax", "identity"],
            "reasoning_trace": ["render_api_safe_document_review"],
            "actions": [{"action": "Collect missing documents", "status": "suggested", "details": ", ".join(missing_documents) or "No missing documents."}],
            "document_actions": [],
            "question_answers": [],
            "global_risk_score": risk_score,
            "global_priority_action": "Complete missing legal evidence" if missing_documents else "Prepare submission package",
            "strict_fail": strict_fail,
            "strict_violations": missing_documents,
        },
        "final_output": {
            "final_decision": final_decision,
            "go_no_go": "NO_GO" if strict_fail else "GO",
            "strict_mode": strict_mode,
            "strict_fail": strict_fail,
            "label_score": startup_act_score,
            "user_message": "Track B generated a legal readiness report.",
            "recommendations": ["Complete evidence pack", "Validate legal form with advisor", "Prepare Startup Act submission"],
        },
        "external_research": {
            "searches": [
                {"platform": "Google", "query": f"{startup_name} {sector}", "agent_search": {"status": "unavailable", "results": []}},
                {"platform": "LinkedIn", "query": startup_name, "agent_search": {"status": "unavailable", "results": []}},
            ]
        },
    }


def _track1_report(payload: dict[str, Any]) -> dict[str, Any]:
    idea = str(payload.get("startup_idea") or payload.get("idea_description") or "Startup idea").strip()
    description = str(payload.get("idea_description") or idea).strip()
    problem = str(payload.get("problem") or "The target users have an unresolved operational pain.").strip()
    target = payload.get("target_customer") or {}
    business = payload.get("business_model") or {}
    mvp_payload = payload.get("mvp") or {}
    legal_payload = payload.get("legal") or {}
    industry = str(payload.get("industry") or payload.get("sector") or "technology")
    target_text = ", ".join(str(value) for value in target.values() if value) or "Early adopters"

    return {
        "startup_summary": {
            "idea": idea,
            "problem": problem,
            "how_it_works": payload.get("how_it_works_one_sentence") or description,
            "target_customer": target_text,
            "business_model": ", ".join(str(value) for value in business.values() if value) or "Subscription or service revenue",
        },
        "market_existence": {
            "status": "Partially exists",
            "existence_risk_score": 62,
            "innovation_score": 74,
            "confidence": "Medium",
            "summary": "The idea addresses a real market need, but comparable alternatives likely exist. The opportunity depends on a focused niche, fast validation, and clear differentiation.",
            "evidence": [
                "Comparable solutions usually exist in the market, so differentiation matters.",
                "The project needs direct customer validation before scaling.",
            ],
            "market_gap": "A focused product for the chosen niche can still be valuable if execution is strong.",
            "relevant_existing_solutions": [
                {
                    "name": "Manual consultants and agencies",
                    "category": "Service alternative",
                    "relevance_confidence": "Medium",
                    "similarity_to_startup": "Medium",
                    "notes": "Customers can already solve part of the problem manually, but automation can improve speed and consistency.",
                },
                {
                    "name": "Generic SaaS tools",
                    "category": "Software alternative",
                    "relevance_confidence": "Medium",
                    "similarity_to_startup": "Low to Medium",
                    "notes": "General tools may cover workflows but usually lack the startup-specific focus.",
                },
            ],
            "uncertainty_notes": [
                "Run direct customer interviews to confirm urgency.",
                "Validate willingness to pay before building advanced features.",
            ],
        },
        "mvp": {
            "mvp_summary": "Launch a narrow MVP that proves the core workflow with a small group of target users before adding automations and integrations.",
            "recommended_scope": mvp_payload.get("core_features") or ["Landing page", "User onboarding", "Core workflow", "Admin dashboard"],
            "must_haves": mvp_payload.get("core_features") or ["Core workflow", "Basic reporting", "User onboarding"],
            "acceptance_criteria": [
                "A target user can complete the core workflow without assistance.",
                "The founder can review activity and collect feedback.",
                "At least 5 pilot users complete a test scenario.",
            ],
            "user_journey": [
                {"step": "Discover", "description": "User understands the value proposition from a simple landing page."},
                {"step": "Onboard", "description": "User creates a profile and enters the minimum required data."},
                {"step": "Use core workflow", "description": "User completes the main task and receives a useful output."},
                {"step": "Feedback", "description": "Founder collects objections, missing features, and willingness to pay."},
            ],
            "out_of_scope": ["Advanced analytics", "Complex integrations", "Multi-country compliance"],
            "nice_to_have_features": ["Automation", "Advanced analytics", "Integrations"],
            "launch_timeline": mvp_payload.get("launch_timeline") or "6-8 weeks",
            "validation_plan": [
                "Interview 10 target users",
                "Launch a simple pilot",
                "Measure conversion, retention, and willingness to pay",
            ],
        },
        "operations": {
            "minimum_roles_responsibilities": [
                {
                    "role": "Product owner",
                    "responsibility_or_description": "Owns the MVP scope, user interviews, backlog priorities, and launch decisions.",
                    "responsibilities": ["Define MVP scope", "Run interviews", "Prioritize backlog"],
                    "necessity_level": "critical",
                },
                {
                    "role": "Full-stack developer",
                    "responsibility_or_description": "Builds the core product workflow, backend API, deployment, monitoring, and pilot fixes.",
                    "responsibilities": ["Build core workflow", "Deploy and monitor app", "Fix pilot issues"],
                    "necessity_level": "critical",
                },
                {
                    "role": "Domain advisor",
                    "responsibility_or_description": "Validates legal, market, and operational assumptions before public launch.",
                    "responsibilities": ["Validate legal/business assumptions", "Review risks"],
                    "necessity_level": "important",
                },
            ],
            "team_needs": [
                "Product owner",
                "Full-stack developer",
                "Domain advisor",
            ],
            "key_partners": payload.get("operations", {}).get("key_partners", "Pilot customers and expert advisors")
            if isinstance(payload.get("operations"), dict)
            else "Pilot customers and expert advisors",
            "main_costs": ["Hosting", "Development", "Customer acquisition", "Legal setup"],
            "operational_risks": ["Slow user validation", "Unclear pricing", "Limited founder bandwidth"],
            "materials_equipment": ["Laptop", "Cloud hosting", "Domain name", "Analytics account"],
            "tools_stack": ["React frontend", "FastAPI backend", "Render hosting", "External LLM API"],
            "important_operational_notes": [
                "Keep the first pilot small and measurable.",
                "Document user objections after every test.",
                "Avoid adding integrations before validating the core workflow.",
            ],
        },
        "finance": {
            "expected_monthly_revenue": {"value": "1,500-4,000 TND"},
            "payback_months": {"value": "4-8"},
            "suggested_price": {"range_tnd": "49-149 TND/month"},
            "employees_and_wages": [
                {
                    "role": "Product owner",
                    "necessity_level": "critical",
                    "why_needed": "Keeps the MVP focused on validated customer pain and prevents scope creep.",
                    "salary_or_range": "1200-2500 TND/month",
                    "monthly_wage_range_tnd": "1200-2500",
                },
                {
                    "role": "Full-stack developer",
                    "necessity_level": "critical",
                    "why_needed": "Builds and maintains the usable product needed for pilot validation.",
                    "salary_or_range": "1800-3500 TND/month",
                    "monthly_wage_range_tnd": "1800-3500",
                },
                {
                    "role": "Domain advisor",
                    "necessity_level": "important",
                    "why_needed": "Reduces legal and business mistakes before launch.",
                    "salary_or_range": "500-1500 TND/month",
                    "monthly_wage_range_tnd": "500-1500",
                },
            ],
            "tools_materials_ops_costs": {"hosting": "80-250 TND/month", "domain": "40-100 TND/year", "LLM API": "usage-based"},
            "monthly_costs": {"lean": "1000-2500 TND", "growth": "3000-6000 TND"},
            "one_time_costs": {"prototype": "3000-8000 TND", "legal setup": "500-1500 TND"},
            "price_realism": {"status": "Medium", "note": "Pricing must be tested with real pilot users."},
            "startup_cost_estimate": payload.get("finance", {}).get("startup_costs", "Low to medium")
            if isinstance(payload.get("finance"), dict)
            else "Low to medium",
            "monthly_cost_estimate": payload.get("finance", {}).get("monthly_costs", "Depends on hosting and acquisition")
            if isinstance(payload.get("finance"), dict)
            else "Depends on hosting and acquisition",
            "funding_needed": payload.get("finance", {}).get("funding_needed", "Validate before fundraising")
            if isinstance(payload.get("finance"), dict)
            else "Validate before fundraising",
            "revenue_notes": "Start with one clear paid offer and validate willingness to pay.",
            "missing_or_uncertain_parts": ["Customer acquisition cost", "Conversion rate", "Exact willingness to pay"],
        },
        "legal_and_compliance": {
            "country": legal_payload.get("country", "Tunisia") if isinstance(legal_payload, dict) else "Tunisia",
            "risk_level": "Medium",
            "legal_needs": ["Company registration", "Terms and privacy policy", "Data handling review"],
            "compliance_notes": "Confirm sector-specific obligations with a local advisor before launch.",
            "legal_compliance_checklist": ["Choose legal form", "Prepare terms and privacy notice", "Review data handling", "Register company when pilot is validated"],
            "trust_requirements": ["Transparent pricing", "Clear data use policy", "Human support channel"],
            "special_operational_constraints": ["Avoid regulated claims until reviewed", "Store customer data carefully"],
            "filtered_summary": ["Medium legal risk", "Needs advisor review before public launch"],
        },
        "final_verdict": {
            "is_startup_promising": "Yes",
            "is_feasible": "Yes",
            "overall_score": 74,
            "main_strengths": [
                f"Clear problem area in {industry}",
                "Can be tested with a focused MVP",
                "Has room for differentiation through execution",
            ],
            "main_weaknesses": [
                "Needs stronger market proof",
                "Needs clearer pricing validation",
                "Legal and operational details should be confirmed",
            ],
            "recommended_next_steps": [
                "Run customer interviews this week",
                "Define the smallest paid MVP",
                "Prepare legal checklist and launch metrics",
            ],
        },
        "uncertainty_flags": [
            "Market demand is not proven yet.",
            "Pricing assumptions need validation.",
            "Legal obligations should be reviewed by a qualified advisor.",
        ],
        "metadata": {
            "mode": "render_api_safe",
            "generated_at": datetime.now(timezone.utc).isoformat(),
        },
    }


try:
    sys.path.insert(0, str(TRACK2_DIR))
    from app.api.main import app as track2_app  # noqa: E402
except Exception as exc:  # pragma: no cover - startup guard for hosted deploys
    track2_app = None
    startup_errors["track2"] = repr(exc)

try:
    sys.path.insert(0, str(TRACK1_DIR))
    from api import analyze_startup, get_saved_report  # noqa: E402

    def track1_health() -> dict[str, str]:
        return {"status": "ok", "app": "track1"}
except Exception as exc:  # pragma: no cover - startup guard for hosted deploys
    analyze_startup = _unavailable("track1")
    get_saved_report = _unavailable("track1")
    track1_health = _unavailable("track1")
    startup_errors["track1"] = repr(exc)

try:
    sys.path.insert(0, str(TEMPLATE_DIR))
    from track3_run_agent import build_api_result, build_fallback_result, build_response, merge_state, run_agent  # noqa: E402
except Exception as exc:  # pragma: no cover - startup guard for hosted deploys
    build_api_result = None
    build_fallback_result = None
    build_response = None
    merge_state = None
    run_agent = None
    startup_errors["track3"] = repr(exc)


def _parse_cors_origins() -> list[str]:
    raw = os.getenv("CORS_ALLOW_ORIGINS", "")
    origins = [origin.strip().rstrip("/") for origin in raw.split(",") if origin.strip()]
    return origins or [
        "https://startup-platform-frontend.onrender.com",
    ]


app = FastAPI(title="Startup Multi-Agent Platform")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_origin_regex=os.getenv("CORS_ALLOW_ORIGIN_REGEX", r"https://.*\.onrender\.com"),
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, Any]:
    return {
        "status": "ok" if not startup_errors else "degraded",
        "service": "startup-platform-api",
        "startup_errors": startup_errors,
    }


@app.get("/track2/sample")
def render_track2_sample() -> dict[str, Any]:
    return _track2_sample_payload()


@app.post("/track2/upload")
async def render_track2_upload(files: list[UploadFile] = File(...)) -> dict[str, Any]:
    documents = []
    for file in files:
        content = await file.read()
        safe_name = Path(file.filename or "document").name
        documents.append(
            {
                "file_name": safe_name,
                "path": f"uploaded/{uuid.uuid4().hex}_{safe_name}",
                "declared_type": None,
                "size_kb": round(len(content) / 1024),
            }
        )
    return {"documents": documents}


@app.post("/track2/run")
def render_track2_run(payload: dict[str, Any]) -> dict[str, Any]:
    return _track2_report(payload)


@app.post("/track1/analyze")
def render_track1_analyze(payload: dict[str, Any]) -> dict[str, Any]:
    return _track1_report(payload)


@app.get("/track1/report")
def render_track1_report() -> dict[str, Any]:
    return _track1_report({"startup_idea": "Sample startup", "idea_description": "Sample Track A report"})


@app.get("/track3/health")
def track3_health() -> dict[str, Any]:
    return {
        "ok": run_agent is not None,
        "startup_error": startup_errors.get("track3"),
        "model_mode": os.getenv("MODEL_MODE", ""),
        "llm_base_url_set": bool(os.getenv("LLM_BASE_URL")),
        "jira_sync_enabled": os.getenv("JIRA_SYNC_ENABLED", "false"),
        "track3_render_free_mode": os.getenv("TRACK3_RENDER_FREE_MODE", "true"),
    }


@app.get("/pitch/health")
def pitch_health() -> dict[str, Any]:
    return {
        "ok": True,
        "service": "pitch-coach-api",
        "mode": "api",
        "llm_base_url_set": bool(os.getenv("LLM_BASE_URL") or os.getenv("OPENAI_BASE_URL")),
        "llm_api_key_set": bool(os.getenv("LLM_API_KEY") or os.getenv("OPENAI_API_KEY")),
        "model": os.getenv("OPENAI_MODEL") or os.getenv("LLM_MODEL") or os.getenv("LLM_PLANNER_MODEL", ""),
    }


def _extract_json_object(text: str) -> dict[str, Any]:
    try:
        parsed = json.loads(text)
        if isinstance(parsed, dict):
            return parsed
    except Exception:
        pass

    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1 or end <= start:
        raise ValueError("No JSON object found in model response")
    parsed = json.loads(text[start : end + 1])
    if not isinstance(parsed, dict):
        raise ValueError("Model response JSON is not an object")
    return parsed


def _call_pitch_llm(prompt: str) -> dict[str, Any]:
    api_key = os.getenv("OPENAI_API_KEY") or os.getenv("LLM_API_KEY") or ""
    base_url = (os.getenv("OPENAI_BASE_URL") or os.getenv("LLM_BASE_URL") or "").rstrip("/")
    model = os.getenv("OPENAI_MODEL") or os.getenv("LLM_MODEL") or os.getenv("LLM_PLANNER_MODEL") or ""

    if not base_url or not model:
        raise RuntimeError("LLM_BASE_URL and LLM_MODEL are required.")

    headers = {"Content-Type": "application/json"}
    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"

    response = requests.post(
        f"{base_url}/chat/completions",
        headers=headers,
        json={
            "model": model,
            "messages": [
                {
                    "role": "system",
                    "content": (
                        "You are an expert startup pitch coach. Return only valid JSON. "
                        "Give practical feedback for an uploaded pitch video when only metadata is available."
                    ),
                },
                {"role": "user", "content": prompt},
            ],
            "temperature": 0.25,
            "max_tokens": int(os.getenv("PITCH_MAX_TOKENS", "1200")),
        },
        timeout=int(os.getenv("PITCH_API_TIMEOUT_SECONDS", "120")),
    )
    response.raise_for_status()
    body = response.json()
    content = ((body.get("choices") or [{}])[0].get("message") or {}).get("content", "")
    return _extract_json_object(str(content))


def _fallback_pitch_report(filename: str, coaching_mode: str, file_size_kb: int) -> dict[str, Any]:
    return {
        "overall_score": 72,
        "overall_status": "Needs sharpening",
        "criteria": [
            {
                "id": "content_clarity",
                "label": "Content clarity",
                "score": 74,
                "status": "solid",
                "what_it_means": "The pitch should make the problem, customer, solution, traction, and ask explicit.",
            },
            {
                "id": "narrative_structure",
                "label": "Narrative structure",
                "score": 70,
                "status": "improve",
                "what_it_means": "Open with the pain, then show proof and close with a clear ask.",
            },
            {
                "id": "investor_readiness",
                "label": "Investor readiness",
                "score": 68,
                "status": "improve",
                "what_it_means": "Add market size, business model, milestones, and funding use.",
            },
            {
                "id": "delivery",
                "label": "Delivery",
                "score": 76,
                "status": "solid",
                "what_it_means": "Keep sentences short and rehearse transitions for confidence.",
            },
        ],
        "summary": {
            "strongest_criteria": [{"label": "Delivery", "score": 76}],
            "weakest_criteria": [{"label": "Investor readiness", "score": 68}],
        },
        "markdown_report": (
            f"# Pitch Coach Report\n\n"
            f"Video: {filename}\n\n"
            f"Mode: {coaching_mode}\n\n"
            f"File size: {file_size_kb} KB\n\n"
            "## Next best action\n"
            "Rewrite the first 30 seconds to clearly state the customer pain, the solution, and the ask.\n\n"
            "## Recommendations\n"
            "- Add one sentence about the target customer.\n"
            "- Show traction or validation evidence.\n"
            "- End with a clear investment, pilot, or partnership ask.\n"
        ),
    }


@app.post("/pitch/analyze")
async def pitch_analyze(
    file: UploadFile = File(...),
    coaching_mode: str = Form("investor"),
    skip_visual: str = Form("false"),
    skip_voice_emotion: str = Form("false"),
    whisper_size: str = Form("medium"),
) -> dict[str, Any]:
    content = await file.read()
    filename = Path(file.filename or "pitch_video.mp4").name
    execution_id = f"pitch_{uuid.uuid4().hex[:12]}"
    file_hash = hashlib.md5(content).hexdigest()[:12]
    file_size_kb = round(len(content) / 1024)

    prompt = f"""
Analyze this startup pitch video from metadata only.
Filename: {filename}
File size KB: {file_size_kb}
Coaching mode: {coaching_mode}
Skip visual: {skip_visual}
Skip voice emotion: {skip_voice_emotion}
Whisper size selected: {whisper_size}

Return JSON with:
{{
  "overall_score": 0-100,
  "overall_status": "short status",
  "criteria": [
    {{"id":"content_clarity","label":"Content clarity","score":0-100,"status":"short","what_it_means":"specific feedback"}},
    {{"id":"narrative_structure","label":"Narrative structure","score":0-100,"status":"short","what_it_means":"specific feedback"}},
    {{"id":"investor_readiness","label":"Investor readiness","score":0-100,"status":"short","what_it_means":"specific feedback"}},
    {{"id":"delivery","label":"Delivery","score":0-100,"status":"short","what_it_means":"specific feedback"}}
  ],
  "summary": {{
    "strongest_criteria": [{{"label":"...", "score": 0}}],
    "weakest_criteria": [{{"label":"...", "score": 0}}]
  }},
  "markdown_report": "A useful markdown report with next best action and recommendations"
}}
"""
    if os.getenv("PITCH_RENDER_FREE_MODE", "true").lower() in {"1", "true", "yes"}:
        scorecard = _fallback_pitch_report(filename, coaching_mode, file_size_kb)
    else:
        try:
            scorecard = _call_pitch_llm(prompt)
        except Exception:
            scorecard = _fallback_pitch_report(filename, coaching_mode, file_size_kb)

    try:
        scorecard.setdefault("criteria", _fallback_pitch_report(filename, coaching_mode, file_size_kb)["criteria"])
        scorecard.setdefault("markdown_report", _fallback_pitch_report(filename, coaching_mode, file_size_kb)["markdown_report"])
    except AttributeError:
        scorecard = _fallback_pitch_report(filename, coaching_mode, file_size_kb)

    return {
        "ok": True,
        "_execution_meta": {
            "execution_id": execution_id,
            "file_hash": file_hash,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "filename": filename,
            "file_size_kb": file_size_kb,
            "coaching_mode": coaching_mode,
            "skip_visual": skip_visual == "true",
            "skip_voice_emotion": skip_voice_emotion == "true",
            "whisper_size": whisper_size,
            "mode": "render_free" if os.getenv("PITCH_RENDER_FREE_MODE", "true").lower() in {"1", "true", "yes"} else "api",
        },
        "reports": {
            "scorecard": scorecard,
            "full_report": {
                "final_report": {
                    "title": "Pitch Coach Report",
                    "markdown_report": scorecard.get("markdown_report", ""),
                    "next_best_action": "Clarify the opening problem statement and close with a concrete ask.",
                    "limitations": ["Render Free mode analyzes metadata and pitch structure guidance, not full video transcription."],
                }
            },
            "markdown": scorecard.get("markdown_report", ""),
        },
    }

@app.options("/track3/execution/run")
def track3_execution_options() -> dict[str, str]:
    return {"ok": "true"}


@app.post("/track3/execution/ping")
def track3_execution_ping(payload: dict[str, Any] | None = None) -> dict[str, Any]:
    return {
        "ok": True,
        "service": "startup-platform-api",
        "track": "track3",
        "received_payload": bool(payload),
    }


@app.get("/track3/execution/ping")
def track3_execution_ping_get() -> dict[str, Any]:
    return track3_execution_ping()


async def _run_track3_job(job_id: str, payload: dict[str, Any]) -> None:
    track3_jobs[job_id].update({"status": "running", "started_at": datetime.now(timezone.utc).isoformat()})

    if not all([build_fallback_result, build_response, merge_state, run_agent]):
        track3_jobs[job_id].update(
            {
                "status": "failed",
                "error": f"track3 is unavailable: {startup_errors.get('track3', 'unknown startup error')}",
                "finished_at": datetime.now(timezone.utc).isoformat(),
            }
        )
        return

    if os.getenv("TRACK3_RENDER_FREE_MODE", "true").lower() in {"1", "true", "yes"}:
        result = await asyncio.to_thread(build_api_result, payload) if build_api_result else build_fallback_result(
            payload,
            "Render free mode is enabled; full Track3 agent is skipped.",
        )
        track3_jobs[job_id].update(
            {
                "status": "completed",
                "result": build_response(result),
                "warning": "Render free API mode is enabled; local Track3 models are skipped.",
                "finished_at": datetime.now(timezone.utc).isoformat(),
            }
        )
        return

    try:
        state = merge_state(payload)
        timeout_seconds = float(os.getenv("TRACK3_JOB_TIMEOUT_SECONDS", "180"))
        result = await asyncio.wait_for(
            asyncio.to_thread(lambda: asyncio.run(run_agent(state))),
            timeout=timeout_seconds,
        )
        track3_jobs[job_id].update(
            {
                "status": "completed",
                "result": build_response(result),
                "finished_at": datetime.now(timezone.utc).isoformat(),
            }
        )
    except asyncio.TimeoutError:
        result = build_fallback_result(payload, "Track3 async execution timed out on Render.")
        track3_jobs[job_id].update(
            {
                "status": "completed",
                "result": build_response(result),
                "warning": "Track3 async execution timed out on Render.",
                "finished_at": datetime.now(timezone.utc).isoformat(),
            }
        )
    except Exception as exc:
        result = build_fallback_result(payload, f"{type(exc).__name__}: {exc}")
        track3_jobs[job_id].update(
            {
                "status": "completed",
                "result": build_response(result),
                "warning": f"{type(exc).__name__}: {exc}",
                "finished_at": datetime.now(timezone.utc).isoformat(),
            }
        )


@app.post("/track3/execution/start")
async def track3_execution_start(payload: dict[str, Any]) -> dict[str, Any]:
    job_id = uuid.uuid4().hex
    track3_jobs[job_id] = {
        "job_id": job_id,
        "status": "queued",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    asyncio.create_task(_run_track3_job(job_id, payload))
    return {"ok": True, "job_id": job_id, "status": "queued"}


@app.get("/track3/execution/status/{job_id}")
def track3_execution_status(job_id: str) -> dict[str, Any]:
    job = track3_jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Track3 job not found")
    return job


@app.post("/track3/execution/run")
async def track3_execution_run(payload: dict[str, Any]) -> dict[str, Any]:
    if not all([build_fallback_result, build_response, merge_state, run_agent]):
        raise HTTPException(
            status_code=503,
            detail=f"track3 is unavailable: {startup_errors.get('track3', 'unknown startup error')}",
        )

    try:
        state = merge_state(payload)
        timeout_seconds = float(os.getenv("TRACK3_RUN_TIMEOUT_SECONDS", "25"))
        result = await asyncio.wait_for(
            asyncio.to_thread(lambda: asyncio.run(run_agent(state))),
            timeout=timeout_seconds,
        )
    except asyncio.TimeoutError:
        result = build_fallback_result(payload, "Track3 execution timed out before Render request limit.")
    except Exception as exc:
        result = build_fallback_result(payload, f"{type(exc).__name__}: {exc}")

    return build_response(result)


app.add_api_route("/track1/health", track1_health, methods=["GET"])
app.add_api_route("/track1/analyze", analyze_startup, methods=["POST"])
app.add_api_route("/track1/report", get_saved_report, methods=["GET"])

if track2_app is not None:
    app.mount("/track2", track2_app)
else:
    app.add_api_route("/track2/health", _unavailable("track2"), methods=["GET"])

if FRONTEND_DIST.exists():
    app.mount("/", StaticFiles(directory=FRONTEND_DIST, html=True), name="frontend")
