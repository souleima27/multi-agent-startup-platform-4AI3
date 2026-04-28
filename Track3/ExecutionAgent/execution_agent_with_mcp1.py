# =========================================================
# EXECUTION AGENT WITH MCP
# State contains facts only.
# Agent thinks, reasons, creates tasks, assigns them, then persists via MCP.
# =========================================================

import os
import re
import json
import time
import copy
import httpx
import pandas as pd
import networkx as nx

from typing import Any, Dict, List, Optional, Tuple
from datetime import datetime, date
from sentence_transformers import SentenceTransformer, CrossEncoder
from openai import OpenAI

from mcp_client_adapter import MCPProjectOpsClient

# =========================================================
# 0) CONFIG
# =========================================================

KB_PATH = "structured_kb_sections/all_kb_records.json"

MODEL_MODE = os.getenv("MODEL_MODE", "local").lower()

LLM_API_KEY = os.getenv("LLM_API_KEY", "")
LLM_BASE_URL = os.getenv("LLM_BASE_URL", "https://tokenfactory.esprit.tn/api")
LLM_PLANNER_MODEL = os.getenv("LLM_PLANNER_MODEL", "hosted_vllm/Llama-3.1-70B-Instruct")
LLM_CRITIC_MODEL = os.getenv("LLM_CRITIC_MODEL", "hosted_vllm/Llama-3.1-70B-Instruct")

VERIFY_SSL = os.getenv("LLM_VERIFY_SSL", "false").lower() in ["true", "1", "yes"]

EMBED_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
RERANK_MODEL_NAME = "cross-encoder/ms-marco-MiniLM-L6-v2"

TOP_K_RETRIEVE = 8
TOP_K_RERANK = 4
MODEL_CALL_SLEEP_SECONDS = 1

PLANNER_MAX_TOKENS = int(os.getenv("PLANNER_MAX_TOKENS", "1600"))
CRITIC_MAX_TOKENS = int(os.getenv("CRITIC_MAX_TOKENS", "900"))

BASE_DAYS = 2.0
DEFAULT_COMPLEXITY = "medium"
DEFAULT_VELOCITY_FACTOR = 1.0
MAX_CRITIC_LOOPS = 1

TODAY = date.today().isoformat()

STATUS_TODO = "todo"
STATUS_IN_PROGRESS = "in_progress"
STATUS_DONE = "done"
STATUS_BLOCKED = "blocked"
STATUS_DELAYED = "delayed"

PRIORITY_HIGH = "high"
PRIORITY_MEDIUM = "medium"
PRIORITY_LOW = "low"

JIRA_SYNC_ENABLED = os.getenv("JIRA_SYNC_ENABLED", "false").lower() in ["true", "1", "yes"]

# =========================================================
# 1) UTILS
# =========================================================

def clean_text(text: Any) -> str:
    if text is None:
        return ""
    text = str(text).replace("\xa0", " ").replace("\u200b", " ")
    return re.sub(r"\s+", " ", text).strip()

def normalize_label(text: str) -> str:
    t = clean_text(text).lower()
    t = t.replace("_", " ").replace("-", " ")
    return re.sub(r"\s+", " ", t).strip()

def slugify(text: str) -> str:
    t = normalize_label(text)
    t = re.sub(r"[^a-z0-9]+", "_", t)
    return t.strip("_")[:80]

def parse_date_safe(s: Optional[str]) -> Optional[date]:
    if not s:
        return None
    try:
        return datetime.fromisoformat(s).date()
    except Exception:
        return None

def days_between(d1: str, d2: str) -> int:
    a = parse_date_safe(d1)
    b = parse_date_safe(d2)
    if a is None or b is None:
        return 9999
    return (b - a).days

def safe_float(x: Any, default: float = 0.0) -> float:
    try:
        return float(x)
    except Exception:
        return default

def pretty_json(obj: Any) -> str:
    return json.dumps(obj, ensure_ascii=False, indent=2)

def count_braces_balance(text: str) -> int:
    balance = 0
    in_string = False
    escape = False

    for ch in text:
        if escape:
            escape = False
            continue
        if ch == "\\":
            escape = True
            continue
        if ch == '"':
            in_string = not in_string
            continue
        if not in_string:
            if ch == "{":
                balance += 1
            elif ch == "}":
                balance -= 1
    return balance

# =========================================================
# 2) TOKEN FACTORY CLIENT
# =========================================================

class LLMClient:
    def __init__(self, api_key: str, base_url: str):
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self._healthchecked = False
        self._health_ok = False

        http_client = httpx.Client(verify=VERIFY_SSL, timeout=120.0)
        self.client = OpenAI(
            api_key=self.api_key,
            base_url=self.base_url,
            http_client=http_client,
        )

    def healthcheck(self, force: bool = False) -> bool:
        if MODEL_MODE == "local":
            return False
        if not self.api_key:
            return False
        if self._healthchecked and not force:
            return self._health_ok

        try:
            _ = self.client.chat.completions.create(
                model=LLM_PLANNER_MODEL,
                messages=[{"role": "user", "content": "hi"}],
                max_tokens=5,
                temperature=0.1,
            )
            self._health_ok = True
            self._healthchecked = True
            print("[LLM healthcheck] ✓ API accessible")
            return True
        except Exception as e:
            self._health_ok = False
            self._healthchecked = True
            print(f"[LLM healthcheck] ✗ Failed: {type(e).__name__}: {str(e)[:150]}")
            return False

    def _extract_json_candidates(self, text: str) -> List[str]:
        text = text.strip()
        candidates = []

        fenced = re.findall(r"```json\s*(\{.*?\}|\[.*?\])\s*```", text, flags=re.DOTALL | re.IGNORECASE)
        candidates.extend(fenced)

        fenced_any = re.findall(r"```\s*(\{.*?\}|\[.*?\])\s*```", text, flags=re.DOTALL)
        candidates.extend(fenced_any)

        tagged = re.findall(r"<json>\s*(\{.*?\}|\[.*?\])\s*</json>", text, flags=re.DOTALL | re.IGNORECASE)
        candidates.extend(tagged)

        obj_match = re.search(r"\{.*", text, flags=re.DOTALL)
        if obj_match:
            candidates.append(obj_match.group(0))

        arr_match = re.search(r"\[.*", text, flags=re.DOTALL)
        if arr_match:
            candidates.append(arr_match.group(0))

        out = []
        seen = set()
        for c in candidates:
            c2 = c.strip()
            if c2 and c2 not in seen:
                seen.add(c2)
                out.append(c2)
        return out

    def _cleanup_json_string(self, s: str) -> str:
        s = s.strip()
        s = re.sub(r"^```json", "", s, flags=re.IGNORECASE).strip()
        s = re.sub(r"^```", "", s).strip()
        s = re.sub(r"```$", "", s).strip()
        s = re.sub(r",\s*([}\]])", r"\1", s)
        return s

    def _safe_parse_json(self, content: str) -> Dict[str, Any]:
        if isinstance(content, dict):
            return content

        content = content.strip()
        if not content:
            raise ValueError("Empty model content")

        try:
            return json.loads(content)
        except Exception:
            pass

        candidates = self._extract_json_candidates(content)
        for cand in candidates:
            cand = self._cleanup_json_string(cand)

            if cand.startswith("{") and count_braces_balance(cand) > 0:
                raise ValueError("TRUNCATED_JSON_OBJECT")

            try:
                parsed = json.loads(cand)
                if isinstance(parsed, list):
                    return {"raw_list": parsed}
                if isinstance(parsed, dict):
                    return parsed
            except Exception:
                continue

        raise ValueError(f"Cannot parse model JSON:\n{content[:1200]}")

    def chat_json(
        self,
        system_prompt: str,
        user_prompt: str,
        model: str,
        temperature: float = 0.1,
        max_tokens: int = 800,
        max_retries: int = 3,
    ) -> Dict[str, Any]:
        last_error = None
        dynamic_max_tokens = max_tokens

        for attempt in range(max_retries):
            try:
                response = self.client.chat.completions.create(
                    model=model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt},
                    ],
                    temperature=temperature,
                    max_tokens=dynamic_max_tokens,
                    response_format={"type": "json_object"},
                )

                content = response.choices[0].message.content
                time.sleep(MODEL_CALL_SLEEP_SECONDS)
                return self._safe_parse_json(content)

            except Exception as e:
                last_error = e
                if "TRUNCATED_JSON_OBJECT" in str(e):
                    dynamic_max_tokens = int(dynamic_max_tokens * 1.6)
                    print(f"[LLM call failed] truncated JSON, retry with max_tokens={dynamic_max_tokens}")
                elif attempt < max_retries - 1:
                    wait_s = min(20, (2 ** attempt) * 2)
                    print(f"[LLM call failed] {type(e).__name__}, retry in {wait_s}s")
                    time.sleep(wait_s)
                else:
                    raise last_error

        raise last_error

# =========================================================
# 3) LOCAL KB
# =========================================================

class LocalKnowledgeBase:
    def __init__(self, kb_path: str, embed_model_name: str, rerank_model_name: str):
        self.kb_path = kb_path
        self.embedder = SentenceTransformer(embed_model_name)
        self.reranker = CrossEncoder(rerank_model_name)
        self.records = self._load_records()
        self.embeddings = self._build_embeddings()

    def _load_records(self) -> List[Dict[str, Any]]:
        if not os.path.exists(self.kb_path):
            return []

        with open(self.kb_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        out = []
        for rec in data:
            text = clean_text(rec.get("text"))
            if not text:
                continue

            out.append({
                "doc_id": clean_text(rec.get("doc_id", "")),
                "category": clean_text(rec.get("category", "")),
                "url": clean_text(rec.get("url", "")),
                "page_title": clean_text(rec.get("page_title", "")),
                "section_id": clean_text(rec.get("section_id", "")),
                "section_heading": clean_text(rec.get("section_heading", "")),
                "mini_section_title": clean_text(rec.get("mini_section_title", "")),
                "text": text,
                "retrieval_text": " ".join([
                    clean_text(rec.get("page_title", "")),
                    clean_text(rec.get("section_heading", "")),
                    clean_text(rec.get("mini_section_title", "")),
                    text,
                ]).strip(),
            })
        return out

    def _build_embeddings(self):
        if not self.records:
            return []
        corpus = [r["retrieval_text"] for r in self.records]
        return self.embedder.encode(corpus, normalize_embeddings=True, show_progress_bar=True)

    def _cosine_search(self, query: str, category: Optional[str], top_k: int) -> List[Tuple[float, int]]:
        if not self.records:
            return []

        q_emb = self.embedder.encode([query], normalize_embeddings=True)[0]

        idxs = []
        for i, rec in enumerate(self.records):
            if category and normalize_label(rec.get("category", "")) != normalize_label(category):
                continue
            idxs.append(i)

        if not idxs:
            idxs = list(range(len(self.records)))

        scored = []
        for i in idxs:
            score = float((q_emb * self.embeddings[i]).sum())
            scored.append((score, i))

        scored.sort(key=lambda x: x[0], reverse=True)
        return scored[:top_k]

    def search(self, query: str, category: Optional[str] = None, top_k_retrieve: int = TOP_K_RETRIEVE, top_k_rerank: int = TOP_K_RERANK) -> List[Dict[str, Any]]:
        initial = self._cosine_search(query=query, category=category, top_k=top_k_retrieve)
        if not initial:
            return []

        pairs = []
        idxs = []
        for _, idx in initial:
            idxs.append(idx)
            pairs.append([query, self.records[idx]["retrieval_text"]])

        rerank_scores = self.reranker.predict(pairs)
        final = []
        for idx, score in zip(idxs, rerank_scores):
            rec = copy.deepcopy(self.records[idx])
            rec["_rerank_score"] = float(score)
            final.append(rec)

        final.sort(key=lambda x: x["_rerank_score"], reverse=True)
        return final[:top_k_rerank]

# =========================================================
# 4) STATE LOADING
# =========================================================

def build_initial_state() -> Dict[str, Any]:
    with open("startup_state.json", "r", encoding="utf-8") as f:
        state = json.load(f)

    state.setdefault("knowledge_base", {"sources": [], "last_retrieval": {}})
    state.setdefault("retrospective", {
        "velocity_default": DEFAULT_VELOCITY_FACTOR,
        "notes": []
    })
    state.setdefault("constraints", {
        "max_parallel_tasks_per_member": 2,
        "working_days_per_week": 5,
        "current_date": TODAY,
    })

    state["execution_state"] = {}
    return state


async def sync_runtime_from_mcp(state: Dict[str, Any], mcp_client: MCPProjectOpsClient) -> Dict[str, Any]:
    state = copy.deepcopy(state)
    state.setdefault("runtime", {})

    try:
        tasks_resp = await mcp_client.list_tasks_async()
        state["runtime"]["tasks"] = tasks_resp.get("tasks", [])
        state["runtime"]["jira"] = tasks_resp.get("jira", {})
    except Exception as e:
        print(f"[MCP] Could not sync runtime tasks: {type(e).__name__}: {e}")
        state["runtime"]["tasks"] = []
        state["runtime"]["jira"] = {}

    if JIRA_SYNC_ENABLED:
        try:
            jira_pull = await mcp_client.fetch_jira_updates_async()
            state["runtime"]["jira_pull"] = jira_pull

            pulled_tasks = jira_pull.get("tasks", [])
            if pulled_tasks:
                state["runtime"]["tasks"] = pulled_tasks

            state["runtime"]["jira"] = jira_pull.get("summary", state["runtime"].get("jira", {}))
            state["runtime"]["jira_empty"] = len(state["runtime"]["tasks"]) == 0

            if state["runtime"]["jira_empty"]:
                print("[JIRA] Initial pull found no tasks. First-run creation mode.")
            else:
                print("[JIRA] Initial pull:", state["runtime"]["jira"])
        except Exception as e:
            print(f"[JIRA] Could not fetch Jira updates: {type(e).__name__}: {e}")
            state["runtime"]["jira_pull"] = {"ok": False, "error": str(e)}
            state["runtime"]["jira_empty"] = len(state["runtime"].get("tasks", [])) == 0
    else:
        state["runtime"]["jira_empty"] = len(state["runtime"].get("tasks", [])) == 0

    try:
        capacity_resp = await mcp_client.get_team_capacity_async()
        state["runtime"]["team_capacity"] = capacity_resp.get("team_capacity", [])
    except Exception as e:
        print(f"[MCP] Could not sync team capacity: {type(e).__name__}: {e}")
        state["runtime"]["team_capacity"] = []

    return state

# =========================================================
# 5) VALIDATION / ADAPTERS
# =========================================================

def is_valid_plan_schema(plan: Dict[str, Any]) -> bool:
    if not isinstance(plan, dict):
        return False
    if "milestones" not in plan or not isinstance(plan["milestones"], list):
        return False
    if "risks" not in plan or not isinstance(plan["risks"], list):
        return False
    if "assumptions" not in plan or not isinstance(plan["assumptions"], list):
        return False

    for ms in plan["milestones"]:
        if not isinstance(ms, dict):
            return False
        if not all(k in ms for k in ["title", "description", "priority", "category", "deadline", "tasks"]):
            return False
        if not isinstance(ms["tasks"], list):
            return False

        for t in ms["tasks"]:
            if not isinstance(t, dict):
                return False
            if not all(k in t for k in [
                "title", "description", "priority", "complexity",
                "tags", "acceptance_criteria", "depends_on_titles"
            ]):
                return False
    return True

def adapt_remote_plan_to_schema(raw_plan: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    if not isinstance(raw_plan, dict):
        return None

    if is_valid_plan_schema(raw_plan):
        return raw_plan

    milestones = []
    risks = ["Remote planner returned non-standard JSON; adapted to internal schema."]
    assumptions = ["Adapted remote response to internal structure."]

    for key, value in raw_plan.items():
        if isinstance(value, list) and key.lower() in ["milestones", "phases", "plan"]:
            for i, ms in enumerate(value, start=1):
                if not isinstance(ms, dict):
                    continue

                tasks = []
                for t in ms.get("tasks", []):
                    if not isinstance(t, dict):
                        continue

                    title = clean_text(t.get("title") or t.get("name") or "Unnamed task")
                    tags = [clean_text(x).lower() for x in t.get("tags", []) if clean_text(x)]
                    if not tags:
                        tags = ["general"]

                    tasks.append({
                        "title": title,
                        "description": clean_text(t.get("description", "Task adapted from remote planner")),
                        "priority": clean_text(t.get("priority", PRIORITY_MEDIUM)).lower(),
                        "complexity": clean_text(t.get("complexity", DEFAULT_COMPLEXITY)).lower(),
                        "tags": tags,
                        "acceptance_criteria": [clean_text(x) for x in t.get("acceptance_criteria", []) if clean_text(x)] or [f"{title} completed"],
                        "depends_on_titles": [clean_text(x) for x in t.get("depends_on_titles", []) if clean_text(x)] or [],
                    })

                milestones.append({
                    "title": clean_text(ms.get("title", f"Milestone {i}")),
                    "description": clean_text(ms.get("description", "Adapted milestone")),
                    "priority": clean_text(ms.get("priority", PRIORITY_MEDIUM)).lower(),
                    "category": clean_text(ms.get("category", "product_execution")),
                    "deadline": ms.get("deadline"),
                    "tasks": tasks,
                })

    if not milestones:
        return None

    return {
        "milestones": milestones,
        "risks": risks,
        "assumptions": assumptions,
    }


def summarize_runtime_tasks(tasks: List[Dict[str, Any]], limit: int = 25) -> List[Dict[str, Any]]:
    summary = []
    for t in tasks[:limit]:
        summary.append({
            "title": clean_text(t.get("title", "")),
            "status": clean_text(t.get("status", "")),
            "assigned_to": clean_text(t.get("assigned_to", "")),
            "priority": clean_text(t.get("priority", "")),
            "milestone_title": clean_text(t.get("milestone_title", "")),
            "jira_issue_key": clean_text(t.get("jira_issue_key", "")),
            "jira_status": clean_text(t.get("jira_status", "")),
            "depends_on": t.get("depends_on", []),
        })
    return summary

# =========================================================
# 6) KB RETRIEVAL + PLANNER
# =========================================================

def retrieve_kb_patterns(state: Dict[str, Any], kb: LocalKnowledgeBase) -> Dict[str, Any]:
    features = state.get("mvp_plan", {}).get("features", [])
    admin = state.get("mvp_plan", {}).get("admin_workflow", [])

    top_feature = features[0]["name"] if features else "mvp execution"
    top_admin = admin[0]["name"] if admin else "startup operations"

    query_1 = f"{top_feature} MVP execution steps"
    query_2 = f"{top_feature} work breakdown structure"
    query_3 = f"{top_admin} startup administrative process"

    hits = []
    hits.extend(kb.search(query=query_1, category="product_execution"))
    hits.extend(kb.search(query=query_2, category="task_decomposition"))
    hits.extend(kb.search(query=query_3, category=None))

    compact = []
    for h in hits:
        compact.append({
            "doc_id": h.get("doc_id", ""),
            "category": h.get("category", ""),
            "section_heading": h.get("section_heading", ""),
            "mini_section_title": h.get("mini_section_title", ""),
            "text": h.get("text", "")[:180],
            "url": h.get("url", ""),
        })

    state["knowledge_base"]["last_retrieval"] = {
        "queries": [query_1, query_2, query_3],
        "hits": compact[:5],
    }
    return state

def local_planner_fallback(state: Dict[str, Any]) -> Dict[str, Any]:
    milestones = []
    risks = []
    assumptions = []

    for feat in state.get("mvp_plan", {}).get("features", []):
        fname = feat["name"]
        prio = feat.get("priority", PRIORITY_MEDIUM)

        milestones.append({
            "title": f"Deliver {fname}",
            "description": f"Execution milestone for {fname}",
            "priority": prio,
            "category": "product_execution",
            "deadline": state.get("mvp_plan", {}).get("deadlines", {}).get("mvp_launch"),
            "tasks": [
                {
                    "title": f"Define scope for {fname}",
                    "description": f"Clarify boundaries and outcomes for {fname}",
                    "priority": prio,
                    "complexity": "medium",
                    "tags": ["planning"],
                    "acceptance_criteria": [f"Scope for {fname} documented"],
                    "depends_on_titles": [],
                },
                {
                    "title": f"Design {fname}",
                    "description": f"Create UX and technical design for {fname}",
                    "priority": prio,
                    "complexity": "medium",
                    "tags": ["design"],
                    "acceptance_criteria": [f"Design for {fname} approved"],
                    "depends_on_titles": [f"Define scope for {fname}"],
                },
                {
                    "title": f"Implement {fname}",
                    "description": f"Build and integrate {fname}",
                    "priority": prio,
                    "complexity": "high",
                    "tags": ["development"],
                    "acceptance_criteria": [f"{fname} implemented end-to-end"],
                    "depends_on_titles": [f"Design {fname}"],
                },
                {
                    "title": f"Test {fname}",
                    "description": f"Validate quality and behavior of {fname}",
                    "priority": prio,
                    "complexity": "medium",
                    "tags": ["testing"],
                    "acceptance_criteria": [f"{fname} passes acceptance tests"],
                    "depends_on_titles": [f"Implement {fname}"],
                },
            ],
        })

    for admin in state.get("mvp_plan", {}).get("admin_workflow", []):
        aname = admin["name"]
        prio = admin.get("priority", PRIORITY_MEDIUM)

        milestones.append({
            "title": f"Complete {aname}",
            "description": f"Administrative milestone for {aname}",
            "priority": prio,
            "category": "admin_execution",
            "deadline": state.get("mvp_plan", {}).get("deadlines", {}).get("legal_deadline"),
            "tasks": [
                {
                    "title": f"Define requirements for {aname}",
                    "description": f"Clarify legal and process requirements for {aname}",
                    "priority": prio,
                    "complexity": "medium",
                    "tags": ["planning"],
                    "acceptance_criteria": [f"Requirements for {aname} documented"],
                    "depends_on_titles": [],
                },
                {
                    "title": f"Prepare documents for {aname}",
                    "description": f"Prepare required documents for {aname}",
                    "priority": prio,
                    "complexity": "medium",
                    "tags": ["documentation"],
                    "acceptance_criteria": [f"Documents for {aname} ready"],
                    "depends_on_titles": [f"Define requirements for {aname}"],
                },
                {
                    "title": f"Submit {aname}",
                    "description": f"Submit and track process for {aname}",
                    "priority": prio,
                    "complexity": "low",
                    "tags": ["operations"],
                    "acceptance_criteria": [f"{aname} submitted"],
                    "depends_on_titles": [f"Prepare documents for {aname}"],
                },
                {
                    "title": f"Confirm completion of {aname}",
                    "description": f"Confirm final completion of {aname}",
                    "priority": prio,
                    "complexity": "low",
                    "tags": ["review"],
                    "acceptance_criteria": [f"{aname} completion confirmed"],
                    "depends_on_titles": [f"Submit {aname}"],
                },
            ],
        })

    assumptions.append("Tasks are generated dynamically from factual state, not pre-seeded task lists.")
    if state.get("knowledge_base", {}).get("last_retrieval", {}).get("hits"):
        assumptions.append("Task decomposition guided by retrieved MVP/WBS knowledge patterns.")
    else:
        assumptions.append("Task decomposition generated without KB support.")

    risks.append("Planning generated from local fallback because remote planning may be unavailable.")
    return {"milestones": milestones, "risks": risks, "assumptions": assumptions}

def remote_planner_attempt(state: Dict[str, Any], llm: LLMClient) -> Optional[Dict[str, Any]]:
    if not llm.healthcheck():
        return None

    runtime_tasks = state.get("runtime", {}).get("tasks", [])
    jira_empty = bool(state.get("runtime", {}).get("jira_empty", len(runtime_tasks) == 0))

    payload = {
        "startup_name": state.get("startup_profile", {}).get("name", ""),
        "objective": state.get("startup_profile", {}).get("objective", ""),
        "problem_statement": state.get("startup_profile", {}).get("problem_statement", ""),
        "execution_context": state.get("startup_profile", {}).get("execution_context", ""),
        "features": state.get("mvp_plan", {}).get("features", []),
        "admin_workflow": state.get("mvp_plan", {}).get("admin_workflow", []),
        "deadlines": state.get("mvp_plan", {}).get("deadlines", {}),
        "team_summary": [
            {
                "name": m.get("name"),
                "role": m.get("role"),
                "skills": m.get("skills", [])[:6],
                "availability": m.get("availability", 1.0),
            }
            for m in state.get("team", [])
        ],
        "kb_hits": state.get("knowledge_base", {}).get("last_retrieval", {}).get("hits", [])[:5],
        "existing_runtime_tasks": summarize_runtime_tasks(runtime_tasks, limit=25),
        "jira_summary": state.get("runtime", {}).get("jira", {}),
        "jira_empty": jira_empty,
    }

    system_prompt = """
You are an execution-planning agent for a startup.
You must reason from startup facts AND current execution reality.

Return ONLY JSON.
No markdown.
No code fences.

Schema:
{
  "milestones": [
    {
      "title": "string",
      "description": "string",
      "why_now": "string",
      "priority": "high|medium|low",
      "category": "product_execution|admin_execution",
      "deadline": "YYYY-MM-DD or null",
      "tasks": [
        {
          "title": "string",
          "description": "string",
          "why_this_task": "string",
          "priority": "high|medium|low",
          "complexity": "low|medium|high",
          "tags": ["string"],
          "acceptance_criteria": ["string"],
          "depends_on_titles": ["string"]
        }
      ]
    }
  ],
  "risks": ["string"],
  "assumptions": ["string"],
  "planning_notes": ["string"]
}

Rules:
- Think from startup facts plus CURRENT execution reality.
- If existing_runtime_tasks is non-empty, treat it as the current truth and replan around it.
- If jira_empty is true, this is the first run. Build the full roadmap from startup facts.
- Do not duplicate an already existing task unless there is a very clear reason.
- For each MVP feature, create operationally useful tasks.
- Include validation/testing tasks where relevant.
- Explain briefly why each milestone and task exists.
- Do not invent team assignments here.
""".strip()

    try:
        raw = llm.chat_json(
            system_prompt=system_prompt,
            user_prompt=pretty_json(payload),
            model=LLM_PLANNER_MODEL,
            temperature=0.0,
            max_tokens=PLANNER_MAX_TOKENS,
            max_retries=4,
        )

        if is_valid_plan_schema(raw):
            print("[Planner] ✓ Remote plan valid")
            return raw

        adapted = adapt_remote_plan_to_schema(raw)
        if adapted and is_valid_plan_schema(adapted):
            print("[Planner] ✓ Remote plan adapted")
            return adapted

        print("[Planner] ✗ Remote plan invalid and not adaptable")
        return None

    except Exception as e:
        print(f"[Planner] ✗ LLM failed: {type(e).__name__}: {str(e)[:250]}")
        return None

def planner_step(state: Dict[str, Any], llm: LLMClient) -> Dict[str, Any]:
    state["execution_state"] = state.get("execution_state", {})

    if MODEL_MODE == "hybrid":
        plan = remote_planner_attempt(state, llm)
        if plan is not None and is_valid_plan_schema(plan):
            state["execution_state"]["draft_plan"] = plan
            state["execution_state"]["planner_used"] = "remote"
            return state

    print("[Planner] Using local fallback")
    state["execution_state"]["draft_plan"] = local_planner_fallback(state)
    state["execution_state"]["planner_used"] = "local_fallback"
    return state

# =========================================================
# 7) REASONING ENGINE
# =========================================================

def complexity_factor(value: str) -> float:
    v = normalize_label(value)
    if v == "low":
        return 0.8
    if v == "high":
        return 1.5
    return 1.0

def load_factor(current_load: int) -> float:
    if current_load <= 0:
        return 1.0
    if current_load <= 2:
        return 0.85
    return 0.60

def infer_match_confidence(task: Dict[str, Any], member: Dict[str, Any]) -> float:
    task_text = normalize_label(task.get("title", "") + " " + " ".join(task.get("tags", [])))
    role = normalize_label(member.get("role", ""))
    skills = [normalize_label(s) for s in member.get("skills", [])]

    overlap = 0
    for s in skills:
        if s and s in task_text:
            overlap += 1

    if overlap >= 2:
        return 0.95
    if overlap == 1:
        return 0.80

    if any(k in role for k in ["backend", "engineer"]) and any(k in task_text for k in ["implement", "api", "backend", "testing"]):
        return 0.65
    if any(k in role for k in ["frontend", "developer", "ux"]) and any(k in task_text for k in ["design", "ui", "frontend"]):
        return 0.65
    if any(k in role for k in ["operations", "manager"]) and any(k in task_text for k in ["document", "submit", "plan", "requirements", "legal"]):
        return 0.65

    return 0.35

def infer_estimation_skill_factor(task: Dict[str, Any], member: Dict[str, Any]) -> float:
    match = infer_match_confidence(task, member)
    if match >= 0.90:
        return 0.9
    if match >= 0.75:
        return 1.0
    if match >= 0.55:
        return 1.15
    return 1.4

def normalize_work_items_from_plan(state: Dict[str, Any]) -> Dict[str, Any]:
    draft = state.get("execution_state", {}).get("draft_plan", {})
    milestones = draft.get("milestones", [])

    items = []
    title_to_id = {}

    for mi, ms in enumerate(milestones, start=1):
        ms_id = f"MS_{mi}_{slugify(ms.get('title', f'milestone_{mi}'))}"
        deadline = ms.get("deadline")
        ms_priority = clean_text(ms.get("priority", PRIORITY_MEDIUM)).lower()
        category = clean_text(ms.get("category", "product_execution"))

        for ti, t in enumerate(ms.get("tasks", []), start=1):
            title = clean_text(t.get("title"))
            if not title:
                continue

            task_id = f"{ms_id}_T_{ti}_{slugify(title)}"
            rec = {
                "id": task_id,
                "parent_id": ms_id,
                "milestone_title": clean_text(ms.get("title", "")),
                "title": title,
                "description": clean_text(t.get("description", "")),
                "priority": clean_text(t.get("priority", ms_priority)).lower(),
                "category": category,
                "complexity": clean_text(t.get("complexity", DEFAULT_COMPLEXITY)).lower(),
                "tags": [clean_text(x).lower() for x in t.get("tags", []) if clean_text(x)],
                "acceptance_criteria": [clean_text(x) for x in t.get("acceptance_criteria", []) if clean_text(x)],
                "depends_on_titles": [clean_text(x) for x in t.get("depends_on_titles", []) if clean_text(x)],
                "depends_on": [],
                "unblocks": [],
                "assigned_to": None,
                "status": STATUS_TODO,
                "progress": 0.0,
                "actual_days": 0,
                "deadline": deadline,
                "estimated_days": 0.0,
                "business_value": 3,
                "blocking_count": 0,
                "risk_weight": 1.0,
                "priority_score": 0.0,
                "assignment_score": 0.0,
                "match_confidence": 0.0,
                "criticality_score": 0.0,
                "blocked_reason": None,
                "graph_depth": 0,
                "continuity_score": 0.0,
                "jira_issue_key": None,
                "jira_issue_id": None,
                "jira_issue_url": None,
                "jira_status": None,
            }
            items.append(rec)
            title_to_id[normalize_label(title)] = task_id

    for task in items:
        dep_ids = []
        for dt in task.get("depends_on_titles", []):
            dep_id = title_to_id.get(normalize_label(dt))
            if dep_id and dep_id != task["id"]:
                dep_ids.append(dep_id)
        task["depends_on"] = sorted(list(set(dep_ids)))

    id_to_task = {t["id"]: t for t in items}
    for task in items:
        for dep in task.get("depends_on", []):
            if dep in id_to_task:
                id_to_task[dep]["unblocks"].append(task["id"])

    hints = state.get("live_status", {}).get("progress_signals", [])
    hints_by_title = {normalize_label(h.get("work_item_hint", "")): h for h in hints}

    runtime_tasks = state.get("runtime", {}).get("tasks", [])
    runtime_by_title = {normalize_label(t.get("title", "")): t for t in runtime_tasks if t.get("title")}

    for task in items:
        hint_match = hints_by_title.get(normalize_label(task["title"]))
        runtime_match = runtime_by_title.get(normalize_label(task["title"]))
        source = runtime_match or hint_match
        if not source:
            continue

        task["status"] = source.get("status", task["status"])
        task["progress"] = safe_float(source.get("progress", task["progress"]), task["progress"])
        task["actual_days"] = safe_float(source.get("actual_days", task["actual_days"]), task["actual_days"])
        task["blocked_reason"] = clean_text(source.get("blocked_reason", "")) or None
        task["assigned_to"] = source.get("assigned_to", task["assigned_to"])
        task["jira_issue_key"] = source.get("jira_issue_key")
        task["jira_issue_id"] = source.get("jira_issue_id")
        task["jira_issue_url"] = source.get("jira_issue_url")
        task["jira_status"] = source.get("jira_status")

    state["execution_state"]["task_list"] = items
    return state

def build_dag_and_ready_queue(state: Dict[str, Any]) -> Dict[str, Any]:
    tasks = state.get("execution_state", {}).get("task_list", [])
    g = nx.DiGraph()

    for t in tasks:
        g.add_node(t["id"], title=t["title"])
    for t in tasks:
        for dep in t.get("depends_on", []):
            g.add_edge(dep, t["id"])

    has_cycle = g.number_of_nodes() > 0 and not nx.is_directed_acyclic_graph(g)
    done_ids = {t["id"] for t in tasks if t.get("status") == STATUS_DONE}
    ready_queue = []

    if not has_cycle and g.number_of_nodes() > 0:
        topo = list(nx.topological_sort(g))
        depth_map = {}

        for node in topo:
            preds = list(g.predecessors(node))
            depth_map[node] = 0 if not preds else 1 + max(depth_map[p] for p in preds)

        for t in tasks:
            t["graph_depth"] = depth_map.get(t["id"], 0)
            if t.get("status") == STATUS_TODO and all(dep in done_ids for dep in t.get("depends_on", [])):
                ready_queue.append(t["id"])
    else:
        for t in tasks:
            t["graph_depth"] = 0

    state["execution_state"]["dependency_graph_has_cycle"] = has_cycle
    state["execution_state"]["ready_queue"] = ready_queue
    return state

def compute_estimations(state: Dict[str, Any]) -> Dict[str, Any]:
    tasks = state.get("execution_state", {}).get("task_list", [])
    team = state.get("team", [])

    velocity_values = [
        safe_float(m.get("velocity_factor", DEFAULT_VELOCITY_FACTOR), DEFAULT_VELOCITY_FACTOR)
        for m in team
    ]
    velocity_factor = sum(velocity_values) / max(len(velocity_values), 1)

    for t in tasks:
        complexity = complexity_factor(t.get("complexity", DEFAULT_COMPLEXITY))
        best_skill_factor = 1.4

        for m in team:
            sf = infer_estimation_skill_factor(t, m)
            if sf < best_skill_factor:
                best_skill_factor = sf

        estimated = BASE_DAYS * complexity * best_skill_factor * velocity_factor
        t["estimated_days"] = round(max(0.5, estimated), 2)

    state["execution_state"]["task_list"] = tasks
    return state

def compute_priority_scores(state: Dict[str, Any]) -> Dict[str, Any]:
    tasks = state.get("execution_state", {}).get("task_list", [])

    prio_to_value = {
        PRIORITY_HIGH: 5,
        PRIORITY_MEDIUM: 3,
        PRIORITY_LOW: 2,
    }

    for t in tasks:
        t["business_value"] = prio_to_value.get(t.get("priority", PRIORITY_MEDIUM), 3)
        t["blocking_count"] = len(t.get("unblocks", []))

        risk_weight = 1.0
        if t.get("status") == STATUS_BLOCKED:
            risk_weight = 5.0
        elif t.get("status") == STATUS_DELAYED:
            risk_weight = 4.0
        elif t.get("complexity") == "high":
            risk_weight = 3.0

        t["risk_weight"] = risk_weight

        score = (
            (t["business_value"] * 0.4)
            + (t["blocking_count"] * 0.35)
            + (t["risk_weight"] * 0.25)
        )
        t["priority_score"] = round(score, 3)

    ready_ids = set(state.get("execution_state", {}).get("ready_queue", []))
    ready_tasks = [t for t in tasks if t["id"] in ready_ids]
    ready_tasks.sort(key=lambda x: (-x.get("priority_score", 0), x.get("estimated_days", 0)))

    state["execution_state"]["task_list"] = tasks
    state["execution_state"]["priority_queue"] = [t["id"] for t in ready_tasks]
    return state

def assign_tasks_graph_aware(state: Dict[str, Any]) -> Dict[str, Any]:
    tasks = state.get("execution_state", {}).get("task_list", [])
    team = copy.deepcopy(state.get("team", []))
    runtime_capacity = {m["name"]: m for m in state.get("runtime", {}).get("team_capacity", []) if m.get("name")}

    for member in team:
        if member["name"] in runtime_capacity:
            member["current_load"] = runtime_capacity[member["name"]].get("current_load", 0)
        else:
            member["current_load"] = 0

    id_to_task = {t["id"]: t for t in tasks}
    tasks_sorted = sorted(tasks, key=lambda x: (-x.get("priority_score", 0), -x.get("graph_depth", 0)))

    for t in tasks_sorted:
        best_idx = None
        best_score = -1.0
        best_match = 0.0
        best_continuity = 0.0

        preds = [id_to_task[d] for d in t.get("depends_on", []) if d in id_to_task]
        predecessor_owners = [p.get("assigned_to") for p in preds if p.get("assigned_to")]

        for i, m in enumerate(team):
            match_conf = infer_match_confidence(t, m)
            lf = load_factor(int(m.get("current_load", 0)))
            criticality = min(1.0, safe_float(t.get("priority_score", 0)) / 5.0)
            unblock_weight = min(1.0, len(t.get("unblocks", [])) / 4.0)
            continuity = 1.0 if m["name"] in predecessor_owners else 0.0
            urgency = 1.0 if t.get("priority") == "high" else 0.5 if t.get("priority") == "medium" else 0.2

            delegation_score = (
                match_conf * 0.35
                + lf * 0.15
                + criticality * 0.20
                + unblock_weight * 0.15
                + continuity * 0.10
                + urgency * 0.05
            )

            if delegation_score > best_score:
                best_score = delegation_score
                best_idx = i
                best_match = match_conf
                best_continuity = continuity

        if best_idx is not None:
            t["assigned_to"] = team[best_idx]["name"]
            t["assignment_score"] = round(best_score, 4)
            t["match_confidence"] = round(best_match, 4)
            t["continuity_score"] = round(best_continuity, 4)
            team[best_idx]["current_load"] = int(team[best_idx].get("current_load", 0)) + 1

    for t in tasks:
        t["criticality_score"] = round(
            t.get("priority_score", 0)
            + (0.2 * t.get("continuity_score", 0))
            + (0.1 * min(1.0, t.get("graph_depth", 0) / 4.0)),
            3
        )

    state["team"] = team
    state["execution_state"]["task_list"] = tasks
    return state

def compute_critical_path_days(state: Dict[str, Any]) -> float:
    tasks = state.get("execution_state", {}).get("task_list", [])
    g = nx.DiGraph()
    task_map = {t["id"]: t for t in tasks}

    for t in tasks:
        g.add_node(t["id"])
    for t in tasks:
        for dep in t.get("depends_on", []):
            g.add_edge(dep, t["id"])

    if g.number_of_nodes() == 0:
        return 0.0
    if not nx.is_directed_acyclic_graph(g):
        return float("inf")

    topo = list(nx.topological_sort(g))
    longest = {n: 0.0 for n in topo}

    for n in topo:
        node_cost = safe_float(task_map.get(n, {}).get("estimated_days", 0), 0)
        preds = list(g.predecessors(n))
        if preds:
            longest[n] = max(longest[p] for p in preds) + node_cost
        else:
            longest[n] = node_cost

    return round(max(longest.values()) if longest else 0.0, 2)

def compute_feasibility(state: Dict[str, Any]) -> Dict[str, Any]:
    deadlines = state.get("mvp_plan", {}).get("deadlines", {})
    current_date = state.get("constraints", {}).get("current_date", TODAY)
    mvp_deadline = deadlines.get("mvp_launch")

    cp_days = compute_critical_path_days(state)
    if cp_days == float("inf"):
        state["execution_state"]["feasibility"] = {
            "status": "invalid_plan_cycle_detected",
            "critical_path_days": None,
            "deadline_days": None,
            "buffer_days": None,
        }
        return state

    deadline_days = days_between(current_date, mvp_deadline) if mvp_deadline else None
    buffer = None if deadline_days is None else round(deadline_days - cp_days, 2)

    if buffer is None:
        status = "unknown"
    elif buffer > 5:
        status = "good"
    elif buffer > 0:
        status = "fragile"
    else:
        status = "high_risk"

    state["execution_state"]["critical_path_days"] = cp_days
    state["execution_state"]["feasibility"] = {
        "status": status,
        "critical_path_days": cp_days,
        "deadline_days": deadline_days,
        "buffer_days": buffer,
    }
    return state

def detect_anomalies(state: Dict[str, Any]) -> Dict[str, Any]:
    tasks = state.get("execution_state", {}).get("task_list", [])
    team = state.get("team", [])
    anomalies = []

    for t in tasks:
        est = safe_float(t.get("estimated_days", 0), 0)
        act = safe_float(t.get("actual_days", 0), 0)

        if est > 0 and act > 2 * est:
            anomalies.append({"type": "stuck_task", "task_id": t["id"], "title": t["title"]})
        elif est > 0 and act > 1.5 * est:
            anomalies.append({"type": "near_overrun", "task_id": t["id"], "title": t["title"]})

    loads = [int(m.get("current_load", 0)) for m in team]
    if loads and min(loads) == 0 and max(loads) >= 4:
        anomalies.append({"type": "load_imbalance", "details": "One member has 0 tasks while another has 4+"})

    by_milestone = {}
    for t in tasks:
        key = t.get("milestone_title", "")
        by_milestone.setdefault(key, []).append(t)

    for m, ts in by_milestone.items():
        if ts and all(x.get("status") == STATUS_BLOCKED for x in ts):
            anomalies.append({"type": "feature_stall", "feature": m})

    state["execution_state"]["anomalies"] = anomalies
    return state

# =========================================================
# 8) CRITIC
# =========================================================

def critic_local_fallback(state: Dict[str, Any]) -> Dict[str, Any]:
    issues = []
    next_actions = []
    anomaly_review = []
    critic_review = []
    recommendations = []

    if state.get("execution_state", {}).get("dependency_graph_has_cycle"):
        issues.append({
            "issue": "Dependency cycle detected in task graph",
            "severity": "high",
            "suggested_fix": "Break at least one circular dependency between tasks.",
        })
        anomaly_review.append("A dependency cycle was detected. Some tasks cannot progress until the loop is broken.")

    feasibility = state.get("execution_state", {}).get("feasibility", {})
    if feasibility.get("status") in ["fragile", "high_risk"]:
        issues.append({
            "issue": f"Feasibility is {feasibility.get('status')}",
            "severity": "high" if feasibility.get("status") == "high_risk" else "medium",
            "suggested_fix": "Reduce scope, protect critical tasks, and postpone low-priority work.",
        })
        critic_review.append(f"The current delivery plan is {feasibility.get('status')} against the deadline.")

    anomalies = state.get("execution_state", {}).get("anomalies", [])
    if anomalies:
        for anomaly in anomalies[:5]:
            anomaly_review.append(f"Detected anomaly: {anomaly.get('type', 'unknown')}.")

    if not anomaly_review:
        anomaly_review.append("No major execution anomaly is currently visible from the deterministic checks.")

    top_priority_ids = set(state.get("execution_state", {}).get("priority_queue", [])[:3])
    for t in state.get("execution_state", {}).get("task_list", []):
        if t["id"] in top_priority_ids:
            next_actions.append(f"Focus next on: {t['title']} (owner: {t.get('assigned_to', 'unassigned')})")

    if not next_actions:
        next_actions.append("Review the ready queue and start the highest-priority available task.")

    recommendations.extend(next_actions[:3])
    if not critic_review:
        critic_review.append("The plan is structurally usable, but should still be reviewed for task sizing and workload balance.")

    recommended_actions = []
    for t in state.get("execution_state", {}).get("task_list", []):
        if t.get("jira_issue_key"):
            action = "update"
            if t.get("status") == STATUS_IN_PROGRESS and t.get("jira_status") not in {"En cours", "In Progress"}:
                action = "transition"
        else:
            action = "create"

        recommended_actions.append({
            "task_title": t.get("title"),
            "action": action,
            "reason": "Derived from current task/Jira state",
            "target_status": t.get("status"),
            "new_owner": t.get("assigned_to"),
        })

    return {
        "anomaly_review": anomaly_review,
        "critic_review": critic_review,
        "recommendations": recommendations,
        "issues_found": issues,
        "updated_next_actions": next_actions,
        "recommended_actions": recommended_actions,
    }

def remote_critic_attempt(state: Dict[str, Any], llm: LLMClient) -> Optional[Dict[str, Any]]:
    if not llm.healthcheck():
        return None

    system_prompt = """
You are the execution reviewer and recommendation engine for a startup.

Return ONLY JSON:
{
  "anomaly_review": [
    "string"
  ],
  "critic_review": [
    "string"
  ],
  "recommendations": [
    "string"
  ],
  "issues_found": [
    {
      "issue": "string",
      "severity": "low|medium|high",
      "suggested_fix": "string"
    }
  ],
  "updated_next_actions": ["string"],
  "recommended_actions": [
    {
      "task_title": "string",
      "action": "create|update|transition|reassign|defer|leave_unchanged|escalate",
      "reason": "string",
      "target_status": "todo|in_progress|done|blocked|delayed|null",
      "new_owner": "string|null"
    }
  ]
}

Rules:
- anomaly_review must explain the most important execution anomalies in clear founder-friendly language.
- critic_review must explain the quality of the plan, its weaknesses, and structural concerns.
- recommendations must give practical startup-level recommendations, not technical formulas.
- recommended_actions should be operational and aligned with Jira reality.
- be concise, concrete, and operational.
""".strip()

    payload = {
        "feasibility": state.get("execution_state", {}).get("feasibility", {}),
        "anomalies": state.get("execution_state", {}).get("anomalies", []),
        "priority_queue": state.get("execution_state", {}).get("priority_queue", [])[:8],
        "task_list": [
            {
                "title": t.get("title"),
                "status": t.get("status"),
                "jira_status": t.get("jira_status"),
                "priority": t.get("priority"),
                "assigned_to": t.get("assigned_to"),
                "estimated_days": t.get("estimated_days"),
                "depends_on": t.get("depends_on"),
                "tags": t.get("tags", []),
                "jira_issue_key": t.get("jira_issue_key"),
                "milestone_title": t.get("milestone_title"),
            }
            for t in state.get("execution_state", {}).get("task_list", [])[:20]
        ],
        "monitoring": state.get("execution_state", {}).get("monitoring", {}),
    }

    try:
        raw = llm.chat_json(
            system_prompt=system_prompt,
            user_prompt=pretty_json(payload),
            model=LLM_CRITIC_MODEL,
            temperature=0.1,
            max_tokens=CRITIC_MAX_TOKENS,
        )

        required = {"anomaly_review", "critic_review", "recommendations", "issues_found", "updated_next_actions", "recommended_actions"}
        if isinstance(raw, dict) and required.issubset(set(raw.keys())):
            print("[Critic] ✓ Remote critic valid")
            return raw

        print("[Critic] ✗ Remote critic invalid")
        return None

    except Exception as e:
        print(f"[Critic] ✗ Remote critic failed: {type(e).__name__}: {str(e)[:200]}")
        return None

def critic_step(state: Dict[str, Any], llm: LLMClient) -> Dict[str, Any]:
    if MODEL_MODE == "hybrid":
        report = remote_critic_attempt(state, llm)
        if report is not None:
            state["execution_state"]["critic_report"] = report
            state["execution_state"]["critic_used"] = "remote"
            return state

    print("[Critic] Using local fallback")
    state["execution_state"]["critic_report"] = critic_local_fallback(state)
    state["execution_state"]["critic_used"] = "local_fallback"
    return state

# =========================================================
# 9) ACTION DECISION
# =========================================================

def action_decision_step(state: Dict[str, Any]) -> Dict[str, Any]:
    task_list = state.get("execution_state", {}).get("task_list", [])
    critic = state.get("execution_state", {}).get("critic_report", {})
    recommendations = critic.get("recommended_actions", [])

    rec_by_title = {
        normalize_label(r.get("task_title", "")): r
        for r in recommendations
        if r.get("task_title")
    }

    action_plan = []

    for task in task_list:
        title_key = normalize_label(task.get("title", ""))
        rec = rec_by_title.get(title_key)

        if rec:
            action_plan.append({
                "task_id": task.get("id"),
                "title": task.get("title"),
                "action": rec.get("action", "leave_unchanged"),
                "reason": rec.get("reason", ""),
                "target_status": rec.get("target_status"),
                "new_owner": rec.get("new_owner"),
                "jira_issue_key": task.get("jira_issue_key"),
            })
            if rec.get("new_owner"):
                task["assigned_to"] = rec["new_owner"]
            if rec.get("target_status") in {"todo", "in_progress", "done", "blocked", "delayed"}:
                task["status"] = rec["target_status"]
        else:
            if task.get("jira_issue_key"):
                action = "update"
                if task.get("status") == STATUS_IN_PROGRESS and task.get("jira_status") not in {"En cours", "In Progress"}:
                    action = "transition"
            else:
                action = "create"

            action_plan.append({
                "task_id": task.get("id"),
                "title": task.get("title"),
                "action": action,
                "reason": "Derived from current task/Jira state",
                "target_status": task.get("status"),
                "new_owner": task.get("assigned_to"),
                "jira_issue_key": task.get("jira_issue_key"),
            })

    state["execution_state"]["task_list"] = task_list
    state["execution_state"]["action_plan"] = action_plan
    return state

# =========================================================
# 10) MCP PERSISTENCE
# =========================================================

async def persist_tasks_to_mcp(state: Dict[str, Any], mcp_client: MCPProjectOpsClient) -> Dict[str, Any]:
    tasks = state.get("execution_state", {}).get("task_list", [])
    runtime_tasks = state.get("runtime", {}).get("tasks", [])
    runtime_by_title = {
        normalize_label(t.get("title", "")): t
        for t in runtime_tasks
        if t.get("title")
    }

    action_plan = state.get("execution_state", {}).get("action_plan", [])
    action_by_id = {a.get("task_id"): a for a in action_plan if a.get("task_id")}

    payload = []
    for t in tasks:
        existing = runtime_by_title.get(normalize_label(t.get("title", "")), {})
        action_info = action_by_id.get(t["id"], {})
        payload.append({
            "id": t["id"],
            "title": t["title"],
            "description": t.get("description", ""),
            "priority": t.get("priority", "medium"),
            "assigned_to": t.get("assigned_to"),
            "deadline": t.get("deadline"),
            "status": t.get("status"),
            "progress": t.get("progress", 0.0),
            "actual_days": t.get("actual_days", 0),
            "blocked_reason": t.get("blocked_reason"),
            "milestone_title": t.get("milestone_title"),
            "estimated_days": t.get("estimated_days"),
            "priority_score": t.get("priority_score"),
            "criticality_score": t.get("criticality_score"),
            "depends_on": t.get("depends_on", []),
            "category": t.get("category"),
            "jira_issue_key": t.get("jira_issue_key") or existing.get("jira_issue_key"),
            "jira_issue_id": t.get("jira_issue_id") or existing.get("jira_issue_id"),
            "jira_issue_url": t.get("jira_issue_url") or existing.get("jira_issue_url"),
            "jira_status": t.get("jira_status") or existing.get("jira_status"),
            "agent_action": action_info.get("action", "update"),
            "agent_action_reason": action_info.get("reason", ""),
        })

    result = await mcp_client.upsert_tasks_async(payload)
    state["execution_state"]["mcp_persist_result"] = result

    if JIRA_SYNC_ENABLED:
        print("[JIRA] Sync starting...")
        jira_result = await mcp_client.sync_tasks_to_jira_async(payload)
        print("[JIRA] Sync result:", jira_result.get("summary", jira_result))
        state["execution_state"]["jira_sync_result"] = jira_result
        state["execution_state"]["jira"] = jira_result.get("summary", {})
        try:
            jira_pull_after = await mcp_client.fetch_jira_updates_async()
            state.setdefault("runtime", {})["tasks"] = jira_pull_after.get("tasks", state.get("runtime", {}).get("tasks", []))
            state["execution_state"]["jira_pull_after_sync"] = jira_pull_after
        except Exception as e:
            print(f"[JIRA] Post-sync fetch failed: {type(e).__name__}: {e}")
    else:
        print("[JIRA] Sync skipped")
        state["execution_state"]["jira_sync_result"] = {"ok": False, "jira_enabled": False}
        state["execution_state"]["jira"] = {}

    return state

# =========================================================
# 11) FOUNDER-FACING REPORT HELPERS
# =========================================================

def get_project_status_label(feasibility: Dict[str, Any], anomalies: List[Dict[str, Any]], critic_report: Dict[str, Any]) -> str:
    status = feasibility.get("status", "unknown")
    critic_issues = len(critic_report.get("issues_found", []))
    anomaly_count = len(anomalies)

    if status == "high_risk" or anomaly_count >= 3:
        return "At risk"
    if status == "fragile" or critic_issues >= 3:
        return "Needs attention"
    if status == "good":
        return "On track"
    return "Unclear"

def build_executive_summary(result: Dict[str, Any]) -> Dict[str, str]:
    feasibility = result.get("feasibility", {})
    anomalies = result.get("anomalies", [])
    critic_report = result.get("critic_report", {})
    next_actions = result.get("next_actions", [])
    priority_tasks = result.get("priority_queue", [])

    status_label = get_project_status_label(feasibility, anomalies, critic_report)

    if feasibility.get("status") == "good":
        reason = "The current roadmap fits within the deadline with a healthy time buffer."
    elif feasibility.get("status") == "fragile":
        reason = "The roadmap is still feasible, but there is little room for delay."
    elif feasibility.get("status") == "high_risk":
        reason = "The current plan is unlikely to fit the deadline without changes."
    else:
        reason = "The delivery outlook is not yet fully clear."

    if priority_tasks:
        immediate_focus = ", ".join([t.get("title", "") for t in priority_tasks[:3] if t.get("title")])
    else:
        immediate_focus = "Review the roadmap and identify the next executable tasks."

    issues = critic_report.get("issues_found", [])
    if issues:
        main_risk = issues[0].get("issue", "Execution risks need review.")
    elif anomalies:
        main_risk = anomalies[0].get("type", "Execution issues need attention.")
    else:
        main_risk = "No major execution risk detected right now."

    return {
        "status": status_label,
        "reason": reason,
        "immediate_focus": immediate_focus,
        "main_risk": main_risk,
        "headline_action": next_actions[0] if next_actions else "Start the highest-priority ready task.",
    }

def build_owner_action_plan(task_list: List[Dict[str, Any]]) -> Dict[str, List[str]]:
    plan: Dict[str, List[str]] = {}

    actionable = [
        t for t in task_list
        if t.get("status") in {"todo", "in_progress"}
    ]

    actionable.sort(
        key=lambda x: (
            -x.get("criticality_score", 0),
            x.get("estimated_days", 0),
            x.get("title", "")
        )
    )

    for task in actionable:
        owner = task.get("assigned_to") or "Unassigned"
        plan.setdefault(owner, [])
        if len(plan[owner]) < 3:
            plan[owner].append(task.get("title", "Untitled task"))

    return plan

def build_decisions_list(result: Dict[str, Any]) -> List[str]:
    critic_report = result.get("critic_report", {})
    decisions = critic_report.get("recommendations", [])
    if not decisions:
        decisions = ["No urgent founder decision is required right now."]
    return decisions

# =========================================================
# 12) ORCHESTRATOR
# =========================================================

class ExecutionOrchestrator:
    def __init__(self, llm: LLMClient, kb: LocalKnowledgeBase, mcp_client: MCPProjectOpsClient):
        self.llm = llm
        self.kb = kb
        self.mcp_client = mcp_client

    async def run(self, state: Dict[str, Any]) -> Dict[str, Any]:
        state = copy.deepcopy(state)

        state = await sync_runtime_from_mcp(state, self.mcp_client)
        state = retrieve_kb_patterns(state, self.kb)
        state = planner_step(state, self.llm)
        state = normalize_work_items_from_plan(state)
        state = build_dag_and_ready_queue(state)
        state = compute_estimations(state)
        state = compute_priority_scores(state)
        state = assign_tasks_graph_aware(state)
        state = compute_feasibility(state)
        state = detect_anomalies(state)

        state["execution_state"]["monitoring"] = {
            "summary": {
                "done": 0,
                "in_progress": 0,
                "todo": 0,
                "blocked": 0,
            },
            "anomaly_count": len(state["execution_state"].get("anomalies", [])),
            "critic_issues": 0,
            "task_count": len(state["execution_state"].get("task_list", [])),
            "ready_count": len(state["execution_state"].get("ready_queue", [])),
        }

        for _ in range(MAX_CRITIC_LOOPS):
            state = critic_step(state, self.llm)

        state = action_decision_step(state)
        state = await persist_tasks_to_mcp(state, self.mcp_client)

        critic = state.get("execution_state", {}).get("critic_report", {})
        state["execution_state"]["next_actions"] = critic.get("updated_next_actions", [])

        id_to_task = {t["id"]: t for t in state.get("execution_state", {}).get("task_list", [])}
        priority_queue = [
            id_to_task[t_id]
            for t_id in state.get("execution_state", {}).get("priority_queue", [])
            if t_id in id_to_task
        ]
        task_list = state.get("execution_state", {}).get("task_list", [])

        state["execution_state"]["monitoring"] = {
            "summary": {
                "done": len([t for t in task_list if t.get("status") == STATUS_DONE]),
                "in_progress": len([t for t in task_list if t.get("status") == STATUS_IN_PROGRESS]),
                "todo": len([t for t in task_list if t.get("status") == STATUS_TODO]),
                "blocked": len([t for t in task_list if t.get("status") == STATUS_BLOCKED]),
            },
            "anomaly_count": len(state["execution_state"].get("anomalies", [])),
            "critic_issues": len(critic.get("issues_found", [])),
            "task_count": len(task_list),
            "ready_count": len(state["execution_state"].get("ready_queue", [])),
        }

        founder_brief = {
            "executive_summary": build_executive_summary({
                "feasibility": state.get("execution_state", {}).get("feasibility", {}),
                "anomalies": state.get("execution_state", {}).get("anomalies", []),
                "critic_report": state.get("execution_state", {}).get("critic_report", {}),
                "next_actions": state.get("execution_state", {}).get("next_actions", []),
                "priority_queue": priority_queue,
            }),
            "owner_action_plan": build_owner_action_plan(task_list),
            "decisions": build_decisions_list({
                "critic_report": state.get("execution_state", {}).get("critic_report", {})
            }),
        }

        return {
            "startup_name": state.get("startup_profile", {}).get("name", "Unknown startup"),
            "models": {
                "planner_requested": LLM_PLANNER_MODEL,
                "critic_requested": LLM_CRITIC_MODEL,
                "mode": MODEL_MODE,
                "planner_used": state.get("execution_state", {}).get("planner_used", "unknown"),
                "critic_used": state.get("execution_state", {}).get("critic_used", "unknown"),
            },
            "kb_retrieval": state.get("knowledge_base", {}).get("last_retrieval", {}),
            "draft_plan": state.get("execution_state", {}).get("draft_plan", {}),
            "task_list": sorted(
                task_list,
                key=lambda x: (-x.get("criticality_score", 0), x.get("title", "")),
            ),
            "priority_queue": priority_queue,
            "ready_queue": state.get("execution_state", {}).get("ready_queue", []),
            "feasibility": state.get("execution_state", {}).get("feasibility", {}),
            "anomalies": state.get("execution_state", {}).get("anomalies", []),
            "critic_report": state.get("execution_state", {}).get("critic_report", {}),
            "next_actions": state.get("execution_state", {}).get("next_actions", []),
            "monitoring": state.get("execution_state", {}).get("monitoring", {}),
            "dependency_graph_has_cycle": state.get("execution_state", {}).get("dependency_graph_has_cycle", False),
            "founder_brief": founder_brief,
            "updated_state": state,
        }

# =========================================================
# 13) OUTPUT
# =========================================================

def render_user_friendly_output(result: Dict[str, Any]):
    startup = result.get("startup_name", "Unknown startup")
    feasibility = result.get("feasibility", {})
    monitoring = result.get("monitoring", {})
    critic_report = result.get("critic_report", {})
    next_actions = result.get("next_actions", [])
    priority_tasks = result.get("priority_queue", [])
    task_list = result.get("task_list", [])
    summary = monitoring.get("summary", {})
    jira = result.get("updated_state", {}).get("execution_state", {}).get("jira", {})

    executive = build_executive_summary(result)
    owner_plan = build_owner_action_plan(task_list)
    anomaly_review = critic_report.get("anomaly_review", [])
    critic_review = critic_report.get("critic_review", [])
    recommendations = critic_report.get("recommendations", [])

    print("\n" + "=" * 90)
    print(f"EXECUTION BRIEF — {startup}")
    print("=" * 90)

    print("\n1. EXECUTIVE SUMMARY")
    print("-" * 90)
    print(f"Project status     : {executive['status']}")
    print(f"Why                : {executive['reason']}")
    print(f"Immediate focus    : {executive['immediate_focus']}")
    print(f"Main risk          : {executive['main_risk']}")
    print(f"Recommended action : {executive['headline_action']}")

    print("\n2. CAN WE DELIVER ON TIME?")
    print("-" * 90)
    print(f"Delivery outlook           : {feasibility.get('status')}")
    print(f"Minimum time needed        : {feasibility.get('critical_path_days')} working days")
    print(f"Days remaining to deadline : {feasibility.get('deadline_days')} days")
    print(f"Safety buffer              : {feasibility.get('buffer_days')} days")

    print("\n3. WHAT SHOULD HAPPEN NOW?")
    print("-" * 90)
    if next_actions:
        for i, action in enumerate(next_actions[:5], start=1):
            print(f"{i}. {action}")
    else:
        print("No immediate action list available.")

    print("\n4. WHO SHOULD DO WHAT?")
    print("-" * 90)
    for owner, actions in owner_plan.items():
        print(f"{owner}:")
        for item in actions:
            print(f"  - {item}")

    print("\n5. MAIN RISKS AND ANOMALIES")
    print("-" * 90)
    if anomaly_review:
        for i, item in enumerate(anomaly_review[:5], start=1):
            print(f"{i}. {item}")
    else:
        print("No major anomaly highlighted by the reviewer.")

    print("\n6. CRITIC REVIEW")
    print("-" * 90)
    if critic_review:
        for i, item in enumerate(critic_review[:5], start=1):
            print(f"{i}. {item}")
    else:
        print("No major structural concern highlighted by the reviewer.")

    print("\n7. RECOMMENDATIONS")
    print("-" * 90)
    if recommendations:
        for i, item in enumerate(recommendations[:7], start=1):
            print(f"{i}. {item}")
    else:
        print("No recommendation available.")

    print("\n8. EXECUTION SNAPSHOT")
    print("-" * 90)
    print(f"Total tasks           : {monitoring.get('task_count', 0)}")
    print(f"Tasks that can start  : {monitoring.get('ready_count', 0)}")
    print(f"Done                  : {summary.get('done', 0)}")
    print(f"In progress           : {summary.get('in_progress', 0)}")
    print(f"To do                 : {summary.get('todo', 0)}")
    print(f"Blocked               : {summary.get('blocked', 0)}")
    print(f"Execution problems    : {monitoring.get('anomaly_count', 0)}")
    print(f"Planning concerns     : {monitoring.get('critic_issues', 0)}")

    print("\n9. DETAILED PRIORITY TASKS")
    print("-" * 90)
    for i, task in enumerate(priority_tasks[:7], start=1):
        print(f"{i}. {task.get('title')}")
        print(f"   Owner      : {task.get('assigned_to', 'unassigned')}")
        print(f"   Priority   : {task.get('priority')}")
        print(f"   Estimate   : {task.get('estimated_days')} days")
        print(f"   Status     : {task.get('status')}")
        print(f"   Milestone  : {task.get('milestone_title')}")

    print("\n10. JIRA SYNC SUMMARY")
    print("-" * 90)
    if jira:
        print(f"Enabled        : {jira.get('enabled', False)}")
        print(f"Project key    : {jira.get('project_key', 'N/A')}")
        print(f"Issues synced  : {jira.get('issues_synced', 0)}")
        print(f"Created        : {jira.get('created', 0)}")
        print(f"Updated        : {jira.get('updated', 0)}")
        print(f"Errors         : {jira.get('errors', 0)}")
        if jira.get("last_sync"):
            print(f"Last sync      : {jira.get('last_sync')}")
    else:
        print("No Jira sync summary available.")

# =========================================================
# 14) RUN
# =========================================================

async def main():
    shared_state = build_initial_state()

    kb = LocalKnowledgeBase(
        kb_path=KB_PATH,
        embed_model_name=EMBED_MODEL_NAME,
        rerank_model_name=RERANK_MODEL_NAME,
    )

    llm = LLMClient(
        api_key=LLM_API_KEY,
        base_url=LLM_BASE_URL,
    )

    mcp_client = MCPProjectOpsClient(
        server_script="mcp_startup_server.py",
        python_cmd="python",
    )

    orchestrator = ExecutionOrchestrator(
        llm=llm,
        kb=kb,
        mcp_client=mcp_client,
    )

    result = await orchestrator.run(shared_state)

    print("\n================ EXECUTION AGENT RESULT ================\n")
    render_user_friendly_output(result)

    df_tasks = pd.DataFrame(result["task_list"])
    if not df_tasks.empty:
        display_cols = [
            "milestone_title",
            "title",
            "assigned_to",
            "status",
            "priority",
            "estimated_days",
            "priority_score",
            "criticality_score",
            "match_confidence",
            "assignment_score",
            "continuity_score",
            "depends_on",
            "category",
        ]
        display_cols = [c for c in display_cols if c in df_tasks.columns]
        df_display = df_tasks[display_cols].copy()
        print(df_display.head(25).to_string(index=False))

    os.makedirs("execution_agent_outputs", exist_ok=True)
    startup_name = result.get("startup_name", "startup")
    out_path = f"execution_agent_outputs/execution_result_{slugify(startup_name) or 'startup'}.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(f"\nSaved: {out_path}")


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
