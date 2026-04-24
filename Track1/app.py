import json
import re
import subprocess
import sys
from pathlib import Path

import streamlit as st


BASE_DIR = Path(__file__).resolve().parent
REPORT_PATH = BASE_DIR / "outputs" / "final_master_report.json"
USER_INPUT_PATH = BASE_DIR / "user_input.json"
PIPELINE_PATH = BASE_DIR / "run_pipeline.py"

INDUSTRY_OPTIONS = [
    "technology",
    "education",
    "health",
    "finance",
    "commerce",
    "logistics / transport / mobility",
    "real estate / housing",
    "food / beverage",
    "beauty / wellness / fitness",
    "media / communications",
    "professional services",
    "manufacturing / industrial",
    "agriculture",
    "construction / home services",
    "energy / environment",
    "travel / hospitality",
    "telecom / connectivity",
    "public sector / nonprofit",
    "other",
    "unknown",
]

PRODUCT_TYPE_OPTIONS = [
    "marketplace",
    "booking / appointments",
    "software tool / SaaS",
    "API / developer platform",
    "data / analytics product",
    "workflow automation / internal tool",
    "B2C app",
    "community / social platform",
    "subscription / membership",
    "media / audience business",
    "content / digital product",
    "training / academy / coaching",
    "ecommerce / retail",
    "directory / lead generation",
    "local service business",
    "on-demand service",
    "agency / done-for-you service",
    "productized service",
    "consulting / expert service",
    "managed operations provider",
    "broker / intermediary",
    "reseller / distributor",
    "wholesale business",
    "import / export business",
    "manufacturer / producer",
    "hardware-enabled product / IoT",
    "logistics / delivery operator",
    "rental / asset access business",
    "repair / maintenance business",
    "franchise / branch model",
    "events / experiences business",
]

TARGET_CUSTOMER_TYPES = [
    "B2B",
    "B2C",
    "B2B2C",
    "Marketplace (business + customer sides)",
    "Public sector / nonprofit",
    "Mixed / other",
]


st.set_page_config(
    page_title="Startup Review Dashboard",
    page_icon="🚀",
    layout="wide",
    initial_sidebar_state="expanded",
)


if "analysis_complete" not in st.session_state:
    st.session_state.analysis_complete = False
if "team_count" not in st.session_state:
    st.session_state.team_count = 1


st.markdown(
    """
    <style>
    .stApp {
        background:
            radial-gradient(circle at top left, rgba(59,130,246,0.13), transparent 30%),
            radial-gradient(circle at top right, rgba(16,185,129,0.10), transparent 28%),
            linear-gradient(180deg, #0b1220 0%, #0f172a 100%);
        color: #e5e7eb;
    }

    .block-container {
        padding-top: 1.3rem;
        padding-bottom: 2rem;
        max-width: 1400px;
    }

    h1, h2, h3 {
        color: #f8fafc !important;
        letter-spacing: -0.02em;
    }

    .hero {
        padding: 24px 26px;
        border-radius: 24px;
        background: linear-gradient(135deg, rgba(30,41,59,0.95), rgba(15,23,42,0.88));
        border: 1px solid rgba(148,163,184,0.18);
        box-shadow: 0 18px 40px rgba(0,0,0,0.28);
        margin-bottom: 18px;
        animation: fadeUp 0.55s ease;
    }

    .form-card {
        padding: 18px 18px 10px 18px;
        border-radius: 22px;
        background: rgba(15,23,42,0.78);
        border: 1px solid rgba(148,163,184,0.16);
        box-shadow: 0 14px 28px rgba(0,0,0,0.18);
        margin-bottom: 14px;
        animation: fadeUp 0.55s ease;
    }

    .card {
        padding: 18px 18px 16px 18px;
        border-radius: 20px;
        background: rgba(15,23,42,0.82);
        border: 1px solid rgba(148,163,184,0.16);
        box-shadow: 0 14px 28px rgba(0,0,0,0.18);
        margin-bottom: 14px;
        animation: fadeUp 0.55s ease;
        transition: transform 0.18s ease, box-shadow 0.18s ease;
    }

    .card:hover {
        transform: translateY(-2px);
        box-shadow: 0 18px 34px rgba(0,0,0,0.22);
    }

    .metric-card {
        padding: 18px 18px;
        border-radius: 20px;
        border: 1px solid rgba(255,255,255,0.10);
        box-shadow: 0 14px 26px rgba(0,0,0,0.18);
        animation: fadeUp 0.55s ease;
        min-height: 120px;
    }

    .metric-label {
        font-size: 0.92rem;
        opacity: 0.82;
        margin-bottom: 8px;
    }

    .metric-value {
        font-size: 2rem;
        font-weight: 800;
        line-height: 1.05;
        color: #ffffff;
    }

    .metric-sub {
        margin-top: 8px;
        font-size: 0.88rem;
        opacity: 0.76;
    }

    .section-title {
        font-size: 1.15rem;
        font-weight: 700;
        margin-bottom: 8px;
        color: #f8fafc;
    }

    .muted {
        color: #cbd5e1;
        opacity: 0.92;
    }

    .subtle {
        color: #94a3b8;
        font-size: 0.92rem;
    }

    .pill {
        display: inline-block;
        padding: 6px 12px;
        border-radius: 999px;
        font-size: 0.82rem;
        font-weight: 700;
        margin-right: 8px;
        margin-bottom: 8px;
        border: 1px solid rgba(255,255,255,0.12);
    }

    .hint-box {
        padding: 14px 16px;
        border-radius: 16px;
        background: rgba(56,189,248,0.10);
        border: 1px solid rgba(56,189,248,0.25);
        margin-bottom: 12px;
    }

    .warning-box {
        padding: 14px 16px;
        border-radius: 16px;
        background: rgba(245,158,11,0.12);
        border: 1px solid rgba(245,158,11,0.35);
        margin-bottom: 10px;
        animation: fadeUp 0.55s ease;
    }

    .danger-box {
        padding: 14px 16px;
        border-radius: 16px;
        background: rgba(239,68,68,0.12);
        border: 1px solid rgba(239,68,68,0.35);
        margin-bottom: 10px;
        animation: fadeUp 0.55s ease;
    }

    .success-box {
        padding: 14px 16px;
        border-radius: 16px;
        background: rgba(34,197,94,0.12);
        border: 1px solid rgba(34,197,94,0.35);
        margin-bottom: 10px;
        animation: fadeUp 0.55s ease;
    }

    .timeline-step {
        position: relative;
        padding: 14px 16px 14px 22px;
        border-radius: 16px;
        background: rgba(15,23,42,0.78);
        border: 1px solid rgba(148,163,184,0.14);
        margin-bottom: 12px;
        animation: fadeUp 0.55s ease;
    }

    .timeline-step::before {
        content: "";
        position: absolute;
        left: 10px;
        top: 0;
        bottom: -12px;
        width: 2px;
        background: linear-gradient(180deg, #38bdf8, #22c55e);
    }

    .timeline-step:last-child::before {
        bottom: 50%;
    }

    .timeline-index {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        font-weight: 800;
        font-size: 0.85rem;
        background: linear-gradient(135deg, #38bdf8, #22c55e);
        color: #0f172a;
        margin-right: 10px;
    }

    .range-wrap {
        margin: 10px 0 18px 0;
    }

    .range-track {
        position: relative;
        height: 14px;
        border-radius: 999px;
        background: rgba(148,163,184,0.20);
        overflow: hidden;
    }

    .range-bar {
        position: absolute;
        top: 0;
        height: 14px;
        border-radius: 999px;
    }

    .footnote {
        font-size: 0.87rem;
        color: #cbd5e1;
        padding-left: 8px;
        border-left: 3px solid rgba(148,163,184,0.35);
        margin-bottom: 10px;
    }

    .big-number {
        font-size: 2.5rem;
        font-weight: 900;
        line-height: 1;
        color: #ffffff;
    }

    .small-label {
        font-size: 0.88rem;
        opacity: 0.75;
        margin-bottom: 6px;
    }

    div[data-testid="stForm"] {
        border: 0 !important;
        background: transparent !important;
        padding: 0 !important;
    }

    div[data-testid="stTextArea"],
    div[data-testid="stTextInput"],
    div[data-testid="stNumberInput"],
    div[data-testid="stSelectbox"] {
        animation: fadeUp 0.4s ease;
    }

    @keyframes fadeUp {
        from {
            opacity: 0;
            transform: translateY(8px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .stTabs [data-baseweb="tab-list"] {
        gap: 10px;
    }

    .stTabs [data-baseweb="tab"] {
        background: rgba(15,23,42,0.75);
        border-radius: 999px;
        padding: 8px 16px;
        border: 1px solid rgba(148,163,184,0.16);
    }
    </style>
    """,
    unsafe_allow_html=True,
)


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def save_json(path: Path, data: dict) -> None:
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


@st.cache_data(show_spinner=False)
def load_report() -> dict | None:
    if not REPORT_PATH.exists():
        return None
    try:
        return read_json(REPORT_PATH)
    except Exception:
        return None


def run_pipeline() -> None:
    subprocess.run([sys.executable, str(PIPELINE_PATH)], check=True, cwd=BASE_DIR)


def empty_user_input() -> dict:
    return {
        "startup_idea": "",
        "idea_description": "",
        "problem": "",
        "target_customer": {
            "type": "B2B",
            "location": "",
            "notes": "",
        },
        "industry": "unknown",
        "product_type": "software tool / SaaS",
        "how_it_works_one_sentence": "",
        "business_model": {
            "revenue_model": "",
            "who_pays": "",
            "when_paid": "",
        },
        "team": {
            "members": [
                {"role": "", "skills": ""}
            ]
        },
        "finance_assumptions": {
            "price_per_sale": "",
            "sales_target_per_month": 0,
            "gain_on_sale_pct": 0,
            "months": "",
            "initial_budget_tnd": 0,
        },
    }


def normalize_text(v):
    if v is None:
        return "N/A"
    return str(v)


def is_missing(v):
    if v is None:
        return True
    s = str(v).strip().lower()
    return s in {"missing_info", "missing", "n/a", "none", ""}


def tone_color(name: str):
    name = str(name).lower()
    mapping = {
        "green": "#22c55e",
        "red": "#ef4444",
        "amber": "#f59e0b",
        "blue": "#38bdf8",
        "purple": "#8b5cf6",
        "cyan": "#06b6d4",
        "slate": "#94a3b8",
    }
    return mapping.get(name, "#38bdf8")


def status_tone(value: str):
    v = str(value).strip().lower()
    if v in {"yes", "high", "appears original"}:
        return "green"
    if v in {"uncertain", "medium", "partially exists"}:
        return "amber"
    if v in {"no", "low", "already exists"}:
        return "red"
    return "blue"


def metric_card(label: str, value, sub=None, tone="blue"):
    color = tone_color(tone)
    st.markdown(
        f"""
        <div class="metric-card" style="background: linear-gradient(135deg, {color}26, rgba(15,23,42,0.92));">
            <div class="metric-label">{label}</div>
            <div class="metric-value">{value}</div>
            <div class="metric-sub">{sub or ""}</div>
        </div>
        """,
        unsafe_allow_html=True,
    )


def section_card(title: str, body: str):
    st.markdown(
        f"""
        <div class="card">
            <div class="section-title">{title}</div>
            <div class="muted">{body}</div>
        </div>
        """,
        unsafe_allow_html=True,
    )


def list_cards(items, tone="blue"):
    if not items:
        st.info("No data.")
        return
    color = tone_color(tone)
    for item in items:
        if is_missing(item):
            st.markdown(
                f"""<div class="danger-box"><b>Missing:</b> {item}</div>""",
                unsafe_allow_html=True,
            )
        else:
            st.markdown(
                f"""
                <div class="card" style="border-left: 4px solid {color};">
                    <div class="muted">{item}</div>
                </div>
                """,
                unsafe_allow_html=True,
            )


def parse_range(value):
    if value is None:
        return None
    text = str(value)
    nums = re.findall(r"\d+(?:\.\d+)?", text)
    if len(nums) >= 2:
        return float(nums[0]), float(nums[1])
    if len(nums) == 1:
        x = float(nums[0])
        return x, x
    return None


def range_bar(title: str, range_text: str, global_max: float, color="blue"):
    parsed = parse_range(range_text)
    if not parsed:
        st.markdown(
            f"""<div class="danger-box"><b>{title}:</b> {range_text}</div>""",
            unsafe_allow_html=True,
        )
        return

    min_v, max_v = parsed
    if global_max <= 0:
        global_max = max_v

    left = (min_v / global_max) * 100
    width = max(((max_v - min_v) / global_max) * 100, 2)
    fill = tone_color(color)

    st.markdown(
        f"""
        <div class="range-wrap">
            <div class="small-label"><b>{title}</b> — {range_text}</div>
            <div class="range-track">
                <div class="range-bar" style="left:{left:.2f}%; width:{width:.2f}%; background:{fill};"></div>
            </div>
        </div>
        """,
        unsafe_allow_html=True,
    )


def salary_global_max(items):
    vals = []
    for item in items:
        r = parse_range(item.get("salary_or_range"))
        if r:
            vals.append(r[1])
    return max(vals) if vals else 1


def necessity_rank(v):
    order = {"critical": 0, "important": 1, "useful": 2, "uncertain": 3}
    return order.get(str(v).lower(), 99)


def matched_ops_roles(operations, finance):
    ops_roles = operations.get("minimum_roles_responsibilities", [])
    finance_roles = finance.get("employees_and_wages", [])

    finance_lookup = {
        str(x.get("role", "")).strip().lower(): x for x in finance_roles
    }

    merged = []
    for item in ops_roles:
        role = str(item.get("role", "")).strip()
        desc = item.get("responsibility_or_description", "")
        linked = finance_lookup.get(role.lower(), {})
        merged.append(
            {
                "role": role,
                "responsibility_or_description": desc,
                "necessity_level": linked.get("necessity_level", "uncertain"),
            }
        )

    return sorted(merged, key=lambda x: necessity_rank(x.get("necessity_level", "")))


def render_role_chain(operations, finance):
    roles = matched_ops_roles(operations, finance)
    if not roles:
        st.info("No role data.")
        return

    cols = st.columns(len(roles))
    tones = {
        "critical": "red",
        "important": "amber",
        "useful": "blue",
        "uncertain": "slate",
    }

    for idx, role in enumerate(roles):
        tone = tones.get(str(role.get("necessity_level", "")).lower(), "slate")
        with cols[idx]:
            st.markdown(
                f"""
                <div class="card" style="height: 220px; border-top: 4px solid {tone_color(tone)};">
                    <div class="section-title">{role.get("role", "Unknown")}</div>
                    <div style="margin-bottom: 10px;">
                        <span class="pill" style="background:{tone_color(tone)}20; color:{tone_color(tone)}; border-color:{tone_color(tone)}55;">
                            {role.get("necessity_level", "uncertain").title()}
                        </span>
                    </div>
                    <div class="muted">{role.get("responsibility_or_description", "")}</div>
                </div>
                """,
                unsafe_allow_html=True,
            )


def render_solution_cards(market):
    solutions = market.get("relevant_existing_solutions", [])
    if not solutions:
        st.info("No relevant existing solutions listed.")
        return

    for item in solutions:
        confidence = normalize_text(item.get("relevance_confidence", "Medium"))
        tone = "amber" if confidence.lower() == "medium" else "green"
        st.markdown(
            f"""
            <div class="card" style="border-left: 4px solid {tone_color(tone)};">
                <div class="section-title">{item.get("company_name", "Unknown")}</div>
                <div class="muted"><b>What it does:</b> {item.get("what_it_does", "N/A")}</div>
                <div class="muted" style="margin-top:8px;"><b>Similarity:</b> {item.get("similarity_to_startup", "N/A")}</div>
                <div class="muted" style="margin-top:8px;"><b>Relevance confidence:</b> {confidence}</div>
            </div>
            """,
            unsafe_allow_html=True,
        )


def render_journey_timeline(mvp):
    steps = mvp.get("user_journey", [])
    if not steps:
        st.info("No user journey data.")
        return

    for i, step in enumerate(steps, start=1):
        st.markdown(
            f"""
            <div class="timeline-step">
                <span class="timeline-index">{i}</span>
                <span class="muted">{step}</span>
            </div>
            """,
            unsafe_allow_html=True,
        )


def render_cost_object(title: str, data):
    st.subheader(title)
    if not data:
        st.info("No data.")
        return

    if not isinstance(data, dict):
        if is_missing(data):
            st.markdown(
                f"""<div class="danger-box"><b>{title}:</b> missing</div>""",
                unsafe_allow_html=True,
            )
        else:
            st.markdown(
                f"""<div class="card"><b>{title}:</b> <span class="muted">{data}</span></div>""",
                unsafe_allow_html=True,
            )
        return

    for k, v in data.items():
        label = k.replace("_", " ").title()
        if is_missing(v):
            st.markdown(
                f"""<div class="danger-box"><b>{label}:</b> missing</div>""",
                unsafe_allow_html=True,
            )
        else:
            st.markdown(
                f"""<div class="card"><b>{label}:</b> <span class="muted">{v}</span></div>""",
                unsafe_allow_html=True,
            )


def render_dashboard(report: dict):
    startup_summary = report.get("startup_summary", {})
    market = report.get("market_existence", {})
    mvp = report.get("mvp", {})
    operations = report.get("operations", {})
    finance = report.get("finance", {})
    legal = report.get("legal_and_compliance", {})
    uncertainty_flags = report.get("uncertainty_flags", [])
    final_verdict = report.get("final_verdict", {})

    with st.sidebar:
        st.title("🚀 Startup Review")
        page = st.radio(
            "Navigate",
            [
                "Overview",
                "Market & Innovation",
                "MVP",
                "Operations",
                "Finance",
                "Legal & Risks",
            ],
            key="dashboard_nav",
        )
        st.markdown("---")
        st.caption("Data source")
        st.code(str(REPORT_PATH), language="text")

    if page == "Overview":
        st.markdown(
            """
            <div class="hero">
                <div class="big-number">Startup Review Dashboard</div>
                <div class="muted" style="margin-top:10px;">
                    A structured founder-facing view of idea quality, feasibility, MVP, operations, finance, and legal watchouts.
                </div>
            </div>
            """,
            unsafe_allow_html=True,
        )

        c1, c2, c3, c4 = st.columns(4)
        with c1:
            metric_card("Promising", final_verdict.get("is_startup_promising", "Unknown"), tone=status_tone(final_verdict.get("is_startup_promising", "")))
        with c2:
            metric_card("Feasible", final_verdict.get("is_feasible", "Unknown"), tone=status_tone(final_verdict.get("is_feasible", "")))
        with c3:
            metric_card("Market Status", market.get("status", "Unknown"), tone=status_tone(market.get("status", "")))
        with c4:
            metric_card("Legal Risk", legal.get("risk_level", "Unknown"), tone=status_tone(legal.get("risk_level", "")))

        st.markdown("## Startup Summary")
        col_a, col_b = st.columns([1.3, 1])
        with col_a:
            section_card("Idea", startup_summary.get("idea", "N/A"))
            section_card("Problem", startup_summary.get("problem", "N/A"))
            section_card("How It Works", startup_summary.get("how_it_works", "N/A"))
        with col_b:
            section_card("Target Customer", startup_summary.get("target_customer", "N/A"))
            section_card("Business Model", startup_summary.get("business_model", "N/A"))

        st.markdown("## Verdict")
        left, right = st.columns(2)
        with left:
            st.subheader("Main Strengths")
            list_cards(final_verdict.get("main_strengths", []), tone="green")
        with right:
            st.subheader("Main Weaknesses")
            list_cards(final_verdict.get("main_weaknesses", []), tone="red")

        st.subheader("Recommended Next Steps")
        list_cards(final_verdict.get("recommended_next_steps", []), tone="blue")

    elif page == "Market & Innovation":
        st.title("Market & Innovation")

        c1, c2, c3 = st.columns(3)
        with c1:
            metric_card("Existence Risk Score", market.get("existence_risk_score", "N/A"), sub="0 = highly original, 100 = heavily existing", tone="amber")
        with c2:
            metric_card("Innovation Score", market.get("innovation_score", "N/A"), sub="0 = low novelty, 100 = highly innovative", tone="green")
        with c3:
            metric_card("Confidence", market.get("confidence", "N/A"), tone=status_tone(market.get("confidence", "")))

        st.markdown(
            f"""
            <div class="card" style="border-left:4px solid {tone_color(status_tone(market.get('status', '')))};">
                <div class="section-title">Status: {market.get("status", "N/A")}</div>
                <div class="muted">{market.get("summary", "N/A")}</div>
            </div>
            """,
            unsafe_allow_html=True,
        )

        st.subheader("Relevant Existing Solutions")
        render_solution_cards(market)

        if market.get("uncertainty_notes"):
            st.subheader("Uncertainty Notes")
            for note in market.get("uncertainty_notes", []):
                st.markdown(f"""<div class="warning-box">{note}</div>""", unsafe_allow_html=True)

    elif page == "MVP":
        st.title("Recommended MVP")

        st.markdown(
            f"""
            <div class="hero">
                <div class="section-title">MVP Summary</div>
                <div class="muted">{mvp.get("mvp_summary", "N/A")}</div>
            </div>
            """,
            unsafe_allow_html=True,
        )

        tab1, tab2, tab3, tab4 = st.tabs(["Must Haves", "User Journey", "Acceptance Criteria", "Out of Scope"])

        with tab1:
            list_cards(mvp.get("must_haves", []), tone="blue")

        with tab2:
            render_journey_timeline(mvp)

        with tab3:
            list_cards(mvp.get("acceptance_criteria", []), tone="green")

        with tab4:
            list_cards(mvp.get("out_of_scope", []), tone="red")

    elif page == "Operations":
        st.title("Operations & Business Needs")

        st.subheader("Minimum Roles & Responsibilities")
        st.caption("Roles are ordered by linked necessity level from the finance view when available.")
        render_role_chain(operations, finance)

        c1, c2 = st.columns(2)

        with c1:
            st.subheader("Materials & Equipment")
            for item in operations.get("materials_equipment", []):
                st.markdown(
                    f"""<div class="card" style="border-left:4px solid {tone_color('cyan')};">{item}</div>""",
                    unsafe_allow_html=True,
                )

        with c2:
            st.subheader("Tools Stack")
            for item in operations.get("tools_stack", []):
                st.markdown(
                    f"""<div class="card" style="border-left:4px solid {tone_color('purple')};">{item}</div>""",
                    unsafe_allow_html=True,
                )

        st.subheader("Operational Notes")
        notes = operations.get("important_operational_notes", [])
        if not notes:
            st.info("No operational notes.")
        else:
            for note in notes:
                st.markdown(f"""<div class="footnote">• {note}</div>""", unsafe_allow_html=True)

    elif page == "Finance":
        st.title("Finance")

        top1, top2, top3 = st.columns(3)
        with top1:
            revenue = finance.get("expected_monthly_revenue", {})
            if isinstance(revenue, dict):
                revenue_value = revenue.get("value", "N/A")
                revenue_sub = revenue.get("uncertainty_flag", "TND")
            else:
                revenue_value = revenue if revenue not in (None, "") else "N/A"
                revenue_sub = "TND"
            metric_card("Expected Monthly Revenue", revenue_value, sub=revenue_sub, tone="green")
        with top2:
            payback = finance.get("payback_months", {})
            if isinstance(payback, dict):
                payback_value = payback.get("value", "N/A")
                payback_sub = payback.get("uncertainty_flag", "")
            else:
                payback_value = payback if payback not in (None, "") else "N/A"
                payback_sub = ""
            metric_card("Payback Months", payback_value, sub=payback_sub, tone="amber")
        with top3:
            suggested_price = finance.get("suggested_price", {})
            if isinstance(suggested_price, dict):
                price_range = suggested_price.get("range_tnd", "N/A")
                price_sub = suggested_price.get("uncertainty_flag", "TND")
            else:
                price_range = suggested_price if suggested_price not in (None, "") else "N/A"
                price_sub = "TND"
            metric_card("Suggested Price", price_range, sub=price_sub, tone="blue")

        st.subheader("Employees & Wage Ranges")
        wage_items = sorted(finance.get("employees_and_wages", []), key=lambda x: necessity_rank(x.get("necessity_level", "")))
        gmax = salary_global_max(wage_items)

        if not wage_items:
            st.info("No employee wage data.")
        else:
            for item in wage_items:
                necessity = item.get("necessity_level", "uncertain")
                tone = {
                    "critical": "red",
                    "important": "amber",
                    "useful": "blue",
                    "uncertain": "slate",
                }.get(str(necessity).lower(), "slate")

                st.markdown(
                    f"""
                    <div class="card" style="border-left:4px solid {tone_color(tone)};">
                        <div class="section-title">{item.get("role", "Unknown")}</div>
                        <div style="margin-bottom:10px;">
                            <span class="pill" style="background:{tone_color(tone)}20; color:{tone_color(tone)}; border-color:{tone_color(tone)}55;">
                                {necessity.title()}
                            </span>
                        </div>
                        <div class="muted"><b>Why needed:</b> {item.get("why_needed", "N/A")}</div>
                    </div>
                    """,
                    unsafe_allow_html=True,
                )
                range_bar("Salary Range", item.get("salary_or_range", "N/A"), gmax, tone)

        st.markdown("---")
        left, right = st.columns(2)

        with left:
            render_cost_object("Tools / Materials / Ops Costs", finance.get("tools_materials_ops_costs", {}))
            render_cost_object("Monthly Costs", finance.get("monthly_costs", {}))
            render_cost_object("One-Time Costs", finance.get("one_time_costs", {}))

        with right:
            suggested_price = finance.get("suggested_price", {})
            if isinstance(suggested_price, dict) and suggested_price.get("range_tnd"):
                st.subheader("Suggested Price Range")
                range_bar("Suggested Price", suggested_price.get("range_tnd", "N/A"), 1000, "blue")
            else:
                render_cost_object("Suggested Price", suggested_price)

            render_cost_object("Price Realism", finance.get("price_realism", {}))
            render_cost_object("Payback Months", finance.get("payback_months", {}))

        st.subheader("Missing / Uncertain Finance Parts")
        missing = finance.get("missing_or_uncertain_parts", [])
        if not missing:
            st.success("No major finance uncertainties listed.")
        else:
            for item in missing:
                st.markdown(f"""<div class="danger-box">{item}</div>""", unsafe_allow_html=True)

    elif page == "Legal & Risks":
        st.title("Legal, Compliance & Risks")

        c1, c2 = st.columns([0.8, 1.2])
        with c1:
            metric_card("Legal Risk Level", legal.get("risk_level", "N/A"), tone="red" if str(legal.get("risk_level", "")).lower() == "high" else "amber")
        with c2:
            st.markdown(
                """
                <div class="card">
                    <div class="section-title">Legal Review Note</div>
                    <div class="muted">
                        This section should be treated as a practical compliance watchlist, not final legal advice.
                    </div>
                </div>
                """,
                unsafe_allow_html=True,
            )

        tab1, tab2, tab3, tab4 = st.tabs(["Compliance Checklist", "Trust Requirements", "Operational Constraints", "Filtered Summary"])

        with tab1:
            list_cards(legal.get("legal_compliance_checklist", []), tone="red")

        with tab2:
            list_cards(legal.get("trust_requirements", []), tone="blue")

        with tab3:
            list_cards(legal.get("special_operational_constraints", []), tone="amber")

        with tab4:
            list_cards(legal.get("filtered_summary", []), tone="purple")

        st.markdown("## Risks, Weak Points & Uncertainty Flags")
        if not uncertainty_flags:
            st.success("No uncertainty flags.")
        else:
            for flag in uncertainty_flags:
                st.markdown(f"""<div class="warning-box">{flag}</div>""", unsafe_allow_html=True)


if not st.session_state.analysis_complete:
    empty_data = empty_user_input()

    st.markdown(
        """
        <div class="hero">
            <div class="big-number">Startup Evaluation Pipeline</div>
            <div class="muted" style="margin-top:10px;">
                Step 1: fill in the startup input.<br>
                Step 2: click Run Full Pipeline.<br>
                Step 3: wait about 10 minutes while the analysis runs.<br>
                Step 4: review the final dashboard.
            </div>
        </div>
        """,
        unsafe_allow_html=True,
    )

    st.markdown(
        """
        <div class="hint-box">
            <b>Tip:</b> Keep the idea description practical and concrete. Mention what the startup does, who it serves, and how it works.
        </div>
        """,
        unsafe_allow_html=True,
    )

    with st.form("startup_input_form", clear_on_submit=False):
        st.markdown('<div class="form-card">', unsafe_allow_html=True)
        st.markdown("### Core startup idea")
        c1, c2 = st.columns(2)
        with c1:
            startup_idea = st.text_area(
                "Startup idea",
                value="",
                height=140,
                placeholder="One clear paragraph describing the startup idea in plain English.",
            )
            idea_description = st.text_area(
                "Idea description",
                value="",
                height=140,
                placeholder="Describe the startup more clearly: what it does, for whom, and in what context.",
            )
        with c2:
            problem = st.text_area(
                "Problem",
                value="",
                height=140,
                placeholder="What real problem does this startup solve?",
            )
            how_it_works = st.text_area(
                "How it works in one sentence",
                value="",
                height=140,
                placeholder="Example: Businesses rent connected refrigerated boxes and track them through a dashboard.",
            )
        st.markdown('</div>', unsafe_allow_html=True)

        st.markdown('<div class="form-card">', unsafe_allow_html=True)
        st.markdown("### Market and customer")
        c3, c4 = st.columns(2)
        with c3:
            target_type = st.selectbox("Target customer type", TARGET_CUSTOMER_TYPES, index=0)
            target_location = st.text_input(
                "Target customer location",
                value="",
                placeholder="Example: Tunisia, especially coastal cities",
            )
            industry = st.selectbox("Industry", INDUSTRY_OPTIONS, index=INDUSTRY_OPTIONS.index("unknown"))
        with c4:
            target_notes = st.text_area(
                "Target customer notes",
                value="",
                height=110,
                placeholder="Who exactly are the customers? Add useful context.",
            )
            product_type = st.selectbox(
                "Product type",
                PRODUCT_TYPE_OPTIONS,
                index=PRODUCT_TYPE_OPTIONS.index("software tool / SaaS"),
            )
        st.markdown('</div>', unsafe_allow_html=True)

        st.markdown('<div class="form-card">', unsafe_allow_html=True)
        st.markdown("### Business model")
        bm1, bm2, bm3 = st.columns(3)
        with bm1:
            revenue_model = st.text_input("Revenue model", value="", placeholder="subscription / transaction / commission / etc.")
        with bm2:
            who_pays = st.text_input("Who pays", value="", placeholder="business / end user / both")
        with bm3:
            when_paid = st.text_input("When paid", value="", placeholder="recurring / one-time / usage-based")
        st.markdown('</div>', unsafe_allow_html=True)

        st.markdown('<div class="form-card">', unsafe_allow_html=True)
        st.markdown("### Team members")
        st.markdown('<div class="subtle">Add the current or planned key members and their skills.</div>', unsafe_allow_html=True)

        add_member = st.form_submit_button("Add member")
        if add_member:
            st.session_state.team_count += 1
            st.rerun()

        team_data = []
        for i in range(st.session_state.team_count):
            c1, c2 = st.columns(2)
            with c1:
                role = st.text_input(
                    f"Role {i + 1}",
                    value="",
                    key=f"role_{i}",
                    placeholder="Example: founder / technical cofounder / sales lead",
                )
            with c2:
                skills = st.text_input(
                    f"Skills {i + 1}",
                    value="",
                    key=f"skills_{i}",
                    placeholder="Example: IoT, backend, logistics partnerships, B2B sales",
                )
            if role.strip() or skills.strip():
                team_data.append({"role": role.strip(), "skills": skills.strip()})
        st.markdown('</div>', unsafe_allow_html=True)

        st.markdown('<div class="form-card">', unsafe_allow_html=True)
        st.markdown("### Finance assumptions")
        f1, f2, f3 = st.columns(3)
        with f1:
            price_per_sale = st.text_input(
                "Price per sale",
                value="",
                placeholder="Example: 350 TND per customer per month",
            )
        with f2:
            sales_target_per_month = st.number_input("Sales target per month", min_value=0, step=1, value=empty_data["finance_assumptions"]["sales_target_per_month"])
        with f3:
            gain_on_sale_pct = st.number_input("Gain on sale %", min_value=0, step=1, value=empty_data["finance_assumptions"]["gain_on_sale_pct"])

        f4, f5 = st.columns(2)
        with f4:
            months = st.text_input("Months", value="", placeholder="Example: 6")
        with f5:
            initial_budget_tnd = st.number_input("Initial budget TND", min_value=0, step=100, value=empty_data["finance_assumptions"]["initial_budget_tnd"])
        st.markdown('</div>', unsafe_allow_html=True)

        run_clicked = st.form_submit_button("Run Full Pipeline", type="primary", use_container_width=True)

    if run_clicked:
        payload = {
            "startup_idea": startup_idea.strip(),
            "idea_description": idea_description.strip(),
            "problem": problem.strip(),
            "target_customer": {
                "type": target_type,
                "location": target_location.strip(),
                "notes": target_notes.strip(),
            },
            "industry": industry,
            "product_type": product_type,
            "how_it_works_one_sentence": how_it_works.strip(),
            "business_model": {
                "revenue_model": revenue_model.strip(),
                "who_pays": who_pays.strip(),
                "when_paid": when_paid.strip(),
            },
            "team": {
                "members": team_data,
            },
            "finance_assumptions": {
                "price_per_sale": price_per_sale.strip(),
                "sales_target_per_month": int(sales_target_per_month),
                "gain_on_sale_pct": int(gain_on_sale_pct),
                "months": months.strip(),
                "initial_budget_tnd": int(initial_budget_tnd),
            },
        }

        save_json(USER_INPUT_PATH, payload)
        load_report.clear()

        try:
            with st.spinner("Running full analysis... this usually takes about 10 minutes."):
                run_pipeline()
            st.session_state.analysis_complete = True
            st.success("Pipeline finished.")
            st.rerun()
        except subprocess.CalledProcessError as e:
            st.error(f"Pipeline failed: {e}")

else:
    report = load_report()
    if report:
        render_dashboard(report)
    else:
        st.error("The pipeline finished but final_master_report.json could not be loaded.")
