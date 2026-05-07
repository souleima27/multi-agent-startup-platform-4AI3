from __future__ import annotations

import json
import os
import subprocess
import sys
import threading
from pathlib import Path
from typing import Any

import httpx
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

import track2_api

BASE_DIR = Path(__file__).resolve().parent
DIST_DIR = BASE_DIR / "dist"
TRACK1_REPORT_PATH = BASE_DIR / "track1_latest_report.json"

app = FastAPI(title="Venture Path Full Stack")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(track2_api.app.router)


@app.on_event("startup")
def start_internal_track_servers() -> None:
    for module_name in ("track3_api", "pitch_coach_api"):
        try:
            module = __import__(module_name)
            thread = threading.Thread(target=module.main, daemon=True)
            thread.start()
        except Exception as exc:
            print(f"[app_server] Could not start {module_name}: {exc}", flush=True)


@app.get("/api/health")
def full_stack_health() -> dict[str, Any]:
    return {
        "ok": True,
        "frontend": DIST_DIR.exists(),
        "track1": "fallback",
        "track2": "mounted",
        "track3": "proxied",
        "pitch": "proxied",
    }


def build_track1_report(payload: dict[str, Any]) -> dict[str, Any]:
    idea = payload.get("startup_idea") or payload.get("idea") or "Startup idea"
    description = payload.get("idea_description") or payload.get("description") or ""
    industry = payload.get("industry") or "unknown"
    product_type = payload.get("product_type") or "software tool / SaaS"
    customer = payload.get("target_customer_type") or "Mixed / other"

    return {
        "startup_summary": {
            "idea": idea,
            "problem": description or "Problem statement was not detailed enough.",
            "how_it_works": "The concept should be validated with a small MVP and early customer interviews.",
            "target_customer": customer,
            "business_model": product_type,
        },
        "market_existence": {
            "status": "uncertain",
            "existence_risk_score": "Medium",
            "innovation_score": "Medium",
            "confidence": "Medium",
            "summary": f"Initial automated review for the {industry} sector. The dedicated Track1 agent is not included in this repository, so this online report is a fallback assessment.",
            "relevant_existing_solutions": [],
            "uncertainty_notes": [
                "Deploy the original Track1 agent to replace this fallback analysis.",
                "Validate competitors and demand with direct market research.",
            ],
        },
        "mvp": {
            "mvp_summary": "Start with the smallest version that proves the core value proposition.",
            "must_haves": ["Landing page", "User signup", "Core workflow", "Feedback collection"],
            "acceptance_criteria": ["A user can complete the core action", "The team can measure activation", "Feedback is stored and reviewed"],
            "user_journey": ["Discover the product", "Sign up", "Complete the core action", "Receive value", "Leave feedback"],
            "out_of_scope": ["Advanced automation", "Large integrations", "Complex analytics"],
        },
        "operations": {
            "minimum_roles_responsibilities": [
                {"role": "Product lead", "necessity_level": "high", "why_needed": "Owns scope, validation, and roadmap."},
                {"role": "Developer", "necessity_level": "high", "why_needed": "Builds and maintains the MVP."},
                {"role": "Growth / sales", "necessity_level": "medium", "why_needed": "Finds early users and partners."},
            ],
            "materials_equipment": ["Laptop", "Hosting", "Analytics", "Customer support channel"],
            "tools_stack": ["React", "FastAPI", "Supabase", "Render"],
            "important_operational_notes": ["Keep the MVP narrow.", "Track real user behavior before scaling."],
        },
        "finance": {
            "expected_monthly_revenue": {"value": "To validate"},
            "payback_months": {"value": "Unknown"},
            "suggested_price": {"range_tnd": "Test with early customers"},
            "tools_materials_ops_costs": {"hosting": "Low at MVP stage", "software": "Low to medium"},
            "monthly_costs": {"team": "Main cost", "hosting": "Low initially"},
            "one_time_costs": {"development": "Depends on MVP scope"},
            "price_realism": {"status": "Needs validation"},
            "missing_or_uncertain_parts": ["Customer acquisition cost", "Conversion rate", "Willingness to pay"],
        },
        "legal_and_compliance": {
            "risk_level": "Medium",
            "legal_compliance_checklist": ["Choose legal form", "Prepare terms", "Prepare privacy policy", "Handle user data carefully"],
            "trust_requirements": ["Transparent pricing", "Clear contact details", "Secure authentication"],
            "special_operational_constraints": ["Confirm sector-specific regulations before launch"],
            "filtered_summary": ["Fallback legal review only. Use Track B for detailed legal guidance."],
        },
        "final_verdict": {
            "is_startup_promising": "uncertain",
            "is_feasible": "yes",
            "main_strengths": ["Deployable MVP path", "Clear testing opportunity"],
            "main_weaknesses": ["Market evidence still needed", "Original Track1 agent missing from deployed code"],
            "recommended_next_steps": ["Deploy or add the real Track1 backend", "Run customer interviews", "Launch a small MVP test"],
        },
        "uncertainty_flags": ["Track1 backend source is missing from this repository."],
    }


@app.post("/track1/analyze")
async def track1_analyze(request: Request) -> JSONResponse:
    payload = await request.json()
    report = build_track1_report(payload)
    TRACK1_REPORT_PATH.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    return JSONResponse(report)


@app.get("/track1/report")
def track1_report() -> JSONResponse:
    if TRACK1_REPORT_PATH.exists():
        return JSONResponse(json.loads(TRACK1_REPORT_PATH.read_text(encoding="utf-8")))
    return JSONResponse(build_track1_report({}))


async def proxy_to_internal(request: Request, base_url: str, path: str) -> Response:
    target_url = f"{base_url}/{path}"
    if request.url.query:
        target_url = f"{target_url}?{request.url.query}"

    headers = {
        key: value
        for key, value in request.headers.items()
        if key.lower() not in {"host", "content-length"}
    }

    async with httpx.AsyncClient(timeout=300.0) as client:
        proxied = await client.request(
            request.method,
            target_url,
            content=await request.body(),
            headers=headers,
        )

    return Response(
        content=proxied.content,
        status_code=proxied.status_code,
        headers={
            key: value
            for key, value in proxied.headers.items()
            if key.lower() not in {"content-encoding", "transfer-encoding", "connection"}
        },
    )


@app.api_route("/track3/{path:path}", methods=["GET", "POST", "OPTIONS"])
async def track3_proxy(request: Request, path: str) -> Response:
    return await proxy_to_internal(request, "http://127.0.0.1:5056/track3", path)


@app.api_route("/pitch/{path:path}", methods=["GET", "POST", "OPTIONS"])
async def pitch_proxy(request: Request, path: str) -> Response:
    return await proxy_to_internal(request, "http://127.0.0.1:5057/pitch", path)


if DIST_DIR.exists():
    app.mount("/assets", StaticFiles(directory=DIST_DIR / "assets"), name="assets")


@app.get("/{full_path:path}")
def serve_frontend(full_path: str) -> FileResponse:
    requested = DIST_DIR / full_path
    if full_path and requested.is_file():
        return FileResponse(requested)
    return FileResponse(DIST_DIR / "index.html")
