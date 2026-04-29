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
  {
    id: "marketing",
    icon: "📢",
    title: "Marketing Agent",
    subtitle: "Go-to-Market & Growth Strategy",
    description: "Develop comprehensive marketing strategies, customer acquisition plans, and growth experiments.",
    features: [
      "Market analysis",
      "Customer acquisition",
      "Growth experiments",
      "Campaign planning",
    ],
    status: "Coming Soon",
  },
];

function FeatureCard({ feature, isActive, onClick }) {
  const isDisabled = feature.status === "Coming Soon";

  return (
    <div
      className="track3-feature-card"
      onClick={!isDisabled ? onClick : undefined}
      style={{
        cursor: isDisabled ? "not-allowed" : "pointer",
        opacity: isDisabled ? 0.6 : 1,
        pointerEvents: isDisabled ? "none" : "auto",
        border: isActive ? "2px solid rgba(75, 124, 255, 0.8)" : "1px solid var(--border)",
        backgroundColor: isActive ? "rgba(75, 124, 255, 0.08)" : undefined,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
        <div style={{ fontSize: "2.5rem" }}>{feature.icon}</div>
        <span
          style={{
            display: "inline-block",
            padding: "4px 10px",
            borderRadius: "999px",
            fontSize: "0.75rem",
            fontWeight: 700,
            backgroundColor:
              feature.status === "Active"
                ? "rgba(34, 197, 94, 0.2)"
                : "rgba(156, 163, 175, 0.2)",
            color: feature.status === "Active" ? "#15803d" : "#6b7280",
            textTransform: "uppercase",
          }}
        >
          {feature.status}
        </span>
      </div>

      <h3 style={{ margin: "0 0 4px 0", fontSize: "1.25rem", color: "var(--navy-900)", fontFamily: '"Space Grotesk", sans-serif' }}>
        {feature.title}
      </h3>
      <p style={{ margin: "0 0 12px 0", fontSize: "0.9rem", color: "var(--text)" }}>
        {feature.subtitle}
      </p>

      <p style={{ margin: "0 0 14px 0", fontSize: "0.95rem", color: "var(--text)", lineHeight: 1.6 }}>
        {feature.description}
      </p>

      <ul style={{ margin: "0", paddingLeft: "18px", fontSize: "0.9rem" }}>
        {feature.features.map((feat) => (
          <li key={feat} style={{ color: "var(--text)", marginBottom: "6px" }}>
            {feat}
          </li>
        ))}
      </ul>

      {!isDisabled && (
        <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px solid var(--border)" }}>
          <button
            style={{
              width: "100%",
              padding: "8px 12px",
              backgroundColor: "rgba(75, 124, 255, 0.2)",
              color: "var(--blue-500)",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          >
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
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
        }

        .track3-feature-card {
          padding: 24px;
          border: 1px solid var(--border);
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.86);
          box-shadow: var(--shadow-md);
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        body.dark-mode .track3-feature-card {
          background: rgba(255, 255, 255, 0.04);
        }

        .track3-feature-card:hover:not([style*="opacity: 0.6"]) {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
          border-color: rgba(75, 124, 255, 0.5);
        }

        .track3-feature-card ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .track3-feature-card li {
          position: relative;
          padding-left: 20px;
        }

        .track3-feature-card li:before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #15803d;
          font-weight: bold;
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

        @media (max-width: 768px) {
          .track3-features-grid {
            grid-template-columns: 1fr;
          }

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
          to refine your investor narrative, and <strong>Marketing Agent</strong> to plan your customer acquisition strategy.
          Run these tools multiple times as your startup evolves!
        </p>
      </div>
    </section>
  );
}
