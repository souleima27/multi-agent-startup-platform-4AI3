import { useState } from "react";
import { Track3Execution } from "./Track3Execution";
import { Track3PitchCoach } from "./Track3PitchCoach";

const HERO_IMAGE = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=75";

const PLAN_BLOCKS = [
  {
    id: "execution",
    label: "Plan",
    title: "Your Roadmap",
    subtitle: "Break your next phase into clear milestones",
    items: ["Define launch milestones", "Set realistic timelines", "Assign priorities per phase"],
    accentColor: "#2f6bff",
    actionLabel: "Build My Plan",
    feature: "execution",
  },
  {
    id: "tasks",
    label: "Tasks",
    title: "Your Actions",
    subtitle: "Stay focused on what moves the needle",
    items: ["Identify top 3 priorities", "Track what is done vs pending", "Remove blockers early"],
    accentColor: "#0d9488",
    actionLabel: null,
    feature: null,
  },
  {
    id: "pitch",
    label: "Progress",
    title: "Your Pitch",
    subtitle: "Present your startup with clarity and confidence",
    items: ["Sharpen your investor story", "Get feedback on delivery", "Improve visual presence"],
    accentColor: "#7c3aed",
    actionLabel: "Open Pitch Coach",
    feature: "pitch-coach",
  },
];

const PROGRESS_ITEMS = [
  { label: "Idea validation", pct: 90 },
  { label: "Legal structure", pct: 55 },
  { label: "Launch readiness", pct: 30 },
];

function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "fixed", top: "84px", left: "24px", zIndex: 90,
        display: "inline-flex", alignItems: "center", gap: "6px",
        padding: "10px 16px",
        background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)",
        border: "1px solid rgba(20,52,100,0.14)", borderRadius: "999px",
        color: "var(--navy-900)", fontWeight: 700, fontSize: "0.88rem",
        cursor: "pointer", boxShadow: "0 4px 16px rgba(14,38,84,0.1)",
        transition: "transform .25s ease, box-shadow .25s ease",
      }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M11 7H3M6 3.5 2.5 7 6 10.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Back to Track C
    </button>
  );
}

export function Track3Hub({ track }) {
  const [selectedFeature, setSelectedFeature] = useState(null);

  if (selectedFeature === "execution") {
    return (
      <div>
        <BackButton onClick={() => setSelectedFeature(null)} />
        <Track3Execution track={track} />
      </div>
    );
  }

  if (selectedFeature === "pitch-coach") {
    return (
      <div>
        <BackButton onClick={() => setSelectedFeature(null)} />
        <Track3PitchCoach track={track} />
      </div>
    );
  }

  return (
    <section className="section track-page track3-hub">
      <style>{`
        /* ── Hub wrapper ─────────────────────────── */
        .track3-hub { padding: 28px 0 60px; }

        /* ── Hero ────────────────────────────────── */
        .t3-hero {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 40px;
          align-items: center;
          padding: 44px 40px;
          border-radius: 28px;
          border: 1px solid var(--border);
          background: rgba(255,255,255,0.97);
          box-shadow: 0 8px 36px rgba(14,38,84,0.08);
          overflow: hidden;
          position: relative;
          margin-bottom: 36px;
        }

        body.dark-mode .t3-hero { background: rgba(10,20,42,0.82); }

        .t3-hero::before {
          content: "";
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 5px;
          background: linear-gradient(90deg, #0d2145, #2f6bff, #5a92ff);
        }

        .t3-hero-copy { display: flex; flex-direction: column; gap: 20px; }

        .t3-eyebrow {
          display: inline-flex;
          align-items: center;
          padding: 7px 14px;
          border-radius: 999px;
          font-size: .72rem;
          font-weight: 800;
          letter-spacing: .06em;
          text-transform: uppercase;
          background: rgba(47,107,255,.1);
          color: var(--navy-800);
          width: fit-content;
        }

        .t3-hero-title {
          margin: 0;
          font-family: "Space Grotesk", sans-serif;
          font-size: clamp(2rem, 4vw, 3.2rem);
          font-weight: 700;
          color: var(--navy-900);
          line-height: 1.05;
          letter-spacing: -.03em;
        }

        .t3-hero-sub {
          margin: 0;
          color: var(--text);
          font-size: 1.05rem;
          line-height: 1.7;
          max-width: 46ch;
        }

        .t3-hero-actions { display: flex; flex-wrap: wrap; gap: 12px; }

        .t3-primary-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 26px;
          border-radius: 999px;
          font-size: .95rem;
          font-weight: 800;
          color: #fff;
          border: 0;
          background: linear-gradient(135deg, #10336a 0%, #2f6bff 55%, #5a92ff 100%);
          box-shadow: 0 12px 30px rgba(21,63,138,.28);
          cursor: pointer;
          text-decoration: none;
          transition: transform .3s ease, box-shadow .3s ease;
        }

        .t3-primary-btn:hover { transform: translateY(-3px); box-shadow: 0 20px 44px rgba(21,63,138,.36); color: #fff; }

        .t3-secondary-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 22px;
          border-radius: 999px;
          font-size: .92rem;
          font-weight: 700;
          color: var(--navy-900);
          border: 1px solid var(--border);
          background: rgba(255,255,255,.9);
          box-shadow: 0 4px 14px rgba(12,34,74,.07);
          cursor: pointer;
          text-decoration: none;
          transition: transform .3s ease, box-shadow .3s ease;
        }

        .t3-secondary-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(14,38,84,.12); }

        /* ── Hero image ──────────────────────────── */
        .t3-hero-visual {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          aspect-ratio: 4/3;
          box-shadow: 0 16px 48px rgba(14,38,84,.14);
        }

        .t3-hero-visual img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .t3-hero-visual::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 40%, rgba(10,25,60,.18));
        }

        /* ── Blocks grid ─────────────────────────── */
        .t3-blocks {
          display: grid;
          grid-template-columns: repeat(3, minmax(0,1fr));
          gap: 22px;
          margin-bottom: 28px;
        }

        .t3-block {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 26px;
          border-radius: 24px;
          border: 1px solid var(--border);
          background: rgba(255,255,255,.97);
          box-shadow: 0 4px 20px rgba(14,38,84,.07);
          transition: transform .34s ease, box-shadow .34s ease;
        }

        body.dark-mode .t3-block { background: rgba(10,20,42,.72); }

        .t3-block:hover { transform: translateY(-6px); box-shadow: 0 20px 48px rgba(14,38,84,.13); }

        .t3-block-label {
          display: inline-flex;
          align-items: center;
          padding: 5px 11px;
          border-radius: 999px;
          font-size: .7rem;
          font-weight: 800;
          letter-spacing: .06em;
          text-transform: uppercase;
          width: fit-content;
          color: #fff;
        }

        .t3-block-title {
          margin: 0;
          font-family: "Space Grotesk", sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--navy-900);
        }

        .t3-block-sub {
          margin: 0;
          font-size: .9rem;
          color: var(--text);
          line-height: 1.6;
        }

        .t3-block-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .t3-block-list li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: .9rem;
          color: var(--text);
          line-height: 1.5;
        }

        .t3-check {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .t3-block-action {
          margin-top: auto;
          padding-top: 14px;
          border-top: 1px solid var(--border);
        }

        .t3-block-btn {
          width: 100%;
          padding: 11px 14px;
          border-radius: 14px;
          border: 1px solid rgba(47,107,255,.28);
          background: rgba(47,107,255,.07);
          color: var(--blue-500);
          font-size: .88rem;
          font-weight: 800;
          cursor: pointer;
          transition: background .25s ease, transform .25s ease;
        }

        .t3-block-btn:hover { background: rgba(47,107,255,.14); transform: translateY(-1px); }

        /* ── Progress block ───────────────────────── */
        .t3-progress-block {
          padding: 28px 32px;
          border-radius: 24px;
          border: 1px solid var(--border);
          background: rgba(255,255,255,.97);
          box-shadow: 0 4px 20px rgba(14,38,84,.07);
          display: grid;
          gap: 20px;
          margin-bottom: 28px;
        }

        body.dark-mode .t3-progress-block { background: rgba(10,20,42,.72); }

        .t3-progress-header { display: flex; justify-content: space-between; align-items: center; }

        .t3-progress-title {
          margin: 0;
          font-family: "Space Grotesk", sans-serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--navy-900);
        }

        .t3-progress-sub { margin: 0; font-size: .88rem; color: var(--text); }

        .t3-progress-items { display: flex; flex-direction: column; gap: 14px; }

        .t3-progress-row { display: grid; gap: 6px; }

        .t3-progress-row-top { display: flex; justify-content: space-between; align-items: center; }

        .t3-progress-label { font-size: .88rem; font-weight: 600; color: var(--navy-900); }

        .t3-progress-pct { font-size: .82rem; font-weight: 700; color: var(--blue-500); }

        .t3-progress-track {
          height: 8px;
          border-radius: 999px;
          background: rgba(47,107,255,.1);
          overflow: hidden;
        }

        .t3-progress-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #0d2145, #2f6bff);
          transition: width .9s ease;
        }

        /* ── Next Step card ──────────────────────── */
        .t3-next-step {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 24px;
          align-items: center;
          padding: 28px 32px;
          border-radius: 24px;
          border: 1px solid rgba(47,107,255,.22);
          background: linear-gradient(135deg, rgba(13,33,69,.04) 0%, rgba(47,107,255,.06) 100%);
          box-shadow: 0 4px 20px rgba(14,38,84,.06);
        }

        .t3-next-step-label {
          font-size: .72rem;
          font-weight: 800;
          letter-spacing: .06em;
          text-transform: uppercase;
          color: var(--blue-500);
          margin-bottom: 6px;
        }

        .t3-next-step-text {
          margin: 0;
          font-family: "Space Grotesk", sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--navy-900);
        }

        .t3-next-step-sub {
          margin: 6px 0 0;
          font-size: .9rem;
          color: var(--text);
        }

        /* ── Responsive ───────────────────────────── */
        @media(max-width:960px) {
          .t3-hero { grid-template-columns: 1fr; }
          .t3-hero-visual { aspect-ratio: 16/7; }
          .t3-blocks { grid-template-columns: 1fr; }
          .t3-next-step { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Hero */}
      <div className="t3-hero reveal">
        <div className="t3-hero-copy">
          <span className="t3-eyebrow">{track?.track || "Track C"} — Launch &amp; Grow</span>
          <h1 className="t3-hero-title">Launch and manage your startup clearly</h1>
          <p className="t3-hero-sub">
            Plan your steps, track progress, and stay focused on what matters most for your startup.
          </p>
          <div className="t3-hero-actions">
            <button className="t3-primary-btn" onClick={() => setSelectedFeature("execution")}>
              Start My Plan
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                <path d="M2.5 7.5h10M8.5 3.5l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button className="t3-secondary-btn" onClick={() => setSelectedFeature("pitch-coach")}>
              Open Pitch Coach
            </button>
          </div>
        </div>

        <div className="t3-hero-visual">
          <img
            src={HERO_IMAGE}
            alt="Startup team planning and launching together"
            loading="lazy"
          />
        </div>
      </div>

      {/* Three blocks */}
      <div className="t3-blocks reveal delay-1">
        {PLAN_BLOCKS.map((block) => (
          <div key={block.id} className="t3-block">
            <span className="t3-block-label" style={{ background: block.accentColor }}>
              {block.label}
            </span>
            <h3 className="t3-block-title">{block.title}</h3>
            <p className="t3-block-sub">{block.subtitle}</p>
            <ul className="t3-block-list">
              {block.items.map((item) => (
                <li key={item}>
                  <span className="t3-check" style={{ background: `${block.accentColor}18` }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                      <path d="M2 5l2.5 2.5L8 3" stroke={block.accentColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            {block.actionLabel && block.feature && (
              <div className="t3-block-action">
                <button
                  className="t3-block-btn"
                  style={{ borderColor: `${block.accentColor}44`, color: block.accentColor, background: `${block.accentColor}0d` }}
                  onClick={() => setSelectedFeature(block.feature)}
                >
                  {block.actionLabel}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="t3-progress-block reveal delay-2">
        <div className="t3-progress-header">
          <div>
            <h3 className="t3-progress-title">Your Progress</h3>
            <p className="t3-progress-sub">A snapshot of where your startup stands today</p>
          </div>
        </div>
        <div className="t3-progress-items">
          {PROGRESS_ITEMS.map((item) => (
            <div key={item.label} className="t3-progress-row">
              <div className="t3-progress-row-top">
                <span className="t3-progress-label">{item.label}</span>
                <span className="t3-progress-pct">{item.pct}%</span>
              </div>
              <div className="t3-progress-track">
                <div className="t3-progress-fill" style={{ width: `${item.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Step */}
      <div className="t3-next-step reveal delay-3">
        <div>
          <p className="t3-next-step-label">Recommended next action</p>
          <p className="t3-next-step-text">Your next best step to move forward</p>
          <p className="t3-next-step-sub">
            Build a clear execution plan with milestones, task breakdowns, and timelines.
          </p>
        </div>
        <button className="t3-primary-btn" onClick={() => setSelectedFeature("execution")}>
          Get Recommendation
        </button>
      </div>
    </section>
  );
}
