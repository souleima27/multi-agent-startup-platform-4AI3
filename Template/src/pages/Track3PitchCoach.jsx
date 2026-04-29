import { useState, useRef } from "react";

const API_URL = "http://127.0.0.1:5057/pitch/analyze";

function Badge({ children, tone = "info" }) {
  return <span className={`track3-status-badge ${tone}`}>{children}</span>;
}

function ScoreSection({ title, score, details }) {
  const getScoreTone = (value) => {
    if (value >= 80) return "good";
    if (value >= 60) return "warn";
    return "danger";
  };

  return (
    <div
      style={{
        padding: "16px",
        borderRadius: "12px",
        border: "1px solid var(--border)",
        marginBottom: "12px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <strong style={{ color: "var(--navy-900)" }}>{title}</strong>
        <span
          style={{
            display: "inline-block",
            padding: "4px 12px",
            borderRadius: "999px",
            backgroundColor:
              score >= 80
                ? "rgba(34, 197, 94, 0.2)"
                : score >= 60
                  ? "rgba(245, 158, 11, 0.2)"
                  : "rgba(239, 68, 68, 0.2)",
            color: score >= 80 ? "#15803d" : score >= 60 ? "#b45309" : "#b91c1c",
            fontWeight: 600,
            fontSize: "0.9rem",
          }}
        >
          {score}/100
        </span>
      </div>

      {/* Progress Bar */}
      <div style={{ width: "100%", height: "6px", backgroundColor: "rgba(0,0,0,0.1)", borderRadius: "3px", marginBottom: "8px" }}>
        <div
          style={{
            height: "100%",
            width: `${score}%`,
            backgroundColor: score >= 80 ? "#15803d" : score >= 60 ? "#b45309" : "#b91c1c",
            borderRadius: "3px",
          }}
        />
      </div>

      {details && <p style={{ margin: "0", fontSize: "0.9rem", color: "var(--text)" }}>{details}</p>}
    </div>
  );
}

export function Track3PitchCoach({ track }) {
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [coachingMode, setCoachingMode] = useState("investor");
  const [skipVisual, setSkipVisual] = useState(false);
  const [skipVoiceEmotion, setSkipVoiceEmotion] = useState(false);
  const [whisperSize, setWhisperSize] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [report, setReport] = useState(null);
  const fileInputRef = useRef(null);

  const handleVideoSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!["video/mp4", "video/quicktime", "video/x-matroska"].includes(file.type)) {
      setError("Please upload an MP4, MOV, or MKV video file");
      return;
    }

    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
    setError("");
    setReport(null);
  };

  const analyzeVideo = async () => {
    if (!videoFile) {
      setError("Please select a video file");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", videoFile);
      formData.append("coaching_mode", coachingMode);
      formData.append("skip_visual", skipVisual ? "true" : "false");
      formData.append("skip_voice_emotion", skipVoiceEmotion ? "true" : "false");
      formData.append("whisper_size", whisperSize);

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "Pitch Coach analysis failed");
      }

      setReport(data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setReport(null);
      setError(err.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setVideoFile(null);
    setVideoPreview("");
    setError("");
    setReport(null);
    setCoachingMode("investor");
    setSkipVisual(false);
    setSkipVoiceEmotion(false);
    setWhisperSize("medium");
  };

  return (
    <section className="section track-page track3-pitch-coach">
      <style>{`
        .track3-pitch-coach .track-page-hero {
          align-items: stretch;
        }

        .pitch-upload-area {
          border: 2px dashed var(--border);
          border-radius: 16px;
          padding: 40px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: rgba(75, 124, 255, 0.04);
        }

        .pitch-upload-area:hover {
          border-color: rgba(75, 124, 255, 0.5);
          background: rgba(75, 124, 255, 0.08);
        }

        .pitch-upload-area.has-file {
          border-color: rgba(34, 197, 94, 0.3);
          background: rgba(34, 197, 94, 0.08);
        }

        .pitch-options-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-top: 24px;
        }

        .pitch-option {
          padding: 16px;
          border: 1px solid var(--border);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.02);
        }

        .pitch-option label {
          display: block;
          margin-bottom: 8px;
          color: var(--navy-900);
          font-weight: 600;
          font-size: 0.9rem;
        }

        .pitch-option select,
        .pitch-option input[type="checkbox"] {
          width: 100%;
          padding: 8px;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--gray-050);
          color: var(--navy-900);
          font-size: 0.9rem;
        }

        body.dark-mode .pitch-option select,
        body.dark-mode .pitch-option input[type="checkbox"] {
          background: rgba(255, 255, 255, 0.04);
        }

        .pitch-checkbox-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .pitch-checkbox-group input {
          width: auto;
        }

        .pitch-checkbox-group label {
          margin-bottom: 0;
        }

        .pitch-video-preview {
          margin-top: 16px;
          border-radius: 12px;
          overflow: hidden;
          max-width: 100%;
          max-height: 300px;
        }

        .track3-results-card {
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.86);
          box-shadow: var(--shadow-md);
          padding: 30px;
          border-radius: 30px;
          margin-top: 24px;
        }

        body.dark-mode .track3-results-card {
          background: rgba(255, 255, 255, 0.04);
        }

        .pitch-scores-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 16px;
          margin-top: 20px;
        }

        .pitch-insights {
          padding: 20px;
          border-radius: 12px;
          background: rgba(75, 124, 255, 0.08);
          border: 1px solid rgba(75, 124, 255, 0.2);
          margin-top: 20px;
        }

        .pitch-insights h4 {
          margin: 0 0 12px 0;
          color: var(--navy-900);
        }

        .pitch-insights ul {
          margin: 0;
          padding-left: 20px;
        }

        .pitch-insights li {
          color: var(--text);
          margin-bottom: 8px;
          line-height: 1.6;
        }
      `}</style>

      <div className="track-page-hero reveal">
        <div className="track3-hero-copy">
          <div className="track-card-top">
            <span className="track-label">{track?.track || "Track C"}</span>
            <span className="track-badge">Pitch Coach</span>
          </div>

          <div className="track-icon large-track-icon" style={{ fontSize: "3.5rem" }}>
            🎤
          </div>
          <h1>Pitch Coach AI</h1>
          <p>Get intelligent feedback on your pitch video. Analyze delivery, content, narrative, and presence.</p>

          <div className="track-highlights">
            <span className="track-chip">Delivery Analysis</span>
            <span className="track-chip">Content Review</span>
            <span className="track-chip">Visual Feedback</span>
          </div>
        </div>

        <div className="track3-hero-panel">
          <p className="eyebrow">What we analyze</p>

          <div className="track3-panel-grid">
            <div className="track3-inline-card">
              <h3>🎯 Delivery</h3>
              <p>Pace, energy, filler words, sentence structure, and presentation clarity.</p>
            </div>

            <div className="track3-inline-card">
              <h3>📝 Content</h3>
              <p>Pitch messaging, structure, value proposition clarity, and investor appeal.</p>
            </div>

            <div className="track3-inline-card">
              <h3>👁️ Visuals</h3>
              <p>Framing, posture, expressions, and visual confidence cues (optional).</p>
            </div>

            <div className="track3-inline-card">
              <h3>🎙️ Voice</h3>
              <p>Tone, emotion, confidence, and vocal assurance throughout the pitch (optional).</p>
            </div>
          </div>
        </div>
      </div>

      <section className="track3-editor-card reveal delay-1">
        <div className="track3-editor-toolbar">
          <div>
            <p className="eyebrow">Upload & Analyze</p>
            <h2>Pitch Video Analysis</h2>
            <p className="track3-editor-subtitle">
              Upload an MP4, MOV, or MKV video. We'll analyze your pitch and provide detailed feedback.
            </p>
          </div>

          <div className="track3-pill-row">
            <Badge tone="info">Video Analysis</Badge>
            <Badge tone={loading ? "warn" : "good"}>{loading ? "Analyzing" : "Ready"}</Badge>
          </div>
        </div>

        {/* VIDEO UPLOAD */}
        <div
          className={`pitch-upload-area ${videoFile ? "has-file" : ""}`}
          onClick={() => fileInputRef.current?.click()}
        >
          {videoPreview ? (
            <div>
              <video src={videoPreview} className="pitch-video-preview" controls />
              <p style={{ marginTop: "12px", color: "var(--text)" }}>
                <strong>{videoFile?.name}</strong>
              </p>
              <p style={{ color: "var(--text)", fontSize: "0.9rem" }}>Click to change video</p>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: "3rem", marginBottom: "12px" }}>📹</div>
              <p style={{ color: "var(--navy-900)", fontWeight: 600, margin: "0 0 4px 0" }}>
                Click to upload your pitch video
              </p>
              <p style={{ color: "var(--text)", margin: "0", fontSize: "0.9rem" }}>
                MP4, MOV, or MKV • Up to 500MB
              </p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/quicktime,video/x-matroska,.mp4,.mov,.mkv"
            style={{ display: "none" }}
            onChange={handleVideoSelect}
          />
        </div>

        {/* OPTIONS */}
        <div className="pitch-options-grid">
          <div className="pitch-option">
            <label>Coaching Mode</label>
            <select value={coachingMode} onChange={(e) => setCoachingMode(e.target.value)}>
              <option value="investor">Investor Pitch</option>
              <option value="sales">Sales Pitch</option>
              <option value="demo_day">Demo Day</option>
              <option value="class_presentation">Class Presentation</option>
              <option value="founder_story">Founder Story</option>
            </select>
          </div>

          <div className="pitch-option">
            <label>Whisper Model Size</label>
            <select value={whisperSize} onChange={(e) => setWhisperSize(e.target.value)}>
              <option value="tiny">Tiny (Fast)</option>
              <option value="base">Base</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large-v3">Large (Accurate)</option>
            </select>
          </div>

          <div className="pitch-option">
            <div className="pitch-checkbox-group">
              <input
                type="checkbox"
                id="skipVisual"
                checked={skipVisual}
                onChange={(e) => setSkipVisual(e.target.checked)}
              />
              <label htmlFor="skipVisual">Skip Visual Analysis</label>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text)", margin: "8px 0 0 0" }}>
              Faster analysis, no face/posture feedback
            </p>
          </div>

          <div className="pitch-option">
            <div className="pitch-checkbox-group">
              <input
                type="checkbox"
                id="skipVoice"
                checked={skipVoiceEmotion}
                onChange={(e) => setSkipVoiceEmotion(e.target.checked)}
              />
              <label htmlFor="skipVoice">Skip Voice Emotion</label>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text)", margin: "8px 0 0 0" }}>
              Faster analysis, no tone/emotion feedback
            </p>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="track3-editor-actions">
          <button
            className="primary-btn"
            onClick={analyzeVideo}
            disabled={loading || !videoFile}
            style={{ opacity: loading || !videoFile ? 0.6 : 1 }}
          >
            {loading ? "🎬 Analyzing Your Pitch..." : "🚀 Analyze Pitch"}
          </button>

          <button className="secondary-btn" onClick={resetForm} disabled={loading}>
            Reset
          </button>
        </div>

        {error && <div className="track3-message">{error}</div>}
      </section>

      {/* RESULTS */}
      {report ? (
        <section className="track3-results-card reveal delay-2">
          <p className="eyebrow">Analysis Report</p>
          <h2>Your Pitch Feedback</h2>

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
              <p style={{ margin: "0 0 8px 0", color: "#15803d", fontWeight: 600 }}>✓ Unique Analysis Generated</p>
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
                  <strong>File Hash:</strong> <code style={{ fontSize: "0.8rem" }}>{report._execution_meta.file_hash}</code>
                </div>
                <div>
                  <strong>Timestamp:</strong> {new Date(report._execution_meta.timestamp).toLocaleString()}
                </div>
                <div>
                  <strong>Video:</strong> {report._execution_meta.filename} ({report._execution_meta.file_size_kb} KB)
                </div>
                <div>
                  <strong>Coaching Mode:</strong> {report._execution_meta.coaching_mode}
                </div>
                <div>
                  <strong>Analysis:</strong> {report._execution_meta.skip_visual ? "Text only" : "With visuals"} {report._execution_meta.skip_voice_emotion ? "(no voice)" : "(+ voice emotion)"}
                </div>
              </div>
            </div>
          )}

          {report.scorecard && (
            <div>
              <h3 style={{ color: "var(--navy-900)", marginTop: "20px" }}>📊 Overall Scores</h3>
              <div className="pitch-scores-grid">
                {report.scorecard.delivery_score && (
                  <ScoreSection
                    title="Delivery"
                    score={report.scorecard.delivery_score}
                    details="Pace, energy, clarity, and presentation"
                  />
                )}
                {report.scorecard.content_score && (
                  <ScoreSection
                    title="Content"
                    score={report.scorecard.content_score}
                    details="Message clarity, structure, investor appeal"
                  />
                )}
                {report.scorecard.narrative_score && (
                  <ScoreSection
                    title="Narrative"
                    score={report.scorecard.narrative_score}
                    details="Story structure, engagement, impact"
                  />
                )}
              </div>
            </div>
          )}

          {report.full_report?.recommendations && (
            <div className="pitch-insights">
              <h4>💡 Key Recommendations</h4>
              <ul>
                {report.full_report.recommendations.slice(0, 5).map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          )}

          {report.full_report?.strengths && (
            <div className="pitch-insights" style={{ backgroundColor: "rgba(34, 197, 94, 0.08)", borderColor: "rgba(34, 197, 94, 0.2)" }}>
              <h4>✨ Strengths</h4>
              <ul>
                {report.full_report.strengths.slice(0, 5).map((str, idx) => (
                  <li key={idx}>{str}</li>
                ))}
              </ul>
            </div>
          )}

          {report.markdown && (
            <div style={{ marginTop: "20px", padding: "20px", backgroundColor: "rgba(0,0,0,0.02)", borderRadius: "12px" }}>
              <h4>📄 Full Report</h4>
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  fontSize: "0.9rem",
                  maxHeight: "500px",
                  overflow: "auto",
                  color: "var(--text)",
                }}
              >
                {report.markdown}
              </pre>
            </div>
          )}
        </section>
      ) : null}
    </section>
  );
}
