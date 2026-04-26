import { useEffect, useState } from "react";

const REPORT_URL = "http://127.0.0.1:5055/track1/report";

const TABS = ["Overview", "Market", "MVP", "Operations", "Finance", "Legal"];

function toneColor(tone) {
  const colors = {
    green: "#22c55e",
    red: "#ef4444",
    amber: "#f59e0b",
    blue: "#38bdf8",
    purple: "#8b5cf6",
    cyan: "#06b6d4",
    slate: "#94a3b8",
  };

  return colors[tone] || colors.blue;
}

function statusTone(value) {
  const v = String(value || "").trim().toLowerCase();

  if (["yes", "high", "appears original"].includes(v)) return "green";
  if (["uncertain", "medium", "partially exists"].includes(v)) return "amber";
  if (["no", "low", "already exists"].includes(v)) return "red";

  return "blue";
}

function riskTone(value) {
  const v = String(value || "").trim().toLowerCase();

  if (v === "high") return "red";
  if (v === "medium") return "amber";
  if (v === "low") return "green";

  return "blue";
}

function necessityTone(value) {
  const v = String(value || "").trim().toLowerCase();

  if (v === "critical") return "red";
  if (v === "important") return "amber";
  if (v === "useful") return "blue";

  return "slate";
}

function labelize(key) {
  return String(key)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function isEmpty(value) {
  return (
    value === null ||
    value === undefined ||
    value === "" ||
    value === "missing_info" ||
    value === "missing" ||
    value === "N/A"
  );
}

function renderValue(value) {
  if (isEmpty(value)) return "N/A";

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => renderValue(item)).join("\n");
  }

  if (typeof value === "object") {
    return Object.entries(value)
      .map(([key, val]) => `${labelize(key)}: ${renderValue(val)}`)
      .join("\n");
  }

  return String(value);
}

function parseRange(value) {
  const text = String(value || "");
  const nums = text.match(/\d+(?:\.\d+)?/g);

  if (!nums || nums.length === 0) return null;
  if (nums.length === 1) return [Number(nums[0]), Number(nums[0])];

  return [Number(nums[0]), Number(nums[1])];
}

function salaryGlobalMax(items = []) {
  const values = items
    .map((item) => parseRange(item?.salary_or_range))
    .filter(Boolean)
    .map((range) => range[1]);

  return values.length ? Math.max(...values) : 1;
}

function Pill({ children, tone = "blue" }) {
  const color = toneColor(tone);

  return (
    <span
      className="track1-pill"
      style={{
        color,
        background: `${color}20`,
        borderColor: `${color}66`,
      }}
    >
      {children}
    </span>
  );
}

function MetricCard({ label, value, tone }) {
  const finalTone = tone || statusTone(value);
  const color = toneColor(finalTone);

  return (
    <div
      className="track1-metric"
      style={{
        background: `linear-gradient(135deg, ${color}18 0%, rgba(255,255,255,0.96) 55%, #f8fbff 100%)`,
        borderColor: `${color}40`,
      }}
    >
      <span>{label}</span>
      <strong>{renderValue(value)}</strong>
    </div>
  );
}

function TextCard({ title, children, tone = "blue" }) {
  const color = toneColor(tone);

  return (
    <div className="track1-card" style={{ borderLeft: `4px solid ${color}` }}>
      <h3>{title}</h3>
      <p className="track1-muted">{renderValue(children)}</p>
    </div>
  );
}

function SimpleList({ title, items, tone = "blue" }) {
  const color = toneColor(tone);
  const safeItems = Array.isArray(items)
    ? items
    : items
    ? [items]
    : [];

  return (
    <section className="track1-section">
      <h2>{title}</h2>

      {safeItems.length === 0 ? (
        <div className="track1-card">
          <p className="track1-muted">No data.</p>
        </div>
      ) : (
        safeItems.map((item, index) => (
          <div
            className={isEmpty(item) ? "track1-alert danger" : "track1-card"}
            style={!isEmpty(item) ? { borderLeft: `4px solid ${color}` } : {}}
            key={index}
          >
            <p className="track1-muted">{renderValue(item)}</p>
          </div>
        ))
      )}
    </section>
  );
}

function RangeBar({ label, value, globalMax = 1, tone = "blue" }) {
  const parsed = parseRange(value);
  const color = toneColor(tone);

  if (!parsed) {
    return (
      <p className="track1-muted">
        <strong>{label}:</strong> {renderValue(value)}
      </p>
    );
  }

  const [min, max] = parsed;
  const left = Math.min((min / globalMax) * 100, 100);
  const width = Math.max(((max - min) / globalMax) * 100, 4);

  return (
    <div className="track1-range-wrap">
      <div className="track1-small-line">
        <strong>{label}</strong> — {value}
      </div>

      <div className="track1-range-track">
        <div
          className="track1-range-bar"
          style={{
            left: `${left}%`,
            width: `${width}%`,
            background: color,
          }}
        />
      </div>
    </div>
  );
}

function ExistingSolutionCard({ item }) {
  const confidence = item?.relevance_confidence || "Medium";
  const tone = statusTone(confidence);

  return (
    <div
      className="track1-card"
      style={{ borderLeft: `4px solid ${toneColor(tone)}` }}
    >
      <h3>{item?.company_name || "Unknown solution"}</h3>

      <div className="track1-pill-row">
        <Pill tone={tone}>Confidence: {confidence}</Pill>
      </div>

      <p className="track1-muted">
        <strong>What it does:</strong> {renderValue(item?.what_it_does)}
      </p>

      <p className="track1-muted">
        <strong>Similarity:</strong> {renderValue(item?.similarity_to_startup)}
      </p>
    </div>
  );
}

function RoleCard({ item, linkedFinance }) {
  const necessity = item?.necessity_level || linkedFinance?.necessity_level || "uncertain";
  const tone = necessityTone(necessity);

  return (
    <div
      className="track1-card role-card"
      style={{ borderTop: `4px solid ${toneColor(tone)}` }}
    >
      <h3>{item?.role || "Unknown role"}</h3>

      <div className="track1-pill-row">
        <Pill tone={tone}>{necessity}</Pill>
      </div>

      <p className="track1-muted">
        {renderValue(item?.responsibility_or_description || item?.why_needed)}
      </p>
    </div>
  );
}

function EmployeeCard({ item, globalMax }) {
  const tone = necessityTone(item?.necessity_level);

  return (
    <div
      className="track1-card"
      style={{ borderLeft: `4px solid ${toneColor(tone)}` }}
    >
      <h3>{item?.role || "Unknown role"}</h3>

      <div className="track1-pill-row">
        <Pill tone={tone}>{item?.necessity_level || "uncertain"}</Pill>
      </div>

      <p className="track1-muted">
        <strong>Why needed:</strong> {renderValue(item?.why_needed)}
      </p>

      <RangeBar
        label="Salary Range"
        value={item?.salary_or_range}
        globalMax={globalMax}
        tone={tone}
      />
    </div>
  );
}

function CostObject({ title, data, tone = "blue" }) {
  const color = toneColor(tone);

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return <TextCard title={title} tone={tone}>{data}</TextCard>;
  }

  return (
    <section className="track1-section">
      <h2>{title}</h2>

      {Object.entries(data).map(([key, value]) => (
        <div
          className="track1-card"
          style={{ borderLeft: `4px solid ${color}` }}
          key={key}
        >
          <h3>{labelize(key)}</h3>
          <p className="track1-muted">{renderValue(value)}</p>
        </div>
      ))}
    </section>
  );
}

function Timeline({ title, items }) {
  const safeItems = Array.isArray(items)
    ? items
    : items
    ? [items]
    : [];

  return (
    <section className="track1-section">
      <h2>{title}</h2>

      {safeItems.length === 0 ? (
        <div className="track1-card">
          <p className="track1-muted">No data.</p>
        </div>
      ) : (
        safeItems.map((item, index) => (
          <div className="track1-timeline-step" key={index}>
            <span className="track1-timeline-index">{index + 1}</span>
            <p>{renderValue(item)}</p>
          </div>
        ))
      )}
    </section>
  );
}

function GenericObjectList({ title, items = [], tone = "blue" }) {
  const color = toneColor(tone);

  return (
    <section className="track1-section">
      <h2>{title}</h2>

      {!items || items.length === 0 ? (
        <div className="track1-card">
          <p className="track1-muted">No data.</p>
        </div>
      ) : (
        items.map((item, index) => {
          if (typeof item !== "object" || item === null) {
            return (
              <div
                className="track1-card"
                style={{ borderLeft: `4px solid ${color}` }}
                key={index}
              >
                <p className="track1-muted">{renderValue(item)}</p>
              </div>
            );
          }

          const titleValue =
            item.role ||
            item.company_name ||
            item.name ||
            item.title ||
            `Item ${index + 1}`;

          return (
            <div
              className="track1-card"
              style={{ borderLeft: `4px solid ${color}` }}
              key={index}
            >
              <h3>{titleValue}</h3>

              <div className="track1-kv-grid">
                {Object.entries(item)
                  .filter(([key]) => !["role", "company_name", "name", "title"].includes(key))
                  .map(([key, value]) => (
                    <div className="track1-kv" key={key}>
                      <span>{labelize(key)}</span>
                      <strong>{renderValue(value)}</strong>
                    </div>
                  ))}
              </div>
            </div>
          );
        })
      )}
    </section>
  );
}

export function Track1SavedReport() {
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Overview");

  useEffect(() => {
    async function loadReport() {
      try {
        const response = await fetch(REPORT_URL);
        const data = await response.json();

        if (!response.ok || data.error) {
          setError(data.error || "Could not load saved report.");
        } else {
          setReport(data);
        }
      } catch {
        setError("Could not connect to Track1 backend.");
      } finally {
        setLoading(false);
      }
    }

    loadReport();
  }, []);

  const startup = report?.startup_summary || {};
  const market = report?.market_existence || {};
  const mvp = report?.mvp || {};
  const operations = report?.operations || {};
  const finance = report?.finance || {};
  const legal = report?.legal_and_compliance || {};
  const verdict = report?.final_verdict || {};
  const uncertaintyFlags = report?.uncertainty_flags || [];

  const financeRoles = finance?.employees_and_wages || [];
  const financeLookup = Object.fromEntries(
    financeRoles.map((item) => [String(item.role || "").toLowerCase(), item])
  );

  const sortedFinanceRoles = [...financeRoles].sort((a, b) => {
    const order = { critical: 0, important: 1, useful: 2, uncertain: 3 };
    return (
      (order[String(a.necessity_level || "").toLowerCase()] ?? 99) -
      (order[String(b.necessity_level || "").toLowerCase()] ?? 99)
    );
  });

  const wageMax = salaryGlobalMax(sortedFinanceRoles);

  return (
    <main className="track1-page">
      <style>{`
  .track1-page {
    min-height: 100vh;
    padding: 120px 6vw 70px;
    background:
      radial-gradient(circle at top left, rgba(62, 106, 225, 0.18), transparent 28%),
      radial-gradient(circle at 85% 10%, rgba(15, 37, 84, 0.12), transparent 22%),
      linear-gradient(180deg, #f6f9ff 0%, #eef3fb 100%);
    color: var(--navy-900);
  }

  body.dark-mode .track1-page {
    background:
      radial-gradient(circle at top left, rgba(75, 124, 255, 0.14), transparent 24%),
      radial-gradient(circle at 80% 12%, rgba(75, 124, 255, 0.1), transparent 18%),
      linear-gradient(180deg, #071224 0%, #0a1730 100%);
    color: #eff4ff;
  }

  .track1-shell {
    width: min(1220px, calc(100% - 28px));
    margin: 0 auto;
  }

  .track1-hero {
    padding: 30px;
    border-radius: 30px;
    background: rgba(255, 255, 255, 0.86);
    border: 1px solid var(--border);
    box-shadow: var(--shadow-md);
    margin-bottom: 22px;
    animation: trackFadeUp 0.45s ease;
  }

  body.dark-mode .track1-hero {
    background: rgba(255, 255, 255, 0.04);
  }

  .track1-eyebrow {
    color: #6b7e9c;
    text-transform: uppercase;
    font-size: 0.78rem;
    letter-spacing: 0.05em;
    font-weight: 800;
    margin-bottom: 10px;
  }

  body.dark-mode .track1-eyebrow {
    color: #9db2d3;
  }

  .track1-hero h1 {
    font-family: "Space Grotesk", sans-serif;
    font-size: clamp(2.5rem, 6vw, 4.5rem);
    line-height: 0.98;
    margin: 0 0 16px;
    color: var(--navy-900);
  }

  .track1-hero p {
    color: var(--text);
    max-width: 760px;
    font-size: 1.05rem;
    line-height: 1.7;
  }

  .track1-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 18px;
  }

  .track1-tab {
    border-radius: 999px;
    border: 1px solid var(--border);
    background: rgba(255, 255, 255, 0.9);
    color: var(--navy-900);
    padding: 10px 16px;
    cursor: pointer;
    font-weight: 800;
    transition: transform 0.35s ease, box-shadow 0.35s ease, background-color 0.35s ease, color 0.35s ease, border-color 0.35s ease;
  }

  body.dark-mode .track1-tab {
    background: rgba(255, 255, 255, 0.04);
  }

  .track1-tab:hover {
    transform: translateY(-2px);
    border-color: rgba(75, 124, 255, 0.45);
  }

  .track1-tab.active {
    color: #fff;
    border-color: transparent;
    background: linear-gradient(135deg, #0d2145, #4b7cff);
    box-shadow: 0 16px 34px rgba(29, 77, 145, 0.28);
  }

  .track1-metrics {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
    margin-bottom: 18px;
  }

  .track1-metric {
    padding: 18px;
    border-radius: 22px;
    border: 1px solid var(--border);
    min-height: 120px;
    box-shadow: var(--shadow-md);
    animation: trackFadeUp 0.45s ease;
    transition: transform 0.35s ease, box-shadow 0.35s ease;
  }

  .track1-metric:hover,
  .track1-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 28px 64px rgba(10, 32, 73, 0.14);
  }

  .track1-metric span {
    display: block;
    color: var(--text);
    margin-bottom: 8px;
  }

  .track1-metric strong {
    display: block;
    color: var(--navy-900);
    font-family: "Space Grotesk", sans-serif;
    font-size: 1.65rem;
    line-height: 1.05;
    white-space: pre-wrap;
  }

  .track1-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  .track1-grid-3 {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }

  .track1-card {
    padding: 22px;
    border-radius: 28px;
    background: rgba(255, 255, 255, 0.84);
    border: 1px solid var(--border);
    box-shadow: var(--shadow-md);
    margin-bottom: 18px;
    color: var(--text);
    animation: trackFadeUp 0.45s ease;
    transition: transform 0.35s ease, box-shadow 0.35s ease, background-color 0.35s ease, border-color 0.35s ease;
  }

  body.dark-mode .track1-card {
    background: rgba(255, 255, 255, 0.04);
  }

  .track1-card h3,
  .track1-section h2 {
    margin: 0 0 14px;
    font-family: "Space Grotesk", sans-serif;
    color: var(--navy-900);
  }

  .track1-muted {
    color: var(--text);
    margin: 0;
    line-height: 1.7;
    white-space: pre-wrap;
  }

  .track1-section {
    margin-bottom: 18px;
  }

  .track1-pill-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 12px;
  }

  .track1-pill {
    display: inline-block;
    padding: 8px 12px;
    border-radius: 999px;
    font-size: 0.78rem;
    font-weight: 800;
    border: 1px solid;
    text-transform: capitalize;
  }

  .track1-kv-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    margin-top: 14px;
  }

  .track1-kv {
    padding: 12px;
    border-radius: 16px;
    background: rgba(18, 51, 100, 0.05);
    border: 1px solid var(--border);
  }

  body.dark-mode .track1-kv {
    background: rgba(255, 255, 255, 0.05);
  }

  .track1-kv span {
    display: block;
    color: #6b7e9c;
    font-size: 0.82rem;
    margin-bottom: 5px;
  }

  body.dark-mode .track1-kv span {
    color: #9db2d3;
  }

  .track1-kv strong {
    color: var(--navy-900);
    font-weight: 600;
    white-space: pre-wrap;
  }

  .track1-range-wrap {
    margin-top: 14px;
  }

  .track1-small-line {
    color: var(--text);
    font-size: 0.92rem;
    margin-bottom: 8px;
  }

  .track1-range-track {
    position: relative;
    height: 14px;
    border-radius: 999px;
    background: rgba(18, 51, 100, 0.1);
    overflow: hidden;
  }

  body.dark-mode .track1-range-track {
    background: rgba(255, 255, 255, 0.12);
  }

  .track1-range-bar {
    position: absolute;
    top: 0;
    height: 14px;
    border-radius: 999px;
  }

  .track1-timeline-step {
    position: relative;
    padding: 16px 18px 16px 56px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.84);
    border: 1px solid var(--border);
    box-shadow: var(--shadow-md);
    margin-bottom: 12px;
    animation: trackFadeUp 0.45s ease;
  }

  body.dark-mode .track1-timeline-step {
    background: rgba(255, 255, 255, 0.04);
  }

  .track1-timeline-step::before {
    content: "";
    position: absolute;
    left: 28px;
    top: 0;
    bottom: -12px;
    width: 2px;
    background: linear-gradient(180deg, var(--navy-900), var(--blue-500));
  }

  .track1-timeline-step:last-child::before {
    bottom: 50%;
  }

  .track1-timeline-index {
    position: absolute;
    left: 14px;
    top: 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    font-weight: 900;
    background: linear-gradient(135deg, #0d2145, #4b7cff);
    color: #fff;
    z-index: 1;
  }

  .track1-timeline-step p {
    margin: 0;
    color: var(--text);
    line-height: 1.7;
  }

  .track1-alert {
    padding: 16px;
    border-radius: 18px;
    margin-bottom: 12px;
    animation: trackFadeUp 0.45s ease;
  }

  .track1-alert.danger {
    background: rgba(239, 68, 68, 0.12);
    border: 1px solid rgba(239, 68, 68, 0.35);
    color: #b91c1c;
  }

  .track1-error {
    padding: 14px 16px;
    border-radius: 16px;
    background: rgba(239, 68, 68, 0.12);
    border: 1px solid rgba(239, 68, 68, 0.35);
    color: #b91c1c;
    margin-top: 16px;
  }

  @keyframes trackFadeUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 900px) {
    .track1-grid,
    .track1-grid-3,
    .track1-metrics,
    .track1-kv-grid {
      grid-template-columns: 1fr;
    }

    .track1-page {
      padding: 100px 18px 50px;
    }
  }
`}</style>

      <div className="track1-shell">
        <section className="track1-hero">
          <div className="track1-eyebrow">Track 1 · Saved Report</div>
          <h1>Startup Review Dashboard</h1>
          <p>
            This page shows the saved Track1 report without rerunning the pipeline.
          </p>
        </section>

        {loading && <TextCard title="Loading">Loading saved report...</TextCard>}

        {error && <div className="track1-error">{error}</div>}

        {report && (
          <>
            <div className="track1-tabs">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  className={`track1-tab ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "Overview" && (
              <>
                <div className="track1-metrics">
                  <MetricCard
                    label="Promising"
                    value={verdict.is_startup_promising}
                    tone={statusTone(verdict.is_startup_promising)}
                  />
                  <MetricCard
                    label="Feasible"
                    value={verdict.is_feasible}
                    tone={statusTone(verdict.is_feasible)}
                  />
                  <MetricCard
                    label="Market Status"
                    value={market.status}
                    tone={statusTone(market.status)}
                  />
                  <MetricCard
                    label="Legal Risk"
                    value={legal.risk_level}
                    tone={riskTone(legal.risk_level)}
                  />
                </div>

                <div className="track1-grid">
                  <TextCard title="Idea">{startup.idea}</TextCard>
                  <TextCard title="Problem">{startup.problem}</TextCard>
                  <TextCard title="How It Works">{startup.how_it_works}</TextCard>
                  <TextCard title="Target Customer">{startup.target_customer}</TextCard>
                  <TextCard title="Business Model">{startup.business_model}</TextCard>
                </div>

                <div className="track1-grid">
                  <SimpleList title="Main Strengths" items={verdict.main_strengths} tone="green" />
                  <SimpleList title="Main Weaknesses" items={verdict.main_weaknesses} tone="red" />
                </div>

                <SimpleList
                  title="Recommended Next Steps"
                  items={verdict.recommended_next_steps}
                  tone="blue"
                />
              </>
            )}

            {activeTab === "Market" && (
              <>
                <div className="track1-metrics">
                  <MetricCard label="Existence Risk Score" value={market.existence_risk_score} tone="amber" />
                  <MetricCard label="Innovation Score" value={market.innovation_score} tone="green" />
                  <MetricCard label="Confidence" value={market.confidence} tone={statusTone(market.confidence)} />
                  <MetricCard label="Status" value={market.status} tone={statusTone(market.status)} />
                </div>

                <TextCard title={`Status: ${market.status || "N/A"}`} tone={statusTone(market.status)}>
                  {market.summary}
                </TextCard>

                <section className="track1-section">
                  <h2>Relevant Existing Solutions</h2>
                  {(market.relevant_existing_solutions || []).map((item, index) => (
                    <ExistingSolutionCard item={item} key={index} />
                  ))}
                </section>

                <SimpleList title="Uncertainty Notes" items={market.uncertainty_notes} tone="amber" />
              </>
            )}

            {activeTab === "MVP" && (
              <>
                <TextCard title="MVP Summary" tone="blue">
                  {mvp.mvp_summary}
                </TextCard>

                <div className="track1-grid">
                  <SimpleList title="Must Haves" items={mvp.must_haves} tone="blue" />
                  <SimpleList title="Acceptance Criteria" items={mvp.acceptance_criteria} tone="green" />
                </div>

                <Timeline title="User Journey" items={mvp.user_journey} />

                <SimpleList title="Out of Scope" items={mvp.out_of_scope} tone="red" />
              </>
            )}

            {activeTab === "Operations" && (
              <>
                <section className="track1-section">
                  <h2>Minimum Roles & Responsibilities</h2>

                  <div className="track1-grid-3">
                    {(operations.minimum_roles_responsibilities || []).map((item, index) => (
                      <RoleCard
                        item={item}
                        linkedFinance={financeLookup[String(item.role || "").toLowerCase()]}
                        key={index}
                      />
                    ))}
                  </div>
                </section>

                <div className="track1-grid">
                  <SimpleList title="Materials & Equipment" items={operations.materials_equipment} tone="cyan" />
                  <SimpleList title="Tools Stack" items={operations.tools_stack} tone="purple" />
                </div>

                <SimpleList title="Operational Notes" items={operations.important_operational_notes} tone="blue" />
              </>
            )}

            {activeTab === "Finance" && (
              <>
                <div className="track1-metrics">
                  <MetricCard
                    label="Expected Monthly Revenue"
                    value={finance.expected_monthly_revenue?.value || finance.expected_monthly_revenue}
                    tone="green"
                  />
                  <MetricCard
                    label="Payback Months"
                    value={finance.payback_months?.value || finance.payback_months}
                    tone="amber"
                  />
                  <MetricCard
                    label="Suggested Price"
                    value={finance.suggested_price?.range_tnd || finance.suggested_price}
                    tone="blue"
                  />
                </div>

                <section className="track1-section">
                  <h2>Employees & Wage Ranges</h2>

                  {sortedFinanceRoles.map((item, index) => (
                    <EmployeeCard item={item} globalMax={wageMax} key={index} />
                  ))}
                </section>

                <div className="track1-grid">
                  <CostObject title="Tools / Materials / Ops Costs" data={finance.tools_materials_ops_costs} tone="cyan" />
                  <CostObject title="Monthly Costs" data={finance.monthly_costs} tone="amber" />
                  <CostObject title="One-Time Costs" data={finance.one_time_costs} tone="purple" />
                  <CostObject title="Price Realism" data={finance.price_realism} tone="blue" />
                </div>

                <SimpleList
                  title="Missing / Uncertain Finance Parts"
                  items={finance.missing_or_uncertain_parts}
                  tone="red"
                />
              </>
            )}

            {activeTab === "Legal" && (
              <>
                <div className="track1-metrics">
                  <MetricCard
                    label="Legal Risk Level"
                    value={legal.risk_level}
                    tone={riskTone(legal.risk_level)}
                  />
                </div>

                <TextCard title="Legal Review Note" tone="amber">
                  This section should be treated as a practical compliance watchlist, not final legal advice.
                </TextCard>

                <SimpleList title="Compliance Checklist" items={legal.legal_compliance_checklist} tone="red" />
                <SimpleList title="Trust Requirements" items={legal.trust_requirements} tone="blue" />
                <SimpleList title="Operational Constraints" items={legal.special_operational_constraints} tone="amber" />
                <SimpleList title="Filtered Summary" items={legal.filtered_summary} tone="purple" />
                <SimpleList title="Uncertainty Flags" items={uncertaintyFlags} tone="amber" />
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default Track1SavedReport;