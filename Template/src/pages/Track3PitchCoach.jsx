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

    // Validate file type by extension as well as MIME type
    const validExtensions = ['.mp4', '.mov', '.mkv'];
    const hasValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    
    if (!hasValidExtension || !["video/mp4", "video/quicktime", "video/x-matroska"].includes(file.type)) {
      setError("Please upload an MP4, MOV, or MKV video file");
      return;
    }

    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
    setError("");
    setReport(null);
    
    // Log file details for debugging
    console.log(`Video file selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB, ${file.type})`);
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

      console.log("Sending analysis request with:");
      console.log(`  - File: ${videoFile.name} (${videoFile.size} bytes)`);
      console.log(`  - Coaching Mode: ${coachingMode}`);
      console.log(`  - Skip Visual: ${skipVisual}`);
      console.log(`  - Skip Voice: ${skipVoiceEmotion}`);
      console.log(`  - Whisper Size: ${whisperSize}`);

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        console.error("API Error:", data);
        throw new Error(data.error || `API Error: ${response.status}`);
      }

      console.log("Analysis successful:", data);
      setReport(data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Analysis error:", err);
      setReport(null);
      setError(err.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    // Clean up blob URL to prevent memory leaks
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
    
    setVideoFile(null);
    setVideoPreview("");
    setError("");
    setReport(null);
    setCoachingMode("investor");
    setSkipVisual(false);
    setSkipVoiceEmotion(false);
    setWhisperSize("medium");
    
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
            C
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
              <h3>Delivery</h3>
              <p>Pace, energy, filler words, sentence structure, and presentation clarity.</p>
            </div>

            <div className="track3-inline-card">
              <h3>Content</h3>
              <p>Pitch messaging, structure, value proposition clarity, and investor appeal.</p>
            </div>

            <div className="track3-inline-card">
              <h3>Visuals</h3>
              <p>Framing, posture, expressions, and visual confidence cues (optional).</p>
            </div>

            <div className="track3-inline-card">
              <h3>Voice</h3>
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
              <div style={{ fontSize: "3rem", marginBottom: "12px" }}>↑</div>
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
            {loading ? "Analyzing Your Pitch..." : "Analyze Pitch"}
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

          {/* EXECUTION DETAILS SECTION */}
          {report._execution_meta && (
            <div
              style={{
                marginTop: "20px",
                padding: "20px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)",
                border: "2px solid rgba(34, 197, 94, 0.3)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <span style={{ fontSize: "1.5rem" }}>✓</span>
                <h3 style={{ margin: "0", color: "#15803d", fontSize: "1.2rem" }}>Unique Analysis Generated</h3>
              </div>
              
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "16px",
                  marginBottom: "16px",
                }}
              >
                <div style={{ padding: "12px", backgroundColor: "rgba(255,255,255,0.5)", borderRadius: "8px" }}>
                  <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "var(--text-muted)" }}>Execution ID</p>
                  <code style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--navy-900)", wordBreak: "break-all" }}>
                    {report._execution_meta.execution_id}
                  </code>
                </div>
                
                <div style={{ padding: "12px", backgroundColor: "rgba(255,255,255,0.5)", borderRadius: "8px" }}>
                  <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "var(--text-muted)" }}>File Hash</p>
                  <code style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--navy-900)" }}>
                    {report._execution_meta.file_hash}
                  </code>
                </div>
                
                <div style={{ padding: "12px", backgroundColor: "rgba(255,255,255,0.5)", borderRadius: "8px" }}>
                  <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "var(--text-muted)" }}>Timestamp</p>
                  <p style={{ margin: "0", fontSize: "0.9rem", fontWeight: "600", color: "var(--navy-900)" }}>
                    {new Date(report._execution_meta.timestamp).toLocaleString()}
                  </p>
                </div>
                
                <div style={{ padding: "12px", backgroundColor: "rgba(255,255,255,0.5)", borderRadius: "8px" }}>
                  <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "var(--text-muted)" }}>Video File</p>
                  <p style={{ margin: "0", fontSize: "0.9rem", fontWeight: "600", color: "var(--navy-900)" }}>
                    {report._execution_meta.filename}
                  </p>
                </div>
                
                <div style={{ padding: "12px", backgroundColor: "rgba(255,255,255,0.5)", borderRadius: "8px" }}>
                  <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "var(--text-muted)" }}>File Size</p>
                  <p style={{ margin: "0", fontSize: "0.9rem", fontWeight: "600", color: "var(--navy-900)" }}>
                    {report._execution_meta.file_size_kb} KB
                  </p>
                </div>
                
                <div style={{ padding: "12px", backgroundColor: "rgba(255,255,255,0.5)", borderRadius: "8px" }}>
                  <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "var(--text-muted)" }}>Coaching Mode</p>
                  <p style={{ margin: "0", fontSize: "0.9rem", fontWeight: "600", color: "var(--navy-900)" }}>
                    {report._execution_meta.coaching_mode.charAt(0).toUpperCase() + report._execution_meta.coaching_mode.slice(1)}
                  </p>
                </div>
                
                <div style={{ padding: "12px", backgroundColor: "rgba(255,255,255,0.5)", borderRadius: "8px" }}>
                  <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "var(--text-muted)" }}>Visual Analysis</p>
                  <p style={{ margin: "0", fontSize: "0.9rem", fontWeight: "600", color: "var(--navy-900)" }}>
                    {report._execution_meta.skip_visual ? "⊘ Skipped" : "✓ Enabled"}
                  </p>
                </div>
                
                <div style={{ padding: "12px", backgroundColor: "rgba(255,255,255,0.5)", borderRadius: "8px" }}>
                  <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "var(--text-muted)" }}>Voice Emotion</p>
                  <p style={{ margin: "0", fontSize: "0.9rem", fontWeight: "600", color: "var(--navy-900)" }}>
                    {report._execution_meta.skip_voice_emotion ? "⊘ Skipped" : "✓ Enabled"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div style={{ display: "flex", gap: "12px", marginTop: "20px", flexWrap: "wrap" }}>
            <button
              onClick={() => {
                // Generate rich PDF from all available agent JSON data
                const generatePDF = async () => {
                  if (!window.jspdf) {
                    await new Promise((resolve, reject) => {
                      const script = document.createElement("script");
                      script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
                      script.onload = resolve; script.onerror = reject;
                      document.head.appendChild(script);
                    });
                  }
                  const { jsPDF } = window.jspdf;
                  const doc = new jsPDF({ unit: "mm", format: "a4" });
                  const pageW = doc.internal.pageSize.getWidth();
                  const pageH = doc.internal.pageSize.getHeight();
                  const margin = 18;
                  const rightMargin = pageW - margin;
                  const contentW = pageW - margin * 2;
                  let y = 22;
                  let pageNum = 1;

                  const checkPage = (needed = 12) => {
                    if (y + needed > pageH - 15) { doc.addPage(); y = 18; pageNum++; }
                  };

                  const txt = (text, size = 10, bold = false, color = [15, 30, 60], indent = 0) => {
                    doc.setFontSize(size); doc.setFont("helvetica", bold ? "bold" : "normal");
                    doc.setTextColor(...color);
                    const lines = doc.splitTextToSize(String(text ?? ""), contentW - indent);
                    checkPage(lines.length * size * 0.42 + 2);
                    doc.text(lines, margin + indent, y);
                    y += lines.length * size * 0.42 + 2;
                  };

                  const rule = (color = [210, 218, 235]) => {
                    checkPage(8);
                    doc.setDrawColor(...color); doc.setLineWidth(0.3);
                    doc.line(margin, y, rightMargin, y); y += 6;
                  };

                  const sectionHeader = (title, color = [13, 33, 69]) => {
                    checkPage(16);
                    y += 4;
                    doc.setFillColor(240, 244, 255); doc.setDrawColor(180, 195, 230);
                    doc.roundedRect(margin, y - 5, contentW, 10, 2, 2, "FD");
                    txt(title, 12, true, color); y += 1;
                  };

                  const scoreBar = (label, score, status, desc, indent = 0) => {
                    checkPage(20);
                    const sc = score ?? 0;
                    const barColor = sc >= 80 ? [21, 128, 61] : sc >= 60 ? [180, 83, 9] : [185, 28, 28];
                    const bgColor = sc >= 80 ? [220, 252, 231] : sc >= 60 ? [254, 243, 199] : [254, 226, 226];
                    // Label + score badge
                    doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.setTextColor(15, 30, 60);
                    doc.text(label, margin + indent, y);
                    const badge = `${sc}/100${status ? " — " + status : ""}`;
                    doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(...barColor);
                    doc.text(badge, rightMargin - doc.getTextWidth(badge), y);
                    y += 5;
                    // Progress bar track
                    doc.setFillColor(220, 225, 235); doc.roundedRect(margin + indent, y, contentW - indent, 3, 1, 1, "F");
                    // Progress bar fill
                    doc.setFillColor(...barColor); doc.roundedRect(margin + indent, y, (contentW - indent) * sc / 100, 3, 1, 1, "F");
                    y += 6;
                    // Description
                    if (desc) { txt(desc, 8.5, false, [90, 100, 120], indent); }
                    y += 1;
                  };

                  const kv = (label, value, indent = 4) => {
                    if (!value && value !== 0) return;
                    checkPage(8);
                    doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(60, 70, 100);
                    doc.text(`${label}:`, margin + indent, y);
                    doc.setFont("helvetica", "normal"); doc.setTextColor(40, 50, 70);
                    const valStr = typeof value === "object" ? JSON.stringify(value) : String(value);
                    const lines = doc.splitTextToSize(valStr, contentW - indent - 30);
                    doc.text(lines, margin + indent + 30, y);
                    y += lines.length * 9 * 0.42 + 1;
                  };

                  const bullet = (text, indent = 6, color = [40, 50, 70]) => {
                    checkPage(8);
                    doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(...color);
                    const lines = doc.splitTextToSize(`• ${text}`, contentW - indent);
                    doc.text(lines, margin + indent, y);
                    y += lines.length * 9 * 0.42 + 1.5;
                  };

                  const subScore = (label, score) => {
                    if (score === undefined || score === null) return;
                    checkPage(7);
                    const sc = typeof score === "number" ? score : 0;
                    const col = sc >= 75 ? [21, 128, 61] : sc >= 50 ? [180, 83, 9] : [185, 28, 28];
                    doc.setFontSize(8.5); doc.setFont("helvetica", "normal"); doc.setTextColor(60, 70, 100);
                    doc.text(label.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()), margin + 8, y);
                    doc.setFont("helvetica", "bold"); doc.setTextColor(...col);
                    doc.text(`${sc}`, rightMargin - 12, y);
                    y += 5;
                  };

                  // Shorthand refs to all report data
                  const sc = report.reports?.scorecard || {};
                  const fullReport = report.reports?.full_report || {};
                  const fr = fullReport.final_report || fullReport;
                  const md = report.reports?.markdown || fr.markdown_report || "";
                  // Raw analyses come through full_report (API sanitize keeps them)
                  const contentAn = fullReport.agent_state?.analyses?.content || fr.content || {};
                  const narrativeAn = fullReport.agent_state?.analyses?.narrative || fr.narrative || {};
                  const deliveryAn = fullReport.agent_state?.analyses?.delivery || fr.delivery || {};
                  const audioFeats = fullReport.agent_state?.analyses?.audio_features || fr.audio_features || {};
                  const rewrites = fullReport.agent_state?.analyses?.rewrites || fr.rewrites || [];
                  const strategy = fullReport.strategy || fr.strategy || {};
                  const meta = report._execution_meta || {};

                  // ── COVER PAGE ─────────────────────────────────────────────
                  doc.setFillColor(13, 33, 69);
                  doc.rect(0, 0, pageW, 52, "F");
                  doc.setFontSize(22); doc.setFont("helvetica", "bold"); doc.setTextColor(255, 255, 255);
                  doc.text("Pitch Coach Report", margin, 24);
                  doc.setFontSize(10); doc.setFont("helvetica", "normal"); doc.setTextColor(160, 180, 220);
                  doc.text(`Mode: ${meta.coaching_mode || "investor"}`, margin, 34);
                  const fname = meta.filename || "";
                  const fnShort = fname.length > 70 ? fname.slice(0, 67) + "..." : fname;
                  doc.text(fnShort, margin, 40);
                  doc.text(`Generated: ${meta.timestamp ? new Date(meta.timestamp).toLocaleString() : new Date().toLocaleString()}`, margin, 46);
                  y = 60;

                  // ── OVERALL SCORE ──────────────────────────────────────────
                  if (sc.overall_score !== undefined) {
                    const ov = sc.overall_score;
                    const ovCol = ov >= 80 ? [21, 128, 61] : ov >= 60 ? [180, 83, 9] : [185, 28, 28];
                    const ovBg = ov >= 80 ? [220, 252, 231] : ov >= 60 ? [254, 243, 199] : [254, 226, 226];
                    doc.setFillColor(...ovBg); doc.roundedRect(margin, y, contentW, 22, 3, 3, "F");
                    doc.setFontSize(28); doc.setFont("helvetica", "bold"); doc.setTextColor(...ovCol);
                    doc.text(`${ov}`, margin + 6, y + 16);
                    doc.setFontSize(11); doc.setTextColor(15, 30, 60);
                    doc.text(`/ 100  —  ${sc.overall_status || ""}`, margin + 24, y + 10);
                    doc.setFontSize(8.5); doc.setFont("helvetica", "normal"); doc.setTextColor(90, 100, 120);
                    doc.text("Overall weighted pitch score across all analysis dimensions", margin + 24, y + 17);
                    y += 28; rule();
                  }

                  // ── SCORECARD ──────────────────────────────────────────────
                  sectionHeader("Scorecard");
                  const criteria = Array.isArray(sc.criteria) ? sc.criteria : [];
                  criteria.forEach((c) => {
                    if (!c) return;
                    scoreBar(c.label || c.id, c.score, c.status, c.what_it_means);

                    // Evidence details per criterion
                    const ev = c.evidence || {};
                    if (c.id === "content_clarity" && Object.keys(ev).length) {
                      if (Array.isArray(ev.covered_parts) && ev.covered_parts.length) txt(`Covered: ${ev.covered_parts.join(", ")}`, 8, false, [21, 128, 61], 6);
                      if (Array.isArray(ev.missing_parts) && ev.missing_parts.length) txt(`Missing: ${ev.missing_parts.join(", ")}`, 8, false, [185, 28, 28], 6);
                      if (Array.isArray(ev.weak_parts) && ev.weak_parts.length) txt(`Weak: ${ev.weak_parts.join(", ")}`, 8, false, [180, 83, 9], 6);
                      if (ev.main_content_issue) txt(`Issue: ${ev.main_content_issue}`, 8, false, [100, 50, 0], 6);
                    }
                    if (c.id === "delivery_fluency" && Object.keys(ev).length) {
                      const parts = [];
                      if (ev.words_per_minute) parts.push(`${ev.words_per_minute} WPM`);
                      if (ev.filler_count !== undefined) parts.push(`${ev.filler_count} filler words`);
                      if (ev.avg_sentence_length_words) parts.push(`avg ${ev.avg_sentence_length_words} words/sentence`);
                      if (parts.length) txt(`Audio metrics: ${parts.join("  |  ")}`, 8, false, [60, 70, 100], 6);
                    }
                    if (c.id === "narrative_strength" && ev.signals) {
                      const sigs = ev.signals;
                      const sigNames = { opening_hook_score: "Opening hook", problem_clarity_score: "Problem clarity", solution_flow_score: "Solution flow", proof_strength_score: "Proof strength", closing_score: "Closing", ask_clarity_score: "Ask clarity", memorability_score: "Memorability" };
                      Object.entries(sigNames).forEach(([k, label]) => { if (sigs[k] !== undefined) subScore(label, sigs[k]); });
                    }
                    y += 1;
                  });

                  // Scorecard summary
                  const summary = sc.summary || {};
                  if (summary.strongest_criteria?.length || summary.weakest_criteria?.length) {
                    rule([220, 230, 245]);
                    if (summary.strongest_criteria?.length) {
                      txt("Strongest Areas", 10, true, [21, 128, 61]);
                      summary.strongest_criteria.forEach(c => bullet(`${c.label}: ${c.score}/100`, 6, [21, 128, 61]));
                    }
                    if (summary.weakest_criteria?.length) {
                      y += 2; txt("Priority Improvements", 10, true, [185, 28, 28]);
                      summary.weakest_criteria.forEach(c => bullet(`${c.label}: ${c.score}/100`, 6, [185, 28, 28]));
                    }
                  }
                  rule();

                  // ── CONTENT ANALYSIS ───────────────────────────────────────
                  if (Object.keys(contentAn).length || criteria.find(c => c.id === "content_clarity")?.evidence) {
                    const cData = Object.keys(contentAn).length ? contentAn : (criteria.find(c => c.id === "content_clarity")?.evidence || {});
                    sectionHeader("Content Analysis");
                    if (cData.main_content_issue) { txt(`Main Issue: ${cData.main_content_issue}`, 9.5, true, [140, 50, 0]); y += 1; }
                    if (cData.recommended_fix) { txt(cData.recommended_fix, 9, false, [60, 70, 100]); y += 2; }
                    const cf = cData.component_feedback || {};
                    if (Object.keys(cf).length) {
                      txt("Component Breakdown", 10, true); y += 1;
                      Object.entries(cf).forEach(([comp, feedback]) => {
                        if (!feedback) return;
                        checkPage(10);
                        doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(40, 60, 120);
                        doc.text(comp.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()) + ":", margin + 4, y);
                        doc.setFont("helvetica", "normal"); doc.setTextColor(50, 60, 80);
                        const lines = doc.splitTextToSize(String(feedback), contentW - 50);
                        doc.text(lines, margin + 40, y);
                        y += Math.max(lines.length * 9 * 0.42, 5) + 1;
                      });
                    }
                    if (Array.isArray(cData.evidence) && cData.evidence.length) {
                      y += 2; txt("Evidence", 10, true);
                      cData.evidence.slice(0, 8).forEach(e => bullet(String(e)));
                    }
                    rule();
                  }

                  // ── NARRATIVE ANALYSIS ─────────────────────────────────────
                  const narCrit = criteria.find(c => c.id === "narrative_strength");
                  const narData = Object.keys(narrativeAn).length ? narrativeAn : (narCrit?.evidence || {});
                  if (narData.narrative_summary || narData.signals) {
                    sectionHeader("Narrative Analysis");
                    if (narData.narrative_summary) { txt(narData.narrative_summary, 9.5, false, [40, 50, 80]); y += 2; }
                    const sigs = narData.signals || narData;
                    const sigLabels = { opening_hook_score: "Opening Hook", problem_clarity_score: "Problem Clarity", solution_flow_score: "Solution Flow", proof_strength_score: "Proof Strength", ask_clarity_score: "Ask Clarity", closing_score: "Closing", memorability_score: "Memorability" };
                    const hasSigs = Object.keys(sigLabels).some(k => sigs[k] !== undefined);
                    if (hasSigs) {
                      txt("Sub-scores", 10, true); y += 1;
                      Object.entries(sigLabels).forEach(([k, label]) => { if (sigs[k] !== undefined) subScore(label, sigs[k]); });
                    }
                    y += 2;
                    if (narData.strongest_narrative_point) { txt(`Strongest Point: ${narData.strongest_narrative_point}`, 9, false, [21, 128, 61]); }
                    if (narData.weakest_narrative_point) { txt(`Weakest Point: ${narData.weakest_narrative_point}`, 9, false, [185, 28, 28]); }
                    if (Array.isArray(narData.key_gaps) && narData.key_gaps.length) {
                      y += 2; txt("Key Gaps", 10, true, [185, 28, 28]);
                      narData.key_gaps.forEach(g => bullet(String(g), 6, [140, 40, 0]));
                    }
                    if (Array.isArray(narData.coaching_directions) && narData.coaching_directions.length) {
                      y += 2; txt("Coaching Directions", 10, true, [21, 80, 130]);
                      narData.coaching_directions.forEach(d => bullet(String(d), 6, [20, 80, 140]));
                    }
                    rule();
                  }

                  // ── DELIVERY ANALYSIS ──────────────────────────────────────
                  const delCrit = criteria.find(c => c.id === "delivery_fluency");
                  const delObs = deliveryAn.observations || delCrit?.evidence || audioFeats;
                  if (delObs && Object.keys(delObs).length) {
                    sectionHeader("Delivery Analysis");
                    const wpm = delObs.words_per_minute ?? audioFeats.words_per_minute;
                    const fillers = delObs.filler_count ?? audioFeats.filler_count;
                    const energy = delObs.mean_energy ?? audioFeats.mean_energy;
                    const avgSent = delObs.avg_sentence_length_words ?? audioFeats.avg_sentence_length_words;
                    const dur = audioFeats.duration_sec;
                    const wordCount = audioFeats.word_count;
                    if (wpm !== undefined) { kv("Speaking pace", `${wpm} words per minute${wpm < 110 ? " (too slow)" : wpm > 170 ? " (too fast)" : " (good range)"}`); }
                    if (fillers !== undefined) { kv("Filler words", `${fillers} total${fillers > 5 ? " — consider reducing" : fillers === 0 ? " — excellent" : " — acceptable"}`); }
                    if (avgSent !== undefined) { kv("Avg sentence length", `${avgSent} words${avgSent > 24 ? " — sentences may be too long" : " — good"}`); }
                    if (energy !== undefined) { kv("Audio energy", `${parseFloat(energy).toFixed(4)}${energy > 0.02 ? " — strong vocal presence" : " — consider projecting more"}`); }
                    if (dur) { kv("Total duration", `${Math.floor(dur / 60)}m ${Math.round(dur % 60)}s`); }
                    if (wordCount) { kv("Total word count", wordCount); }
                    rule();
                  }

                  // ── COACHING STRATEGY ──────────────────────────────────────
                  if (strategy.dominant_problem || Array.isArray(strategy.top_priorities) && strategy.top_priorities.length) {
                    sectionHeader("Coaching Strategy");
                    if (strategy.dominant_problem) {
                      txt("Dominant Problem", 10, true, [140, 40, 0]);
                      txt(strategy.dominant_problem, 9.5, false, [80, 40, 0]); y += 1;
                      if (strategy.why_this_is_dominant) txt(strategy.why_this_is_dominant, 9, false, [100, 60, 20]); y += 2;
                    }
                    const priorities = strategy.top_priorities || [];
                    if (priorities.length) {
                      txt("Top Priorities", 10, true);
                      priorities.forEach((p, i) => {
                        checkPage(24);
                        y += 2;
                        doc.setFillColor(245, 248, 255); doc.roundedRect(margin, y - 4, contentW, 4, 1, 1, "F");
                        txt(`${i + 1}. ${p.area || ""}`, 9.5, true, [13, 33, 69]);
                        if (p.evidence) txt(`Evidence: ${p.evidence}`, 8.5, false, [80, 90, 120], 4);
                        if (p.coaching_action) txt(`Action: ${p.coaching_action}`, 8.5, false, [40, 100, 60], 4);
                        if (p.success_test) txt(`Success test: ${p.success_test}`, 8.5, false, [100, 80, 20], 4);
                      });
                    }
                    if (Array.isArray(strategy.what_not_to_focus_on_yet) && strategy.what_not_to_focus_on_yet.length) {
                      y += 2; txt("What Not to Focus on Yet", 10, true, [100, 100, 100]);
                      strategy.what_not_to_focus_on_yet.forEach(w => bullet(`${w.area}: ${w.reason}`, 6, [120, 120, 130]));
                    }
                    rule();
                  }

                  // ── NEXT BEST ACTION ───────────────────────────────────────
                  const nba = strategy.next_best_action || fr.next_best_action;
                  if (nba) {
                    sectionHeader("Next Best Action", [20, 100, 60]);
                    doc.setFillColor(220, 252, 231); doc.roundedRect(margin, y, contentW, 30, 3, 3, "F");
                    const nbaAction = typeof nba === "string" ? nba : (nba.action || "");
                    const nbaWhy = typeof nba === "object" ? nba.why : "";
                    const nbaTest = typeof nba === "object" ? nba.success_test : "";
                    doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.setTextColor(15, 100, 50);
                    const nbaLines = doc.splitTextToSize(nbaAction, contentW - 8);
                    doc.text(nbaLines, margin + 4, y + 9);
                    y += nbaLines.length * 11 * 0.42 + 12;
                    if (nbaWhy) { doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(40, 100, 60); const wLines = doc.splitTextToSize(`Why: ${nbaWhy}`, contentW - 8); doc.text(wLines, margin + 4, y); y += wLines.length * 9 * 0.42 + 2; }
                    if (nbaTest) { doc.setFontSize(9); doc.setTextColor(60, 120, 80); const tLines = doc.splitTextToSize(`Success test: ${nbaTest}`, contentW - 8); doc.text(tLines, margin + 4, y); y += tLines.length * 9 * 0.42 + 2; }
                    y += 4; rule();
                  }

                  // ── REWRITE SUGGESTIONS ────────────────────────────────────
                  const rwArr = Array.isArray(rewrites) ? rewrites : [];
                  if (rwArr.length > 0) {
                    sectionHeader("Suggested Rewrites");
                    rwArr.forEach((rw) => {
                      if (!rw) return;
                      checkPage(20);
                      txt(`Part: ${(rw.part || "").toUpperCase()}`, 10, true, [13, 33, 100]);
                      if (rw.original) { txt("Original:", 9, true, [150, 50, 50]); txt(rw.original, 9, false, [120, 50, 50], 4); y += 1; }
                      if (rw.improved) { txt("Improved:", 9, true, [21, 128, 61]); txt(rw.improved, 9, false, [20, 100, 50], 4); }
                      y += 4;
                    });
                    rule();
                  }

                  // ── FULL MARKDOWN REPORT ───────────────────────────────────
                  if (md) {
                    sectionHeader("Full Coaching Report");
                    md.split("\n").forEach((rawLine) => {
                      const line = rawLine.trim();
                      if (!line) { y += 2; return; }
                      if (line.startsWith("# ")) { txt(line.slice(2), 13, true, [13, 33, 69]); y += 1; }
                      else if (line.startsWith("## ")) { y += 2; txt(line.slice(3), 11, true, [30, 60, 140]); }
                      else if (line.startsWith("### ")) { txt(line.slice(4), 10, true, [50, 80, 160]); }
                      else if (line.startsWith("- ") || line.startsWith("* ")) { bullet(line.slice(2)); }
                      else if (/^\d+\.\s/.test(line)) { bullet(line, 6); }
                      else { txt(line, 9, false, [40, 50, 70]); }
                    });
                    rule();
                  }

                  // ── LIMITATIONS ────────────────────────────────────────────
                  if (fr.limitations?.length) {
                    sectionHeader("Limitations & Notes", [100, 80, 0]);
                    fr.limitations.forEach(l => bullet(l, 4, [120, 80, 0]));
                  }

                  // ── PAGE FOOTERS ───────────────────────────────────────────
                  const totalPages = doc.internal.getNumberOfPages();
                  for (let i = 1; i <= totalPages; i++) {
                    doc.setPage(i);
                    doc.setFontSize(7.5); doc.setFont("helvetica", "normal"); doc.setTextColor(160, 170, 190);
                    doc.text(`Pitch Coach Report  •  Page ${i} of ${totalPages}`, margin, pageH - 8);
                    doc.text(meta.execution_id || "", rightMargin - doc.getTextWidth(meta.execution_id || ""), pageH - 8);
                  }

                  const filename = `pitch_report_${meta.execution_id || Date.now()}.pdf`;
                  doc.save(filename);
                };
                generatePDF().catch((err) => alert("PDF generation failed: " + err.message));
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 20px",
                backgroundColor: "#dc2626",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "1rem",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#b91c1c")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#dc2626")}
            >
              Download Report (PDF)
            </button>
            <button
              onClick={() => {
                const element = document.querySelector(".pitch-scores-grid");
                if (element) element.scrollIntoView({ behavior: "smooth" });
              }}
              style={{
                padding: "12px 20px",
                backgroundColor: "var(--navy-900)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "1rem",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1a3a52")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--navy-900)")}
            >
              View Scorecard
            </button>
          </div>

          {/* SCORECARD SCORES */}
          {report.reports?.scorecard ? (
            <div>
              {/* Overall score */}
              {report.reports.scorecard.overall_score !== undefined && (
                <div style={{
                  display: "flex", alignItems: "center", gap: "16px",
                  padding: "16px 20px", borderRadius: "14px", marginTop: "20px",
                  background: report.reports.scorecard.overall_score >= 80
                    ? "rgba(34,197,94,0.12)" : report.reports.scorecard.overall_score >= 60
                    ? "rgba(245,158,11,0.12)" : "rgba(239,68,68,0.12)",
                  border: `1px solid ${report.reports.scorecard.overall_score >= 80
                    ? "rgba(34,197,94,0.35)" : report.reports.scorecard.overall_score >= 60
                    ? "rgba(245,158,11,0.35)" : "rgba(239,68,68,0.35)"}`,
                }}>
                  <span style={{
                    fontSize: "2.4rem", fontWeight: "800",
                    color: report.reports.scorecard.overall_score >= 80 ? "#15803d"
                      : report.reports.scorecard.overall_score >= 60 ? "#b45309" : "#b91c1c",
                  }}>
                    {report.reports.scorecard.overall_score}
                  </span>
                  <div>
                    <p style={{ margin: "0 0 2px", fontWeight: 700, color: "var(--navy-900)" }}>
                      Overall Score — {report.reports.scorecard.overall_status || ""}
                    </p>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text)" }}>
                      Weighted across all analysis dimensions
                    </p>
                  </div>
                </div>
              )}

              <h3 style={{ color: "var(--navy-900)", marginTop: "30px" }}>Your Pitch Scorecard</h3>
              <div className="pitch-scores-grid">
                {(report.reports.scorecard.criteria || []).map((criterion) => {
                  if (!criterion || !criterion.score) return null;
                  const score = criterion.score;
                  const scoreColor = score >= 80 ? "#15803d" : score >= 60 ? "#b45309" : "#b91c1c";
                  const backgroundColor = score >= 80 ? "rgba(34, 197, 94, 0.2)" : score >= 60 ? "rgba(245, 158, 11, 0.2)" : "rgba(239, 68, 68, 0.2)";

                  return (
                    <div key={criterion.id} style={{ padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", backgroundColor }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <strong style={{ color: "var(--navy-900)" }}>{criterion.label}</strong>
                        <div style={{ textAlign: "right" }}>
                          <span style={{ fontSize: "1.4rem", fontWeight: "bold", color: scoreColor }}>{score}</span>
                          <span style={{ fontSize: "0.75rem", color: scoreColor, display: "block" }}>{criterion.status}</span>
                        </div>
                      </div>
                      <div style={{ width: "100%", height: "6px", backgroundColor: "rgba(0,0,0,0.1)", borderRadius: "3px", marginBottom: "8px" }}>
                        <div style={{ height: "100%", width: `${score}%`, backgroundColor: scoreColor, borderRadius: "3px" }} />
                      </div>
                      {criterion.what_it_means && (
                        <p style={{ margin: "0", fontSize: "0.85rem", color: "var(--text)" }}>{criterion.what_it_means}</p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Strongest / Weakest summary */}
              {report.reports.scorecard.summary && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "20px" }}>
                  {report.reports.scorecard.summary.strongest_criteria?.length > 0 && (
                    <div className="pitch-insights" style={{ backgroundColor: "rgba(34,197,94,0.08)", borderColor: "rgba(34,197,94,0.2)" }}>
                      <h4>Strongest Areas</h4>
                      <ul>
                        {report.reports.scorecard.summary.strongest_criteria.map((c, i) => (
                          <li key={i}><strong>{c.label}</strong>: {c.score}/100</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {report.reports.scorecard.summary.weakest_criteria?.length > 0 && (
                    <div className="pitch-insights" style={{ backgroundColor: "rgba(245,158,11,0.08)", borderColor: "rgba(245,158,11,0.2)" }}>
                      <h4>Areas to Improve</h4>
                      <ul>
                        {report.reports.scorecard.summary.weakest_criteria.map((c, i) => (
                          <li key={i}><strong>{c.label}</strong>: {c.score}/100</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : null}

          {/* FULL REPORT ANALYSIS */}
          {report.reports?.full_report ? (() => {
            // Agent shape: full_report.final_report.{title, markdown_report, diagnostic_summary, next_best_action, limitations}
            const fr = report.reports.full_report.final_report || report.reports.full_report;
            const diagSummary = fr.diagnostic_summary;
            const nba = fr.next_best_action;
            const limitations = fr.limitations;
            const hasDiag = diagSummary && typeof diagSummary === "object" && Object.keys(diagSummary).length > 0;
            const hasNba = nba && (typeof nba === "string" ? nba : nba.action);
            if (!hasDiag && !hasNba && !limitations?.length) return null;
            return (
              <div style={{ marginTop: "30px" }}>
                {hasNba && (
                  <div className="pitch-insights" style={{ backgroundColor: "rgba(75,124,255,0.08)", borderColor: "rgba(75,124,255,0.2)" }}>
                    <h4>Next Best Action</h4>
                    <p style={{ margin: 0, fontSize: "0.95rem", color: "var(--text)" }}>
                      {typeof nba === "string" ? nba : nba.action || JSON.stringify(nba)}
                    </p>
                  </div>
                )}
                {hasDiag && (
                  <div className="pitch-insights" style={{ marginTop: "16px" }}>
                    <h4>Diagnostic Summary</h4>
                    <ul>
                      {Object.entries(diagSummary).map(([k, v]) => v ? (
                        <li key={k}><strong>{k.replace(/_/g, " ")}:</strong> {String(v)}</li>
                      ) : null)}
                    </ul>
                  </div>
                )}
                {limitations?.length > 0 && (
                  <div className="pitch-insights" style={{ marginTop: "16px", backgroundColor: "rgba(245,158,11,0.08)", borderColor: "rgba(245,158,11,0.2)" }}>
                    <h4>Limitations</h4>
                    <ul>
                      {limitations.map((l, i) => <li key={i}>{l}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            );
          })() : null}

          {/* MARKDOWN REPORT */}
          {report.reports?.markdown && (
            <details 
              style={{ marginTop: "30px" }}
              open={false}
            >
              <summary style={{ 
                cursor: "pointer", 
                padding: "12px 16px",
                backgroundColor: "rgba(0,0,0,0.03)",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "1rem",
                color: "var(--navy-900)",
                marginBottom: "12px"
              }}>
                View Full Markdown Report (Details)
              </summary>
              <div style={{ padding: "20px", backgroundColor: "rgba(0,0,0,0.02)", borderRadius: "12px", marginTop: "12px" }}>
                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    fontSize: "0.9rem",
                    maxHeight: "600px",
                    overflow: "auto",
                    color: "var(--text)",
                    fontFamily: "monospace",
                    lineHeight: "1.5",
                  }}
                >
                  {report.reports.markdown}
                </pre>
              </div>
            </details>
          )}
        </section>
      ) : null}
    </section>
  );
}
