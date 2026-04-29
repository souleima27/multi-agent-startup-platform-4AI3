import { useState, useRef } from "react";

const API_URL = "http://127.0.0.1:5056/track3/execution/run";

const INITIAL_STATE = {
  startup_profile: {
    name: "MedLink",
    objective: "Launch an MVP for an online doctor appointment booking platform",
    problem_statement: "Patients need a simple way to find doctors, book appointments, and receive reminders.",
    target_users: "Patients in urban areas and small private clinics",
    mvp_scope_paragraph: "The MVP includes signup/login, doctor search, appointment booking, clinic dashboard, and reminder notifications.",
    execution_context: "Small startup team building an MVP in 10 weeks with limited budget and aiming for pilot clinics.",
  },
  mvp_plan: {
    features: [
      { name: "User signup and authentication", priority: "high" },
      { name: "Doctor search and filtering", priority: "high" },
      { name: "Appointment booking", priority: "high" },
      { name: "Clinic dashboard", priority: "medium" },
      { name: "Reminder notifications", priority: "medium" },
    ],
    admin_workflow: [
      { name: "Legal registration", priority: "high" },
      { name: "Pilot clinic partnership agreements", priority: "high" },
      { name: "Payment gateway setup", priority: "medium" },
    ],
    deadlines: {
      mvp_launch: "2026-07-15",
      legal_deadline: "2026-06-01",
    },
  },
  team: [
    { name: "Sarah", role: "Product Manager", skills: ["planning", "requirements", "operations"], availability: 1 },
    { name: "Youssef", role: "Backend Engineer", skills: ["backend", "api", "database", "integrations"], availability: 1 },
    { name: "Lina", role: "Frontend Designer", skills: ["design", "ux", "frontend"], availability: 1 },
    { name: "Hamza", role: "Full Stack Engineer", skills: ["frontend", "backend", "testing"], availability: 1 },
    { name: "Mariem", role: "Operations and Legal", skills: ["documentation", "legal", "partnerships"], availability: 1 },
  ],
  live_status: {
    progress_signals: [],
    founder_notes: "",
  },
};

function labelize(value) {
  return String(value || "")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function statusTone(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (["good", "done", "ready", "synced", "success"].includes(normalized)) return "good";
  if (["fragile", "todo", "in_progress", "warning"].includes(normalized)) return "warn";
  if (["high_risk", "blocked", "delayed", "error", "failed"].includes(normalized)) return "danger";
  return "info";
}

function prettyJson(value) {
  return JSON.stringify(value, null, 2);
}

function Badge({ children, tone = "info" }) {
  return <span className={`track3-status-badge ${tone}`}>{children}</span>;
}

function SummaryMetric({ label, value, tone = "info" }) {
  return (
    <div className={`track3-summary-metric ${tone}`}>
      <span>{label}</span>
      <strong>{String(value ?? "N/A")}</strong>
    </div>
  );
}

function TaskCard({ task }) {
  return (
    <article className="track3-task-card">
      <div className="track3-task-header">
        <div>
          <strong>{task.title || "Untitled task"}</strong>
          <p>{task.description || "No description provided."}</p>
        </div>

        <div className="track3-pill-row">
          <Badge tone={statusTone(task.status)}>{task.status || "todo"}</Badge>
          <Badge tone={statusTone(task.priority)}>{task.priority || "medium"}</Badge>
        </div>
      </div>

      <div className="track3-task-meta">
        <span>Owner: {task.assigned_to || "Unassigned"}</span>
        <span>Estimate: {task.estimated_days || "N/A"} days</span>
        <span>Milestone: {task.milestone_title || "N/A"}</span>
        <span>Action: {task.agent_action || "update"}</span>
        {task.jira_issue_key ? <span>Jira: {task.jira_issue_key}</span> : null}
      </div>
    </article>
  );
}

function generateExecutionId() {
  return `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function hashObject(obj) {
  const str = JSON.stringify(obj);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).slice(0, 8);
}

export function Track3Execution({ track }) {
  const [formState, setFormState] = useState(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [report, setReport] = useState(null);
  const [executionHistory, setExecutionHistory] = useState([]);
  const [executionId, setExecutionId] = useState(generateExecutionId());
  const [inputHash, setInputHash] = useState(hashObject(INITIAL_STATE));

  const updateProfile = (field, value) => {
    setFormState((prev) => ({
      ...prev,
      startup_profile: { ...prev.startup_profile, [field]: value },
    }));
  };

  const updateDeadline = (field, value) => {
    setFormState((prev) => ({
      ...prev,
      mvp_plan: {
        ...prev.mvp_plan,
        deadlines: { ...prev.mvp_plan.deadlines, [field]: value },
      },
    }));
  };

  const updateFeature = (index, field, value) => {
    setFormState((prev) => {
      const newFeatures = [...prev.mvp_plan.features];
      newFeatures[index] = { ...newFeatures[index], [field]: value };
      return {
        ...prev,
        mvp_plan: { ...prev.mvp_plan, features: newFeatures },
      };
    });
  };

  const addFeature = () => {
    setFormState((prev) => ({
      ...prev,
      mvp_plan: {
        ...prev.mvp_plan,
        features: [...prev.mvp_plan.features, { name: "", priority: "medium" }],
      },
    }));
  };

  const removeFeature = (index) => {
    setFormState((prev) => ({
      ...prev,
      mvp_plan: {
        ...prev.mvp_plan,
        features: prev.mvp_plan.features.filter((_, i) => i !== index),
      },
    }));
  };

  const updateWorkflow = (index, field, value) => {
    setFormState((prev) => {
      const newWorkflow = [...prev.mvp_plan.admin_workflow];
      newWorkflow[index] = { ...newWorkflow[index], [field]: value };
      return {
        ...prev,
        mvp_plan: { ...prev.mvp_plan, admin_workflow: newWorkflow },
      };
    });
  };

  const addWorkflow = () => {
    setFormState((prev) => ({
      ...prev,
      mvp_plan: {
        ...prev.mvp_plan,
        admin_workflow: [...prev.mvp_plan.admin_workflow, { name: "", priority: "medium" }],
      },
    }));
  };

  const removeWorkflow = (index) => {
    setFormState((prev) => ({
      ...prev,
      mvp_plan: {
        ...prev.mvp_plan,
        admin_workflow: prev.mvp_plan.admin_workflow.filter((_, i) => i !== index),
      },
    }));
  };

  const updateTeamMember = (index, field, value) => {
    setFormState((prev) => {
      const newTeam = [...prev.team];
      newTeam[index] = { ...newTeam[index], [field]: value };
      return { ...prev, team: newTeam };
    });
  };

  const addTeamMember = () => {
    setFormState((prev) => ({
      ...prev,
      team: [...prev.team, { name: "", role: "", skills: [], availability: 1 }],
    }));
  };

  const removeTeamMember = (index) => {
    setFormState((prev) => ({
      ...prev,
      team: prev.team.filter((_, i) => i !== index),
    }));
  };

  const updateFounderNotes = (value) => {
    setFormState((prev) => ({
      ...prev,
      live_status: { ...prev.live_status, founder_notes: value },
    }));
  };

  async function runExecutionAgent() {
    setLoading(true);
    setError("");

    const currentExecutionId = generateExecutionId();
    const currentInputHash = hashObject(formState);
    const executionTimestamp = new Date().toISOString();

    setExecutionId(currentExecutionId);
    setInputHash(currentInputHash);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "Track C execution failed.");
      }

      const enrichedReport = {
        ...data,
        _execution_meta: {
          execution_id: currentExecutionId,
          timestamp: executionTimestamp,
          input_hash: currentInputHash,
          startup_name: formState.startup_profile.name,
          execution_number: executionHistory.length + 1,
        },
      };

      setReport(enrichedReport);
      setExecutionHistory((prev) => [
        {
          id: currentExecutionId,
          timestamp: executionTimestamp,
          startup: formState.startup_profile.name,
          inputHash: currentInputHash,
          taskCount: data.task_list?.length || 0,
        },
        ...prev,
      ]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (runError) {
      setReport(null);
      setError(runError.message || "Track C execution failed.");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setFormState(INITIAL_STATE);
    setError("");
    setReport(null);
  }

  const executiveSummary = report?.executive_summary || {};
  const feasibility = report?.feasibility || {};
  const monitoring = report?.monitoring || {};
  const jira = report?.jira || {};
  const nextActions = report?.next_actions || [];
  const founderDecisions = report?.founder_decisions || [];
  const anomalies = report?.anomalies || [];
  const recommendations = report?.critic_report?.recommendations || [];
  const tasks = report?.task_list || [];
  const topTasks = report?.priority_queue?.slice(0, 6) || [];

  return (
    <section className="section track-page track3-execution">
      <style>{`
        .track3-execution .track-page-hero {
          align-items: stretch;
        }

        .track3-shell-card {
          border: 1px solid var(--border);
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.86);
          box-shadow: var(--shadow-md);
        }

        body.dark-mode .track3-shell-card {
          background: rgba(255, 255, 255, 0.04);
        }

        .track3-hero-copy,
        .track3-hero-panel,
        .track3-editor-card,
        .track3-results-card,
        .track3-inline-card,
        .track3-task-card,
        .track3-summary-metric,
        .track3-json-preview {
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.86);
          box-shadow: var(--shadow-md);
        }

        body.dark-mode .track3-hero-copy,
        body.dark-mode .track3-hero-panel,
        body.dark-mode .track3-editor-card,
        body.dark-mode .track3-results-card,
        body.dark-mode .track3-inline-card,
        body.dark-mode .track3-task-card,
        body.dark-mode .track3-summary-metric,
        body.dark-mode .track3-json-preview {
          background: rgba(255, 255, 255, 0.04);
        }

        .track3-hero-copy,
        .track3-hero-panel,
        .track3-editor-card,
        .track3-results-card {
          padding: 30px;
          border-radius: 30px;
        }

        .track3-hero-copy h1,
        .track3-results-card h2,
        .track3-editor-card h2,
        .track3-inline-card h3 {
          margin: 0;
          font-family: "Space Grotesk", sans-serif;
          color: var(--navy-900);
        }

        .track3-hero-copy h1 {
          max-width: 11ch;
          font-size: clamp(2.6rem, 5vw, 4.4rem);
          line-height: 0.98;
        }

        .track3-hero-copy p,
        .track3-hero-panel p,
        .track3-editor-subtitle,
        .track3-task-card p,
        .track3-empty,
        .track3-json-preview pre,
        .track3-inline-card li,
        .track3-inline-card span {
          color: var(--text);
          line-height: 1.7;
        }

        .track3-hero-panel {
          display: grid;
          gap: 18px;
          align-content: start;
        }

        .track3-panel-grid,
        .track3-summary-grid,
        .track3-results-grid,
        .track3-meta-grid {
          display: grid;
          gap: 16px;
        }

        .track3-panel-grid,
        .track3-summary-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .track3-results-grid {
          grid-template-columns: 1.1fr 0.9fr;
          margin-top: 22px;
        }

        .track3-inline-card {
          padding: 22px;
          border-radius: 24px;
        }

        .track3-inline-card ul {
          margin: 14px 0 0;
          padding-left: 18px;
        }

        .track3-editor-card,
        .track3-results-card {
          margin-top: 24px;
        }

        .track3-editor-toolbar,
        .track3-editor-actions,
        .track3-pill-row,
        .track3-task-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .track3-editor-toolbar {
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .track3-editor-actions {
          margin-top: 18px;
          flex-wrap: wrap;
        }

        .track3-form-section {
          margin-top: 24px;
          padding: 20px;
          border: 1px solid var(--border);
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.04);
        }

        .track3-form-section h3 {
          margin-top: 0;
          color: var(--navy-900);
          font-family: "Space Grotesk", sans-serif;
        }

        .track3-form-group {
          margin-bottom: 16px;
        }

        .track3-form-label {
          display: block;
          margin-bottom: 6px;
          color: var(--navy-900);
          font-weight: 600;
          font-size: 0.9rem;
        }

        .track3-form-input,
        .track3-form-textarea,
        .track3-form-select {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid var(--gray-300);
          border-radius: 8px;
          background: var(--gray-050);
          color: var(--navy-900);
          font-family: inherit;
          font-size: 0.95rem;
          outline: none;
        }

        body.dark-mode .track3-form-input,
        body.dark-mode .track3-form-textarea,
        body.dark-mode .track3-form-select {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .track3-form-input:focus,
        .track3-form-textarea:focus,
        .track3-form-select:focus {
          border-color: rgba(75, 124, 255, 0.55);
          box-shadow: 0 0 0 4px rgba(75, 124, 255, 0.12);
        }

        .track3-form-textarea {
          min-height: 80px;
          resize: vertical;
        }

        .track3-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .track3-form-item {
          padding: 14px;
          border: 1px solid var(--border);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.02);
          margin-bottom: 12px;
        }

        .track3-form-item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .track3-form-item-actions {
          display: flex;
          gap: 8px;
        }

        .track3-remove-btn {
          padding: 6px 10px;
          background: rgba(239, 68, 68, 0.14);
          color: #b91c1c;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .track3-remove-btn:hover {
          background: rgba(239, 68, 68, 0.24);
        }

        .track3-add-btn {
          padding: 8px 12px;
          background: rgba(75, 124, 255, 0.14);
          color: var(--blue-500);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 600;
          margin-top: 8px;
        }

        .track3-add-btn:hover {
          background: rgba(75, 124, 255, 0.24);
        }

        .track3-status-badge {
          display: inline-flex;
          align-items: center;
          padding: 8px 12px;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 800;
          border: 1px solid transparent;
          text-transform: capitalize;
        }

        .track3-status-badge.info {
          color: var(--blue-500);
          background: rgba(75, 124, 255, 0.14);
        }

        .track3-status-badge.good {
          color: #15803d;
          background: rgba(34, 197, 94, 0.14);
        }

        .track3-status-badge.warn {
          color: #b45309;
          background: rgba(245, 158, 11, 0.14);
        }

        .track3-status-badge.danger {
          color: #b91c1c;
          background: rgba(239, 68, 68, 0.14);
        }

        .track3-summary-grid {
          margin-top: 18px;
        }

        .track3-summary-metric {
          padding: 18px;
          border-radius: 22px;
        }

        .track3-summary-metric span {
          display: block;
          margin-bottom: 8px;
          color: var(--text);
        }

        .track3-summary-metric strong {
          display: block;
          color: var(--navy-900);
          font-family: "Space Grotesk", sans-serif;
          font-size: 1.5rem;
          line-height: 1.05;
        }

        .track3-task-list {
          display: grid;
          gap: 14px;
          margin-top: 18px;
        }

        .track3-task-card {
          padding: 22px;
          border-radius: 24px;
        }

        .track3-task-header {
          display: flex;
          justify-content: space-between;
          gap: 18px;
        }

        .track3-task-header strong {
          display: block;
          margin-bottom: 8px;
          color: var(--navy-900);
        }

        .track3-task-header p {
          margin: 0;
        }

        .track3-task-meta {
          margin-top: 14px;
          color: var(--text);
          font-size: 0.92rem;
        }

        .track3-meta-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          margin-top: 16px;
        }

        .track3-meta-grid div {
          padding: 14px 16px;
          border-radius: 18px;
          background: rgba(18, 51, 100, 0.05);
        }

        body.dark-mode .track3-meta-grid div {
          background: rgba(255, 255, 255, 0.05);
        }

        .track3-meta-grid strong {
          display: block;
          margin-bottom: 6px;
          color: var(--navy-900);
        }

        .track3-message {
          margin-top: 16px;
          padding: 14px 16px;
          border-radius: 18px;
          border: 1px solid rgba(239, 68, 68, 0.22);
          background: rgba(239, 68, 68, 0.08);
          color: #b91c1c;
          font-weight: 700;
        }

        .track3-json-preview {
          margin-top: 18px;
          padding: 18px;
          border-radius: 24px;
          overflow: auto;
        }

        .track3-json-preview pre {
          margin: 0;
          font-family: Consolas, "Courier New", monospace;
          font-size: 0.88rem;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .track3-empty {
          margin: 18px 0 0;
        }

        @media (max-width: 1100px) {
          .track3-results-grid,
          .track3-panel-grid,
          .track3-summary-grid,
          .track3-meta-grid,
          .track3-form-row {
            grid-template-columns: 1fr;
          }

          .track3-task-header {
            flex-direction: column;
          }
        }
      `}</style>

      <div className="track-page-hero reveal">
        <div className="track3-hero-copy">
          <div className="track-card-top">
            <span className="track-label">{track?.track || "Track C"}</span>
            <span className="track-badge">{track?.badge || "Execution agent"}</span>
          </div>

          <div className="track-icon large-track-icon">{track?.icon || "C"}</div>
          <h1>Build your execution plan with a simple form.</h1>
          <p>
            Fill in your startup profile, features, team, and deadlines. We'll generate a complete execution plan with
            tasks, feasibility analysis, and Jira integration.
          </p>

          <div className="track-highlights">
            <span className="track-chip">Easy form-based input</span>
            <span className="track-chip">Smart execution planning</span>
            <span className="track-chip">Instant Jira sync</span>
          </div>
        </div>

        <div className="track3-hero-panel">
          <p className="eyebrow">How it works</p>

          <div className="track3-panel-grid">
            <div className="track3-inline-card">
              <h3>1. Your startup</h3>
              <p>Name, objective, problem, and target users.</p>
            </div>

            <div className="track3-inline-card">
              <h3>2. Your plan</h3>
              <p>Features, admin tasks, and key deadlines.</p>
            </div>

            <div className="track3-inline-card">
              <h3>3. Your team</h3>
              <p>Team members, roles, skills, and availability.</p>
            </div>

            <div className="track3-inline-card">
              <h3>4. Get results</h3>
              <p>Execution plan with tasks, priorities, and risks.</p>
            </div>
          </div>
        </div>
      </div>

      <section className="track3-editor-card reveal delay-1">
        <div className="track3-editor-toolbar">
          <div>
            <p className="eyebrow">Startup Planning Form</p>
            <h2>Build your execution plan</h2>
            <p className="track3-editor-subtitle">
              Fill in each section with your startup details. All fields help generate a better execution plan.
            </p>
          </div>

          <div className="track3-pill-row">
            <Badge tone="info">Interactive form</Badge>
            <Badge tone={loading ? "warn" : "good"}>{loading ? "Running" : "Ready"}</Badge>
          </div>
        </div>

        {/* STARTUP PROFILE SECTION */}
        <div className="track3-form-section">
          <h3>📱 Startup Profile</h3>

          <div className="track3-form-group">
            <label className="track3-form-label">Startup Name</label>
            <input
              className="track3-form-input"
              type="text"
              value={formState.startup_profile.name}
              onChange={(e) => updateProfile("name", e.target.value)}
              placeholder="e.g., MedLink"
            />
          </div>

          <div className="track3-form-group">
            <label className="track3-form-label">Objective</label>
            <input
              className="track3-form-input"
              type="text"
              value={formState.startup_profile.objective}
              onChange={(e) => updateProfile("objective", e.target.value)}
              placeholder="e.g., Launch an MVP for an online booking platform"
            />
          </div>

          <div className="track3-form-group">
            <label className="track3-form-label">Problem Statement</label>
            <textarea
              className="track3-form-textarea"
              value={formState.startup_profile.problem_statement}
              onChange={(e) => updateProfile("problem_statement", e.target.value)}
              placeholder="Describe the problem you're solving..."
            />
          </div>

          <div className="track3-form-group">
            <label className="track3-form-label">Target Users</label>
            <input
              className="track3-form-input"
              type="text"
              value={formState.startup_profile.target_users}
              onChange={(e) => updateProfile("target_users", e.target.value)}
              placeholder="e.g., Urban patients and small clinics"
            />
          </div>

          <div className="track3-form-group">
            <label className="track3-form-label">MVP Scope</label>
            <textarea
              className="track3-form-textarea"
              value={formState.startup_profile.mvp_scope_paragraph}
              onChange={(e) => updateProfile("mvp_scope_paragraph", e.target.value)}
              placeholder="Describe what's included in your MVP..."
            />
          </div>

          <div className="track3-form-group">
            <label className="track3-form-label">Execution Context</label>
            <textarea
              className="track3-form-textarea"
              value={formState.startup_profile.execution_context}
              onChange={(e) => updateProfile("execution_context", e.target.value)}
              placeholder="e.g., Small team, 10 weeks, limited budget..."
            />
          </div>
        </div>

        {/* MVP PLAN SECTION */}
        <div className="track3-form-section">
          <h3>🎯 MVP Features</h3>

          {formState.mvp_plan.features.map((feature, idx) => (
            <div key={idx} className="track3-form-item">
              <div className="track3-form-item-header">
                <span style={{ fontWeight: 600 }}>Feature {idx + 1}</span>
                {formState.mvp_plan.features.length > 1 && (
                  <button className="track3-remove-btn" onClick={() => removeFeature(idx)}>
                    Remove
                  </button>
                )}
              </div>

              <div className="track3-form-row">
                <div className="track3-form-group">
                  <label className="track3-form-label">Feature Name</label>
                  <input
                    className="track3-form-input"
                    type="text"
                    value={feature.name}
                    onChange={(e) => updateFeature(idx, "name", e.target.value)}
                    placeholder="e.g., User authentication"
                  />
                </div>

                <div className="track3-form-group">
                  <label className="track3-form-label">Priority</label>
                  <select
                    className="track3-form-select"
                    value={feature.priority}
                    onChange={(e) => updateFeature(idx, "priority", e.target.value)}
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
            </div>
          ))}

          <button className="track3-add-btn" onClick={addFeature}>
            + Add Feature
          </button>
        </div>

        {/* ADMIN WORKFLOW SECTION */}
        <div className="track3-form-section">
          <h3>⚙️ Admin Workflow</h3>

          {formState.mvp_plan.admin_workflow.map((workflow, idx) => (
            <div key={idx} className="track3-form-item">
              <div className="track3-form-item-header">
                <span style={{ fontWeight: 600 }}>Task {idx + 1}</span>
                {formState.mvp_plan.admin_workflow.length > 1 && (
                  <button className="track3-remove-btn" onClick={() => removeWorkflow(idx)}>
                    Remove
                  </button>
                )}
              </div>

              <div className="track3-form-row">
                <div className="track3-form-group">
                  <label className="track3-form-label">Task Name</label>
                  <input
                    className="track3-form-input"
                    type="text"
                    value={workflow.name}
                    onChange={(e) => updateWorkflow(idx, "name", e.target.value)}
                    placeholder="e.g., Legal registration"
                  />
                </div>

                <div className="track3-form-group">
                  <label className="track3-form-label">Priority</label>
                  <select
                    className="track3-form-select"
                    value={workflow.priority}
                    onChange={(e) => updateWorkflow(idx, "priority", e.target.value)}
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
            </div>
          ))}

          <button className="track3-add-btn" onClick={addWorkflow}>
            + Add Task
          </button>
        </div>

        {/* DEADLINES SECTION */}
        <div className="track3-form-section">
          <h3>📅 Key Deadlines</h3>

          <div className="track3-form-row">
            <div className="track3-form-group">
              <label className="track3-form-label">MVP Launch Date</label>
              <input
                className="track3-form-input"
                type="date"
                value={formState.mvp_plan.deadlines.mvp_launch}
                onChange={(e) => updateDeadline("mvp_launch", e.target.value)}
              />
            </div>

            <div className="track3-form-group">
              <label className="track3-form-label">Legal Deadline</label>
              <input
                className="track3-form-input"
                type="date"
                value={formState.mvp_plan.deadlines.legal_deadline}
                onChange={(e) => updateDeadline("legal_deadline", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* TEAM SECTION */}
        <div className="track3-form-section">
          <h3>👥 Team Members</h3>

          {formState.team.map((member, idx) => (
            <div key={idx} className="track3-form-item">
              <div className="track3-form-item-header">
                <span style={{ fontWeight: 600 }}>Member {idx + 1}</span>
                {formState.team.length > 1 && (
                  <button className="track3-remove-btn" onClick={() => removeTeamMember(idx)}>
                    Remove
                  </button>
                )}
              </div>

              <div className="track3-form-row">
                <div className="track3-form-group">
                  <label className="track3-form-label">Name</label>
                  <input
                    className="track3-form-input"
                    type="text"
                    value={member.name}
                    onChange={(e) => updateTeamMember(idx, "name", e.target.value)}
                    placeholder="e.g., Sarah"
                  />
                </div>

                <div className="track3-form-group">
                  <label className="track3-form-label">Role</label>
                  <input
                    className="track3-form-input"
                    type="text"
                    value={member.role}
                    onChange={(e) => updateTeamMember(idx, "role", e.target.value)}
                    placeholder="e.g., Product Manager"
                  />
                </div>
              </div>

              <div className="track3-form-group">
                <label className="track3-form-label">Skills (comma-separated)</label>
                <input
                  className="track3-form-input"
                  type="text"
                  value={member.skills.join(", ")}
                  onChange={(e) => updateTeamMember(idx, "skills", e.target.value.split(",").map((s) => s.trim()))}
                  placeholder="e.g., backend, api, database"
                />
              </div>

              <div className="track3-form-group">
                <label className="track3-form-label">Availability (0-1)</label>
                <input
                  className="track3-form-input"
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={member.availability}
                  onChange={(e) => updateTeamMember(idx, "availability", parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          ))}

          <button className="track3-add-btn" onClick={addTeamMember}>
            + Add Team Member
          </button>
        </div>

        {/* FOUNDER NOTES SECTION */}
        <div className="track3-form-section">
          <h3>📝 Founder Notes</h3>

          <div className="track3-form-group">
            <label className="track3-form-label">Any additional notes or context</label>
            <textarea
              className="track3-form-textarea"
              value={formState.live_status.founder_notes}
              onChange={(e) => updateFounderNotes(e.target.value)}
              placeholder="Add any additional context or notes..."
              style={{ minHeight: "100px" }}
            />
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="track3-editor-actions">
          <button className="primary-btn" type="button" onClick={runExecutionAgent} disabled={loading}>
            {loading ? "Running execution agent..." : "🚀 Run Execution Agent"}
          </button>

          <button className="secondary-btn" type="button" onClick={resetForm} disabled={loading}>
            Reset Form
          </button>
        </div>

        {error ? <div className="track3-message">{error}</div> : null}
      </section>

      {/* RESULTS SECTION */}
      {report ? (
        <section className="track3-results-card reveal delay-2">
          <p className="eyebrow">Execution report</p>
          <h2>{report.startup_name || "Startup"} execution summary</h2>

          {/* EXECUTION VERIFICATION BADGE */}
          {report._execution_meta && (
            <div
              style={{
                marginTop: "16px",
                padding: "14px",
                borderRadius: "12px",
                background: "rgba(34, 197, 94, 0.1)",
                border: "1px solid rgba(34, 197, 94, 0.3)",
              }}
            >
              <p style={{ margin: "0 0 8px 0", color: "#15803d", fontWeight: 600 }}>✓ Fresh Execution Verified</p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "8px",
                  fontSize: "0.85rem",
                  color: "var(--text)",
                }}
              >
                <div>
                  <strong>Execution ID:</strong> <code style={{ fontSize: "0.8rem" }}>{report._execution_meta.execution_id}</code>
                </div>
                <div>
                  <strong>Input Hash:</strong> <code style={{ fontSize: "0.8rem" }}>{report._execution_meta.input_hash}</code>
                </div>
                <div>
                  <strong>Timestamp:</strong> {new Date(report._execution_meta.timestamp).toLocaleString()}
                </div>
                <div>
                  <strong>Run #:</strong> {report._execution_meta.execution_number}
                </div>
              </div>
            </div>
          )}

          <div className="track3-summary-grid">
            <SummaryMetric
              label="Feasibility"
              value={feasibility.status || executiveSummary.feasibility || "unknown"}
              tone={statusTone(feasibility.status || executiveSummary.feasibility)}
            />
            <SummaryMetric label="Task count" value={monitoring.task_count || 0} tone="info" />
            <SummaryMetric label="Ready tasks" value={monitoring.ready_count || 0} tone="good" />
            <SummaryMetric label="Main risk" value={executiveSummary.main_risk || "N/A"} tone="warn" />
          </div>

          <div className="track3-results-grid">
            <div>
              <div className="track3-inline-card">
                <h3>Executive summary</h3>
                <div className="track3-meta-grid">
                  {Object.entries(executiveSummary).map(([key, value]) => (
                    <div key={key}>
                      <strong>{labelize(key)}</strong>
                      <span>{String(value ?? "N/A")}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="track3-inline-card" style={{ marginTop: 18 }}>
                <h3>Next actions</h3>
                {nextActions.length === 0 ? (
                  <p className="track3-empty">No next actions were returned.</p>
                ) : (
                  <ul>
                    {nextActions.map((item, index) => (
                      <li key={`${item}-${index}`}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="track3-inline-card" style={{ marginTop: 18 }}>
                <h3>Founder decisions</h3>
                {founderDecisions.length === 0 ? (
                  <p className="track3-empty">No founder decisions were returned.</p>
                ) : (
                  <ul>
                    {founderDecisions.map((item, index) => (
                      <li key={`${item}-${index}`}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div>
              <div className="track3-inline-card">
                <h3>Feasibility details</h3>
                <div className="track3-meta-grid">
                  {Object.entries(feasibility).map(([key, value]) => (
                    <div key={key}>
                      <strong>{labelize(key)}</strong>
                      <span>{String(value ?? "N/A")}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="track3-inline-card" style={{ marginTop: 18 }}>
                <h3>Jira sync</h3>
                <div className="track3-meta-grid">
                  {Object.keys(jira).length === 0 ? (
                    <div>
                      <strong>Status</strong>
                      <span>No Jira summary returned.</span>
                    </div>
                  ) : (
                    Object.entries(jira).map(([key, value]) => (
                      <div key={key}>
                        <strong>{labelize(key)}</strong>
                        <span>{String(value ?? "N/A")}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="track3-inline-card" style={{ marginTop: 18 }}>
                <h3>Risks and recommendations</h3>
                {anomalies.length === 0 && recommendations.length === 0 ? (
                  <p className="track3-empty">No major anomaly or recommendation was returned.</p>
                ) : (
                  <ul>
                    {anomalies.slice(0, 4).map((item, index) => (
                      <li key={`anomaly-${index}`}>{prettyJson(item)}</li>
                    ))}
                    {recommendations.slice(0, 4).map((item, index) => (
                      <li key={`recommendation-${index}`}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="track3-inline-card" style={{ marginTop: 22 }}>
            <h3>Top priority tasks</h3>
            {topTasks.length === 0 ? (
              <p className="track3-empty">No priority queue was returned.</p>
            ) : (
              <div className="track3-task-list">
                {topTasks.map((task) => (
                  <TaskCard key={task.id || task.title} task={task} />
                ))}
              </div>
            )}
          </div>

          <div className="track3-inline-card" style={{ marginTop: 22 }}>
            <h3>All generated tasks</h3>
            {tasks.length === 0 ? (
              <p className="track3-empty">No generated tasks were returned.</p>
            ) : (
              <div className="track3-task-list">
                {tasks.map((task) => (
                  <TaskCard key={task.id || task.title} task={task} />
                ))}
              </div>
            )}
          </div>

          <div className="track3-inline-card" style={{ marginTop: 22 }}>
            <h3>📊 Execution History</h3>
            {executionHistory.length === 0 ? (
              <p className="track3-empty">This is your first execution.</p>
            ) : (
              <div style={{ fontSize: "0.9rem", overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border)" }}>
                      <th style={{ textAlign: "left", padding: "8px", color: "var(--navy-900)", fontWeight: 600 }}>Run</th>
                      <th style={{ textAlign: "left", padding: "8px", color: "var(--navy-900)", fontWeight: 600 }}>Startup</th>
                      <th style={{ textAlign: "left", padding: "8px", color: "var(--navy-900)", fontWeight: 600 }}>Tasks</th>
                      <th style={{ textAlign: "left", padding: "8px", color: "var(--navy-900)", fontWeight: 600 }}>Input Hash</th>
                      <th style={{ textAlign: "left", padding: "8px", color: "var(--navy-900)", fontWeight: 600 }}>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {executionHistory.slice(0, 5).map((exec, idx) => (
                      <tr key={exec.id} style={{ borderBottom: "1px solid var(--border)" }}>
                        <td style={{ padding: "8px", color: "var(--text)" }}>#{executionHistory.length - idx}</td>
                        <td style={{ padding: "8px", color: "var(--text)" }}>{exec.startup}</td>
                        <td style={{ padding: "8px", color: "var(--text)" }}>{exec.taskCount}</td>
                        <td style={{ padding: "8px", color: "var(--text)", fontSize: "0.75rem" }}>
                          <code>{exec.inputHash}</code>
                        </td>
                        <td style={{ padding: "8px", color: "var(--text)", fontSize: "0.8rem" }}>
                          {new Date(exec.timestamp).toLocaleTimeString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {executionHistory.length > 5 && (
                  <p style={{ marginTop: "8px", color: "var(--text)", fontSize: "0.85rem" }}>
                    ... and {executionHistory.length - 5} more executions
                  </p>
                )}
              </div>
            )}
          </div>

          <details className="track3-json-preview">
            <summary>View raw response JSON</summary>
            <pre>{prettyJson(report)}</pre>
          </details>
        </section>
      ) : null}
    </section>
  );
}
