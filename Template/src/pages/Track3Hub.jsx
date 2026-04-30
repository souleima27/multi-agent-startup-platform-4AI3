import { useState } from "react";
import { Track3Execution } from "./Track3Execution";
import { Track3PitchCoach } from "./Track3PitchCoach";

const TRACK3_FEATURES = [
  {
    id: "execution",
    icon: "⚡",
    title: "Execution Agent",
    subtitle: "Project Management & Planning",
    description: "Generate complete execution plans with task breakdowns, team assignments, and feasibility analysis.",
    features: [
      "Automatic task generation",
      "Smart team assignments",
      "Risk detection",
      "Jira integration",
    ],
    status: "Active",
  },
  {
    id: "pitch-coach",
    icon: "🎤",
    title: "Pitch Coach",
    subtitle: "Pitch Deck & Investor Messaging",
    description: "Get AI-powered feedback on your pitch video. Analyze delivery, content, narrative, and visual presence.",
    features: [
      "Delivery analysis",
      "Content review",
      "Visual feedback",
      "Voice emotion analysis",
    ],
    status: "Active",
  },
];

function FeatureCard({ feature, isActive, onClick }) {
  const isDisabled = feature.status === "Coming Soon";

  return (
    <div
      className={`track3-feature-card${isActive ? " is-active" : ""}${isDisabled ? " is-disabled" : ""}`}
      onClick={!isDisabled ? onClick : undefined}
    >
      <div className="track3-feature-header">
        <div className="track3-feature-icon" aria-hidden="true">
          {feature.icon}
        </div>
        <span className={`track3-feature-status${feature.status === "Active" ? " is-active" : ""}`}>
          {feature.status}
        </span>
      </div>

      <div className="track3-feature-body">
        <h3 className="track3-feature-title">{feature.title}</h3>
        <p className="track3-feature-subtitle">{feature.subtitle}</p>
        <p className="track3-feature-description">{feature.description}</p>

        <ul className="track3-feature-list">
          {feature.features.map((feat) => (
            <li key={feat}>{feat}</li>
          ))}
        </ul>
      </div>

      {!isDisabled && (
        <div className="track3-feature-action">
          <button className="track3-feature-btn" type="button">
            Open {feature.title}
          </button>
        </div>
      )}
    </div>
  );
}

export function Track3Hub({ track }) {
  const [selectedFeature, setSelectedFeature] = useState(null);

  // If a feature is selected, render that feature's page
  if (selectedFeature === "execution") {
    return (
      <div>
        <button
          onClick={() => setSelectedFeature(null)}
          style={{
            position: "fixed",
            top: "20px",
            left: "20px",
            zIndex: 100,
            padding: "8px 14px",
            backgroundColor: "rgba(75, 124, 255, 0.2)",
            color: "var(--blue-500)",
            border: "1px solid rgba(75, 124, 255, 0.3)",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "0.9rem",
          }}
        >
          ← Back to Track C Menu
        </button>
        <Track3Execution track={track} />
      </div>
    );
  }

  if (selectedFeature === "pitch-coach") {
    return (
      <div>
        <button
          onClick={() => setSelectedFeature(null)}
          style={{
            position: "fixed",
            top: "20px",
            left: "20px",
            zIndex: 100,
            padding: "8px 14px",
            backgroundColor: "rgba(75, 124, 255, 0.2)",
            color: "var(--blue-500)",
            border: "1px solid rgba(75, 124, 255, 0.3)",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "0.9rem",
          }}
        >
          ← Back to Track C Menu
        </button>
        <Track3PitchCoach track={track} />
      </div>
    );
  }

  // Show the feature selection menu
  return (
    <section className="section track-page track3-hub">
      <style>{`
        .track3-hub .track-page-hero {
          align-items: stretch;
        }

        .track3-hub-header {
          margin-bottom: 40px;
          text-align: center;
        }

        .track3-hub-header h1 {
          font-size: clamp(2.2rem, 5vw, 3.5rem);
          margin: 0 0 12px 0;
          color: var(--navy-900);
          font-family: "Space Grotesk", sans-serif;
          line-height: 1;
        }

        .track3-hub-header p {
          font-size: 1.1rem;
          color: var(--text);
          margin: 0;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .track3-features-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(280px, 1fr));
          gap: 28px;
          margin: 0 auto 42px;
          max-width: 920px;
        }

        .track3-feature-card {
          padding: 28px;
          border: 1px solid var(--border);
          border-radius: 24px;
          background: linear-gradient(160deg, rgba(255, 255, 255, 0.95), rgba(237, 244, 255, 0.7));
          box-shadow: 0 20px 50px rgba(10, 32, 73, 0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        body.dark-mode .track3-feature-card {
          background: linear-gradient(160deg, rgba(10, 20, 40, 0.7), rgba(10, 20, 40, 0.3));
        }

        .track3-feature-card.is-active {
          border-color: rgba(75, 124, 255, 0.7);
          box-shadow: 0 24px 60px rgba(20, 60, 150, 0.18);
        }

        .track3-feature-card.is-disabled {
          opacity: 0.6;
          cursor: not-allowed;
          pointer-events: none;
        }

        .track3-feature-card:hover:not(.is-disabled) {
          transform: translateY(-6px);
          box-shadow: 0 28px 70px rgba(10, 32, 73, 0.16);
          border-color: rgba(75, 124, 255, 0.45);
        }

        .track3-feature-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }

        .track3-feature-icon {
          width: 56px;
          height: 56px;
          border-radius: 18px;
          display: grid;
          place-items: center;
          font-size: 1.8rem;
          background: linear-gradient(140deg, rgba(13, 33, 69, 0.9), rgba(75, 124, 255, 0.9));
          color: #fff;
          box-shadow: 0 16px 30px rgba(13, 33, 69, 0.25);
        }

        .track3-feature-status {
          display: inline-flex;
          align-items: center;
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          background: rgba(156, 163, 175, 0.2);
          color: #6b7280;
        }

        .track3-feature-status.is-active {
          background: rgba(34, 197, 94, 0.18);
          color: #15803d;
        }

        .track3-feature-body {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .track3-feature-title {
          margin: 0;
          font-size: 1.35rem;
          color: var(--navy-900);
          font-family: "Space Grotesk", sans-serif;
        }

        .track3-feature-subtitle {
          margin: 0;
          font-size: 0.92rem;
          color: var(--navy-700);
          font-weight: 600;
        }

        .track3-feature-description {
          margin: 0;
          font-size: 0.98rem;
          color: var(--text);
          line-height: 1.65;
        }

        .track3-feature-card ul {
          list-style: none;
          padding: 0;
          margin: 6px 0 0;
        }

        .track3-feature-card li {
          position: relative;
          padding-left: 20px;
          color: var(--text);
          font-size: 0.92rem;
          line-height: 1.55;
        }

        .track3-feature-card li:before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #15803d;
          font-weight: bold;
        }

        .track3-feature-action {
          margin-top: auto;
          padding-top: 14px;
          border-top: 1px solid var(--border);
        }

        .track3-feature-btn {
          width: 100%;
          padding: 10px 14px;
          border-radius: 12px;
          border: 1px solid rgba(75, 124, 255, 0.3);
          background: linear-gradient(135deg, rgba(75, 124, 255, 0.18), rgba(13, 33, 69, 0.06));
          color: var(--blue-500);
          font-weight: 700;
          font-size: 0.92rem;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .track3-feature-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 24px rgba(20, 60, 150, 0.18);
        }

        .track3-hub-info {
          padding: 24px;
          background: rgba(75, 124, 255, 0.08);
          border: 1px solid rgba(75, 124, 255, 0.2);
          border-radius: 16px;
          margin-bottom: 40px;
        }

        .track3-hub-info h3 {
          margin: 0 0 8px 0;
          color: var(--navy-900);
          font-family: "Space Grotesk", sans-serif;
        }

        .track3-hub-info p {
          margin: 0;
          color: var(--text);
          line-height: 1.6;
        }

        @media (max-width: 980px) {
          .track3-features-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .track3-hub-header h1 {
            font-size: 2rem;
          }
        }
      `}</style>

      <div className="track-page-hero reveal">
        <div className="track3-hub-header">
          <div className="track-card-top" style={{ justifyContent: "center", marginBottom: "20px" }}>
            <span className="track-label">{track?.track || "Track C"}</span>
          </div>
          <div className="track-icon large-track-icon" style={{ fontSize: "4rem", marginBottom: "20px" }}>
            {track?.icon || "C"}
          </div>
          <h1>Choose Your Track C Tool</h1>
          <p>
            Select from our suite of AI-powered tools designed to help you execute, pitch, and grow your startup.
          </p>
        </div>
      </div>

      <div className="track3-hub-info reveal delay-1">
        <h3>🎯 What is Track C?</h3>
        <p>
          Track C provides AI-powered agents that act as expert advisors for different aspects of your startup journey.
          Each tool uses advanced AI to analyze your inputs and provide actionable insights tailored to your specific situation.
        </p>
      </div>

      <div className="track3-features-grid reveal delay-2">
        {TRACK3_FEATURES.map((feature) => (
          <FeatureCard
            key={feature.id}
            feature={feature}
            isActive={selectedFeature === feature.id}
            onClick={() => setSelectedFeature(feature.id)}
          />
        ))}
      </div>

      <div className="track3-hub-info reveal delay-3" style={{ backgroundColor: "rgba(34, 197, 94, 0.08)", borderColor: "rgba(34, 197, 94, 0.2)" }}>
        <h3 style={{ color: "#15803d" }}>💡 Pro Tips</h3>
        <p>
          Start with <strong>Execution Agent</strong> to get a clear project plan. Then use <strong>Pitch Coach</strong>
          to refine your investor narrative. Run these tools multiple times as your startup evolves!
        </p>
      </div>
    </section>
  );
}
