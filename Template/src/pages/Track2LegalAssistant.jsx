import { useMemo, useState } from "react";

const API_URL = "http://127.0.0.1:5057";

const INITIAL_FORM = {
  startup_profile: {
    startup_name: "",
    sector: "",
    activity_description: "",
    founders_count: "",
    funding_need_tnd: "",
    wants_investors: false,
    needs_limited_liability: true,
    has_foreign_investors: false,
    innovative: false,
    scalable: false,
    uses_technology: false,
    associates: [{ name: "", role: "Founder", equity_pct: 100, active: true }],
  },
  documents: [],
  label_input: {
    startup_name: "",
    transcript: "",
    slide_text: "",
    sector: "",
    traction_signals: [],
    team_signals: [],
    pitch_notes: [],
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
    text: "Recommended form, liability fit, investor readiness, and founder setup.",
  },
  {
    number: "02",
    title: "Document evidence",
    text: "Mandatory files, missing documents, upload quality, and strict-mode blockers.",
  },
  {
    number: "03",
    title: "Decision package",
    text: "Final decision, legal score, risk level, and committee-ready summary.",
  },
  {
    number: "04",
    title: "Market access",
    text: "Google, LinkedIn, and Facebook research links for ecosystem follow-up.",
  },
];

const RESULT_TABS = [
  { id: "decision", label: "Decision" },
  { id: "documents", label: "Documents" },
  { id: "roadmap", label: "Roadmap" },
  { id: "opportunities", label: "Opportunities" },
];

const PROFILE_FLAGS = [
  ["wants_investors", "Investors"],
  ["has_foreign_investors", "Foreign investors"],
  ["innovative", "Innovative"],
  ["scalable", "Scalable"],
  ["uses_technology", "Technology"],
];

function splitLines(value) {
  return String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toneForDecision(value) {
  const normalized = String(value || "").toLowerCase();
  if (["pass", "go", "ready", "good"].includes(normalized)) return "good";
  if (["fail", "no_go", "blocked"].includes(normalized)) return "danger";
  return "warn";
}

function toneForScore(score) {
  if (score >= 75) return "good";
  if (score >= 45) return "warn";
  return "danger";
}

function readSearchHost(url) {
  if (!url) return "Search";
  if (url.includes("linkedin")) return "LinkedIn";
  if (url.includes("facebook")) return "Facebook";
  return "Google";
}

function Field({ label, children }) {
  return (
    <label className="track2-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function Metric({ label, value, tone = "info" }) {
  return (
    <div className={`track2-metric ${tone}`}>
      <span>{label}</span>
      <strong>{value ?? "N/A"}</strong>
    </div>
  );
}

function EmptyState({ title, text }) {
  return (
    <div className="track2-empty">
      <strong>{title}</strong>
      <p>{text}</p>
    </div>
  );
}

export function Track2LegalAssistant({ track }) {
  const [formState, setFormState] = useState(INITIAL_FORM);
  const [documentsText, setDocumentsText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sampleLoading, setSampleLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [error, setError] = useState("");
  const [report, setReport] = useState(null);
  const [activeTab, setActiveTab] = useState("case");

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
    updateLabelInput(field, splitLines(value));
  };

  const toggleProfileFlag = (field) => {
    setFormState((prev) => ({
      ...prev,
      startup_profile: {
        ...prev.startup_profile,
        [field]: !prev.startup_profile[field],
      },
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

  const completionItems = [
    Boolean(formState.startup_profile.startup_name.trim()),
    Boolean(formState.startup_profile.sector.trim()),
    Boolean(formState.startup_profile.activity_description.trim()),
    Boolean(formState.label_input.transcript.trim()),
    Boolean(uploadedDocuments.length),
  ];
  const completionScore = Math.round((completionItems.filter(Boolean).length / completionItems.length) * 100);

  async function readJsonResponse(response) {
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) return response.json();
    return { detail: await response.text() };
  }

  async function loadSample() {
    setSampleLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/track2/sample`);
      const data = await readJsonResponse(response);
      if (!response.ok) throw new Error(data.detail || "Unable to load sample.");
      setFormState(data);
      setDocumentsText(data.documents.map((doc) => `${doc.path}|${doc.declared_type || ""}`).join("\n"));
      setUploadedDocuments(data.documents.map((doc) => ({ file_name: doc.path.split(/[\\/]/).pop(), path: doc.path })));
      setReport(null);
      setActiveTab("case");
    } catch (sampleError) {
      setError(toFriendlyNetworkError(sampleError, "Unable to load sample."));
    } finally {
      setSampleLoading(false);
    }
  }

  function toFriendlyNetworkError(error, fallback) {
    const message = error?.message || "";
    if (message === "Failed to fetch" || error instanceof TypeError) {
      return "Track B API is not running. Start it with: python -m uvicorn track2_api:app --host 127.0.0.1 --port 5057 --reload";
    }
    return message || fallback;
  }

  async function uploadLegalDocuments(event) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    setUploadLoading(true);
    setError("");

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      const response = await fetch(`${API_URL}/track2/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await readJsonResponse(response);
      if (!response.ok || data.detail) {
        throw new Error(typeof data.detail === "string" ? data.detail : "Document upload failed.");
      }

      const uploaded = data.documents || [];
      setUploadedDocuments((prev) => [...prev, ...uploaded]);
      setDocumentsText((prev) => {
        const nextLines = uploaded.map((doc) => `${doc.path}|${doc.declared_type || ""}`);
        return [prev, ...nextLines].filter(Boolean).join("\n");
      });
    } catch (uploadError) {
      setError(toFriendlyNetworkError(uploadError, "Document upload failed."));
    } finally {
      setUploadLoading(false);
      event.target.value = "";
    }
  }

  async function runTrackB() {
    if (!formState.startup_profile.startup_name.trim() || !formState.startup_profile.sector.trim()) {
      setError("Complete at least the startup name and sector before running the legal review.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/track2/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formState,
          startup_profile: {
            ...formState.startup_profile,
            founders_count: Number(formState.startup_profile.founders_count) || 1,
            funding_need_tnd: Number(formState.startup_profile.funding_need_tnd) || 0,
          },
          documents,
        }),
      });
      const data = await readJsonResponse(response);
      if (!response.ok || data.detail) {
        throw new Error(typeof data.detail === "string" ? data.detail : "Track B analysis failed.");
      }
      setReport(data);
      setActiveTab("decision");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (runError) {
      setReport(null);
      setError(toFriendlyNetworkError(runError, "Track B analysis failed."));
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
  const startupActScore = Number(strategic.startup_act_eligibility_score ?? 0);
  const labelScore = Number(report?.label_agent?.overall_score ?? finalOutput.label_score ?? 0);
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
  const searches = externalResearch?.searches || [];
  const executedSearchCount = searches.filter((search) => search.agent_search?.status === "completed").length;
  const discoveredResultCount = searches.reduce((total, search) => total + (search.agent_search?.results?.length || 0), 0);
  const roadmapItems = [
    {
      title: "Complete the legal evidence pack",
      text: missingDocuments.length
        ? `Add ${missingDocuments.slice(0, 3).join(", ")}${missingDocuments.length > 3 ? "..." : ""}.`
        : "Keep the uploaded documents versioned and ready for advisor review.",
      status: missingDocuments.length ? "Priority" : "Ready",
    },
    {
      title: "Validate the recommended structure",
      text: `Review the ${strategic.recommended_legal_form || "recommended legal form"} choice against founder liability, investment plans, and tax constraints.`,
      status: "Legal",
    },
    {
      title: "Prepare the committee narrative",
      text: "Use the decision summary, traction evidence, and Startup Act score to prepare the next advisor meeting.",
      status: "Pitch",
    },
    {
      title: "Run ecosystem outreach",
      text: "Open the generated Google, LinkedIn, and Facebook searches, then capture the most relevant mentors, events, and investors.",
      status: "Growth",
    },
  ];

  const resultTabs = [{ id: "case", label: "Case" }, ...RESULT_TABS];

  return (
    <section className="section track-page track2-legal">
      <style>{`
        .track2-legal {
          padding-top: 18px;
        }

        .track2-shell {
          display: grid;
          gap: 22px;
        }

        .track2-hero {
          display: grid;
          grid-template-columns: minmax(0, 1.02fr) minmax(340px, 0.88fr);
          gap: 24px;
          align-items: stretch;
        }

        .track2-hero-copy {
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: 430px;
          padding: 22px 0 34px;
        }

        .track2-kicker-row,
        .track2-tabs,
        .track2-chip-row,
        .track2-actions,
        .track2-result-actions {
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

        .track2-hero h1,
        .track2-result-hero h1 {
          margin: 18px 0 16px;
          color: var(--navy-900);
          font-family: "Space Grotesk", sans-serif;
          line-height: 0.95;
          letter-spacing: 0;
        }

        .track2-hero h1 {
          max-width: 12ch;
          font-size: clamp(3.1rem, 7vw, 5.4rem);
        }

        .track2-result-hero h1 {
          max-width: 16ch;
          font-size: clamp(2.6rem, 5vw, 4.9rem);
        }

        .track2-hero-copy p,
        .track2-result-hero p {
          max-width: 68ch;
          margin: 0;
          color: var(--text);
          line-height: 1.7;
        }

        .track2-actions,
        .track2-result-actions {
          margin-top: 26px;
        }

        .track2-progress {
          display: grid;
          gap: 10px;
          margin-top: 24px;
          max-width: 520px;
        }

        .track2-progress-row {
          display: flex;
          justify-content: space-between;
          color: var(--navy-800);
          font-size: 0.82rem;
          font-weight: 800;
        }

        .track2-progress-track {
          height: 9px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(18, 51, 100, 0.1);
        }

        .track2-progress-fill {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(135deg, #102a56, #2f6bff);
        }

        .track2-roadmap {
          display: grid;
          gap: 16px;
          padding: 14px;
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.45);
          border: 1px solid rgba(255, 255, 255, 0.62);
          box-shadow: var(--shadow-md);
        }

        body.dark-mode .track2-roadmap {
          background: rgba(255, 255, 255, 0.035);
        }

        .track2-roadmap-card,
        .track2-form-card,
        .track2-result-card,
        .track2-panel {
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.94);
          box-shadow: var(--shadow-md);
        }

        body.dark-mode .track2-roadmap-card,
        body.dark-mode .track2-form-card,
        body.dark-mode .track2-result-card,
        body.dark-mode .track2-panel {
          background: rgba(255, 255, 255, 0.045);
        }

        .track2-roadmap-card {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 16px;
          align-items: start;
          padding: 20px;
          border-radius: 16px;
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
        .track2-panel h3,
        .track2-result-hero h2 {
          margin: 0;
          color: var(--navy-900);
          font-family: "Space Grotesk", sans-serif;
          letter-spacing: 0;
        }

        .track2-roadmap-card p,
        .track2-form-card p,
        .track2-result-card p,
        .track2-panel p,
        .track2-panel li {
          margin: 8px 0 0;
          color: var(--text);
          line-height: 1.65;
        }

        .track2-tabs {
          position: sticky;
          top: 78px;
          z-index: 5;
          margin: 2px 0 0;
          padding: 10px;
          border: 1px solid rgba(255, 255, 255, 0.62);
          border-radius: 999px;
          background: rgba(245, 248, 255, 0.86);
          backdrop-filter: blur(14px);
          box-shadow: 0 14px 32px rgba(18, 51, 100, 0.08);
          width: fit-content;
        }

        .track2-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 34px;
          padding: 0 15px;
          border-radius: 999px;
          border: 1px solid transparent;
          background: rgba(255, 255, 255, 0.72);
          color: var(--navy-800);
          font-size: 0.82rem;
          font-weight: 800;
          cursor: pointer;
        }

        .track2-pill.is-active {
          color: #fff;
          background: linear-gradient(135deg, #102a56, #2f6bff);
          box-shadow: 0 12px 26px rgba(47, 107, 255, 0.2);
        }

        .track2-pill:disabled {
          cursor: not-allowed;
          opacity: 0.48;
        }

        .track2-workspace {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(330px, 0.95fr);
          gap: 18px;
          align-items: start;
        }

        .track2-form-card,
        .track2-result-card,
        .track2-panel {
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
          background: rgba(247, 249, 255, 0.94);
          color: var(--navy-900);
          font: inherit;
          outline: none;
        }

        .track2-input:focus,
        .track2-textarea:focus {
          border-color: rgba(47, 107, 255, 0.72);
          box-shadow: 0 0 0 4px rgba(47, 107, 255, 0.11);
        }

        body.dark-mode .track2-input,
        body.dark-mode .track2-textarea {
          background: rgba(255, 255, 255, 0.045);
          border-color: rgba(255, 255, 255, 0.14);
        }

        .track2-textarea {
          min-height: 112px;
          resize: vertical;
        }

        .track2-chip-row {
          margin-top: 14px;
        }

        .track2-mini-chip,
        .track2-toggle-chip,
        .track2-status-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          min-height: 30px;
          padding: 0 10px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: rgba(18, 51, 100, 0.04);
          color: var(--navy-800);
          font-size: 0.78rem;
          font-weight: 800;
        }

        .track2-toggle-chip {
          cursor: pointer;
        }

        .track2-toggle-chip.is-active,
        .track2-status-chip.good {
          border-color: rgba(34, 197, 94, 0.35);
          background: rgba(34, 197, 94, 0.1);
          color: #15803d;
        }

        .track2-status-chip.warn {
          border-color: rgba(245, 158, 11, 0.35);
          background: rgba(245, 158, 11, 0.1);
          color: #b45309;
        }

        .track2-status-chip.danger {
          border-color: rgba(239, 68, 68, 0.35);
          background: rgba(239, 68, 68, 0.09);
          color: #b91c1c;
        }

        .track2-upload-box {
          display: grid;
          place-items: center;
          min-height: 150px;
          margin-top: 18px;
          padding: 20px;
          border: 2px dashed rgba(47, 107, 255, 0.42);
          border-radius: 16px;
          background: rgba(247, 249, 255, 0.76);
          color: var(--text);
          text-align: center;
          cursor: pointer;
          transition: border-color 0.25s ease, background 0.25s ease, transform 0.25s ease;
        }

        .track2-upload-box:hover {
          border-color: rgba(47, 107, 255, 0.72);
          background: rgba(237, 244, 255, 0.92);
          transform: translateY(-1px);
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

        .track2-upload-box input {
          display: none;
        }

        .track2-upload-list,
        .track2-doc-grid,
        .track2-timeline,
        .track2-opportunity-grid {
          display: grid;
          gap: 10px;
        }

        .track2-upload-list {
          margin-top: 12px;
        }

        .track2-upload-item,
        .track2-doc-item,
        .track2-timeline-item {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 12px;
          align-items: center;
          padding: 12px 14px;
          border: 1px solid var(--border);
          border-radius: 12px;
          background: rgba(18, 51, 100, 0.04);
          color: var(--navy-800);
          font-size: 0.82rem;
          font-weight: 800;
        }

        .track2-upload-item span:first-child,
        .track2-doc-item span:first-child {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
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

        .track2-result-hero {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(320px, 0.75fr);
          gap: 22px;
          align-items: center;
          padding: 28px;
          border: 1px solid rgba(255, 255, 255, 0.62);
          border-radius: 24px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.92), rgba(237, 244, 255, 0.78));
          box-shadow: var(--shadow-md);
        }

        .track2-score-card {
          display: grid;
          gap: 14px;
          padding: 22px;
          border: 1px solid var(--border);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.82);
        }

        .track2-score-line {
          display: grid;
          grid-template-columns: 128px 1fr 48px;
          gap: 12px;
          align-items: center;
          color: var(--navy-800);
          font-size: 0.82rem;
          font-weight: 800;
        }

        .track2-score-bar {
          height: 9px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(18, 51, 100, 0.1);
        }

        .track2-score-bar span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(135deg, #102a56, #2f6bff);
        }

        .track2-metrics,
        .track2-results-grid,
        .track2-search-grid {
          display: grid;
          gap: 14px;
        }

        .track2-metrics {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .track2-metric {
          padding: 16px;
          border-radius: 14px;
          border: 1px solid var(--border);
          background: rgba(247, 249, 255, 0.84);
        }

        .track2-metric span {
          display: block;
          margin-bottom: 8px;
          color: var(--text);
          font-size: 0.76rem;
          font-weight: 800;
        }

        .track2-metric strong {
          display: block;
          color: var(--navy-900);
          font-family: "Space Grotesk", sans-serif;
          font-size: 1.16rem;
          line-height: 1.2;
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
        }

        .track2-decision-banner {
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

        .track2-decision-banner strong,
        .track2-empty strong {
          display: block;
          color: var(--navy-900);
          font-family: "Space Grotesk", sans-serif;
          font-size: 1.1rem;
        }

        .track2-panel ul {
          margin: 12px 0 0;
          padding-left: 18px;
        }

        .track2-empty {
          padding: 18px;
          border-radius: 14px;
          border: 1px dashed rgba(47, 107, 255, 0.32);
          background: rgba(247, 249, 255, 0.68);
        }

        .track2-opportunity-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .track2-research-hero {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(280px, 0.45fr);
          gap: 18px;
          align-items: stretch;
          padding: 0;
          overflow: hidden;
        }

        .track2-research-copy {
          padding: 28px;
        }

        .track2-research-board {
          display: grid;
          gap: 12px;
          padding: 22px;
          background: linear-gradient(135deg, rgba(16, 42, 86, 0.96), rgba(47, 107, 255, 0.9));
          color: #fff;
        }

        .track2-research-board span,
        .track2-research-board strong {
          color: #fff;
        }

        .track2-research-stat {
          display: grid;
          gap: 4px;
          padding: 14px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.13);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .track2-research-stat span {
          font-size: 0.74rem;
          font-weight: 800;
          opacity: 0.82;
        }

        .track2-research-stat strong {
          font-family: "Space Grotesk", sans-serif;
          font-size: 1.6rem;
          line-height: 1;
        }

        .track2-search-card {
          display: flex;
          min-height: 360px;
          flex-direction: column;
          justify-content: space-between;
          padding: 0;
          overflow: hidden;
          border: 1px solid var(--border);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.9);
        }

        .track2-search-head {
          padding: 20px;
          border-bottom: 1px solid var(--border);
          background: linear-gradient(135deg, rgba(247, 249, 255, 0.96), rgba(255, 255, 255, 0.86));
        }

        .track2-search-head h3 {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .track2-search-query {
          margin-top: 12px;
          padding: 11px;
          border-radius: 10px;
          background: rgba(18, 51, 100, 0.06);
          color: var(--navy-800);
          font-size: 0.78rem;
          font-weight: 800;
          word-break: break-word;
        }

        .track2-result-list {
          display: grid;
          gap: 10px;
          padding: 16px;
        }

        .track2-public-result {
          display: grid;
          gap: 7px;
          padding: 13px;
          border-radius: 13px;
          border: 1px solid rgba(47, 107, 255, 0.16);
          background: rgba(247, 249, 255, 0.78);
        }

        .track2-public-result strong {
          color: var(--navy-900);
          font-size: 0.92rem;
          line-height: 1.35;
        }

        .track2-public-result p {
          margin: 0;
          font-size: 0.8rem;
          line-height: 1.55;
        }

        .track2-result-domain {
          color: #7a8cab;
          font-size: 0.72rem;
          font-weight: 900;
          text-transform: uppercase;
        }

        .track2-search-card a {
          color: var(--blue-500);
          font-weight: 900;
        }

        .track2-search-footer {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px 20px;
          margin-top: auto;
        }

        .track2-tab-content {
          display: grid;
          gap: 18px;
        }

        @media (max-width: 1100px) {
          .track2-hero,
          .track2-workspace,
          .track2-result-hero,
          .track2-research-hero,
          .track2-results-grid,
          .track2-search-grid,
          .track2-opportunity-grid {
            grid-template-columns: 1fr;
          }

          .track2-metrics {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 700px) {
          .track2-form-grid,
          .track2-metrics {
            grid-template-columns: 1fr;
          }

          .track2-tabs {
            position: static;
            border-radius: 18px;
            width: 100%;
          }

          .track2-pill {
            flex: 1 1 auto;
          }

          .track2-hero h1,
          .track2-result-hero h1 {
            font-size: clamp(2.5rem, 13vw, 4rem);
          }

          .track2-score-line {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="track2-shell">
        {!report ? (
          <div className="track2-hero reveal">
            <div className="track2-hero-copy">
              <div className="track2-kicker-row">
                <span className="track2-kicker">{track?.track || "Track B"}</span>
                <span className="track2-kicker">Legal & Administrative PRO</span>
              </div>
              <h1>Legal readiness dashboard for Tunisian startups.</h1>
              <p>
                Build a clean legal file, upload the required evidence, and let the Track B agents prepare a structured
                decision package for advisors, investors, and Startup Act readiness.
              </p>
              <div className="track2-progress">
                <div className="track2-progress-row">
                  <span>Case completion</span>
                  <span>{completionScore}%</span>
                </div>
                <div className="track2-progress-track">
                  <div className="track2-progress-fill" style={{ width: `${completionScore}%` }} />
                </div>
              </div>
              <div className="track2-actions">
                <button className="primary-btn" type="button" onClick={runTrackB} disabled={loading}>
                  {loading ? "Reviewing..." : "Review legal file"}
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
        ) : (
          <div className="track2-result-hero reveal">
            <div>
              <div className="track2-kicker-row">
                <span className="track2-kicker">{track?.track || "Track B"}</span>
                <span className={`track2-status-chip ${decisionTone}`}>{decisionLabel}</span>
              </div>
              <h1>{formState.startup_profile.startup_name || "Startup"} legal review.</h1>
              <p>
                The analysis is organized into decision, documents, roadmap, and opportunity views. Use the tabs below
                to review each part without mixing the case form with the final dashboard.
              </p>
              <div className="track2-result-actions">
                <button className="secondary-btn" type="button" onClick={() => setActiveTab("case")}>
                  Edit case
                </button>
                <button className="primary-btn" type="button" onClick={runTrackB} disabled={loading}>
                  {loading ? "Refreshing..." : "Run again"}
                </button>
              </div>
              {error ? <div className="track2-message">{error}</div> : null}
            </div>
            <div className="track2-score-card">
              <div className="track2-score-line">
                <span>Startup Act</span>
                <div className="track2-score-bar">
                  <span style={{ width: `${Math.min(startupActScore, 100)}%` }} />
                </div>
                <strong>{startupActScore}%</strong>
              </div>
              <div className="track2-score-line">
                <span>Label score</span>
                <div className="track2-score-bar">
                  <span style={{ width: `${Math.min(labelScore, 100)}%` }} />
                </div>
                <strong>{labelScore}%</strong>
              </div>
              <div className="track2-score-line">
                <span>Documents</span>
                <div className="track2-score-bar">
                  <span style={{ width: `${Math.min(documentScore, 100)}%` }} />
                </div>
                <strong>{documentScore}%</strong>
              </div>
            </div>
          </div>
        )}

        <div className="track2-tabs">
          {(report ? resultTabs : [{ id: "case", label: "Case" }]).map((tab) => (
            <button
              className={`track2-pill${activeTab === tab.id ? " is-active" : ""}`}
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "case" ? (
          <div className="track2-workspace">
            <section className="track2-form-card">
              <span className="track2-card-label">Startup profile</span>
              <h2>Company information</h2>

              <div className="track2-form-grid">
                <Field label="Startup name">
                  <input
                    className="track2-input"
                    placeholder="Example: MedLink Tunisia"
                    value={formState.startup_profile.startup_name}
                    onChange={(event) => updateProfile("startup_name", event.target.value)}
                  />
                </Field>
                <Field label="Sector">
                  <input
                    className="track2-input"
                    placeholder="Example: HealthTech SaaS"
                    value={formState.startup_profile.sector}
                    onChange={(event) => updateProfile("sector", event.target.value)}
                  />
                </Field>
                <Field label="Founders count">
                  <input
                    className="track2-input"
                    type="number"
                    min="1"
                    placeholder="Example: 2"
                    value={formState.startup_profile.founders_count}
                    onChange={(event) => updateProfile("founders_count", event.target.value)}
                  />
                </Field>
                <Field label="Funding need TND">
                  <input
                    className="track2-input"
                    type="number"
                    placeholder="Example: 350000"
                    value={formState.startup_profile.funding_need_tnd}
                    onChange={(event) => updateProfile("funding_need_tnd", event.target.value)}
                  />
                </Field>
              </div>

              <div className="track2-form-grid single">
                <Field label="Activity description">
                  <textarea
                    className="track2-textarea"
                    placeholder="Describe what the startup does, who it serves, and what problem it solves."
                    value={formState.startup_profile.activity_description}
                    onChange={(event) => updateProfile("activity_description", event.target.value)}
                  />
                </Field>
              </div>

              <div className="track2-chip-row">
                {PROFILE_FLAGS.map(([field, label]) => (
                  <button
                    className={`track2-toggle-chip${formState.startup_profile[field] ? " is-active" : ""}`}
                    type="button"
                    key={field}
                    onClick={() => toggleProfileFlag(field)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </section>

            <section className="track2-form-card">
              <span className="track2-card-label">Pitching package</span>
              <h2>Pitch and legal file</h2>

              <div className="track2-form-grid single">
                <Field label="Pitch notes">
                  <textarea
                    className="track2-textarea"
                    placeholder="Problem: ...&#10;Solution: ...&#10;Proof: ...&#10;Team: ..."
                    value={formState.label_input.transcript}
                    onChange={(event) => updateLabelInput("transcript", event.target.value)}
                  />
                </Field>
              </div>

              <div className="track2-form-grid">
                <Field label="Traction signals">
                  <textarea
                    className="track2-textarea"
                    placeholder="pilot users&#10;advisor feedback&#10;letters of intent"
                    value={formState.label_input.traction_signals.join("\n")}
                    onChange={(event) => updateSignalList("traction_signals", event.target.value)}
                  />
                </Field>
                <Field label="Team signals">
                  <textarea
                    className="track2-textarea"
                    placeholder="legal operations&#10;AI engineering&#10;domain expertise"
                    value={formState.label_input.team_signals.join("\n")}
                    onChange={(event) => updateSignalList("team_signals", event.target.value)}
                  />
                </Field>
              </div>

              <label className="track2-upload-box">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg,.bmp,.tif,.tiff,.webp"
                  onChange={uploadLegalDocuments}
                  disabled={uploadLoading}
                />
                <div>
                  <strong>Upload legal documents</strong>
                  <span>{uploadLoading ? "Uploading documents..." : "Choose files from your computer"}</span>
                  <span>PDF, Word, PowerPoint, images, scans</span>
                </div>
              </label>

              {uploadedDocuments.length ? (
                <div className="track2-upload-list">
                  {uploadedDocuments.map((document) => (
                    <div className="track2-upload-item" key={document.path}>
                      <span>{document.file_name || document.path.split(/[\\/]/).pop()}</span>
                      <span className="track2-status-chip good">Ready</span>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState title="No document uploaded yet" text="Add the legal files before strict review for a more realistic decision." />
              )}

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
                    placeholder="Founder background, relevant experience, and execution strengths."
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
                    placeholder="Find mentors, early investors, and events that improve legal and funding readiness."
                    value={formState.label_input.slide_text}
                    onChange={(event) => updateLabelInput("slide_text", event.target.value)}
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
        ) : null}

        {report && activeTab === "decision" ? (
          <div className="track2-tab-content">
            <section className="track2-result-card is-wide">
              <span className="track2-card-label">Decision package</span>
              <h2>Final legal decision</h2>
              <div className="track2-metrics">
                <Metric label="Decision" value={decisionLabel} tone={decisionTone} />
                <Metric label="Legal form" value={strategic.recommended_legal_form || "N/A"} />
                <Metric label="Startup Act" value={`${startupActScore}%`} tone={toneForScore(startupActScore)} />
                <Metric label="Risk level" value={riskLabel} tone={riskScore >= 60 ? "danger" : "warn"} />
              </div>
            </section>

            <div className={`track2-decision-banner ${decisionTone}`}>
              <strong>{decisionLabel}</strong>
              <p>
                {finalOutput.user_message ||
                  "The final decision combines legal structure, document completeness, Startup Act readiness, and strict-mode blockers."}
              </p>
            </div>

            <div className="track2-results-grid">
              <section className="track2-panel">
                <span className="track2-card-label">Legal recommendation</span>
                <h3>Strategy summary</h3>
                {(strategic.rationale || []).length ? (
                  <ul>
                    {(strategic.rationale || []).slice(0, 6).map((item, index) => (
                      <li key={`${item}-${index}`}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <EmptyState title="No rationale returned" text="Run again after adding more pitch and legal context." />
                )}
              </section>

              <section className="track2-panel">
                <span className="track2-card-label">Main blocker</span>
                <h3>{primaryBlocker}</h3>
                <p>
                  Strict mode separates startup potential from file readiness. A strong Startup Act score can still be
                  blocked if the required documents are incomplete.
                </p>
              </section>
            </div>
          </div>
        ) : null}

        {report && activeTab === "documents" ? (
          <div className="track2-tab-content">
            <section className="track2-result-card is-wide">
              <span className="track2-card-label">File readiness</span>
              <h2>Documents dashboard</h2>
              <div className="track2-metrics">
                <Metric label="Completeness" value={`${documentScore}%`} tone={toneForScore(documentScore)} />
                <Metric label="Status" value={documentStatus} tone={documentScore >= 80 ? "good" : "warn"} />
                <Metric label="Uploaded" value={uploadedDocuments.length} />
                <Metric label="Missing" value={missingDocuments.length} tone={missingDocuments.length ? "danger" : "good"} />
              </div>
            </section>

            <div className="track2-results-grid">
              <section className="track2-panel">
                <span className="track2-card-label">Uploaded evidence</span>
                <h3>Ready documents</h3>
                {uploadedDocuments.length ? (
                  <div className="track2-doc-grid">
                    {uploadedDocuments.map((document) => (
                      <div className="track2-doc-item" key={document.path}>
                        <span>{document.file_name || document.path.split(/[\\/]/).pop()}</span>
                        <span className="track2-status-chip good">Ready</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState title="No uploaded document" text="Return to the Case tab and upload the legal evidence package." />
                )}
              </section>

              <section className="track2-panel">
                <span className="track2-card-label">Required documents</span>
                <h3>Documents to complete</h3>
                {missingDocuments.length ? (
                  <div className="track2-doc-grid">
                    {missingDocuments.map((item) => (
                      <div className="track2-doc-item" key={item}>
                        <span>{item}</span>
                        <span className="track2-status-chip danger">Missing</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState title="No missing document" text="The document agent did not return any mandatory missing item." />
                )}
              </section>
            </div>
          </div>
        ) : null}

        {report && activeTab === "roadmap" ? (
          <div className="track2-tab-content">
            <section className="track2-result-card is-wide">
              <span className="track2-card-label">Execution plan</span>
              <h2>Legal readiness roadmap</h2>
              <p>Follow these steps in order before advisor submission or investor outreach.</p>
            </section>

            <div className="track2-timeline">
              {roadmapItems.map((item, index) => (
                <article className="track2-timeline-item" key={item.title}>
                  <div>
                    <span className="track2-card-label">Step {index + 1}</span>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                  <span className={`track2-status-chip ${index === 0 && missingDocuments.length ? "danger" : "good"}`}>
                    {item.status}
                  </span>
                </article>
              ))}
            </div>
          </div>
        ) : null}

        {report && activeTab === "opportunities" ? (
          <div className="track2-tab-content">
            <section className="track2-result-card is-wide track2-research-hero">
              <div className="track2-research-copy">
                <span className="track2-card-label">External research agent</span>
                <h2>Opportunities and ecosystem intelligence</h2>
                <p>
                  The agent now executes public web searches for company credibility, LinkedIn presence, and Facebook
                  activity, then displays the results directly in the dashboard.
                </p>
              </div>
              <div className="track2-research-board">
                <div className="track2-research-stat">
                  <span>Searches executed</span>
                  <strong>{executedSearchCount}/{searches.length || 3}</strong>
                </div>
                <div className="track2-research-stat">
                  <span>Public results found</span>
                  <strong>{discoveredResultCount}</strong>
                </div>
                <div className="track2-research-stat">
                  <span>Agent status</span>
                  <strong>{discoveredResultCount ? "Active" : "Limited"}</strong>
                </div>
              </div>
            </section>

            {searches.length ? (
              <div className="track2-opportunity-grid">
                {searches.map((search) => (
                  <article className="track2-search-card" key={`${search.platform}-${search.query}`}>
                    <div className="track2-search-head">
                      <span className="track2-card-label">{readSearchHost(search.url)}</span>
                      <h3>
                        {search.platform}
                        <span
                          className={`track2-status-chip ${
                            search.agent_search?.status === "completed" ? "good" : "warn"
                          }`}
                        >
                          {search.agent_search?.status === "completed" ? "Searched" : "Needs retry"}
                        </span>
                      </h3>
                      <p>{search.purpose}</p>
                      <div className="track2-search-query">{search.query}</div>
                    </div>

                    <div className="track2-result-list">
                      {(search.agent_search?.results || []).length ? (
                        search.agent_search.results.map((result) => (
                          <a className="track2-public-result" href={result.url} target="_blank" rel="noreferrer" key={result.url}>
                            <span className="track2-result-domain">{result.domain || "Public source"}</span>
                            <strong>{result.title}</strong>
                            <p>{result.snippet}</p>
                          </a>
                        ))
                      ) : (
                        <EmptyState
                          title={search.agent_search?.status === "unavailable" ? "Search unavailable" : "No result captured"}
                          text={
                            search.agent_search?.message ||
                            "The agent executed the query, but no public result was returned from the search provider."
                          }
                        />
                      )}
                    </div>

                    <div className="track2-search-footer">
                      <span className="track2-mini-chip">{search.agent_search?.source || "Public search"}</span>
                      <a href={search.url} target="_blank" rel="noreferrer">
                        Open full search
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No external search returned"
                text="Run the legal review again after completing the startup name, sector, and networking goal."
              />
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}
