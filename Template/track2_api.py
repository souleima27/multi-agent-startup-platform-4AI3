from __future__ import annotations

import sys
import os
import html
import re
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor
from copy import deepcopy
from pathlib import Path
from typing import Any
from urllib.parse import quote_plus, unquote, urlparse, parse_qs

import requests
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

PROJECT_ROOT = Path(__file__).resolve().parents[1]
TRACK2_ROOT = PROJECT_ROOT / "Track2"

os.environ.setdefault("LLM_TIMEOUT_SECONDS", "6")
os.environ.setdefault("REPORTS_DIR", str(Path(__file__).resolve().parent / "track2_reports"))
if os.getenv("LLM_PLANNER_MODEL") and not os.getenv("LLM_MODEL"):
    os.environ["LLM_MODEL"] = os.getenv("LLM_PLANNER_MODEL", "")

if str(TRACK2_ROOT) not in sys.path:
    sys.path.insert(0, str(TRACK2_ROOT))

from app.services import local_llm as track2_llm  # noqa: E402


def _complete_with_openai_compatible_or_ollama(self, prompt: str, system: str = "") -> str:
    api_key = os.getenv("LLM_API_KEY") or os.getenv("OPENAI_API_KEY")
    base_url = self.base_url.rstrip("/")

    if api_key or "tokenfactory" in base_url or "openai" in base_url:
        headers = {"Content-Type": "application/json"}
        if api_key:
            headers["Authorization"] = f"Bearer {api_key}"
        response = requests.post(
            f"{base_url}/chat/completions",
            json={
                "model": self.model,
                "messages": [
                    {"role": "system", "content": system or "Return strict JSON when requested."},
                    {"role": "user", "content": prompt},
                ],
                "temperature": 0.2,
            },
            headers=headers,
            timeout=self.timeout_seconds,
        )
        response.raise_for_status()
        body = response.json()
        return str(body.get("choices", [{}])[0].get("message", {}).get("content", "")).strip()

    response = requests.post(
        f"{base_url}/api/generate",
        json={"model": self.model, "prompt": prompt, "system": system, "stream": False},
        timeout=self.timeout_seconds,
    )
    response.raise_for_status()
    body = response.json()
    return str(body.get("response", "")).strip()


track2_llm.LocalLLMClient.complete = _complete_with_openai_compatible_or_ollama

from app.models.schemas import ChatRequest, TrackBRequest  # noqa: E402
from app.services.chatbot import TrackBChatbot  # noqa: E402
from app.services.knowledge_base import load_knowledge_base  # noqa: E402
from app.services.local_llm import get_local_llm_client  # noqa: E402
from app.services.orchestrator import TrackBOrchestrator  # noqa: E402

app = FastAPI(title="Track B Legal Bridge")

SEARCH_STOP_TERMS = {
    "com",
    "www",
    "site",
    "page",
    "pages",
    "profile",
    "official",
    "company",
    "startup",
    "startups",
    "social",
    "media",
    "google",
    "linkedin",
    "facebook",
    "meaning",
    "dictionary",
    "definition",
    "translation",
    "wikipedia",
    "tunisia",
    "tunisian",
}
BLOCKED_SEARCH_DOMAINS = {
    "openmeaning.com",
    "dictionary.com",
    "merriam-webster.com",
    "cambridge.org",
    "wikipedia.org",
    "wiktionary.org",
}
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

orchestrator = TrackBOrchestrator()
chatbot = TrackBChatbot(llm=get_local_llm_client(), kb=load_knowledge_base())
latest_result = None
UPLOADS_DIR = Path(__file__).resolve().parent / "track2_uploads"

SAMPLE_REQUEST: dict[str, Any] = {
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
        "associates": [
            {"name": "Mariam", "role": "CEO", "equity_pct": 45, "active": True},
            {"name": "Youssef", "role": "CTO", "equity_pct": 35, "active": True},
            {"name": "Nour", "role": "COO", "equity_pct": 20, "active": True},
        ],
    },
    "documents": [
        {"path": "Track2/data/synthetic_docs/scans/fake_01_statuts.png", "declared_type": "statuts"},
        {"path": "Track2/data/synthetic_docs/scans/fake_02_rc.png", "declared_type": "registre_commerce"},
        {"path": "Track2/data/synthetic_docs/scans/fake_03_if.png", "declared_type": "identifiant_fiscal"},
        {"path": "Track2/data/synthetic_docs/scans/fake_04_attestation_bancaire.png", "declared_type": "attestation_bancaire"},
        {"path": "Track2/data/synthetic_docs/scans/fake_05_cin.png", "declared_type": "cin"},
    ],
    "label_input": {
        "startup_name": "Neuronix Legal AI",
        "transcript": "We automate legal readiness for Tunisian startups.",
        "slide_text": "AI legal compliance, Startup Act readiness, document diagnostics.",
        "sector": "AI SaaS",
        "traction_signals": ["pilot customers", "legal workflow automation"],
        "team_signals": ["technical founder", "legal operations experience"],
        "pitch_notes": ["clear market pain", "strong compliance use case"],
    },
    "options": {
        "strict_mode": True,
        "generate_json_report": True,
        "generate_pdf_report": False,
        "report_prefix": "track_b_template_run",
    },
}


def _as_text_list(values: Any) -> list[str]:
    if not values:
        return []
    if isinstance(values, list):
        return [str(item).strip() for item in values if str(item).strip()]
    return [str(values).strip()]


def _clean_search_url(url: str) -> str:
    if url.startswith("//"):
        url = f"https:{url}"
    parsed = urlparse(url)
    if parsed.path.startswith("/l/"):
        redirect = parse_qs(parsed.query).get("uddg", [""])[0]
        if redirect:
            return unquote(redirect)
    return url


def _fetch_public_search_results(
    query: str,
    limit: int = 3,
    fallback_queries: list[str] | None = None,
    strict_identity: bool = True,
) -> dict[str, Any]:
    attempted_queries = [query, *(fallback_queries or [])]
    collected_results: list[dict[str, Any]] = []
    seen_urls: set[str] = set()
    last_response: dict[str, Any] | None = None
    search_terms = {
        term
        for term in re.findall(r"[\w-]+", " ".join(attempted_queries).lower())
        if len(term) > 2 and term not in SEARCH_STOP_TERMS
    }
    identity_terms = {
        term
        for term in re.findall(r"[\w-]+", query.lower())
        if len(term) > 2 and term not in SEARCH_STOP_TERMS
    } or search_terms

    for search_query in attempted_queries:
        response = _fetch_single_public_search(search_query, limit)
        response["attempted_queries"] = attempted_queries
        if response["status"] == "unavailable":
            last_response = response
            continue

        for result in response.get("results", []):
            result_url = str(result.get("url") or "").strip()
            if not result_url or result_url in seen_urls:
                continue
            if strict_identity and identity_terms and not _result_contains_any(result, identity_terms):
                continue
            if _score_search_result(result, search_terms) <= 0:
                continue
            seen_urls.add(result_url)
            enriched_result = dict(result)
            enriched_result["matched_query"] = search_query
            collected_results.append(enriched_result)

        if len(collected_results) >= limit:
            break

        last_response = response

    if collected_results:
        collected_results.sort(
            key=lambda result: (
                -_score_search_result(result, search_terms),
                result.get("domain", ""),
                result.get("title", ""),
            )
        )
        final_results = collected_results[:limit]
        return {
            "status": "completed",
            "source": "DuckDuckGo public HTML",
            "message": "Public web search executed by the local Track B bridge.",
            "results": final_results,
            "attempted_queries": attempted_queries,
        }

    if last_response and last_response.get("status") == "unavailable":
        last_response["attempted_queries"] = attempted_queries
        return last_response

    return {
        "status": "no_results",
        "source": "DuckDuckGo + Bing public search",
        "message": "Public web search executed, but no matching public result was captured.",
        "results": [],
        "attempted_queries": attempted_queries,
    }


def _result_haystack(result: dict[str, Any]) -> str:
    return " ".join(
        [
            str(result.get("title") or ""),
            str(result.get("snippet") or ""),
            str(result.get("domain") or ""),
            str(result.get("url") or ""),
        ]
    ).lower()


def _contains_term(text: str, term: str) -> bool:
    return bool(re.search(rf"(?<![a-z0-9]){re.escape(term.lower())}(?![a-z0-9])", text))


def _is_blocked_search_result(result: dict[str, Any]) -> bool:
    domain = str(result.get("domain") or "").lower().replace("www.", "")
    title = str(result.get("title") or "").lower()
    snippet = str(result.get("snippet") or "").lower()
    if any(domain == blocked or domain.endswith(f".{blocked}") for blocked in BLOCKED_SEARCH_DOMAINS):
        return True
    blocked_text = ("meaning of", "definition of", "dictionary", "translation", "word meaning")
    return any(term in title or term in snippet for term in blocked_text)


def _result_contains_any(result: dict[str, Any], terms: set[str]) -> bool:
    haystack = _result_haystack(result)
    return any(_contains_term(haystack, term) for term in terms)


def _score_search_result(result: dict[str, Any], search_terms: set[str]) -> int:
    title = str(result.get("title") or "").lower()
    domain = str(result.get("domain") or "").lower()
    haystack = _result_haystack(result)

    if _is_blocked_search_result(result):
        return -100

    score = 0
    for term in search_terms:
        if _contains_term(title, term):
            score += 6
        elif _contains_term(haystack, term):
            score += 3

    if "linkedin.com" in domain:
        score += 2
    if "facebook.com" in domain:
        score += 2
    if domain.endswith(".tn"):
        score += 1

    return score


def _build_search_query(*terms: str) -> str:
    parts: list[str] = []

    for term in terms:
        value = str(term).strip()
        if not value:
            continue
        current_text = " ".join(parts).lower()
        if value.lower() in current_text:
            continue
        parts.append(value)

    return " ".join(parts)


def _build_investor_queries(sector: str, activity: str) -> list[str]:
    sector_term = sector or activity or "startup"
    return [
        _build_search_query("Tunisia startup investors", sector_term, "funding accelerator"),
        _build_search_query("Tunisia venture capital", sector_term, "startup"),
        _build_search_query("startup accelerator Tunisia", sector_term, "investors"),
        _build_search_query("Startup Tunisia investors incubator accelerator"),
    ]


def _fetch_single_public_search(query: str, limit: int = 3) -> dict[str, Any]:
    # Demo fallback: when running in a restricted environment set
    # environment variable TRACK2_PUBLIC_SEARCH_DEMO=1 to return synthetic results.
    if str(os.environ.get("TRACK2_PUBLIC_SEARCH_DEMO", "")).lower() in ("1", "true", "yes"):
        demo_domain = "example.com"
        demo_startup = query or "startup"
        demo_results = [
            {
                "title": f"{demo_startup} — Official website",
                "url": f"https://{demo_domain}/{quote_plus(demo_startup)}",
                "snippet": "Demo result: official website placeholder.",
                "domain": demo_domain,
            },
            {
                "title": f"{demo_startup} — LinkedIn profile",
                "url": f"https://linkedin.com/company/{quote_plus(demo_startup)}",
                "snippet": "Demo result: LinkedIn company page placeholder.",
                "domain": "linkedin.com",
            },
            {
                "title": f"{demo_startup} — Facebook page",
                "url": f"https://facebook.com/{quote_plus(demo_startup)}",
                "snippet": "Demo result: Facebook page placeholder.",
                "domain": "facebook.com",
            },
        ]
        return {
            "status": "demo",
            "source": "demo",
            "message": "Demo public search results (environment network blocked).",
            "results": demo_results[:limit],
        }

    duckduckgo_response = _fetch_duckduckgo_search(query, limit)
    if duckduckgo_response.get("results"):
        return duckduckgo_response

    bing_response = _fetch_bing_search(query, limit)
    if bing_response.get("results"):
        return bing_response

    if duckduckgo_response.get("status") == "unavailable":
        return duckduckgo_response

    if bing_response.get("status") == "unavailable":
        return bing_response

    return {
        "status": "no_results",
        "source": "DuckDuckGo + Bing public HTML",
        "message": "Public web search executed, but no verified direct public page was captured.",
        "results": [],
    }


def _fetch_duckduckgo_search(query: str, limit: int = 3) -> dict[str, Any]:
    search_url = f"https://duckduckgo.com/lite/?q={quote_plus(query)}"
    request = urllib.request.Request(
        search_url,
        headers={
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
            )
        },
    )

    try:
        with urllib.request.urlopen(request, timeout=5) as response:
            page = response.read().decode("utf-8", errors="ignore")
    except (urllib.error.URLError, TimeoutError, OSError) as exc:
        return {
            "status": "unavailable",
            "source": "DuckDuckGo public HTML",
            "message": f"External search could not be reached from the local API: {exc}",
            "results": [],
        }

    results = []
    anchor_matches = list(re.finditer(r'<a\b[^>]*>.*?</a>', page, flags=re.IGNORECASE | re.DOTALL))

    for match in anchor_matches:
        anchor = match.group(0)
        opening_tag = anchor.split(">", 1)[0]
        if "result-link" not in opening_tag.lower():
            continue

        url_match = re.search(r'href=[\'\"]([^\'\"]+)[\'\"]', opening_tag, flags=re.IGNORECASE)
        if not url_match:
            continue

        title = anchor.split(">", 1)[1].rsplit("</a>", 1)[0]
        block = page[match.end() : match.end() + 1800]
        snippet_match = re.search(r'<td[^>]*class=[\'\"]result-snippet[\'\"][^>]*>(.*?)</td>', block, flags=re.IGNORECASE | re.DOTALL)
        snippet = snippet_match.group(1) if snippet_match else ""
        clean_title = re.sub(r"<[^>]+>", "", html.unescape(title)).strip()
        clean_snippet = re.sub(r"<[^>]+>", "", html.unescape(snippet)).strip()
        clean_url = _clean_search_url(html.unescape(url_match.group(1)))
        if clean_title and clean_url:
            domain = urlparse(clean_url).netloc.replace("www.", "")
            results.append(
                {
                    "title": clean_title,
                    "url": clean_url,
                    "snippet": clean_snippet or "Public result found for this research query.",
                    "domain": domain,
                }
            )
        if len(results) >= limit:
            break

    return {
        "status": "completed" if results else "no_results",
        "source": "DuckDuckGo public HTML",
        "message": (
            "Public web search executed by the local Track B bridge."
            if results
            else "Public search executed, but no public result matched this query."
        ),
        "results": results,
    }


def _fetch_bing_search(query: str, limit: int = 3) -> dict[str, Any]:
    rss_response = _fetch_bing_rss_search(query, limit)
    if rss_response.get("results"):
        return rss_response

    search_url = f"https://www.bing.com/search?q={quote_plus(query)}"
    request = urllib.request.Request(
        search_url,
        headers={
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
            )
        },
    )

    try:
        with urllib.request.urlopen(request, timeout=5) as response:
            page = response.read().decode("utf-8", errors="ignore")
    except (urllib.error.URLError, TimeoutError, OSError):
        return {
            "status": "no_results",
            "source": "Bing public HTML",
            "message": "Bing fallback search did not return reachable results.",
            "results": [],
        }

    results = []
    matches = re.finditer(
        r'<li\s+class="b_algo".*?<h2[^>]*>\s*<a[^>]+href="([^"]+)"[^>]*>(.*?)</a>.*?</h2>(.*?)</li>',
        page,
        flags=re.IGNORECASE | re.DOTALL,
    )
    for match in matches:
        raw_url, raw_title, block = match.groups()
        clean_url = html.unescape(raw_url).strip()
        clean_title = re.sub(r"<[^>]+>", "", html.unescape(raw_title)).strip()
        snippet_match = re.search(r"<p[^>]*>(.*?)</p>", block, flags=re.IGNORECASE | re.DOTALL)
        clean_snippet = (
            re.sub(r"<[^>]+>", "", html.unescape(snippet_match.group(1))).strip()
            if snippet_match
            else "Public result found for this research query."
        )
        domain = urlparse(clean_url).netloc.replace("www.", "")
        if clean_url.startswith("http") and clean_title and domain and "bing.com" not in domain:
            results.append(
                {
                    "title": clean_title,
                    "url": clean_url,
                    "snippet": clean_snippet,
                    "domain": domain,
                }
            )
        if len(results) >= limit:
            break

    return {
        "status": "completed" if results else "no_results",
        "source": "Bing public HTML",
        "message": (
            "Bing fallback search returned direct public links."
            if results
            else "Bing fallback search found no direct public links."
        ),
        "results": results,
    }


def _fetch_bing_rss_search(query: str, limit: int = 3) -> dict[str, Any]:
    search_url = f"https://www.bing.com/search?format=rss&mkt=en-US&setlang=en-US&q={quote_plus(query)}"
    request = urllib.request.Request(
        search_url,
        headers={
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
            )
        },
    )

    try:
        with urllib.request.urlopen(request, timeout=5) as response:
            page = response.read().decode("utf-8", errors="ignore")
    except (urllib.error.URLError, TimeoutError, OSError):
        return {
            "status": "unavailable",
            "source": "Bing public RSS",
            "message": "Bing RSS fallback could not be reached from the local API.",
            "results": [],
        }

    results = []
    try:
        root = ET.fromstring(page)
    except ET.ParseError:
        return {
            "status": "no_results",
            "source": "Bing public RSS",
            "message": "Bing RSS fallback did not return readable public results.",
            "results": [],
        }

    for item in root.findall(".//item"):
        clean_title = "".join(item.findtext("title", "")).strip()
        clean_url = _clean_search_url(item.findtext("link", "").strip())
        clean_snippet = html.unescape(item.findtext("description", "")).strip()
        domain = urlparse(clean_url).netloc.replace("www.", "")
        if clean_url.startswith("http") and clean_title and domain and "bing.com" not in domain:
            results.append(
                {
                    "title": clean_title,
                    "url": clean_url,
                    "snippet": clean_snippet or "Public result found for this research query.",
                    "domain": domain,
                }
            )
        if len(results) >= limit:
            break

    return {
        "status": "completed" if results else "no_results",
        "source": "Bing public RSS",
        "message": (
            "Bing RSS fallback returned direct public links."
            if results
            else "Bing RSS fallback found no direct public links."
        ),
        "results": results,
    }


def _build_external_research(payload: dict[str, Any], result: dict[str, Any] | None = None) -> dict[str, Any]:
    profile = payload.get("startup_profile", {})
    label_input = payload.get("label_input") or {}
    final_output = (result or {}).get("final_output", {})
    startup_name = str(profile.get("startup_name") or "startup").strip()
    sector = str(profile.get("sector") or "").strip()
    activity = str(profile.get("activity_description") or "").strip()
    founders = profile.get("associates") or []
    founder_names = [str(item.get("name", "")).strip() for item in founders if isinstance(item, dict) and item.get("name")]

    core_terms = " ".join([startup_name, sector, "Tunisia startup"]).strip()
    founder_terms = " OR ".join(founder_names) if founder_names else startup_name

    searches = [
        {
            "platform": "Google",
            "purpose": "Company, market, regulatory and public credibility check",
            "query": _build_search_query(startup_name, "Tunisia", "startup"),
            "fallback_queries": [
                _build_search_query(startup_name, "Tunisia"),
                _build_search_query(startup_name, "startup", "Tunisia"),
                _build_search_query(startup_name, sector) if sector else _build_search_query(startup_name, "company"),
                _build_search_query(startup_name, sector, "Tunisia") if sector else _build_search_query(startup_name, "Tunisia", "company"),
            ],
            "url": None,
            "signals_to_check": [
                "Official website or product page",
                "Press, accelerator, investor, or partner mentions",
                "Regulatory or public registry mentions",
                "Conflicting names, inactive pages, or reputation risks",
            ],
        },
        {
            "platform": "LinkedIn",
            "purpose": "Founder and company professional presence check",
            "query": f"{startup_name} LinkedIn",
            "fallback_queries": [
                _build_search_query(startup_name, "startup"),
                f'site:linkedin.com "{startup_name}"',
                f'site:linkedin.com {startup_name}',
                f'site:linkedin.com/company "{startup_name}"' if not founder_names else f'site:linkedin.com/in {founder_terms}',
            ],
            "url": None,
            "signals_to_check": [
                "Founder profiles match the declared team",
                "Company page exists and matches sector/activity",
                "Roles and experience support the legal dossier",
                "Team claims are consistent with pitch and documents",
            ],
        },
        {
            "platform": "Facebook",
            "purpose": "Public social proof and activity check",
            "query": f"{startup_name} Facebook Tunisia",
            "fallback_queries": [
                _build_search_query(startup_name, "page"),
                _build_search_query(startup_name, "social media"),
                f'site:facebook.com "{startup_name}"',
                f"site:facebook.com {startup_name} Tunisia",
            ],
            "url": None,
            "signals_to_check": [
                "Active public page or founder/community presence",
                "Recent posts, launch activity, or customer signals",
                "Contact details consistent with the legal dossier",
                "Negative comments, abandoned pages, or impersonation risks",
            ],
        },
        {
            "platform": "Events",
            "purpose": "Relevant startup, sector, accelerator, and investor events",
            "query": _build_search_query(sector or activity or startup_name, "Tunisia", "startup events"),
            "fallback_queries": [
                _build_search_query("Tunisia startup events", "accelerator"),
                _build_search_query(sector, "Tunisia events") if sector else _build_search_query("startup events", "Tunisia"),
                _build_search_query("Open Startup Tunisia events"),
                _build_search_query("startup ecosystem Tunisia events investors"),
            ],
            "url": None,
            "strict_identity": False,
            "signals_to_check": [
                "Upcoming founder, accelerator, pitch, or investor events",
                "Sector relevance to the startup activity",
                "Application deadlines, eligibility, and location",
                "Mentor, partner, or investor access",
            ],
        },
        {
            "platform": "Investors",
            "purpose": "Relevant Tunisian startup investors, accelerators, incubators and funding programs",
            "query": _build_investor_queries(sector, activity)[0],
            "fallback_queries": _build_investor_queries(sector, activity)[1:],
            "url": None,
            "strict_identity": False,
            "signals_to_check": [
                "Investor, accelerator, incubator, or funding program relevance",
                "Tunisia or MENA startup funding focus",
                "Application, contact, portfolio, or investment thesis evidence",
                "Avoid dictionary, generic meaning, and unrelated informational pages",
            ],
        },
    ]

    with ThreadPoolExecutor(max_workers=min(5, len(searches))) as executor:
        search_results = list(
            executor.map(
                lambda item: _fetch_public_search_results(
                    str(item["query"]),
                    fallback_queries=item.get("fallback_queries"),
                    strict_identity=bool(item.get("strict_identity", True)),
                ),
                searches,
            )
        )

    for search, search_result in zip(searches, search_results):
        search["agent_search"] = search_result

    recommendations = [
        "Review the returned results and keep only public evidence that matches the startup identity.",
        "Save screenshots or URLs for strong evidence such as company page, founder profiles, press, accelerator mentions, or events.",
        "Use event links to plan founder networking, mentor access, and investor follow-up.",
        "Treat missing LinkedIn/Facebook/events presence as a warning, not an automatic blocker.",
    ]

    if final_output.get("final_decision") == "FAIL":
        recommendations.insert(0, "Fix blocking document issues first, then use public research to strengthen the dossier.")

    return {
        "startup_name": startup_name,
        "sector": sector,
        "activity_description": activity,
        "traction_signals": _as_text_list(label_input.get("traction_signals")),
        "team_signals": _as_text_list(label_input.get("team_signals")),
        "searches": searches,
        "recommendations": recommendations,
        "automation_note": "The local API executes public search queries and displays the results it can retrieve.",
    }


def _resolve_document_paths(payload: dict[str, Any]) -> dict[str, Any]:
    normalized = deepcopy(payload)
    for document in normalized.get("documents", []):
        path_value = document.get("path")
        if not path_value:
            continue
        path = Path(path_value)
        if not path.is_absolute():
            document["path"] = str(PROJECT_ROOT / path)
    return normalized


def _json_safe(value: Any, seen: set[int] | None = None) -> Any:
    if seen is None:
        seen = set()

    if value is None or isinstance(value, (str, int, float, bool)):
        return value

    if isinstance(value, Path):
        return str(value)

    if isinstance(value, BaseModel):
        value = value.model_dump()

    if isinstance(value, dict):
        value_id = id(value)
        if value_id in seen:
            return "[circular-reference]"
        seen.add(value_id)
        cleaned = {str(key): _json_safe(item, seen) for key, item in value.items()}
        seen.remove(value_id)
        return cleaned

    if isinstance(value, (list, tuple, set)):
        value_id = id(value)
        if value_id in seen:
            return ["[circular-reference]"]
        seen.add(value_id)
        cleaned = [_json_safe(item, seen) for item in value]
        seen.remove(value_id)
        return cleaned

    return str(value)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "app": "track-b-legal-bridge"}


@app.get("/track2/sample")
def sample() -> dict[str, Any]:
    return _resolve_document_paths(SAMPLE_REQUEST)


@app.post("/track2/upload")
async def upload_documents(files: list[UploadFile] = File(...)) -> dict[str, Any]:
    UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
    uploaded: list[dict[str, str | None]] = []

    for file in files:
        safe_name = Path(file.filename or "document").name.replace("|", "_")
        target = UPLOADS_DIR / safe_name
        suffix = target.suffix
        stem = target.stem
        counter = 1
        while target.exists():
            target = UPLOADS_DIR / f"{stem}_{counter}{suffix}"
            counter += 1

        target.write_bytes(await file.read())
        uploaded.append(
            {
                "path": str(target),
                "declared_type": None,
                "file_name": safe_name,
            }
        )

    return {"documents": uploaded}


@app.post("/track2/run")
def run_track_b(payload: dict[str, Any]) -> JSONResponse:
    global latest_result
    normalized_payload = _resolve_document_paths(payload)
    request = TrackBRequest.model_validate(normalized_payload)
    latest_result = orchestrator.run(request)
    result = latest_result.model_dump()
    external_research = _build_external_research(normalized_payload, result)
    result["external_research"] = external_research
    return JSONResponse(content=_json_safe(result))


@app.get("/track2/llm/health")
def llm_health() -> JSONResponse:
    llm = get_local_llm_client()
    payload = {
        "base_url": llm.base_url,
        "model": llm.model,
        "api_key_set": bool(os.getenv("LLM_API_KEY") or os.getenv("OPENAI_API_KEY")),
        "provider_mode": "openai-compatible" if os.getenv("LLM_API_KEY") or "tokenfactory" in llm.base_url else "ollama",
    }
    try:
        text = llm.complete(
            prompt='Return exactly this JSON: {"ok": true, "source": "llm"}',
            system="Return strict JSON only.",
        )
        payload["ok"] = True
        payload["sample"] = text[:300]
    except Exception as exc:
        payload["ok"] = False
        payload["error"] = f"{type(exc).__name__}: {exc}"
    return JSONResponse(content=_json_safe(payload))


@app.post("/track2/chat")
def chat(payload: ChatRequest) -> dict[str, Any]:
    return chatbot.answer(payload.question, latest_result).model_dump()


@app.post("/track2/research")
def external_research(payload: dict[str, Any]) -> JSONResponse:
    return JSONResponse(content=_json_safe(_build_external_research(_resolve_document_paths(payload))))
