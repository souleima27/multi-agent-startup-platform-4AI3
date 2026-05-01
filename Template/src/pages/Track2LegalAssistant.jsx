import { useMemo, useState } from "react";

const API_URL = "http://127.0.0.1:5057";

const INITIAL_FORM = {
  startup_profile: {
    startup_name: "Neuronix Legal AI",
    sector: "AI SaaS",
    activity_description: "AI platform for startup legal guidance and compliance automation.",
    founders_count: 3,
    funding_need_tnd: 250000,
    wants_investors: true,
    needs_limited_liability: true,
    has_foreign_investors: false,
    innovative: true,
    scalable: true,
    uses_technology: true,
    associates: [
      { name: "Mariam", role: "CEO", equity_pct: 45, active: true },
      { name: "Youssef", role: "CTO", equity_pct: 35, active: true },
      { name: "Nour", role: "COO", equity_pct: 20, active: true },
    ],
  },
  documents: [
    { path: "Track2/data/synthetic_docs/scans/fake_01_statuts.png", declared_type: "statuts" },
    { path: "Track2/data/synthetic_docs/scans/fake_02_rc.png", declared_type: "registre_commerce" },
    { path: "Track2/data/synthetic_docs/scans/fake_03_if.png", declared_type: "identifiant_fiscal" },
    { path: "Track2/data/synthetic_docs/scans/fake_04_attestation_bancaire.png", declared_type: "attestation_bancaire" },
    { path: "Track2/data/synthetic_docs/scans/fake_05_cin.png", declared_type: "cin" },
  ],
  label_input: {
    startup_name: "Neuronix Legal AI",
    transcript: "We automate legal readiness for Tunisian startups.",
    slide_text: "AI legal compliance, Startup Act readiness, document diagnostics.",
    sector: "AI SaaS",
    traction_signals: ["pilot customers", "legal workflow automation"],
    team_signals: ["technical founder", "legal operations experience"],
    pitch_notes: ["clear market pain", "strong compliance use case"],
  },
  options: {
    strict_mode: true,
    generate_json_report: true,
    generate_pdf_report: false,
    report_prefix: "track_b_template_run",
  },
};

function labelize(value) {
  return String(value || "")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function toneForDecision(value) {
  const normalized = String(value || "").toLowerCase();
  if (["pass", "go", "ready", "good"].includes(normalized)) return "good";
  if (["fail", "no_go", "blocked"].includes(normalized)) return "danger";
  return "warn";
}

function prettyJson(value) {
  return JSON.stringify(value, null, 2);
}

function Metric({ label, value, tone = "info" }) {
  return (
    <div className={`track2-metric ${tone}`}>
      <span>{label}</span>
      <strong>{value ?? "N/A"}</strong>
    </div>
  );
}

function Badge({ children, tone = "info" }) {
  return <span className={`track2-badge ${tone}`}>{children}</span>;
}

function splitLines(value) {
  return String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function Track2LegalAssistant({ track }) {
  const [formState, setFormState] = useState(INITIAL_FORM);
  const [documentsText, setDocumentsText] = useState(
    INITIAL_FORM.documents.map((doc) => `${doc.path}|${doc.declared_type}`).join("\n")
  );
  const [loading, setLoading] = useState(false);
  const [sampleLoading, setSampleLoading] = useState(false);
  const [error, setError] = useState("");
  const [report, setReport] = useState(null);
  const [chatQuestion, setChatQuestion] = useState("What should we fix first?");
  const [chatAnswer, setChatAnswer] = useState(null);

  const updateProfile = (field, value) => {
    setFormState((prev) => ({
      ...prev,
      startup_profile: { ...prev.startup_profile, [field]: value },
      label_input: field === "startup_name" || field === "sector"
        ? { ...prev.label_input, [field]: value }
        : prev.label_input,
    }));
  };

  const updateOption = (field, value) => {
    setFormState((prev) => ({
      ...prev,
      options: { ...prev.options, [field]: value },
    }));
  };

  const documents = useMemo(
    () =>
      splitLines(documentsText).map((line) => {
        const [path, declaredType] = line.split("|").map((part) => part.trim());
        return { path, declared_type: declaredType || null };
      }),
    [documentsText]
  );

  async function loadSample() {
    setSampleLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/track2/sample`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Unable to load sample.");
      setFormState(data);
      setDocumentsText(data.documents.map((doc) => `${doc.path}|${doc.declared_type || ""}`).join("\n"));
      setReport(null);
      setChatAnswer(null);
    } catch (sampleError) {
      setError(sampleError.message || "Unable to load sample.");
    } finally {
      setSampleLoading(false);
    }
  }

  async function runTrackB() {
    setLoading(true);
    setError("");
    setChatAnswer(null);

    try {
      const response = await fetch(`${API_URL}/track2/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formState, documents }),
      });
      const data = await response.json();
      if (!response.ok || data.detail) {
        throw new Error(typeof data.detail === "string" ? data.detail : "Track B analysis failed.");
      }
      setReport(data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (runError) {
      setReport(null);
      setError(runError.message || "Track B analysis failed.");
    } finally {
      setLoading(false);
    }
  }

  async function askChatbot() {
    setError("");
    setChatAnswer(null);
    try {
      const response = await fetch(`${API_URL}/track2/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: chatQuestion }),
      });
      const data = await response.json();
      if (!response.ok || data.detail) throw new Error("Track B chatbot failed.");
      setChatAnswer(data);
    } catch (chatError) {
      setError(chatError.message || "Track B chatbot failed.");
    }
  }

  const finalOutput = report?.final_output || {};
  const externalResearch = report?.external_research || null;
  const strategic = report?.strategic_agent || {};
  const documentAgent = report?.document_agent || {};
  const checklist = strategic.checklist || [];
  const docs = documentAgent.documents || [];
  const decisionTone = toneForDecision(finalOutput.final_decision || finalOutput.go_no_go);

  return (
    <section className="section track-page track2-legal">
      <style>{`
        .track2-legal {
          --track2-surface: #ffffff;
          --track2-muted-surface: #f4f7fb;
          --track2-line: #d8e1ef;
          --track2-ink: #12233f;
          --track2-muted: #53657f;
          --track2-accent: #1f5eff;
          --track2-success: #087443;
          --track2-warning: #9a5a00;
          --track2-danger: #b42318;
          width: min(1180px, calc(100% - 32px));
          min-height: 100vh;
          margin: 0 auto;
          padding: 26px 0 44px;
        }

        body.dark-mode .track2-legal {
          --track2-surface: rgba(255, 255, 255, 0.045);
          --track2-muted-surface: rgba(255, 255, 255, 0.065);
          --track2-line: rgba(255, 255, 255, 0.12);
          --track2-ink: var(--navy-900);
          --track2-muted: var(--text);
        }

        .track2-legal .track-page-hero {
          align-items: stretch;
        }

        .track2-console-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 18px;
          padding: 14px 16px;
          border: 1px solid var(--track2-line);
          border-radius: 8px;
          background: var(--track2-surface);
        }

        .track2-console-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .track2-console-mark {
          display: grid;
          place-items: center;
          width: 38px;
          height: 38px;
          border-radius: 8px;
          background: #12336c;
          color: #fff;
          font-weight: 900;
          font-family: "Space Grotesk", sans-serif;
        }

        .track2-console-brand strong {
          display: block;
          color: var(--track2-ink);
          font-family: "Space Grotesk", sans-serif;
          font-size: 1rem;
          letter-spacing: 0;
        }

        .track2-console-brand span {
          display: block;
          color: var(--track2-muted);
          font-size: 0.78rem;
        }

        .track2-console-nav {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .track2-console-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 38px;
          padding: 0 13px;
          border: 1px solid var(--track2-line);
          border-radius: 8px;
          color: var(--track2-ink);
          background: var(--track2-muted-surface);
          font-weight: 800;
          font-size: 0.88rem;
        }

        .track2-hero-card,
        .track2-panel,
        .track2-result-card,
        .track2-inline-card,
        .track2-document-card,
        .track2-metric {
          border: 1px solid var(--track2-line);
          background: var(--track2-surface);
          box-shadow: none;
        }

        body.dark-mode .track2-hero-card,
        body.dark-mode .track2-panel,
        body.dark-mode .track2-result-card,
        body.dark-mode .track2-inline-card,
        body.dark-mode .track2-document-card,
        body.dark-mode .track2-metric {
          background: rgba(255, 255, 255, 0.04);
        }

        .track2-hero-card,
        .track2-panel,
        .track2-result-card {
          padding: 22px;
          border-radius: 8px;
        }

        .track2-hero-card h1,
        .track2-panel h2,
        .track2-result-card h2,
        .track2-inline-card h3,
        .track2-document-card strong {
          margin: 0;
          color: var(--navy-900);
          font-family: "Space Grotesk", sans-serif;
        }

        .track2-hero-card h1 {
          max-width: none;
          font-size: 1.9rem;
          line-height: 1.12;
          letter-spacing: 0;
        }

        .track2-hero-card p,
        .track2-panel p,
        .track2-inline-card p,
        .track2-inline-card li,
        .track2-document-card p,
        .track2-json pre,
        .track2-field label,
        .track2-search-card a {
          color: var(--text);
          line-height: 1.65;
        }

        .track2-grid,
        .track2-result-grid,
        .track2-metrics,
        .track2-form-row,
        .track2-documents-grid {
          display: grid;
          gap: 16px;
        }

        .track2-grid,
        .track2-result-grid {
          grid-template-columns: minmax(0, 1.3fr) minmax(320px, 0.7fr);
        }

        .track2-form-row,
        .track2-metrics {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .track2-documents-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .track2-panel {
          margin-top: 16px;
        }

        .track2-panel h2,
        .track2-result-card h2 {
          margin-bottom: 14px;
          font-size: 1.15rem;
          letter-spacing: 0;
        }

        .track2-field {
          display: grid;
          gap: 7px;
        }

        .track2-field label {
          font-size: 0.88rem;
          font-weight: 700;
        }

        .track2-input,
        .track2-textarea,
        .track2-select {
          width: 100%;
          padding: 11px 12px;
          border: 1px solid var(--track2-line);
          border-radius: 8px;
          background: var(--track2-muted-surface);
          color: var(--track2-ink);
          font: inherit;
          outline: none;
        }

        body.dark-mode .track2-input,
        body.dark-mode .track2-textarea,
        body.dark-mode .track2-select {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(255, 255, 255, 0.12);
        }

        .track2-textarea {
          min-height: 92px;
          resize: vertical;
        }

        .track2-actions,
        .track2-badge-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
        }

        .track2-actions {
          margin-top: 20px;
        }

        .track2-badge {
          display: inline-flex;
          align-items: center;
          padding: 7px 11px;
          border-radius: 6px;
          font-size: 0.78rem;
          font-weight: 800;
          text-transform: capitalize;
        }

        .track2-badge.info,
        .track2-metric.info {
          color: var(--track2-accent);
          background: rgba(31, 94, 255, 0.1);
        }

        .track2-badge.good,
        .track2-metric.good {
          color: var(--track2-success);
          background: rgba(8, 116, 67, 0.1);
        }

        .track2-badge.warn,
        .track2-metric.warn {
          color: var(--track2-warning);
          background: rgba(154, 90, 0, 0.1);
        }

        .track2-badge.danger,
        .track2-metric.danger {
          color: var(--track2-danger);
          background: rgba(180, 35, 24, 0.1);
        }

        .track2-metric {
          padding: 14px;
          border-radius: 8px;
        }

        .track2-metric span {
          display: block;
          margin-bottom: 8px;
          font-size: 0.82rem;
          color: var(--text);
        }

        .track2-metric strong {
          display: block;
          color: var(--navy-900);
          font-size: 1.15rem;
          line-height: 1.1;
        }

        .track2-result-card {
          margin-top: 16px;
        }

        .track2-inline-card,
        .track2-document-card {
          padding: 16px;
          border-radius: 8px;
        }

        .track2-inline-card ul {
          margin: 14px 0 0;
          padding-left: 18px;
        }

        .track2-document-card {
          display: grid;
          gap: 12px;
        }

        .track2-search-card {
          display: grid;
          gap: 14px;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid var(--track2-line);
          background: var(--track2-surface);
          box-shadow: none;
        }

        body.dark-mode .track2-search-card {
          background: rgba(255, 255, 255, 0.04);
        }

        .track2-search-card h3 {
          margin: 0;
          color: var(--navy-900);
          font-family: "Space Grotesk", sans-serif;
        }

        .track2-search-card code {
          display: block;
          padding: 10px 12px;
          border-radius: 6px;
          background: var(--track2-muted-surface);
          color: var(--track2-ink);
          white-space: pre-wrap;
          word-break: break-word;
        }

        .track2-search-card a {
          font-weight: 800;
          color: var(--blue-500);
        }

        .track2-document-card p {
          margin: 0;
        }

        .track2-json {
          margin-top: 18px;
          padding: 18px;
          border-radius: 8px;
          border: 1px solid var(--track2-line);
          overflow: auto;
        }

        .track2-json pre {
          margin: 0;
          white-space: pre-wrap;
          word-break: break-word;
          font-family: Consolas, "Courier New", monospace;
          font-size: 0.86rem;
        }

        .track2-message {
          margin-top: 16px;
          padding: 14px 16px;
          border-radius: 8px;
          border: 1px solid rgba(239, 68, 68, 0.22);
          background: rgba(239, 68, 68, 0.08);
          color: #b91c1c;
          font-weight: 700;
        }

        .track2-app-header {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          align-items: flex-start;
          padding-bottom: 18px;
          margin-bottom: 16px;
          border-bottom: 1px solid var(--track2-line);
        }

        .track2-app-title {
          display: grid;
          gap: 8px;
        }

        .track2-app-title p {
          max-width: 78ch;
          margin: 0;
        }

        .track2-app-kicker {
          color: var(--track2-muted);
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0;
          text-transform: uppercase;
        }

        .track2-status-strip {
          display: grid;
          gap: 10px;
          min-width: 260px;
        }

        .track2-run-note {
          margin-top: 14px;
          padding: 12px;
          border: 1px solid var(--track2-line);
          border-radius: 8px;
          background: var(--track2-muted-surface);
          color: var(--track2-muted);
          font-size: 0.9rem;
        }

        .track2-section-header {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: center;
          margin-bottom: 14px;
        }

        .track2-section-header h2 {
          margin: 0;
        }

        .track2-legal .track-icon.large-track-icon {
          width: 44px;
          height: 44px;
          border-radius: 8px;
          font-size: 1rem;
          box-shadow: none;
        }

        @media (max-width: 980px) {
          .track2-grid,
          .track2-result-grid,
          .track2-form-row,
          .track2-metrics,
          .track2-documents-grid {
            grid-template-columns: 1fr;
          }

          .track2-app-header {
            display: grid;
          }

          .track2-status-strip {
            min-width: 0;
          }

          .track2-console-top {
            align-items: stretch;
            flex-direction: column;
          }

          .track2-console-nav {
            justify-content: flex-start;
          }
        }
      `}</style>

      <div className="track2-console-top">
        <div className="track2-console-brand">
          <div className="track2-console-mark">B</div>
          <div>
            <strong>Track B Legal Console</strong>
            <span>Legal setup, document control and public evidence review</span>
          </div>
        </div>
        <div className="track2-console-nav">
          <a className="track2-console-link" href="#services">Back to tracks</a>
          <a className="track2-console-link" href="#home">Home</a>
        </div>
      </div>

      <div className="track-page-hero reveal track2-grid">
        <div className="track2-hero-card">
          <div className="track2-app-header">
            <div className="track2-app-title">
              <span className="track2-app-kicker">{track?.track || "Track B"} · Legal Operations Console</span>
              <h1>Legal and administrative readiness</h1>
              <p>
                Analyze company structure, Startup Act readiness, document compliance, external public
                evidence and filing blockers from one controlled workspace.
              </p>
            </div>
            <div className="track2-status-strip">
              <div className="track-card-top">
                <span className="track-label">{track?.track || "Track B"}</span>
                <span className="track-badge">{track?.badge || "Best for setup"}</span>
              </div>
              <div className="track2-badge-row">
                <Badge>Legal Agent</Badge>
                <Badge>Document Agent</Badge>
              </div>
            </div>
          </div>

          {report ? (
            <div className="track2-metrics">
              <Metric label="Decision" value={finalOutput.final_decision || "N/A"} tone={decisionTone} />
              <Metric label="Legal form" value={strategic.recommended_legal_form || "N/A"} />
              <Metric label="Document score" value={`${documentAgent.overall_completeness_score ?? 0}%`} tone="info" />
            </div>
          ) : (
            <div className="track2-run-note">
              Connect the Track B API on port 5057, review the startup profile and documents, then run the legal analysis.
            </div>
          )}
        </div>

        <div className="track2-panel">
          <div className="track2-section-header">
            <h2>Execution</h2>
            <Badge tone="info">API 5057</Badge>
          </div>
          <p>
            Use the sample package for a fast demo or replace the document paths with your dossier files.
          </p>
          <div className="track2-actions">
            <button className="primary-btn" type="button" onClick={runTrackB} disabled={loading}>
              {loading ? "Running Track B..." : "Run Legal Analysis"}
            </button>
            <button className="secondary-btn" type="button" onClick={loadSample} disabled={sampleLoading || loading}>
              {sampleLoading ? "Loading sample..." : "Load Sample"}
            </button>
          </div>
          {error ? <div className="track2-message">{error}</div> : null}
        </div>
      </div>

      {report ? (
        <section className="track2-result-card reveal delay-1">
          <p className="eyebrow">Track B result</p>
          <h2>{formState.startup_profile.startup_name} legal dashboard</h2>
          <div className="track2-metrics">
            <Metric label="Final decision" value={finalOutput.final_decision || "N/A"} tone={decisionTone} />
            <Metric label="GO / NO-GO" value={finalOutput.go_no_go || "N/A"} tone={toneForDecision(finalOutput.go_no_go)} />
            <Metric label="Legal form" value={strategic.recommended_legal_form || "N/A"} />
            <Metric label="Startup Act score" value={`${strategic.startup_act_eligibility_score ?? 0}%`} tone="good" />
            <Metric label="Document score" value={`${documentAgent.overall_completeness_score ?? 0}%`} tone="info" />
            <Metric label="Risk score" value={`${documentAgent.global_risk_score ?? 0}%`} tone={documentAgent.global_risk_score >= 60 ? "danger" : "warn"} />
          </div>

          <div className="track2-result-grid" style={{ marginTop: 20 }}>
            <div className="track2-inline-card">
              <h3>Strategic guidance</h3>
              <ul>
                {(strategic.rationale || []).slice(0, 5).map((item, index) => (
                  <li key={`${item}-${index}`}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="track2-inline-card">
              <h3>Missing documents</h3>
              {documentAgent.missing_documents?.length ? (
                <ul>
                  {documentAgent.missing_documents.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>No missing document returned.</p>
              )}
            </div>
          </div>
        </section>
      ) : null}

      <section className="track2-panel reveal delay-2">
        <h2>Startup profile</h2>
        <div className="track2-form-row">
          <div className="track2-field">
            <label>Startup name</label>
            <input
              className="track2-input"
              value={formState.startup_profile.startup_name}
              onChange={(event) => updateProfile("startup_name", event.target.value)}
            />
          </div>
          <div className="track2-field">
            <label>Sector</label>
            <input
              className="track2-input"
              value={formState.startup_profile.sector}
              onChange={(event) => updateProfile("sector", event.target.value)}
            />
          </div>
          <div className="track2-field">
            <label>Funding need TND</label>
            <input
              className="track2-input"
              type="number"
              value={formState.startup_profile.funding_need_tnd}
              onChange={(event) => updateProfile("funding_need_tnd", Number(event.target.value))}
            />
          </div>
        </div>

        <div className="track2-field" style={{ marginTop: 16 }}>
          <label>Activity description</label>
          <textarea
            className="track2-textarea"
            value={formState.startup_profile.activity_description}
            onChange={(event) => updateProfile("activity_description", event.target.value)}
          />
        </div>

        <div className="track2-form-row" style={{ marginTop: 16 }}>
          <div className="track2-field">
            <label>Founders count</label>
            <input
              className="track2-input"
              type="number"
              min="1"
              value={formState.startup_profile.founders_count}
              onChange={(event) => updateProfile("founders_count", Number(event.target.value))}
            />
          </div>
          <div className="track2-field">
            <label>Wants investors</label>
            <select
              className="track2-select"
              value={String(formState.startup_profile.wants_investors)}
              onChange={(event) => updateProfile("wants_investors", event.target.value === "true")}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          <div className="track2-field">
            <label>Foreign investors</label>
            <select
              className="track2-select"
              value={String(formState.startup_profile.has_foreign_investors)}
              onChange={(event) => updateProfile("has_foreign_investors", event.target.value === "true")}
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>
        </div>
      </section>

      <section className="track2-panel reveal delay-3">
        <h2>Documents</h2>
        <p>One document per line. Format: path|declared_type</p>
        <textarea
          className="track2-textarea"
          style={{ minHeight: 170 }}
          value={documentsText}
          onChange={(event) => setDocumentsText(event.target.value)}
        />
        <div className="track2-form-row" style={{ marginTop: 16 }}>
          <div className="track2-field">
            <label>Strict mode</label>
            <select
              className="track2-select"
              value={String(formState.options.strict_mode)}
              onChange={(event) => updateOption("strict_mode", event.target.value === "true")}
            >
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </select>
          </div>
          <div className="track2-field">
            <label>JSON report</label>
            <select
              className="track2-select"
              value={String(formState.options.generate_json_report)}
              onChange={(event) => updateOption("generate_json_report", event.target.value === "true")}
            >
              <option value="true">Generate</option>
              <option value="false">Skip</option>
            </select>
          </div>
          <div className="track2-field">
            <label>PDF report</label>
            <select
              className="track2-select"
              value={String(formState.options.generate_pdf_report)}
              onChange={(event) => updateOption("generate_pdf_report", event.target.value === "true")}
            >
              <option value="false">Skip</option>
              <option value="true">Generate</option>
            </select>
          </div>
        </div>
      </section>

      {report ? (
        <>
          <section className="track2-panel">
            <h2>Administrative checklist</h2>
            <div className="track2-documents-grid">
              {checklist.slice(0, 8).map((step) => (
                <article className="track2-document-card" key={step.step_no}>
                  <div className="track2-badge-row">
                    <Badge>{`Step ${step.step_no}`}</Badge>
                    <Badge tone="info">{step.estimated_delay_days} days</Badge>
                  </div>
                  <strong>{step.title}</strong>
                  <p>{step.institution}</p>
                  <p>{(step.deliverables || []).join(", ")}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="track2-panel">
            <h2>Document diagnostics</h2>
            <div className="track2-documents-grid">
              {docs.map((document) => (
                <article className="track2-document-card" key={document.file_name}>
                  <div className="track2-badge-row">
                    <Badge tone={document.completeness_score >= 80 ? "good" : "warn"}>
                      {document.completeness_score}% complete
                    </Badge>
                    <Badge tone={document.quality === "good" ? "good" : "warn"}>{document.quality}</Badge>
                  </div>
                  <strong>{document.file_name}</strong>
                  <p>{labelize(document.document_type)}</p>
                  <p>{document.suggested_fix || "No specific fix returned."}</p>
                  {document.issues?.length ? (
                    <ul>
                      {document.issues.slice(0, 3).map((issue) => (
                        <li key={issue}>{issue}</li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              ))}
            </div>
          </section>

          <section className="track2-panel">
            <h2>External research</h2>
            {externalResearch ? (
              <>
                <p>{externalResearch.automation_note}</p>
                <div className="track2-documents-grid" style={{ marginTop: 16 }}>
                  {externalResearch.searches.map((search) => (
                    <article className="track2-search-card" key={search.platform}>
                      <div className="track2-badge-row">
                        <Badge>{search.platform}</Badge>
                        <Badge tone="info">Public search</Badge>
                      </div>
                      <h3>{search.purpose}</h3>
                      <code>{search.query}</code>
                      <a href={search.url} target="_blank" rel="noreferrer">
                        Open {search.platform} search
                      </a>
                      <ul>
                        {search.signals_to_check.map((signal) => (
                          <li key={signal}>{signal}</li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
                <div className="track2-inline-card" style={{ marginTop: 16 }}>
                  <h3>Research recommendations</h3>
                  <ul>
                    {externalResearch.recommendations.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <p>Run Track B to generate Google, LinkedIn and Facebook research checks.</p>
            )}
          </section>

          <section className="track2-panel">
            <h2>Track B assistant</h2>
            <div className="track2-field">
              <label>Question</label>
              <input
                className="track2-input"
                value={chatQuestion}
                onChange={(event) => setChatQuestion(event.target.value)}
              />
            </div>
            <div className="track2-actions">
              <button className="secondary-btn" type="button" onClick={askChatbot}>
                Ask Assistant
              </button>
            </div>
            {chatAnswer ? (
              <div className="track2-inline-card" style={{ marginTop: 16 }}>
                <h3>Answer</h3>
                <p>{chatAnswer.answer}</p>
                <div className="track2-badge-row">
                  <Badge>{chatAnswer.confidence}</Badge>
                  {chatAnswer.context_available ? <Badge tone="good">Context loaded</Badge> : <Badge tone="warn">No context</Badge>}
                </div>
              </div>
            ) : null}
          </section>

          <details className="track2-json">
            <summary>View raw Track B JSON</summary>
            <pre>{prettyJson(report)}</pre>
          </details>
        </>
      ) : null}
    </section>
  );
}
