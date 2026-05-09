import asyncio
import importlib
import json
import os
import sys
from contextlib import contextmanager
from copy import deepcopy
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent
TRACK3_DIR = BASE_DIR.parent / "Track3" / "ExecutionAgent"
DEFAULT_INPUT_PATH = BASE_DIR / "track3_bridge_input.json"
DEFAULT_OUTPUT_PATH = BASE_DIR / "track3_bridge_output.json"

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")


@contextmanager
def working_directory(path: Path):
    previous = Path.cwd()
    os.chdir(path)
    try:
        yield
    finally:
        os.chdir(previous)


def load_payload(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def load_base_state() -> dict:
    state_path = TRACK3_DIR / "startup_state.json"
    return json.loads(state_path.read_text(encoding="utf-8"))


def build_fallback_result(payload: dict, reason: str) -> dict:
    startup_profile = payload.get("startup_profile", {})
    mvp_plan = payload.get("mvp_plan", {})
    team = payload.get("team", [])
    startup_name = startup_profile.get("name") or startup_profile.get("startup_name") or "Startup"
    features = normalize_items(mvp_plan.get("features"))
    workflow = normalize_items(mvp_plan.get("admin_workflow"))
    tasks = features + workflow
    if not tasks:
        tasks = [
            {"name": "Validate MVP scope with founders", "priority": "high"},
            {"name": "Prepare first delivery sprint", "priority": "high"},
            {"name": "Define launch metrics", "priority": "medium"},
        ]

    owners = normalize_team(team)
    owner_names = [member.get("name") or member.get("role") for member in owners] or ["Founder"]
    task_list = [
        {
            "id": f"T{i + 1:02d}",
            "title": task["name"],
            "priority": task.get("priority", "medium"),
            "assigned_to": owner_names[i % len(owner_names)],
            "owner": owner_names[i % len(owner_names)],
            "status": "ready",
            "estimated_days": 2 if task.get("priority") == "high" else 3,
            "estimate_days": 2 if task.get("priority") == "high" else 3,
            "milestone_title": "MVP execution",
            "agent_action": "plan",
        }
        for i, task in enumerate(tasks)
    ]

    return {
        "startup_name": startup_name,
        "models": {"mode": "fallback", "planner": "local", "critic": "local"},
        "executive_summary": {
            "startup_name": startup_name,
            "model_mode": os.getenv("MODEL_MODE", "hybrid"),
            "planner_model": os.getenv("LLM_PLANNER_MODEL", "not configured"),
            "critic_model": os.getenv("LLM_CRITIC_MODEL", "not configured"),
            "feasibility": "partial",
            "main_risk": "Full ExecutionAgent package is not available on the deployed service.",
            "summary": (
                f"{startup_name} has a workable execution path, but the deployed Track3 agent "
                "could not load its full ExecutionAgent package. This response is a structured fallback."
            ),
        },
        "founder_decisions": [
            "Confirm the MVP scope before adding integrations.",
            "Assign one owner for each high-priority task.",
            "Review the Render deployment logs to restore the full Track3 agent.",
        ],
        "owner_action_plan": [
            {"owner": owner, "next_action": "Pick the highest priority ready task and report progress."}
            for owner in owner_names
        ],
        "feasibility": {
            "status": "partial",
            "risk_level": "medium",
            "reason": "Fallback generated because the full Track3 runner failed.",
        },
        "monitoring": {
            "cadence": "Daily execution check",
            "task_count": len(task_list),
            "ready_count": len(task_list[:5]),
            "signals": ["completed_tasks", "blocked_tasks", "owner_capacity"],
        },
        "next_actions": [task["title"] for task in task_list[:5]],
        "anomalies": [reason],
        "critic_report": {
            "status": "needs_full_agent",
            "recommendations": [
                "Confirm the ExecutionAgent source files are pushed with the repo.",
                "Check /track3/health to confirm LLM and Jira environment variables are loaded.",
            ],
            "notes": [
                "The online service is reachable.",
                "The complete ExecutionAgent dependency must be available for full AI planning.",
            ],
        },
        "priority_queue": task_list,
        "ready_queue": task_list[:5],
        "task_list": task_list,
        "jira": {"sync_enabled": False, "status": "skipped_in_fallback"},
    }


def ensure_agent_defaults(state: dict) -> dict:
    state.setdefault("knowledge_base", {"sources": [], "last_retrieval": {}})
    state.setdefault("retrospective", {"velocity_default": 1.0, "notes": []})
    state.setdefault(
        "constraints",
        {
            "max_parallel_tasks_per_member": 2,
            "working_days_per_week": 5,
            "current_date": os.getenv("TRACK3_CURRENT_DATE", "2026-04-28"),
        },
    )
    state["execution_state"] = {}
    return state


def normalize_items(items):
    normalized = []
    for item in items or []:
        name = str(item.get("name", "")).strip()
        if not name:
            continue
        normalized.append(
            {
                "name": name,
                "priority": str(item.get("priority", "medium")).strip().lower() or "medium",
            }
        )
    return normalized


def normalize_team(team):
    normalized = []
    for member in team or []:
        name = str(member.get("name", "")).strip()
        role = str(member.get("role", "")).strip()
        if not name and not role:
            continue

        skills = member.get("skills", [])
        if isinstance(skills, str):
            skills = [part.strip() for part in skills.split(",") if part.strip()]

        normalized.append(
            {
                "name": name,
                "role": role,
                "skills": [str(skill).strip() for skill in skills if str(skill).strip()],
                "availability": float(member.get("availability", 1) or 1),
            }
        )
    return normalized


def merge_state(payload: dict) -> dict:
    state = ensure_agent_defaults(deepcopy(load_base_state()))
    startup_profile = payload.get("startup_profile", {})
    mvp_plan = payload.get("mvp_plan", {})
    live_status = payload.get("live_status", {})

    state["startup_profile"] = {
        **state.get("startup_profile", {}),
        **{key: value for key, value in startup_profile.items() if value not in (None, "")},
    }

    state["mvp_plan"] = {
        **state.get("mvp_plan", {}),
        "features": normalize_items(mvp_plan.get("features")) or state.get("mvp_plan", {}).get("features", []),
        "admin_workflow": normalize_items(mvp_plan.get("admin_workflow"))
        or state.get("mvp_plan", {}).get("admin_workflow", []),
        "deadlines": {
            **state.get("mvp_plan", {}).get("deadlines", {}),
            **(mvp_plan.get("deadlines") or {}),
        },
    }

    state["team"] = normalize_team(payload.get("team")) or state.get("team", [])
    state["live_status"] = {
        "progress_signals": live_status.get("progress_signals", []),
        "founder_notes": str(live_status.get("founder_notes", "")).strip(),
    }

    if isinstance(payload.get("knowledge_base"), dict):
        state["knowledge_base"] = {
            **state.get("knowledge_base", {}),
            **payload.get("knowledge_base", {}),
        }

    if isinstance(payload.get("retrospective"), dict):
        state["retrospective"] = {
            **state.get("retrospective", {}),
            **payload.get("retrospective", {}),
        }

    if isinstance(payload.get("constraints"), dict):
        state["constraints"] = {
            **state.get("constraints", {}),
            **payload.get("constraints", {}),
        }

    return state


def build_response(result: dict) -> dict:
    return {
        "startup_name": result.get("startup_name"),
        "models": result.get("models"),
        "executive_summary": result.get("executive_summary"),
        "founder_decisions": result.get("founder_decisions"),
        "owner_action_plan": result.get("owner_action_plan"),
        "feasibility": result.get("feasibility"),
        "monitoring": result.get("monitoring"),
        "next_actions": result.get("next_actions"),
        "anomalies": result.get("anomalies"),
        "critic_report": result.get("critic_report"),
        "priority_queue": result.get("priority_queue"),
        "ready_queue": result.get("ready_queue"),
        "task_list": result.get("task_list"),
        "jira": result.get("jira"),
    }


async def run_agent(state: dict) -> dict:
    if str(TRACK3_DIR) not in sys.path:
        sys.path.insert(0, str(TRACK3_DIR))

    execution_module = importlib.import_module("execution_agent_with_mcp")

    kb_path = TRACK3_DIR / "structured_kb_sections" / "all_kb_records.json"
    server_script = TRACK3_DIR / "mcp_startup_server.py"

    with working_directory(TRACK3_DIR):
        kb = execution_module.LocalKnowledgeBase(
            kb_path=str(kb_path),
            embed_model_name=execution_module.EMBED_MODEL_NAME,
            rerank_model_name=execution_module.RERANK_MODEL_NAME,
        )
        llm = execution_module.LLMClient(
            api_key=execution_module.LLM_API_KEY,
            base_url=execution_module.LLM_BASE_URL,
        )
        mcp_client = execution_module.MCPProjectOpsClient(
            server_script=str(server_script),
            python_cmd=sys.executable,
        )
        orchestrator = execution_module.ExecutionOrchestrator(
            llm=llm,
            kb=kb,
            mcp_client=mcp_client,
        )
        return await orchestrator.run(state)


def main():
    input_path = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_INPUT_PATH
    output_path = Path(sys.argv[2]) if len(sys.argv) > 2 else DEFAULT_OUTPUT_PATH

    payload = load_payload(input_path)
    try:
        state = merge_state(payload)
        result = asyncio.run(run_agent(state))
    except Exception as error:
        result = build_fallback_result(payload, f"{type(error).__name__}: {error}")

    output_path.write_text(
        json.dumps(build_response(result), ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
