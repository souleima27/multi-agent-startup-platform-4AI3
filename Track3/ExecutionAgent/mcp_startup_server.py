import json
import os
import sys
from typing import Any, Dict, List, Optional

from mcp.server.fastmcp import FastMCP

FACTS_FILE = "startup_state.json"
RUNTIME_FILE = "agent_runtime.json"

mcp = FastMCP("startup-project-manager", json_response=True)


def log(msg: str) -> None:
    print(msg, file=sys.stderr)


def load_json(path: str) -> Dict[str, Any]:
    if not os.path.exists(path):
        return {}
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def save_json(path: str, data: Dict[str, Any]) -> None:
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def load_facts() -> Dict[str, Any]:
    return load_json(FACTS_FILE)


def load_runtime() -> Dict[str, Any]:
    data = load_json(RUNTIME_FILE)
    data.setdefault("tasks", [])
    return data


def save_runtime(data: Dict[str, Any]) -> None:
    data.setdefault("tasks", [])
    save_json(RUNTIME_FILE, data)


@mcp.tool()
def create_task(task: Dict[str, Any]) -> Dict[str, Any]:
    runtime = load_runtime()
    tasks = runtime.setdefault("tasks", [])

    task_id = task.get("id")

    if not task_id:
        return {"created": False, "error": "Task id is required"}

    if any(t.get("id") == task_id for t in tasks):
        return {"created": False, "error": f"Task already exists: {task_id}"}

    tasks.append(task)
    save_runtime(runtime)
    return {"created": True, "task": task}


@mcp.tool()
def update_task_status(
    task_id: str,
    new_status: str,
    blocked_reason: Optional[str] = None,
    progress: Optional[float] = None,
    actual_days: Optional[float] = None,
) -> Dict[str, Any]:
    runtime = load_runtime()
    tasks = runtime.get("tasks", [])

    for task in tasks:
        if task.get("id") == task_id:
            task["status"] = new_status
            if blocked_reason is not None:
                task["blocked_reason"] = blocked_reason
            if progress is not None:
                task["progress"] = progress
            if actual_days is not None:
                task["actual_days"] = actual_days
            save_runtime(runtime)
            return {"updated": True, "task": task}

    return {"updated": False, "error": f"Task not found: {task_id}"}


@mcp.tool()
def assign_owner(task_id: str, owner: str) -> Dict[str, Any]:
    runtime = load_runtime()
    tasks = runtime.get("tasks", [])

    for task in tasks:
        if task.get("id") == task_id:
            task["assigned_to"] = owner
            save_runtime(runtime)
            return {"updated": True, "task": task}

    return {"updated": False, "error": f"Task not found: {task_id}"}


@mcp.tool()
def generate_execution_summary(summary: Dict[str, Any]) -> Dict[str, Any]:
    runtime = load_runtime()
    runtime["last_execution_summary"] = summary
    save_runtime(runtime)
    return {"written": True, "summary": summary}


@mcp.resource("startup://facts")
def startup_facts() -> str:
    return json.dumps(load_facts(), ensure_ascii=False, indent=2)


@mcp.resource("team://current")
def team_resource() -> str:
    facts = load_facts()
    return json.dumps(facts.get("team", []), ensure_ascii=False, indent=2)


@mcp.resource("runtime://tasks")
def runtime_tasks() -> str:
    runtime = load_runtime()
    return json.dumps(runtime.get("tasks", []), ensure_ascii=False, indent=2)


if __name__ == "__main__":
    log("[MCP Server] startup-project-manager starting...")
    mcp.run()
