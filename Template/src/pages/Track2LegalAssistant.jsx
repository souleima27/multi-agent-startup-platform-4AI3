import { useMemo, useState } from "react";

const API_URL = "http://127.0.0.1:5057";

const INITIAL_FORM = {
  startup_profile: {
    startup_name: "Demo Startup Tunisia",
    sector: "LegalTech SaaS",
    activity_description: "Automates startup legal and administrative case preparation.",
    founders_count: 2,
    funding_need_tnd: 350000,
    wants_investors: true,
    needs_limited_liability: true,
    has_foreign_investors: false,
    innovative: true,
    scalable: true,
    uses_technology: true,
    associates: [
      { name: "Founder with legal operations and AI engineering experience", role: "Founder", equity_pct: 100, active: true },
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
    startup_name: "Demo Startup Tunisia",
    transcript:
      "Problem: legal setup is complex and slow. Solution: guided legal workflow with document diagnostics. Proof: OCR and cross-document validation pipeline.",
    slide_text: "Startup legal readiness, document review, compliance scoring, public evidence research.",
    sector: "LegalTech SaaS",
    traction_signals: ["pilot users", "advisor feedback"],
    team_signals: ["legal operations", "AI engineering"],
    pitch_notes: ["clear legal blocker", "strong compliance use case"],
  },
  options: {
    strict_mode: true,
    generate_json_report: true,
    generate_pdf_report: false,
    report_prefix: "track_b_template_run",
  },
};

const ROADMAP_CARDS = [
  {
    number: "01",
    title: "Legal structure",
    text: "Recommended form, investor readiness, liability fit, and founding structure.",
  },
  {
    number: "02",
    title: "Compliance evidence",
    text: "Required documents, missing pieces, quality checks, and correction priorities.",
  },
  {
    number: "03",
    title: "Decision package",
    text: "Scores, risk indicators, next steps, and report-ready recommendations.",
  },
  {
    number: "04",
    title: "Ecosystem readiness",
    text: "Investor fit, mentor timing, event relevance, and relationship follow-up priorities.",
  },
];

function splitLines(value) {
  return String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function prettyJson(value) {
  return JSON.stringify(value, null, 2);
}

function toneForDecision(value) {
  const normalized = String(value || "").toLowerCase();
  if (["pass", "go", "ready", "good"].includes(normalized)) return "good";
  if (["fail", "no_go", "blocked"].includes(normalized)) return "danger";
  return "warn";
}

function Field({ label, children }) {
  return (
    <label className="track2-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function Pill({ children, active = false }) {
  return <span className={`track2-pill${active ? " is-active" : ""}`}>{children}</span>;
}

function Metric({ label, value, tone = "info" }) {
  return (
    <div className={`track2-metric ${tone}`}>
      <span>{label}</span>
      <strong>{value ?? "N/A"}</strong>
    </div>
  );
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

  const updateProfile = (field, value) => {
    setFormState((prev) => ({
      ...prev,
      startup_profile: { ...prev.startup_profile, [field]: value },
      label_input:
        field === "startup_name" || field === "sector"
          ? { ...prev.label_input, [field]: value }
          : prev.label_input,
    }));
  };

  const updateLabelInput = (field, value) => {
    setFormState((prev) => ({
      ...prev,
      label_input: { ...prev.label_input, [field]: value },
    }));
  };

  const updateSignalList = (field, value) => {
    updateLabelInput(
      field,
      value
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean)
    );
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
    } catch (sampleError) {
      setError(sampleError.message || "Unable to load sample.");
    } finally {
      setSampleLoading(false);
    }
  }

  async function runTrackB() {
    setLoading(true);
    setError("");

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

  const finalOutput = report?.final_output || {};
  const externalResearch = report?.external_research || null;
  const strategic = report?.strategic_agent || {};
  const documentAgent = report?.document_agent || {};
  const decisionTone = toneForDecision(finalOutput.final_decision || finalOutput.go_no_go);
  const missingDocuments = documentAgent.missing_documents || [];
  const documentScore = Number(documentAgent.overall_completeness_score ?? 0);
  const riskScore = Number(documentAgent.global_risk_score ?? 0);
  const isStrictBlocked =
    finalOutput.strict_mode && (finalOutput.strict_fail || missingDocuments.length > 0 || finalOutput.go_no_go === "NO_GO");
  const decisionLabel =
    finalOutput.final_decision === "PASS"
      ? "Ready to file"
      : isStrictBlocked
        ? "Blocked by legal file"
        : finalOutput.final_decision === "WARNING"
          ? "Needs review"
          : "Blocked";
  const documentStatus = documentScore >= 80 ? "Complete" : documentScore > 0 ? "Incomplete" : "Not reviewed";
  const riskLabel = riskScore >= 60 ? "High" : riskScore >= 35 ? "Medium" : "Low";
  const primaryBlocker = missingDocuments.length
    ? `${missingDocuments.length} required document${missingDocuments.length > 1 ? "s" : ""} missing`
    : finalOutput.user_message || "No blocking issue returned.";

  return (
    <section className="section track-page track2-legal">
      <style>{`
        .track2-legal {
          padding-top: 18px;
        }

        .track2-hero {
          display: grid;
          grid-template-columns: minmax(0, 1.02fr) minmax(340px, 0.88fr);
          gap: 24px;
          align-items: stretch;
          min-height: 520px;
        }

        .track2-hero-copy {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 20px 0 34px;
        }

        .track2-kicker-row,
        .track2-tabs,
        .track2-chip-row,
        .track2-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 10px;
        }

        .track2-kicker {
          display: inline-flex;
          align-items: center;
          padding: 7px 11px;
          border-radius: 999px;
          border: 1px solid rgba(47, 107, 255, 0.22);
          background: rgba(47, 107, 255, 0.08);
          color: var(--blue-500);
          font-size: 0.73rem;
          font-weight: 800;
        }

        .track2-hero h1 {
          max-width: 12ch;
          margin: 18px 0 16px;
          color: var(--navy-900);
          font-family: "Space Grotesk", sans-serif;
          font-size: clamp(3rem, 7vw, 5.6rem);
          line-height: 0.9;
          letter-spacing: 0;
        }

        .track2-hero-copy p {
          max-width: 64ch;
          margin: 0;
          color: var(--text);
          line-height: 1.7;
        }

        .track2-actions {
          margin-top: 28px;
        }

        .track2-roadmap {
          display: grid;
          gap: 18px;
          padding: 14px;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.38);
          border: 1px solid rgba(255, 255, 255, 0.58);
          box-shadow: var(--shadow-md);
        }

        body.dark-mode .track2-roadmap {
          background: rgba(255, 255, 255, 0.035);
        }

        .track2-roadmap-card,
        .track2-form-card,
        .track2-result-card {
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.92);
          box-shadow: var(--shadow-md);
        }

        body.dark-mode .track2-roadmap-card,
        body.dark-mode .track2-form-card,
        body.dark-mode .track2-result-card {
          background: rgba(255, 255, 255, 0.045);
        }

        .track2-roadmap-card {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 16px;
          align-items: start;
          padding: 22px;
          border-radius: 20px;
        }

        .track2-roadmap-card.is-active {
          border-color: rgba(47, 107, 255, 0.55);
          box-shadow: 0 18px 46px rgba(47, 107, 255, 0.14);
        }

        .track2-step-number {
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          border-radius: 14px;
          color: #fff;
          background: linear-gradient(135deg, #102a56, #2f6bff);
          font-family: "Space Grotesk", sans-serif;
          font-weight: 800;
        }

        .track2-roadmap-card h3,
        .track2-form-card h2,
        .track2-result-card h2,
        .track2-result-card h3 {
          margin: 0;
          color: var(--navy-900);
          font-family: "Space Grotesk", sans-serif;
          letter-spacing: 0;
        }

        .track2-roadmap-card p,
        .track2-form-card p,
        .track2-result-card p,
        .track2-result-card li {
          margin: 8px 0 0;
          color: var(--text);
          line-height: 1.65;
        }

        .track2-tabs {
          margin: 26px 0 18px;
        }

        .track2-pill {
          display: inline-flex;
          align-items: center;
          min-height: 34px;
          padding: 0 15px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.88);
          color: var(--navy-800);
          font-size: 0.82rem;
          font-weight: 800;
        }

        .track2-pill.is-active {
          color: #fff;
          border-color: transparent;
          background: linear-gradient(135deg, #102a56, #2f6bff);
        }

        .track2-workspace {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(330px, 0.95fr);
          gap: 18px;
          align-items: start;
        }

        .track2-form-card,
        .track2-result-card {
          padding: 24px;
          border-radius: 18px;
        }

        .track2-form-card.is-wide,
        .track2-result-card.is-wide {
          grid-column: 1 / -1;
        }

        .track2-card-label {
          display: block;
          margin-bottom: 8px;
          color: #7a8cab;
          font-size: 0.72rem;
          font-weight: 900;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .track2-form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          margin-top: 18px;
        }

        .track2-form-grid.single {
          grid-template-columns: 1fr;
        }

        .track2-field {
          display: grid;
          gap: 7px;
          color: var(--text);
          font-size: 0.82rem;
          font-weight: 800;
        }

        .track2-input,
        .track2-textarea {
          width: 100%;
          min-height: 42px;
          padding: 11px 12px;
          border: 1px solid rgba(47, 107, 255, 0.32);
          border-radius: 9px;
          background: rgba(247, 249, 255, 0.92);
          color: var(--navy-900);
          font: inherit;
          outline: none;
        }

        body.dark-mode .track2-input,
        body.dark-mode .track2-textarea {
          background: rgba(255, 255, 255, 0.045);
          border-color: rgba(255, 255, 255, 0.14);
        }

        .track2-textarea {
          min-height: 96px;
          resize: vertical;
        }

        .track2-chip-row {
          margin-top: 14px;
        }

        .track2-mini-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 10px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: rgba(18, 51, 100, 0.04);
          color: var(--navy-800);
          font-size: 0.78rem;
          font-weight: 800;
        }

        body.dark-mode .track2-mini-chip {
          background: rgba(255, 255, 255, 0.045);
        }

        .track2-upload-box {
          display: grid;
          place-items: center;
          min-height: 150px;
          margin-top: 18px;
          padding: 20px;
          border: 2px dashed rgba(47, 107, 255, 0.42);
          border-radius: 16px;
          background: rgba(247, 249, 255, 0.72);
          color: var(--text);
          text-align: center;
        }

        .track2-upload-box strong {
          display: block;
          margin-bottom: 8px;
          color: var(--blue-500);
        }

        .track2-upload-box span {
          display: block;
          font-size: 0.78rem;
        }

        .track2-documents-text {
          min-height: 90px;
          margin-top: 12px;
        }

        .track2-message {
          margin: 14px 0 0;
          padding: 14px 16px;
          border-radius: 14px;
          border: 1px solid rgba(239, 68, 68, 0.22);
          background: rgba(239, 68, 68, 0.08);
          color: #b91c1c;
          font-weight: 800;
        }

        .track2-result-card {
          margin-top: 18px;
        }

        .track2-metrics,
        .track2-results-grid,
        .track2-search-grid {
          display: grid;
          gap: 14px;
        }

        .track2-metrics {
          grid-template-columns: repeat(6, minmax(0, 1fr));
          margin-top: 18px;
        }

        .track2-metric {
          padding: 15px;
          border-radius: 14px;
          border: 1px solid var(--border);
          background: rgba(247, 249, 255, 0.84);
        }

        body.dark-mode .track2-metric {
          background: rgba(255, 255, 255, 0.045);
        }

        .track2-metric span {
          display: block;
          margin-bottom: 8px;
          color: var(--text);
          font-size: 0.76rem;
          font-weight: 800;
        }

        .track2-metric strong {
          color: var(--navy-900);
          font-family: "Space Grotesk", sans-serif;
          font-size: 1.18rem;
        }

        .track2-metric.good strong {
          color: #15803d;
        }

        .track2-metric.warn strong {
          color: #b45309;
        }

        .track2-metric.danger strong {
          color: #b91c1c;
        }

        .track2-results-grid,
        .track2-search-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          margin-top: 18px;
        }

        .track2-decision-banner {
          margin-top: 18px;
          padding: 18px;
          border-radius: 16px;
          border: 1px solid rgba(245, 158, 11, 0.28);
          background: rgba(245, 158, 11, 0.1);
        }

        .track2-decision-banner.good {
          border-color: rgba(34, 197, 94, 0.28);
          background: rgba(34, 197, 94, 0.1);
        }

        .track2-decision-banner.danger {
          border-color: rgba(239, 68, 68, 0.28);
          background: rgba(239, 68, 68, 0.09);
        }

        .track2-decision-banner strong {
          display: block;
          color: var(--navy-900);
          font-family: "Space Grotesk", sans-serif;
          font-size: 1.1rem;
        }

        .track2-decision-banner p {
          margin: 8px 0 0;
          color: var(--text);
          line-height: 1.65;
        }

        .track2-result-panel {
          padding: 18px;
          border-radius: 14px;
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.72);
        }

        body.dark-mode .track2-result-panel {
          background: rgba(255, 255, 255, 0.035);
        }

        .track2-result-panel ul {
          margin: 12px 0 0;
          padding-left: 18px;
        }

        .track2-result-panel code {
          display: block;
          margin-top: 10px;
          padding: 10px;
          border-radius: 10px;
          background: rgba(18, 51, 100, 0.06);
          color: var(--navy-900);
          white-space: pre-wrap;
          word-break: break-word;
        }

        .track2-json {
          margin-top: 18px;
          padding: 18px;
          border-radius: 14px;
          border: 1px solid var(--border);
          overflow: auto;
        }

        .track2-json pre {
          margin: 0;
          color: var(--text);
          white-space: pre-wrap;
          word-break: break-word;
          font-family: Consolas, "Courier New", monospace;
          font-size: 0.86rem;
        }

        @media (max-width: 1100px) {
          .track2-hero,
          .track2-workspace,
          .track2-results-grid,
          .track2-search-grid {
            grid-template-columns: 1fr;
          }

          .track2-metrics {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 700px) {
          .track2-form-grid,
          .track2-metrics {
            grid-template-columns: 1fr;
          }

          .track2-hero h1 {
            font-size: clamp(2.5rem, 13vw, 4rem);
          }
        }
      `}</style>

      <div className="track2-hero reveal">
        <div className="track2-hero-copy">
          <div className="track2-kicker-row">
            <span className="track2-kicker">{track?.track || "Track B"}</span>
            <span className="track2-kicker">Legal & Administrative PRO</span>
          </div>
          <h1>Legal readiness dashboard for Tunisian startups.</h1>
          <p>
            Prepare a founder-ready legal file with structure guidance, Startup Act readiness,
            document review, and team-sourced evidence that is clear enough for a committee or advisor.
          </p>
          <div className="track2-actions">
            <button className="primary-btn" type="button" onClick={runTrackB} disabled={loading}>
              {loading ? "Reviewing..." : "Run legal review"}
            </button>
            <a href="#services" className="secondary-btn">
              Back to Tracks
            </a>
          </div>
          {error ? <div className="track2-message">{error}</div> : null}
        </div>

        <div className="track2-roadmap">
          {ROADMAP_CARDS.map((card, index) => (
            <article className={`track2-roadmap-card${index === 0 ? " is-active" : ""}`} key={card.number}>
              <span className="track2-step-number">{card.number}</span>
              <div>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="track2-tabs">
        <Pill active>Case</Pill>
        <Pill>Decision</Pill>
        <Pill>Documents</Pill>
        <Pill>Roadmap</Pill>
        <Pill>Opportunities</Pill>
      </div>

      <div className="track2-workspace">
        <section className="track2-form-card">
          <span className="track2-card-label">Startup profile</span>
          <h2>Company information</h2>

          <div className="track2-form-grid">
            <Field label="Startup name">
              <input
                className="track2-input"
                value={formState.startup_profile.startup_name}
                onChange={(event) => updateProfile("startup_name", event.target.value)}
              />
            </Field>
            <Field label="Sector">
              <input
                className="track2-input"
                value={formState.startup_profile.sector}
                onChange={(event) => updateProfile("sector", event.target.value)}
              />
            </Field>
            <Field label="Founders count">
              <input
                className="track2-input"
                type="number"
                min="1"
                value={formState.startup_profile.founders_count}
                onChange={(event) => updateProfile("founders_count", Number(event.target.value))}
              />
            </Field>
            <Field label="Funding need TND">
              <input
                className="track2-input"
                type="number"
                value={formState.startup_profile.funding_need_tnd}
                onChange={(event) => updateProfile("funding_need_tnd", Number(event.target.value))}
              />
            </Field>
          </div>

          <div className="track2-form-grid single">
            <Field label="Activity description">
              <textarea
                className="track2-textarea"
                value={formState.startup_profile.activity_description}
                onChange={(event) => updateProfile("activity_description", event.target.value)}
              />
            </Field>
          </div>

          <div className="track2-chip-row">
            <span className="track2-mini-chip">Investors</span>
            <span className="track2-mini-chip">Foreign investors</span>
            <span className="track2-mini-chip">Innovative</span>
            <span className="track2-mini-chip">Scalable</span>
            <span className="track2-mini-chip">Technology</span>
          </div>
        </section>

        <section className="track2-form-card">
          <span className="track2-card-label">Pitching package</span>
          <h2>Pitch and legal file</h2>

          <div className="track2-form-grid single">
            <Field label="Pitch notes">
              <textarea
                className="track2-textarea"
                value={formState.label_input.transcript}
                onChange={(event) => updateLabelInput("transcript", event.target.value)}
              />
            </Field>
          </div>

          <div className="track2-form-grid">
            <Field label="Traction signals">
              <textarea
                className="track2-textarea"
                value={formState.label_input.traction_signals.join("\n")}
                onChange={(event) => updateSignalList("traction_signals", event.target.value)}
              />
            </Field>
            <Field label="Team signals">
              <textarea
                className="track2-textarea"
                value={formState.label_input.team_signals.join("\n")}
                onChange={(event) => updateSignalList("team_signals", event.target.value)}
              />
            </Field>
          </div>

          <div className="track2-upload-box">
            <div>
              <strong>Upload legal documents</strong>
              <span>Choose files from your computer</span>
              <span>PDF, Word, PowerPoint, images, scans</span>
            </div>
          </div>

          <textarea
            className="track2-textarea track2-documents-text"
            value={documentsText}
            onChange={(event) => setDocumentsText(event.target.value)}
          />

          <div className="track2-actions">
            <button className="secondary-btn" type="button" onClick={loadSample} disabled={sampleLoading || loading}>
              {sampleLoading ? "Loading..." : "Load sample"}
            </button>
            <button className="primary-btn" type="button" onClick={runTrackB} disabled={loading}>
              {loading ? "Reviewing..." : "Review legal file"}
            </button>
          </div>
        </section>

        <section className="track2-form-card is-wide">
          <span className="track2-card-label">Accelerator readiness</span>
          <h2>Network and funding context</h2>
          <div className="track2-form-grid">
            <Field label="Founder profile">
              <textarea
                className="track2-textarea"
                value={formState.startup_profile.associates?.[0]?.name || ""}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    startup_profile: {
                      ...prev.startup_profile,
                      associates: [{ name: event.target.value, role: "Founder", equity_pct: 100, active: true }],
                    },
                  }))
                }
              />
            </Field>
            <Field label="Stage">
              <input className="track2-input" value="Pre-seed / preparing launch" readOnly />
            </Field>
          </div>
          <div className="track2-form-grid single">
            <Field label="Networking goal">
              <textarea
                className="track2-textarea"
                value="Find mentors, early investors, and events that improve legal and funding readiness."
                readOnly
              />
            </Field>
          </div>
          <div className="track2-chip-row">
            <span className="track2-mini-chip">Google discovery</span>
            <span className="track2-mini-chip">LinkedIn relationship</span>
            <span className="track2-mini-chip">Facebook ecosystem signals</span>
            <span className="track2-mini-chip">Event database</span>
            <span className="track2-mini-chip">Relationship history</span>
          </div>
        </section>
      </div>

      {report ? (
        <section className="track2-result-card is-wide">
          <span className="track2-card-label">Decision package</span>
          <h2>{formState.startup_profile.startup_name} legal dashboard</h2>
          <div className="track2-metrics">
            <Metric label="Decision" value={decisionLabel} tone={decisionTone} />
            <Metric label="Legal form" value={strategic.recommended_legal_form || "N/A"} />
            <Metric label="Startup Act" value={`${strategic.startup_act_eligibility_score ?? 0}%`} tone="good" />
            <Metric label="Documents" value={documentStatus} tone={documentScore >= 80 ? "good" : "warn"} />
            <Metric label="Risk level" value={riskLabel} tone={riskScore >= 60 ? "danger" : "warn"} />
            <Metric label="Main blocker" value={primaryBlocker} tone={missingDocuments.length ? "danger" : "good"} />
          </div>

          <div className={`track2-decision-banner ${decisionTone}`}>
            <strong>{decisionLabel}</strong>
            <p>
              The Startup Act and label scores describe eligibility potential. The final decision is blocked only
              because the legal file is not complete enough for strict review.
            </p>
          </div>

          <div className="track2-results-grid">
            <div className="track2-result-panel">
              <h3>Strategic guidance</h3>
              <ul>
                {(strategic.rationale || []).slice(0, 5).map((item, index) => (
                  <li key={`${item}-${index}`}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="track2-result-panel">
              <h3>Required documents to complete</h3>
              {missingDocuments.length ? (
                <ul>
                  {missingDocuments.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>No mandatory missing document was returned by the document agent.</p>
              )}
            </div>
          </div>

          {externalResearch ? (
            <div className="track2-search-grid">
              {externalResearch.searches.map((search) => (
                <div className="track2-result-panel" key={search.platform}>
                  <h3>{search.platform}</h3>
                  <p>{search.purpose}</p>
                  <code>{search.query}</code>
                  <p>
                    <a href={search.url} target="_blank" rel="noreferrer">
                      Open search
                    </a>
                  </p>
                </div>
              ))}
            </div>
          ) : null}

          <details className="track2-json">
            <summary>View raw Track B JSON</summary>
            <pre>{prettyJson(report)}</pre>
          </details>
        </section>
      ) : null}
    </section>
  );
}
