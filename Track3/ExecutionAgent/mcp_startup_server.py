# mcp_startup_server.py

import json
import os
import sys
from datetime import datetime
from typing import Any, Dict, List, Optional

import httpx
from mcp.server.fastmcp import FastMCP

FACTS_FILE = "startup_state.json"
RUNTIME_FILE = "agent_runtime.json"

JIRA_BASE_URL = os.getenv("JIRA_BASE_URL", "").rstrip("/")
JIRA_USER_EMAIL = os.getenv("JIRA_USER_EMAIL", "")
JIRA_API_TOKEN = os.getenv("JIRA_API_TOKEN", "")
JIRA_PROJECT_KEY = os.getenv("JIRA_PROJECT_KEY", "")
JIRA_ISSUE_TYPE = os.getenv("JIRA_ISSUE_TYPE", "Task")
JIRA_VERIFY_SSL = os.getenv("JIRA_VERIFY_SSL", "true").lower() in {"true", "1", "yes"}

mcp = FastMCP("startup-project-manager", json_response=True)


# ---------------------------------------------------------
# STATUS MAPPING
# ---------------------------------------------------------

STATUS_TO_JIRA = {
    "todo": [
        "À faire",
        "A faire",
        "To Do",
        "Open",
        "Backlog",
        "Selected for Development",
    ],
    "in_progress": [
        "En cours",
        "In Progress",
        "Doing",
    ],
    "done": [
        "Terminé",
        "Terminée",
        "Done",
        "Closed",
        "Resolved",
    ],
    "blocked": [
        "Bloqué",
        "Bloquee",
        "Blocked",
    ],
    "delayed": [
        "Retardé",
        "Retardee",
        "Delayed",
    ],
}


# ---------------------------------------------------------
# HELPERS
# ---------------------------------------------------------

def log(msg: str) -> None:
    print(msg, file=sys.stderr)


def now_utc_iso() -> str:
    return datetime.utcnow().isoformat() + "Z"


def clean_text(value: Any) -> str:
    if value is None:
        return ""
    return str(value).strip()


def normalize_text(value: Any) -> str:
    return clean_text(value).lower()


def normalize_status(value: Optional[str]) -> str:
    text = normalize_text(value)
    if text in {"todo", "to do", "a faire", "à faire", "open", "backlog"}:
        return "todo"
    if text in {"in_progress", "in progress", "en cours", "doing"}:
        return "in_progress"
    if text in {"done", "termine", "terminé", "terminee", "terminée", "closed", "resolved"}:
        return "done"
    if text in {"blocked", "bloque", "bloqué", "bloquee", "bloquée"}:
        return "blocked"
    if text in {"delayed", "retarde", "retardé", "retardee", "retardée"}:
        return "delayed"
    return text or "todo"


def normalize_action(value: Optional[str]) -> str:
    text = normalize_text(value)
    allowed = {
        "create",
        "update",
        "transition",
        "reassign",
        "defer",
        "leave_unchanged",
        "escalate",
    }
    return text if text in allowed else "update"


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
    data.setdefault("jira", {"last_sync": None, "issues_synced": 0})
    return data


def save_runtime(data: Dict[str, Any]) -> None:
    data.setdefault("tasks", [])
    data.setdefault("jira", {"last_sync": None, "issues_synced": 0})
    save_json(RUNTIME_FILE, data)


def jira_is_configured() -> bool:
    return all([JIRA_BASE_URL, JIRA_USER_EMAIL, JIRA_API_TOKEN, JIRA_PROJECT_KEY])


def jira_headers() -> Dict[str, str]:
    return {
        "Accept": "application/json",
        "Content-Type": "application/json",
    }


def jira_auth() -> httpx.BasicAuth:
    return httpx.BasicAuth(JIRA_USER_EMAIL, JIRA_API_TOKEN)


def jira_issue_url(issue_key: str) -> str:
    return f"{JIRA_BASE_URL}/browse/{issue_key}" if issue_key else ""


def adf_paragraph(text: str) -> Dict[str, Any]:
    return {
        "type": "paragraph",
        "content": [{"type": "text", "text": text}] if text else [],
    }


def jira_adf_from_task(task: Dict[str, Any]) -> Dict[str, Any]:
    lines = [
        f"Execution Agent Task ID: {task.get('id', '')}",
        f"Milestone: {task.get('milestone_title', '')}",
        f"Owner: {task.get('assigned_to') or 'Unassigned'}",
        f"Priority: {task.get('priority', 'medium')}",
        f"Estimated days: {task.get('estimated_days', 'N/A')}",
        f"Deadline: {task.get('deadline') or 'N/A'}",
        f"Local status: {task.get('status') or 'todo'}",
        f"Agent action: {task.get('agent_action') or 'update'}",
        "",
        task.get("description", "") or "No description provided.",
    ]

    blocked_reason = task.get("blocked_reason")
    if blocked_reason:
        lines.extend(["", f"Blocked reason: {blocked_reason}"])

    depends_on = task.get("depends_on", []) or []
    if depends_on:
        lines.extend(["", f"Depends on: {', '.join(depends_on)}"])

    action_reason = task.get("agent_action_reason")
    if action_reason:
        lines.extend(["", f"Agent action reason: {action_reason}"])

    return {
        "type": "doc",
        "version": 1,
        "content": [adf_paragraph(line) for line in lines],
    }


def jira_field_payload(task: Dict[str, Any]) -> Dict[str, Any]:
    labels = ["execution-agent", f"startup-{JIRA_PROJECT_KEY.lower()}"]

    category = clean_text(task.get("category", "")).lower()
    if category:
        labels.append(category.replace("_", "-"))

    fields: Dict[str, Any] = {
        "project": {"key": JIRA_PROJECT_KEY},
        "summary": clean_text(task.get("title", "Untitled task"))[:255],
        "issuetype": {"name": JIRA_ISSUE_TYPE},
        "description": jira_adf_from_task(task),
        "labels": labels,
    }

    priority = clean_text(task.get("priority", "medium")).lower()
    jira_priority = {
        "high": "High",
        "medium": "Medium",
        "low": "Low",
    }.get(priority)

    if jira_priority:
        fields["priority"] = {"name": jira_priority}

    return fields


def merge_runtime_task(existing: Dict[str, Any], incoming: Dict[str, Any]) -> Dict[str, Any]:
    merged = dict(existing)
    merged.update(incoming)
    return merged


def find_runtime_task_by_title(tasks: List[Dict[str, Any]], title: str) -> Optional[Dict[str, Any]]:
    norm_title = normalize_text(title)
    for task in tasks:
        if normalize_text(task.get("title")) == norm_title:
            return task
    return None


# ---------------------------------------------------------
# JIRA API
# ---------------------------------------------------------

def jira_get_issue(issue_key: str) -> Dict[str, Any]:
    with httpx.Client(auth=jira_auth(), headers=jira_headers(), verify=JIRA_VERIFY_SSL, timeout=30.0) as client:
        resp = client.get(f"{JIRA_BASE_URL}/rest/api/3/issue/{issue_key}")
        resp.raise_for_status()
        return resp.json()


def jira_search_issue_by_summary(summary: str) -> Optional[Dict[str, Any]]:
    jql = f'project = "{JIRA_PROJECT_KEY}" AND summary ~ "{summary.replace(chr(34), "")}" ORDER BY created DESC'
    with httpx.Client(auth=jira_auth(), headers=jira_headers(), verify=JIRA_VERIFY_SSL, timeout=30.0) as client:
        resp = client.get(
            f"{JIRA_BASE_URL}/rest/api/3/search",
            params={"jql": jql, "maxResults": 10},
        )
        resp.raise_for_status()
        issues = resp.json().get("issues", [])
        if not issues:
            return None

        target_title = normalize_text(summary)
        for issue in issues:
            issue_summary = normalize_text(issue.get("fields", {}).get("summary", ""))
            if issue_summary == target_title:
                return issue

        return issues[0]


def jira_get_issue_transitions(issue_key: str) -> List[Dict[str, Any]]:
    with httpx.Client(auth=jira_auth(), headers=jira_headers(), verify=JIRA_VERIFY_SSL, timeout=30.0) as client:
        resp = client.get(f"{JIRA_BASE_URL}/rest/api/3/issue/{issue_key}/transitions")
        resp.raise_for_status()
        return resp.json().get("transitions", [])


def jira_transition_issue(issue_key: str, local_status: str) -> Dict[str, Any]:
    local_status = normalize_status(local_status)
    target_names = STATUS_TO_JIRA.get(local_status, [])
    if not target_names:
        return {"changed": False, "reason": f"No Jira mapping for local status={local_status}."}

    try:
        issue_data = jira_get_issue(issue_key)
        current_status = clean_text(issue_data.get("fields", {}).get("status", {}).get("name", ""))
        if current_status and current_status.lower() in {name.lower() for name in target_names}:
            return {"changed": False, "reason": f"Already in target status: {current_status}", "to": current_status}
    except Exception:
        pass

    transitions = jira_get_issue_transitions(issue_key)
    target = None
    lowered_targets = {name.lower() for name in target_names}

    for transition in transitions:
        to_name = clean_text(transition.get("to", {}).get("name", "")).lower()
        if to_name in lowered_targets:
            target = transition
            break

    if not target:
        available = [clean_text(t.get("to", {}).get("name", "")) for t in transitions]
        return {
            "changed": False,
            "reason": f"No available Jira transition for status={local_status}. Available: {available}",
        }

    with httpx.Client(auth=jira_auth(), headers=jira_headers(), verify=JIRA_VERIFY_SSL, timeout=30.0) as client:
        resp = client.post(
            f"{JIRA_BASE_URL}/rest/api/3/issue/{issue_key}/transitions",
            json={"transition": {"id": target["id"]}},
        )
        resp.raise_for_status()

    return {
        "changed": True,
        "transition_id": target["id"],
        "to": clean_text(target.get("to", {}).get("name")),
    }


def jira_create_issue(task: Dict[str, Any]) -> Dict[str, Any]:
    payload = {"fields": jira_field_payload(task)}
    with httpx.Client(auth=jira_auth(), headers=jira_headers(), verify=JIRA_VERIFY_SSL, timeout=30.0) as client:
        resp = client.post(f"{JIRA_BASE_URL}/rest/api/3/issue", json=payload)
        resp.raise_for_status()
        data = resp.json()

    return {
        "key": data.get("key"),
        "id": data.get("id"),
        "url": jira_issue_url(data.get("key", "")),
    }


def jira_update_issue(issue_key: str, task: Dict[str, Any]) -> Dict[str, Any]:
    payload = {"fields": jira_field_payload(task)}
    with httpx.Client(auth=jira_auth(), headers=jira_headers(), verify=JIRA_VERIFY_SSL, timeout=30.0) as client:
        resp = client.put(f"{JIRA_BASE_URL}/rest/api/3/issue/{issue_key}", json=payload)
        resp.raise_for_status()

    return {"updated": True, "key": issue_key, "url": jira_issue_url(issue_key)}


# ---------------------------------------------------------
# MCP TOOLS
# ---------------------------------------------------------

@mcp.tool()
def list_tasks(status: Optional[str] = None, assigned_to: Optional[str] = None) -> Dict[str, Any]:
    runtime = load_runtime()
    tasks = runtime.get("tasks", [])

    result = tasks
    if status:
        result = [t for t in result if normalize_status(t.get("status")) == normalize_status(status)]
    if assigned_to:
        result = [t for t in result if clean_text(t.get("assigned_to")) == clean_text(assigned_to)]

    return {"count": len(result), "tasks": result, "jira": runtime.get("jira", {})}


@mcp.tool()
def upsert_tasks(tasks: List[Dict[str, Any]]) -> Dict[str, Any]:
    runtime = load_runtime()
    existing = {t["id"]: t for t in runtime.get("tasks", []) if t.get("id")}
    inserted = 0
    updated = 0

    for task in tasks:
        task_id = task.get("id")
        if not task_id:
            continue

        task["status"] = normalize_status(task.get("status"))

        if task_id in existing:
            existing[task_id] = merge_runtime_task(existing[task_id], task)
            updated += 1
        else:
            existing[task_id] = task
            inserted += 1

    runtime["tasks"] = list(existing.values())
    save_runtime(runtime)

    return {
        "ok": True,
        "inserted": inserted,
        "updated": updated,
        "total_tasks": len(runtime["tasks"]),
        "jira": runtime.get("jira", {}),
    }


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
            task["status"] = normalize_status(new_status)
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
def get_team_capacity() -> Dict[str, Any]:
    facts = load_facts()
    runtime = load_runtime()
    team = facts.get("team", [])
    tasks = runtime.get("tasks", [])

    result = []
    for member in team:
        current_load = len([
            t for t in tasks
            if clean_text(t.get("assigned_to")) == clean_text(member.get("name"))
            and normalize_status(t.get("status")) in {"todo", "in_progress", "blocked", "delayed"}
        ])
        result.append({
            "name": member.get("name"),
            "role": member.get("role"),
            "availability": member.get("availability", 1.0),
            "current_load": current_load,
            "skills": member.get("skills", []),
        })

    return {"team_capacity": result}


@mcp.tool()
def clear_runtime_tasks() -> Dict[str, Any]:
    runtime = {"tasks": [], "jira": {"last_sync": None, "issues_synced": 0}}
    save_runtime(runtime)
    return {"ok": True, "total_tasks": 0}


@mcp.tool()
def sync_tasks_to_jira(tasks: List[Dict[str, Any]]) -> Dict[str, Any]:
    runtime = load_runtime()
    existing = {t["id"]: t for t in runtime.get("tasks", []) if t.get("id")}

    if not jira_is_configured():
        return {
            "ok": False,
            "jira_enabled": False,
            "error": "Jira is not configured. Set JIRA_BASE_URL, JIRA_USER_EMAIL, JIRA_API_TOKEN, and JIRA_PROJECT_KEY.",
            "tasks": list(existing.values()),
        }

    synced = []
    created = 0
    updated = 0
    errors = []

    for task in tasks:
        task_id = task.get("id")
        if not task_id:
            continue

        stored = existing.get(task_id, {})
        merged_task = merge_runtime_task(stored, task)
        merged_task["status"] = normalize_status(merged_task.get("status"))
        merged_task["agent_action"] = normalize_action(merged_task.get("agent_action"))
        issue_key = clean_text(merged_task.get("jira_issue_key"))

        try:
            if not issue_key:
                by_title = find_runtime_task_by_title(runtime.get("tasks", []), merged_task.get("title", ""))
                if by_title and by_title.get("jira_issue_key"):
                    issue_key = by_title.get("jira_issue_key")
                    merged_task["jira_issue_key"] = issue_key
                    merged_task["jira_issue_id"] = by_title.get("jira_issue_id")
                    merged_task["jira_issue_url"] = by_title.get("jira_issue_url")

            if not issue_key:
                found_issue = jira_search_issue_by_summary(merged_task.get("title", ""))
                if found_issue:
                    issue_key = found_issue.get("key")
                    merged_task["jira_issue_key"] = issue_key
                    merged_task["jira_issue_id"] = found_issue.get("id")
                    merged_task["jira_issue_url"] = jira_issue_url(issue_key)

            action = merged_task.get("agent_action", "update")

            if action == "leave_unchanged" and issue_key:
                pass
            elif not issue_key or action == "create":
                created_issue = jira_create_issue(merged_task)
                issue_key = created_issue.get("key")
                merged_task["jira_issue_key"] = issue_key
                merged_task["jira_issue_id"] = created_issue.get("id")
                merged_task["jira_issue_url"] = created_issue.get("url")
                created += 1
            else:
                jira_update_issue(issue_key, merged_task)
                updated += 1

            if issue_key and action in {"transition", "update", "create", "reassign", "defer"}:
                try:
                    transition_result = jira_transition_issue(issue_key, merged_task.get("status", "todo"))
                    merged_task["jira_transition_result"] = transition_result
                except Exception as transition_error:
                    merged_task["jira_transition_result"] = {
                        "changed": False,
                        "reason": str(transition_error),
                    }

                issue_data = jira_get_issue(issue_key)
                status_name = issue_data.get("fields", {}).get("status", {}).get("name")
                merged_task["jira_status"] = status_name
                merged_task["jira_issue_url"] = jira_issue_url(issue_key)

            existing[task_id] = merged_task
            synced.append({
                "task_id": task_id,
                "title": merged_task.get("title"),
                "jira_issue_key": merged_task.get("jira_issue_key"),
                "jira_status": merged_task.get("jira_status"),
                "jira_issue_url": merged_task.get("jira_issue_url"),
                "agent_action": merged_task.get("agent_action"),
            })

        except Exception as e:
            errors.append({
                "task_id": task_id,
                "title": merged_task.get("title"),
                "error": str(e),
                "agent_action": merged_task.get("agent_action"),
            })

    runtime["tasks"] = list(existing.values())
    runtime["jira"] = {
        "enabled": True,
        "project_key": JIRA_PROJECT_KEY,
        "issues_synced": len(synced),
        "created": created,
        "updated": updated,
        "errors": len(errors),
        "last_sync": now_utc_iso(),
    }
    save_runtime(runtime)

    return {
        "ok": len(errors) == 0,
        "jira_enabled": True,
        "summary": runtime["jira"],
        "synced": synced,
        "errors": errors,
        "tasks": runtime["tasks"],
    }


@mcp.tool()
def fetch_jira_updates() -> Dict[str, Any]:
    runtime = load_runtime()
    tasks = runtime.get("tasks", [])

    if not jira_is_configured():
        return {
            "ok": False,
            "jira_enabled": False,
            "error": "Jira is not configured.",
            "tasks": tasks,
        }

    refreshed = 0
    errors = []

    for task in tasks:
        issue_key = task.get("jira_issue_key")
        if not issue_key:
            continue
        try:
            issue_data = jira_get_issue(issue_key)
            status_name = issue_data.get("fields", {}).get("status", {}).get("name")
            task["jira_status"] = status_name
            task["jira_issue_url"] = jira_issue_url(issue_key)
            refreshed += 1
        except Exception as e:
            errors.append({
                "task_id": task.get("id"),
                "jira_issue_key": issue_key,
                "error": str(e),
            })

    runtime["jira"] = {
        **runtime.get("jira", {}),
        "enabled": True,
        "project_key": JIRA_PROJECT_KEY,
        "refreshed": refreshed,
        "errors": len(errors),
        "last_pull": now_utc_iso(),
    }
    save_runtime(runtime)

    return {
        "ok": len(errors) == 0,
        "jira_enabled": True,
        "summary": runtime["jira"],
        "tasks": tasks,
        "errors": errors,
    }


# ---------------------------------------------------------
# RESOURCES
# ---------------------------------------------------------

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