from langchain_ollama import ChatOllama
from langchain.agents import create_agent
from langgraph.checkpoint.memory import InMemorySaver
from tools import search_similar_companies, search_web_results
from tools1 import search_company

from shared.config import MODEL_NAME, OLLAMA_API_BASE
import json
from pathlib import Path

llm = ChatOllama(
    model=MODEL_NAME,
    base_url=OLLAMA_API_BASE,
    temperature=0.2,
)
BASE_DIR = Path(__file__).resolve().parent
OUTPUT_DIR = BASE_DIR / "outputs"
OUTPUT_DIR.mkdir(exist_ok=True)
USER_INPUT_PATH = BASE_DIR / "user_input.json"


def load_startup_idea() -> str:
    with open(USER_INPUT_PATH, "r", encoding="utf-8") as f:
        raw = json.load(f)

    return raw.get("startup_idea") or raw.get("idea_description", "")


def save_text_output(filename: str, text: str) -> None:
    (OUTPUT_DIR / filename).write_text(str(text).strip(), encoding="utf-8")

FAKE_COMPANIES = {
    "LeadPilot AI": {
        "industry": "B2B SaaS",
        "field": "AI sales prospecting",
        "description": "Uses AI to identify high-intent leads for outbound sales teams.",
        "target_customers": "SMBs and mid-market SaaS companies",
        "core_features": [
            "lead scoring",
            "buyer intent signals",
            "CRM sync",
            "automated prospect lists"
        ],
        "business_model": "Subscription",
        "hq": "San Francisco, USA"
    },
    "ProspectForge": {
        "industry": "B2B SaaS",
        "field": "AI sales prospecting",
        "description": "Helps revenue teams generate prospect lists and enrich contact data automatically.",
        "target_customers": "Sales teams and agencies",
        "core_features": [
            "contact enrichment",
            "company filtering",
            "lead discovery",
            "email finder"
        ],
        "business_model": "Subscription",
        "hq": "London, UK"
    },
    "SignalBloom": {
        "industry": "B2B SaaS",
        "field": "AI sales prospecting",
        "description": "Tracks market signals and company activity to surface warm outbound opportunities.",
        "target_customers": "Growth teams and SDR teams",
        "core_features": [
            "intent monitoring",
            "funding/news triggers",
            "account alerts",
            "sales workflow integration"
        ],
        "business_model": "Subscription",
        "hq": "Berlin, Germany"
    },
    "OutboundIQ": {
        "industry": "B2B SaaS",
        "field": "AI sales prospecting",
        "description": "Finds lookalike companies and recommends high-fit accounts for outbound campaigns.",
        "target_customers": "Mid-market B2B companies",
        "core_features": [
            "ICP matching",
            "lookalike account search",
            "pipeline recommendations",
            "lead prioritization"
        ],
        "business_model": "Subscription",
        "hq": "Toronto, Canada"
    },
    "PipelineRadar": {
        "industry": "B2B SaaS",
        "field": "AI sales prospecting",
        "description": "Monitors firmographic and behavioral data to identify sales-ready companies.",
        "target_customers": "Enterprise sales organizations",
        "core_features": [
            "firmographic analysis",
            "engagement tracking",
            "account scoring",
            "team dashboards"
        ],
        "business_model": "Subscription",
        "hq": "New York, USA"
    },
    "IntentLoop": {
        "industry": "B2B SaaS",
        "field": "AI sales prospecting",
        "description": "Aggregates buying intent data from multiple channels to help teams find active buyers.",
        "target_customers": "Revenue operations and outbound teams",
        "core_features": [
            "multi-source intent data",
            "lead ranking",
            "alerts",
            "export to CRM"
        ],
        "business_model": "Subscription",
        "hq": "Amsterdam, Netherlands"
    }
}


system_prompt = """
You are a startup idea checker with access to these tools:
- search_similar_companies(startup_description)
- search_web_results(startup_description)
- search_company(company_name)

Your job is to decide whether the startup idea already exists, partially exists, or appears original.

Behavior rules:
- Work in phases.
- In each phase, output only the tool calls needed for that phase.
- Do not write the final answer until all required tools have been used.

Required phases:
Phase 1:
- Call search_similar_companies once with the full startup idea description.
- Call search_web_results twice with two variations of the full startup idea description.

Phase 2:
- Collect every unique company name returned by Phase 1.
- For every collected company name from both calls, call search_company.
- If even one collected company has not been checked with search_company yet, do not write any conclusion.

Phase 3:
- After all search_company calls are finished, write the final answer.

Hard constraints:
- search_company is mandatory for every company found in Phase 1.
- search_similar_companies and search_web_results are only for finding names, not for company facts.
- Only search_company results may be used to describe companies.
- If a company was found but not checked with search_company, you are forbidden from giving a final answer.
- If there are unchecked companies, your next response must contain only search_company tool calls.
- Never skip Phase 2.

Final answer format:
- First line must be exactly one of:
  - already exists
  - partially exists
  - appears original
- Then list only relevant companies, one short line each, mentionning what they have similar with the startup idea.
- Mention if the startup idea might offer something different from them, like maybe for example the location, if they truly offer something new and different.
- If none are relevant, write: no clearly similar existing solution was found
- End with your short personal opinion on whether the idea is innovative or not for a startup.

Keep the final answer short, factual, and clear.
"""

memory = InMemorySaver()

agent = create_agent(
    model=llm,
    tools=[search_similar_companies, search_web_results, search_company],
    checkpointer=memory,
    system_prompt=system_prompt,
)

if __name__ == "__main__":
    startup_idea = load_startup_idea()

    llm_call_count = 0
    tool_call_count = 0
    final_output = None

    for chunk in agent.stream(
        {
            "messages": [
                {
                    "role": "user",
                    "content": startup_idea
                }
            ]
        },
        config={
            "configurable": {
                "thread_id": "startup-check-1"
            }
        },
        stream_mode="updates",
    ):
        for step_name, step_data in chunk.items():
            message = step_data["messages"][-1]

            if step_name == "model":
                llm_call_count += 1
                print(f"\n=== LLM CALL #{llm_call_count} ===")

                content_blocks = getattr(message, "content_blocks", None)
                if content_blocks:
                    print(content_blocks)
                    for block in content_blocks:
                        if block.get("type") == "text":
                            final_output = block.get("text")
                else:
                    print(message.content)
                    final_output = message.content

            elif step_name == "tools":
                tool_call_count += 1
                print(f"\n=== TOOL CALL #{tool_call_count} ===")

                tool_name = getattr(message, "name", "unknown_tool")
                print(f"Tool: {tool_name}")
                print(f"Output: {message.content}")

    final_output = str(final_output or "").strip()
    save_text_output("exist_sol_output.txt", final_output)