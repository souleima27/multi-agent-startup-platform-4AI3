# =========================================================
# EXECUTION AGENT WITH MCP
# State contains facts only.
# Agent thinks, reasons, creates tasks, assigns them, then persists via MCP.
# MCP is execution-only.
# All reasoning, planning, DAG construction, prioritization, and decision-making are agent-side only.
# Executor is deterministic and stateless.
# =========================================================

import os
import re
import json
import time
import copy
from dataclasses import asdict
import httpx
import pandas as pd
import networkx as nx

from typing import Any, Dict, List, Optional, Tuple
from datetime import datetime, date
from sentence_transformers import SentenceTransformer, CrossEncoder
from openai import OpenAI

from mcp_client_adapter import MCPProjectOpsClient
from a2a.router import Router

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

PLANNER_MAX_TOKENS = int(os.getenv("PLANNER_MAX_TOKENS", "1200"))
CRITIC_MAX_TOKENS = int(os.getenv("CRITIC_MAX_TOKENS", "500"))

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

ACTION_PRIORITY = {
    "create_task": 0,
    "assign_owner": 1,
    "update_status": 2,
    "generate_summary": 3,
}

INTERNAL_ACTIONS = {
    "investigate_blocker",
    "split_large_task",
    "reassign_task",
    "accelerate_critical_task",
    "start_task",
    "critic_recommendation",
}

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

    # Important: facts only. No predefined execution task list here.
    state.setdefault("execution_state", {})
    state.setdefault("feasibility", {})
    state.setdefault("anomalies", [])
    return state

def save_updated_state(state: Dict[str, Any], path: str = "startup_state.json") -> None:
    with open(path, "w", encoding="utf-8") as f:
        json.dump(state, f, ensure_ascii=False, indent=2)

async def sync_runtime_from_mcp(state: Dict[str, Any], mcp_client: MCPProjectOpsClient) -> Dict[str, Any]:
    state = copy.deepcopy(state)

    runtime = {}
    if os.path.exists("agent_runtime.json"):
        try:
            with open("agent_runtime.json", "r", encoding="utf-8") as f:
                runtime = json.load(f)
        except Exception as e:
            print(f"[Runtime Sync] Could not read agent_runtime.json: {type(e).__name__}: {e}")
            runtime = {}

    runtime_tasks = runtime.get("tasks", [])
    state.setdefault("runtime", {})["tasks"] = runtime_tasks

    team_capacity = []
    for member in state.get("team", []):
        current_load = len([
            t for t in runtime_tasks
            if t.get("assigned_to") == member.get("name")
            and t.get("status") in {STATUS_TODO, STATUS_IN_PROGRESS, STATUS_BLOCKED}
        ])
        team_capacity.append({
            "name": member.get("name"),
            "role": member.get("role"),
            "availability": member.get("availability", 1.0),
            "current_load": current_load,
            "skills": member.get("skills", []),
        })
    state["runtime"]["team_capacity"] = team_capacity
    state["runtime"]["blockers"] = [
        {
            "id": t.get("id"),
            "title": t.get("title"),
            "assigned_to": t.get("assigned_to"),
            "blocked_reason": t.get("blocked_reason"),
            "status": t.get("status"),
        }
        for t in runtime_tasks
        if t.get("status") == STATUS_BLOCKED
    ]

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
    """
    This is where dynamic task generation happens.
    Tasks are created from facts: objectives, features, admin work, deadlines.
    """
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
    }

    system_prompt = """
You are an execution-planning agent for a startup.

Return ONLY JSON.
No markdown.
No code fences.

Schema:
{
  "milestones": [
    {
      "title": "string",
      "description": "string",
      "priority": "high|medium|low",
      "category": "product_execution|admin_execution",
      "deadline": "YYYY-MM-DD or null",
      "tasks": [
        {
          "title": "string",
          "description": "string",
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
  "assumptions": ["string"]
}

Rules:
- Tasks must be generated from objective, features, admin workflow, deadlines, and team context.
- Keep tasks concrete and operational.
- Include validation/testing tasks where relevant.
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

def normalize_ratio(value: float, ceiling: float) -> float:
    if ceiling <= 0:
        return 0.0
    return max(0.0, min(1.0, value / ceiling))

def compute_urgency_weight(task: Dict[str, Any], fallback_buffer: Optional[float], current_date: str) -> float:
    deadline = task.get("deadline")
    estimated_days = max(0.5, safe_float(task.get("estimated_days", 0.5), 0.5))
    if deadline:
        days_left = days_between(current_date, deadline)
        if days_left <= estimated_days:
            return 1.0
        if days_left <= estimated_days + 2:
            return 0.8
        if days_left <= estimated_days + 5:
            return 0.6
        return 0.3

    if fallback_buffer is None:
        return 0.4
    if fallback_buffer <= 0:
        return 1.0
    if fallback_buffer <= 3:
        return 0.8
    if fallback_buffer <= 5:
        return 0.6
    return 0.3

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
    """
    Convert milestone/task plan into flat internal work items.
    No assignments are imported from the state facts.
    Only status hints may be merged from factual live signals and runtime tasks.
    """
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

    # Merge factual live status hints
    hints = state.get("live_status", {}).get("progress_signals", [])
    hints_by_title = {normalize_label(h.get("work_item_hint", "")): h for h in hints}

    # Merge runtime task status if any previous agent run exists
    runtime_tasks = state.get("runtime", {}).get("tasks", [])
    runtime_by_title = {normalize_label(t.get("title", "")): t for t in runtime_tasks}

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
    downstream_counts = {}
    critical_path_nodes = set()
    critical_path_length = 0.0
    cycle_edges = []

    if not has_cycle and g.number_of_nodes() > 0:
        topo = list(nx.topological_sort(g))
        depth_map = {}
        longest_to = {}
        longest_from = {}
        est_by_id = {
            t["id"]: max(0.5, safe_float(t.get("estimated_days", 0.5), 0.5))
            for t in tasks
        }

        for node in topo:
            preds = list(g.predecessors(node))
            depth_map[node] = 0 if not preds else 1 + max(depth_map[p] for p in preds)
            node_cost = est_by_id.get(node, 0.5)
            longest_to[node] = node_cost if not preds else max(longest_to[p] for p in preds) + node_cost

        for node in reversed(topo):
            succs = list(g.successors(node))
            node_cost = est_by_id.get(node, 0.5)
            longest_from[node] = node_cost if not succs else node_cost + max(longest_from[s] for s in succs)
            downstream_counts[node] = len(nx.descendants(g, node))

        critical_path_length = max(longest_to.values(), default=0.0)

        for t in tasks:
            t["graph_depth"] = depth_map.get(t["id"], 0)
            total_through_node = longest_to.get(t["id"], 0.0) + longest_from.get(t["id"], 0.0) - est_by_id.get(t["id"], 0.5)
            slack = max(0.0, critical_path_length - total_through_node)
            t["downstream_count"] = downstream_counts.get(t["id"], 0)
            t["critical_path_weight"] = round(max(0.0, 1.0 - (slack / max(critical_path_length, 1.0))), 4)
            if abs(total_through_node - critical_path_length) < 1e-6:
                critical_path_nodes.add(t["id"])
            if t.get("status") == STATUS_TODO and all(dep in done_ids for dep in t.get("depends_on", [])):
                ready_queue.append(t["id"])
    else:
        for t in tasks:
            t["graph_depth"] = 0
            t["downstream_count"] = len(t.get("unblocks", []))
            t["critical_path_weight"] = 0.0
        if has_cycle:
            try:
                cycle_edges = list(nx.find_cycle(g))
            except Exception:
                cycle_edges = []

    state["execution_state"]["dependency_graph_has_cycle"] = has_cycle
    state["execution_state"]["dependency_graph"] = {
        "node_count": g.number_of_nodes(),
        "edge_count": g.number_of_edges(),
        "critical_path_days_estimate": round(critical_path_length, 2),
        "critical_path_task_ids": sorted(list(critical_path_nodes)),
        "cycle_edges": cycle_edges,
    }
    state["execution_state"]["ready_queue"] = sorted(ready_queue)
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

    g = nx.DiGraph()
    for t in tasks:
        g.add_node(t["id"])
    for t in tasks:
        for dep in t.get("depends_on", []):
            g.add_edge(dep, t["id"])

    if g.number_of_nodes() > 0 and nx.is_directed_acyclic_graph(g):
        topo = list(nx.topological_sort(g))
        longest_to = {}
        longest_from = {}
        est_by_id = {t["id"]: safe_float(t.get("estimated_days", 0.5), 0.5) for t in tasks}

        for node in topo:
            preds = list(g.predecessors(node))
            node_cost = est_by_id.get(node, 0.5)
            longest_to[node] = node_cost if not preds else max(longest_to[p] for p in preds) + node_cost

        for node in reversed(topo):
            succs = list(g.successors(node))
            node_cost = est_by_id.get(node, 0.5)
            longest_from[node] = node_cost if not succs else node_cost + max(longest_from[s] for s in succs)

        critical_path_length = max(longest_to.values(), default=0.0)
        for t in tasks:
            total_through_node = longest_to.get(t["id"], 0.0) + longest_from.get(t["id"], 0.0) - est_by_id.get(t["id"], 0.5)
            slack = max(0.0, critical_path_length - total_through_node)
            t["critical_path_weight"] = round(max(0.0, 1.0 - (slack / max(critical_path_length, 1.0))), 4)

        state.setdefault("execution_state", {}).setdefault("dependency_graph", {})["critical_path_days_estimate"] = round(critical_path_length, 2)

    state["execution_state"]["task_list"] = tasks
    return state

def compute_priority_scores(state: Dict[str, Any]) -> Dict[str, Any]:
    tasks = state.get("execution_state", {}).get("task_list", [])
    feasibility = state.get("execution_state", {}).get("feasibility", {})
    fallback_buffer = feasibility.get("buffer_days")
    current_date = state.get("constraints", {}).get("current_date", TODAY)

    prio_to_value = {
        PRIORITY_HIGH: 5,
        PRIORITY_MEDIUM: 3,
        PRIORITY_LOW: 2,
    }

    for t in tasks:
        t["business_value"] = prio_to_value.get(t.get("priority", PRIORITY_MEDIUM), 3)
        t["blocking_count"] = max(len(t.get("unblocks", [])), int(t.get("downstream_count", 0)))

        risk_weight = 1.0
        if t.get("status") == STATUS_BLOCKED:
            risk_weight = 5.0
        elif t.get("status") == STATUS_DELAYED:
            risk_weight = 4.0
        elif t.get("complexity") == "high":
            risk_weight = 3.0

        t["risk_weight"] = risk_weight
        urgency_weight = compute_urgency_weight(t, fallback_buffer, current_date)
        ready_bonus = 1.0 if t["id"] in set(state.get("execution_state", {}).get("ready_queue", [])) else 0.0

        score = (
            (t["business_value"] * 0.30)
            + (min(5.0, t["blocking_count"]) * 0.20)
            + (t["risk_weight"] * 0.15)
            + (safe_float(t.get("critical_path_weight", 0.0), 0.0) * 2.5 * 0.20)
            + (urgency_weight * 5.0 * 0.10)
            + (ready_bonus * 5.0 * 0.05)
        )
        t["priority_score"] = round(score, 3)
        t["criticality_score"] = round(
            t["priority_score"]
            + (0.3 * safe_float(t.get("critical_path_weight", 0.0), 0.0))
            + (0.15 * safe_float(t.get("continuity_score", 0.0), 0.0)),
            3,
        )

    ready_ids = set(state.get("execution_state", {}).get("ready_queue", []))
    ready_tasks = [t for t in tasks if t["id"] in ready_ids]
    ready_tasks.sort(
        key=lambda x: (
            -x.get("priority_score", 0),
            -x.get("critical_path_weight", 0),
            -x.get("downstream_count", 0),
            x.get("estimated_days", 0),
            x.get("title", ""),
        )
    )

    state["execution_state"]["task_list"] = tasks
    state["execution_state"]["priority_queue"] = [t["id"] for t in ready_tasks]
    return state

def assign_tasks_graph_aware(state: Dict[str, Any]) -> Dict[str, Any]:
    """
    This is where intelligent assignment happens.
    It uses:
    - skill match
    - load balance
    - critical path weight
    - downstream unblock effect
    - predecessor continuity
    - urgency
    """
    tasks = state.get("execution_state", {}).get("task_list", [])
    team = copy.deepcopy(state.get("team", []))
    runtime_capacity = {m["name"]: m for m in state.get("runtime", {}).get("team_capacity", []) if m.get("name")}
    current_date = state.get("constraints", {}).get("current_date", TODAY)
    feasibility = state.get("execution_state", {}).get("feasibility", {})
    fallback_buffer = feasibility.get("buffer_days")

    for member in team:
        if member["name"] in runtime_capacity:
            member["current_load"] = runtime_capacity[member["name"]].get("current_load", 0)
        else:
            member["current_load"] = 0

    id_to_task = {t["id"]: t for t in tasks}
    tasks_sorted = sorted(
        tasks,
        key=lambda x: (
            -x.get("critical_path_weight", 0),
            -x.get("downstream_count", 0),
            -x.get("graph_depth", 0),
            x.get("title", ""),
        ),
    )

    for t in tasks_sorted:
        best_idx = None
        best_score = -1.0
        best_match = 0.0
        best_continuity = 0.0

        preds = [id_to_task[d] for d in t.get("depends_on", []) if d in id_to_task]
        predecessor_owners = [p.get("assigned_to") for p in preds if p.get("assigned_to")]
        max_downstream = max([int(x.get("downstream_count", 0)) for x in tasks] or [1])

        for i, m in enumerate(team):
            match_conf = infer_match_confidence(t, m)
            lf = load_factor(int(m.get("current_load", 0)))
            criticality = safe_float(t.get("critical_path_weight", 0.0), 0.0)
            unblock_weight = normalize_ratio(float(t.get("downstream_count", 0)), float(max_downstream))
            continuity = 1.0 if m["name"] in predecessor_owners else 0.0
            urgency = compute_urgency_weight(t, fallback_buffer, current_date)

            delegation_score = (
                match_conf * 0.35
                + lf * 0.20
                + criticality * 0.20
                + unblock_weight * 0.15
                + continuity * 0.05
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
            (0.7 * safe_float(t.get("critical_path_weight", 0), 0))
            + (0.2 * safe_float(t.get("continuity_score", 0), 0))
            + (0.1 * normalize_ratio(float(t.get("downstream_count", 0)), 5.0)),
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
        feasibility = {
            "status": "infeasible",
            "critical_path_days": None,
            "deadline_days": None,
            "buffer_days": None,
            "reason": "dependency_cycle",
        }
        state["execution_state"]["critical_path_days"] = None
        state["execution_state"]["feasibility"] = feasibility
        state["feasibility"] = feasibility
        return state

    deadline_days = days_between(current_date, mvp_deadline) if mvp_deadline else None
    buffer = None if deadline_days is None else round(deadline_days - cp_days, 2)

    if buffer is None:
        status = "unknown"
    elif buffer > 5:
        status = "safe"
    elif buffer >= 1:
        status = "fragile"
    else:
        status = "infeasible"

    state["execution_state"]["critical_path_days"] = cp_days
    feasibility = {
        "status": status,
        "critical_path_days": cp_days,
        "deadline_days": deadline_days,
        "buffer_days": buffer,
    }
    state["execution_state"]["feasibility"] = feasibility
    state["feasibility"] = feasibility
    return state

def detect_anomalies(state: Dict[str, Any]) -> Dict[str, Any]:
    tasks = state.get("execution_state", {}).get("task_list", [])
    team = state.get("team", [])
    anomalies = []

    for t in tasks:
        est = safe_float(t.get("estimated_days", 0), 0)
        act = safe_float(t.get("actual_days", 0), 0)

        if t.get("status") in {STATUS_IN_PROGRESS, STATUS_BLOCKED} and act >= max(3.0, est) and safe_float(t.get("progress", 0), 0) < 0.35:
            anomalies.append({"type": "stuck_task", "task_id": t["id"], "title": t["title"]})
        if est > 0 and act > 2 * est:
            anomalies.append({"type": "effort_overrun", "task_id": t["id"], "title": t["title"], "estimated_days": est, "actual_days": act})

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

    if state.get("execution_state", {}).get("dependency_graph_has_cycle"):
        anomalies.append({
            "type": "dependency_cycle",
            "details": state.get("execution_state", {}).get("dependency_graph", {}).get("cycle_edges", []),
        })

    state["execution_state"]["anomalies"] = anomalies
    state["anomalies"] = anomalies
    return state

# =========================================================
# 8) CRITIC
# =========================================================

def critic_local_fallback(state: Dict[str, Any]) -> Dict[str, Any]:
    issues = []
    next_actions = []

    if state.get("execution_state", {}).get("dependency_graph_has_cycle"):
        issues.append({
            "issue": "Dependency cycle detected in task graph",
            "severity": "high",
            "suggested_fix": "Break at least one circular dependency between tasks.",
        })

    feasibility = state.get("execution_state", {}).get("feasibility", {})
    if feasibility.get("status") in ["fragile", "infeasible"]:
        issues.append({
            "issue": f"Feasibility is {feasibility.get('status')}",
            "severity": "high" if feasibility.get("status") == "infeasible" else "medium",
            "suggested_fix": "Reduce scope, protect critical tasks, and postpone low-priority work.",
        })

    anomalies = state.get("execution_state", {}).get("anomalies", [])
    if anomalies:
        next_actions.append("Resolve blocked and overrun tasks before starting new non-critical work.")

    top_priority_ids = set(state.get("execution_state", {}).get("priority_queue", [])[:3])
    for t in state.get("execution_state", {}).get("task_list", []):
        if t["id"] in top_priority_ids:
            next_actions.append(f"Focus next on: {t['title']} (owner: {t.get('assigned_to', 'unassigned')})")

    if not next_actions:
        next_actions.append("Review the ready queue and start the highest-priority available task.")

    return {"issues_found": issues, "updated_next_actions": next_actions}

def remote_critic_attempt(state: Dict[str, Any], llm: LLMClient) -> Optional[Dict[str, Any]]:
    if not llm.healthcheck():
        return None

    system_prompt = """
You are the execution reviewer.
Return ONLY JSON:
{
  "issues_found": [
    {
      "issue": "string",
      "severity": "low|medium|high",
      "suggested_fix": "string"
    }
  ],
  "updated_next_actions": ["string"]
}
""".strip()

    payload = {
        "feasibility": state.get("execution_state", {}).get("feasibility", {}),
        "anomalies": state.get("execution_state", {}).get("anomalies", []),
        "priority_queue": state.get("execution_state", {}).get("priority_queue", [])[:5],
        "task_list": [
            {
                "title": t.get("title"),
                "status": t.get("status"),
                "priority": t.get("priority"),
                "assigned_to": t.get("assigned_to"),
                "estimated_days": t.get("estimated_days"),
                "depends_on": t.get("depends_on"),
                "tags": t.get("tags", []),
            }
            for t in state.get("execution_state", {}).get("task_list", [])[:12]
        ],
    }

    try:
        raw = llm.chat_json(
            system_prompt=system_prompt,
            user_prompt=pretty_json(payload),
            model=LLM_CRITIC_MODEL,
            temperature=0.1,
            max_tokens=CRITIC_MAX_TOKENS,
        )

        if isinstance(raw, dict) and "issues_found" in raw and "updated_next_actions" in raw:
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

def build_internal_action(action_type: str, **kwargs: Any) -> Dict[str, Any]:
    action = {"type": "internal", "action_type": action_type}
    action.update(kwargs)
    return action

def build_external_action(
    action_id: str,
    seq: int,
    system: str,
    operation: str,
    payload: Dict[str, Any],
    depends_on: Optional[List[str]] = None,
    max_attempts: int = 5,
    tags: Optional[List[str]] = None,
) -> Dict[str, Any]:
    return {
        "action_id": action_id,
        "type": "external",
        "seq": seq,
        "depends_on": depends_on or [],
        "destination": {
            "system": system,
            "operation": operation,
        },
        "payload": payload,
        "execution_policy": {
            "max_attempts": max_attempts,
            "base_delay_seconds": 1.0,
            "jitter_seconds": 0.25,
        },
        "audit": {
            "requested_by": "execution-agent",
            "tags": tags or [],
        },
    }

def split_actions(actions: List[Dict[str, Any]]) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
    internal_actions: List[Dict[str, Any]] = []
    external_actions: List[Dict[str, Any]] = []

    for action in actions:
        action_type = action.get("type")
        if action_type == "external":
            external_actions.append(action)
        else:
            internal_actions.append(action)

    return internal_actions, external_actions

def build_external_actions(state: Dict[str, Any]) -> List[Dict[str, Any]]:
    external_actions: List[Dict[str, Any]] = []
    anomalies = state.get("execution_state", {}).get("anomalies", [])
    feasibility = state.get("execution_state", {}).get("feasibility", {})
    startup_name = state.get("startup_profile", {}).get("name", "Startup")
    blocked_tasks = state.get("runtime", {}).get("blockers", [])
    ready_ids = state.get("execution_state", {}).get("priority_queue", [])[:3]
    id_to_task = {t["id"]: t for t in state.get("execution_state", {}).get("task_list", [])}
    integrations = state.get("external_destinations", {})

    seq = 100
    jira_action_id: Optional[str] = None

    if anomalies and isinstance(integrations.get("jira"), dict) and integrations["jira"].get("url"):
        top_anomaly = anomalies[0]
        jira_action_id = f"ext_jira_{slugify(str(top_anomaly.get('type', 'issue')))}"
        external_actions.append(build_external_action(
            action_id=jira_action_id,
            seq=seq,
            system="jira",
            operation="create_issue",
            payload={
                "url": integrations["jira"]["url"],
                "method": "POST",
                "body": {
                    "fields": {
                        "summary": f"{startup_name}: {top_anomaly.get('type')} detected",
                        "description": pretty_json(top_anomaly),
                        "issuetype": {"name": "Task"},
                    }
                },
            },
            tags=["anomaly", "jira"],
        ))
        seq += 10

    if (blocked_tasks or feasibility.get("status") in {"fragile", "infeasible"}) and isinstance(integrations.get("slack"), dict):
        slack_channel = integrations["slack"].get("channel")
        slack_url = integrations["slack"].get("url")
        if slack_channel:
            external_actions.append(build_external_action(
                action_id="ext_slack_execution_alert",
                seq=seq,
                system="slack",
                operation="post_message",
                payload={
                    "url": slack_url or "https://slack.com/api/chat.postMessage",
                    "body": {
                        "channel": slack_channel,
                        "text": f"{startup_name} execution update: feasibility={feasibility.get('status')}, blockers={len(blocked_tasks)}, anomalies={len(anomalies)}",
                    },
                },
                depends_on=[jira_action_id] if jira_action_id else [],
                tags=["alert", "slack"],
            ))
            seq += 10

    if feasibility.get("status") == "infeasible" and isinstance(integrations.get("email"), dict):
        email_cfg = integrations["email"]
        if email_cfg.get("smtp_host") and email_cfg.get("to_email") and email_cfg.get("from_email"):
            external_actions.append(build_external_action(
                action_id="ext_email_feasibility_alert",
                seq=seq,
                system="email",
                operation="send_email",
                payload={
                    "smtp_host": email_cfg["smtp_host"],
                    "smtp_port": email_cfg.get("smtp_port", 587),
                    "smtp_username": email_cfg.get("smtp_username"),
                    "from_email": email_cfg["from_email"],
                    "to_email": email_cfg["to_email"],
                    "subject": f"{startup_name} feasibility alert",
                    "body": f"Project status is {feasibility.get('status')} with buffer {feasibility.get('buffer_days')} days.",
                },
                depends_on=[jira_action_id] if jira_action_id else [],
                tags=["email", "feasibility"],
            ))
            seq += 10

    if anomalies and isinstance(integrations.get("github"), dict) and integrations["github"].get("url"):
        external_actions.append(build_external_action(
            action_id="ext_github_issue_execution_risk",
            seq=seq,
            system="github",
            operation="create_issue",
            payload={
                "url": integrations["github"]["url"],
                "method": "POST",
                "body": {
                    "title": f"{startup_name} execution risk follow-up",
                    "body": pretty_json({"anomalies": anomalies[:5], "feasibility": feasibility}),
                },
            },
            tags=["github", "risk"],
        ))
        seq += 10

    if isinstance(integrations.get("notion"), dict) and integrations["notion"].get("url"):
        external_actions.append(build_external_action(
            action_id="ext_notion_execution_summary",
            seq=seq,
            system="notion",
            operation="update_page",
            payload={
                "url": integrations["notion"]["url"],
                "method": "POST",
                "body": {
                    "startup": startup_name,
                    "feasibility": feasibility,
                    "top_ready_tasks": [id_to_task[t_id]["title"] for t_id in ready_ids if t_id in id_to_task],
                },
            },
            tags=["notion", "summary"],
        ))
        seq += 10

    if ready_ids and isinstance(integrations.get("calendar"), dict) and integrations["calendar"].get("url"):
        lead_task = id_to_task.get(ready_ids[0])
        if lead_task:
            external_actions.append(build_external_action(
                action_id="ext_calendar_focus_block",
                seq=seq,
                system="calendar",
                operation="schedule_event",
                payload={
                    "url": integrations["calendar"]["url"],
                    "method": "POST",
                    "body": {
                        "title": f"Focus block: {lead_task['title']}",
                        "description": f"Critical execution task for {startup_name}",
                    },
                },
                tags=["calendar", "focus"],
            ))

    return external_actions

def decide_actions_agentically(state: Dict[str, Any]) -> List[Dict[str, Any]]:
    tasks = state.get("execution_state", {}).get("task_list", [])
    runtime_tasks = state.get("runtime", {}).get("tasks", [])
    runtime_by_id = {t.get("id"): t for t in runtime_tasks if t.get("id")}
    ready_ids = state.get("execution_state", {}).get("priority_queue", []) or state.get("execution_state", {}).get("ready_queue", [])
    id_to_task = {t["id"]: t for t in tasks}
    feasibility = state.get("execution_state", {}).get("feasibility", {})
    anomalies = state.get("execution_state", {}).get("anomalies", [])

    candidate_actions = []

    for task in tasks:
        runtime_task = runtime_by_id.get(task["id"])
        if runtime_task is None:
            candidate_actions.append(build_internal_action(
                "create_task",
                task_id=task["id"],
                task={
                    "id": task["id"],
                    "title": task["title"],
                    "description": task.get("description", ""),
                    "priority": task.get("priority", PRIORITY_MEDIUM),
                    "assigned_to": task.get("assigned_to"),
                    "deadline": task.get("deadline"),
                    "status": task.get("status", STATUS_TODO),
                    "progress": task.get("progress", 0.0),
                    "actual_days": task.get("actual_days", 0),
                    "blocked_reason": task.get("blocked_reason"),
                    "milestone_title": task.get("milestone_title"),
                    "estimated_days": task.get("estimated_days"),
                    "priority_score": task.get("priority_score"),
                    "criticality_score": task.get("criticality_score"),
                    "depends_on": task.get("depends_on", []),
                    "category": task.get("category"),
                },
                priority=round(6.0 + safe_float(task.get("priority_score", 0), 0), 3),
                reason="Mirror planner output into MCP runtime so execution stays in sync.",
            ))
        elif runtime_task.get("assigned_to") != task.get("assigned_to") and task.get("assigned_to"):
            candidate_actions.append(build_internal_action(
                "assign_owner",
                task_id=task["id"],
                owner=task["assigned_to"],
                priority=round(5.0 + safe_float(task.get("criticality_score", 0), 0), 3),
                reason="Apply graph-aware delegation decision.",
            ))

    for task_id in ready_ids[:5]:
        task = id_to_task.get(task_id)
        if not task:
            continue
        runtime_task = runtime_by_id.get(task_id, {})
        if task.get("status") == STATUS_TODO and runtime_task.get("status") in [None, STATUS_TODO]:
            action_type = "accelerate_critical_task" if safe_float(task.get("critical_path_weight", 0), 0) >= 0.8 else "start_task"
            candidate_actions.append(build_internal_action(
                "update_status",
                task_id=task_id,
                new_status=STATUS_IN_PROGRESS,
                progress=max(0.05, safe_float(task.get("progress", 0), 0)),
                priority=round(8.0 + safe_float(task.get("criticality_score", 0), 0), 3),
                reason=f"{action_type} for ready task {task.get('title')}.",
                agentic_label=action_type,
            ))

        if safe_float(task.get("estimated_days", 0), 0) >= 5.0 and task_id in ready_ids[:3]:
            candidate_actions.append(build_internal_action(
                "investigate_blocker",
                task_id=task_id,
                priority=round(4.0 + safe_float(task.get("priority_score", 0), 0), 3),
                reason="Large ready task should be reviewed for potential split before it slows the critical path.",
                agentic_label="split_large_task",
            ))

    for anomaly in anomalies:
        if anomaly.get("type") in {"stuck_task", "effort_overrun"}:
            candidate_actions.append(build_internal_action(
                "investigate_blocker",
                task_id=anomaly.get("task_id"),
                priority=9.5,
                reason=f"Investigate anomaly {anomaly.get('type')} on {anomaly.get('title', anomaly.get('task_id'))}.",
                agentic_label="investigate_blocker",
            ))
        elif anomaly.get("type") == "load_imbalance":
            candidate_actions.append(build_internal_action(
                "reassign_task",
                priority=8.5,
                reason="Rebalance ownership because team load is uneven.",
                agentic_label="reassign_task",
            ))

    summary = {
        "feasibility": feasibility,
        "ready_queue": ready_ids[:5],
        "blockers": state.get("runtime", {}).get("blockers", []),
        "anomalies": anomalies[:10],
        "next_actions_preview": [
            {
                "type": action.get("agentic_label", action.get("action_type", action.get("type"))),
                "task_id": action.get("task_id"),
                "reason": action.get("reason"),
            }
            for action in sorted(candidate_actions, key=lambda x: (-x.get("priority", 0), x.get("task_id", "") or ""))[:8]
        ],
    }
    candidate_actions.append(build_internal_action(
        "generate_summary",
        summary=summary,
        priority=1.0,
        reason="Persist the agent's execution summary to the MCP runtime.",
    ))

    candidate_actions.extend(build_external_actions(state))
    candidate_actions.sort(
        key=lambda x: (
            0 if x.get("type") == "internal" else 1,
            -x.get("priority", 0),
            x.get("action_id") or x.get("task_id") or "",
        )
    )
    return candidate_actions

async def execute_selected_actions_via_mcp(state: Dict[str, Any], mcp_client: MCPProjectOpsClient) -> Dict[str, Any]:
    actions = state.get("execution_state", {}).get("candidate_actions", [])
    execution_results = []
    ordered_actions = sorted(
        actions,
        key=lambda a: (
            ACTION_PRIORITY.get(a.get("action_type", a.get("type")), 99),
            -a.get("priority", 0),
            a.get("task_id") or "",
        ),
    )

    for action in ordered_actions:
        action_type = action.get("action_type", action.get("type"))
        if action_type in INTERNAL_ACTIONS:
            execution_results.append({
                "action": action,
                "executed": False,
                "reason": "agent_internal_action",
            })
            continue

        mcp_action = dict(action)
        mcp_action["type"] = action_type
        result = await mcp_client.execute_action_async(mcp_action)
        execution_results.append({
            "action": action,
            "executed": True,
            "result": result,
        })

    state["execution_state"]["mcp_execution_results"] = execution_results
    return state

def render_outputs(state: Dict[str, Any]) -> Dict[str, Any]:
    critic = state.get("execution_state", {}).get("critic_report", {})
    state["execution_state"]["next_actions"] = [
        action.get("reason")
        for action in (
            state.get("execution_state", {}).get("candidate_actions", [])
            + state.get("execution_state", {}).get("external_actions", [])
        )
        if action.get("reason")
    ][:8]

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
        "external_action_count": len(state["execution_state"].get("external_actions", [])),
        "external_result_count": len(state["execution_state"].get("external_results", [])),
    }

    assignments = [
        {
            "task_id": t["id"],
            "title": t["title"],
            "assigned_to": t.get("assigned_to"),
            "assignment_score": t.get("assignment_score"),
            "critical_path_weight": t.get("critical_path_weight"),
        }
        for t in sorted(task_list, key=lambda x: (-x.get("criticality_score", 0), x.get("title", "")))
    ]

    executable_roadmap = [
        {
            "title": t.get("title"),
            "owner": t.get("assigned_to"),
            "status": t.get("status"),
            "milestone": t.get("milestone_title"),
            "depends_on": t.get("depends_on", []),
        }
        for t in priority_queue[:10]
    ]
    blockers = [
        {
            "task_id": t.get("id"),
            "title": t.get("title"),
            "owner": t.get("assigned_to"),
            "blocked_reason": t.get("blocked_reason"),
        }
        for t in task_list
        if t.get("status") == STATUS_BLOCKED
    ]

    result = {
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
        "assignments": assignments,
        "executable_roadmap": executable_roadmap,
        "blockers": blockers,
        "feasibility": state.get("execution_state", {}).get("feasibility", {}),
        "anomalies": state.get("execution_state", {}).get("anomalies", []),
        "critic_report": state.get("execution_state", {}).get("critic_report", {}),
        "next_actions": state.get("execution_state", {}).get("next_actions", []),
        "candidate_actions": state.get("execution_state", {}).get("candidate_actions", []),
        "external_actions": state.get("execution_state", {}).get("external_actions", []),
        "external_results": state.get("execution_state", {}).get("external_results", []),
        "mcp_execution_results": state.get("execution_state", {}).get("mcp_execution_results", []),
        "monitoring": state.get("execution_state", {}).get("monitoring", {}),
        "dependency_graph_has_cycle": state.get("execution_state", {}).get("dependency_graph_has_cycle", False),
        "updated_state": state,
    }
    return result

# =========================================================
# 10) ORCHESTRATOR
# =========================================================

class ExecutionOrchestrator:
    def __init__(self, llm: LLMClient, kb: LocalKnowledgeBase, mcp_client: MCPProjectOpsClient):
        self.llm = llm
        self.kb = kb
        self.mcp_client = mcp_client
        self.router = Router()

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

        for _ in range(MAX_CRITIC_LOOPS):
            state = critic_step(state, self.llm)

        actions = decide_actions_agentically(state)
        internal_actions, external_actions = split_actions(actions)

        state["execution_state"]["candidate_actions"] = internal_actions
        state["execution_state"]["external_actions"] = external_actions
        state["pending_external_actions"] = external_actions
        state = await execute_selected_actions_via_mcp(state, self.mcp_client)
        self.router.enqueue_many(state.get("pending_external_actions", []))
        external_results = self.router.dispatch_pending()
        state["execution_state"]["external_results"] = [asdict(result) for result in external_results]
        result = render_outputs(state)
        save_updated_state(state)
        return result

# =========================================================
# 11) OUTPUT
# =========================================================

def render_user_friendly_output(result: Dict[str, Any]):
    startup = result.get("startup_name", "Unknown startup")
    models = result.get("models", {})
    feasibility = result.get("feasibility", {})
    monitoring = result.get("monitoring", {})
    critic_report = result.get("critic_report", {})
    next_actions = result.get("next_actions", [])
    priority_tasks = result.get("priority_queue", [])
    blockers = result.get("blockers", [])
    external_results = result.get("external_results", [])
    summary = monitoring.get("summary", {})

    print("\n" + "=" * 90)
    print(f"USER-FRIENDLY EXECUTION REPORT — {startup}")
    print("=" * 90)

    print("\n1. GLOBAL STATUS")
    print("-" * 90)
    print(f"Planning source : {models.get('planner_used', 'unknown')}")
    print(f"Review source   : {models.get('critic_used', 'unknown')}")

    print("\n2. TIME AND FEASIBILITY")
    print("-" * 90)
    print(f"Critical path duration : {feasibility.get('critical_path_days')} days")
    print(f"Days until deadline    : {feasibility.get('deadline_days')} days")
    print(f"Safety buffer          : {feasibility.get('buffer_days')} days")
    print(f"Feasibility            : {feasibility.get('status')}")

    print("\n3. EXECUTION HEALTH")
    print("-" * 90)
    print(f"Total tasks       : {monitoring.get('task_count', 0)}")
    print(f"Ready tasks       : {monitoring.get('ready_count', 0)}")
    print(f"Done              : {summary.get('done', 0)}")
    print(f"In progress       : {summary.get('in_progress', 0)}")
    print(f"Todo              : {summary.get('todo', 0)}")
    print(f"Blocked           : {summary.get('blocked', 0)}")
    print(f"Anomalies         : {monitoring.get('anomaly_count', 0)}")
    print(f"Critic issues     : {monitoring.get('critic_issues', 0)}")
    print(f"External actions  : {monitoring.get('external_action_count', 0)}")
    print(f"External results  : {monitoring.get('external_result_count', 0)}")

    print("\n4. TOP PRIORITY TASKS")
    print("-" * 90)
    for i, task in enumerate(priority_tasks[:5], start=1):
        print(f"{i}. {task.get('title')}")
        print(f"   Owner     : {task.get('assigned_to', 'unassigned')}")
        print(f"   Priority  : {task.get('priority')}")
        print(f"   Estimate  : {task.get('estimated_days')} days")
        print(f"   Score     : {task.get('criticality_score')}")

    print("\n5. CURRENT BLOCKERS")
    print("-" * 90)
    if not blockers:
        print("No current blockers detected.")
    else:
        for i, blocker in enumerate(blockers[:5], start=1):
            print(f"{i}. {blocker.get('title')}")
            print(f"   Owner     : {blocker.get('owner', 'unassigned')}")
            print(f"   Reason    : {blocker.get('blocked_reason', 'No reason provided')}")

    print("\n6. NEXT ACTIONS")
    print("-" * 90)
    for i, action in enumerate(next_actions[:7], start=1):
        print(f"{i}. {action}")

    print("\n7. REVIEW COMMENTS")
    print("-" * 90)
    issues = critic_report.get("issues_found", [])
    if not issues:
        print("No major critic issues were reported.")
    else:
        for i, issue in enumerate(issues[:5], start=1):
            print(f"{i}. Problem : {issue.get('issue')}")
            print(f"   Severity: {issue.get('severity')}")
            print(f"   Fix     : {issue.get('suggested_fix')}")

    print("\n8. EXTERNAL EXECUTION")
    print("-" * 90)
    if not external_results:
        print("No external actions were executed.")
    else:
        for i, item in enumerate(external_results[:5], start=1):
            print(f"{i}. {item.get('system')} -> {item.get('operation')}")
            print(f"   Success  : {item.get('success')}")
            print(f"   Attempts : {item.get('attempts')}")
            print(f"   Error    : {item.get('error', 'None')}")

# =========================================================
# 12) RUN
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
    out_path = "execution_agent_outputs/execution_result_SkillBridge.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(f"\nSaved: {out_path}")


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
