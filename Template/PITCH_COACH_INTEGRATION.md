# Pitch Coach Integration Guide 🎤

## What's New

### Files Created
```
✓ pitch_coach_api.py          → Backend API server for pitch analysis
✓ Track3PitchCoach.jsx         → React component with upload & analysis UI
```

### Files Updated
```
✓ Track3Hub.jsx               → Added Pitch Coach as ACTIVE feature
✓ App.jsx                     → (no changes needed)
```

---

## Architecture

```
┌─────────────────────────────────────────────┐
│  Browser (React)                            │
│  ├─ Track3Hub.jsx (Menu)                   │
│  └─ Track3PitchCoach.jsx (Upload + Form)   │
└───────────────┬─────────────────────────────┘
                │ HTTP POST
                ↓
┌─────────────────────────────────────────────┐
│  pitch_coach_api.py (Port 5057)             │
│  ├─ GET / → API Info                       │
│  ├─ GET /pitch/health → Status             │
│  └─ POST /pitch/analyze → Run Agent        │
└───────────────┬─────────────────────────────┘
                │ subprocess.run()
                ↓
┌─────────────────────────────────────────────┐
│  agentic_pitch_coach.py (Track3/pitch/)     │
│  ├─ Extract audio                          │
│  ├─ Transcribe (Whisper)                   │
│  ├─ Analyze delivery                       │
│  ├─ Analyze content (LLM)                  │
│  ├─ Analyze narrative (LLM)                │
│  ├─ Sample frames (Optional)               │
│  ├─ Analyze visuals (Optional)             │
│  └─ Generate reports (JSON, MD, PDF)       │
└─────────────────────────────────────────────┘
```

---

## How to Use

### 1. Start the Pitch Coach API Server

```bash
cd C:\Users\asus\Desktop\FullProject\Template
python pitch_coach_api.py
```

Expected output:
```
Pitch Coach API listening on http://127.0.0.1:5057
```

### 2. Make sure other servers are running

```bash
# Terminal 1: Pitch Coach API (just started above)
python pitch_coach_api.py

# Terminal 2: Track3 Execution API
python track3_api.py

# Terminal 3: React Dev Server
npm run dev
```

### 3. Open in Browser

```
http://localhost:5173/#track-c
```

### 4. Select Pitch Coach

- Hub page loads with 3 cards
- Pitch Coach card = **GREEN (ACTIVE)** ✅
- Click "Pitch Coach" → Opens upload form

### 5. Upload Video & Analyze

```
1. Click upload area or select video button
2. Choose MP4, MOV, or MKV file
3. Configure options (optional):
   - Coaching Mode: investor/sales/demo_day/etc
   - Whisper Size: tiny/base/small/medium/large
   - Skip Visual: unchecked (analyze visuals)
   - Skip Voice Emotion: unchecked (analyze emotion)
4. Click "🚀 Analyze Pitch"
5. Wait for analysis (2-5 minutes depending on video length)
6. View results with scores and recommendations
```

---

## API Endpoints

### GET /pitch/health
Check if Pitch Coach API is running:
```bash
curl http://127.0.0.1:5057/pitch/health
```

Response:
```json
{
  "ok": true,
  "agent_script": "C:\\...\\agentic_pitch_coach.py",
  "python": "C:\\...\\python.exe",
  "output_dir": "C:\\...\\pitch_coach_outputs",
  "pitch_agent_exists": true
}
```

### POST /pitch/analyze
Analyze a pitch video:
```bash
curl -X POST http://127.0.0.1:5057/pitch/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "video_path": "C:\\path\\to\\pitch.mp4",
    "coaching_mode": "investor",
    "skip_visual": false,
    "skip_voice_emotion": false,
    "whisper_size": "medium"
  }'
```

Response:
```json
{
  "ok": true,
  "session_id": "session_1714000000000",
  "video_path": "C:\\path\\to\\pitch.mp4",
  "output_dir": "C:\\...\\pitch_coach_outputs\\session_xxx",
  "reports": {
    "full_report": {...},
    "scorecard": {...},
    "markdown": "...",
    "pdf_path": "..."
  }
}
```

---

## Configuration

### Environment Variables (Optional)
```bash
# Set these before running pitch_coach_api.py
export OPENAI_API_KEY="your_api_key"
export OPENAI_BASE_URL="https://tokenfactory.esprit.tn/api"
export OPENAI_MODEL="hosted_vllm/Llama-3.1-70B-Instruct"
export PYTHON_EXECUTABLE="path/to/python.exe"
```

### Default Settings (Already Configured)
```python
DEFAULT_OPENAI_BASE_URL = "https://tokenfactory.esprit.tn/api"
DEFAULT_OPENAI_MODEL = "hosted_vllm/Llama-3.1-70B-Instruct"
DEFAULT_WHISPER_SIZE = "medium"
```

---

## Frontend Features

### Upload Area
- Click to upload video
- Supports: MP4, MOV, MKV
- Shows video preview
- Click again to change video

### Configuration Options
```
┌─ Coaching Mode ─────────────────┐
│ • Investor (default)            │
│ • Sales                         │
│ • Demo Day                      │
│ • Class Presentation            │
│ • Founder Story                 │
└─────────────────────────────────┘

┌─ Whisper Model Size ────────────┐
│ • Tiny (Fast)                   │
│ • Base                          │
│ • Small                         │
│ • Medium (default)              │
│ • Large (Accurate)              │
└─────────────────────────────────┘

┌─ Optional Analysis ─────────────┐
│ ☐ Skip Visual Analysis          │
│ ☐ Skip Voice Emotion Analysis   │
└─────────────────────────────────┘
```

### Results Display
```
✓ Overall Scores (Delivery, Content, Narrative)
✓ Progress bars for each score (0-100)
✓ Color-coded (Green: 80+, Yellow: 60-79, Red: <60)
✓ Key recommendations
✓ Strengths identified
✓ Full markdown report (collapsible)
✓ JSON data available (via API)
```

---

## Output Files

The Pitch Coach generates reports in:
```
pitch_coach_outputs/
└── session_1714000000000/
    └── reports/
        ├── agentic_pitch_coach_full_report.json
        ├── agentic_pitch_coach_scorecard.json
        ├── agentic_pitch_coach_report.md
        └── agentic_pitch_coach_report.pdf (if reportlab installed)
```

---

## What Gets Analyzed

### 1. **Delivery Analysis** (Automatic)
- Pace (words per minute)
- Filler words (um, uh, like, you know)
- Energy level (flat vs. engaged)
- Sentence length (complex vs. simple)
- Speaking clarity
- Verbal hesitations

### 2. **Content Analysis** (LLM-powered)
- Problem clarity
- Solution positioning
- Value proposition strength
- Market opportunity articulation
- Competitive differentiation
- Call-to-action clarity

### 3. **Narrative Analysis** (LLM-powered)
- Story structure
- Emotional engagement
- Founder credibility
- Vision communication
- Audience connection
- Overall impact

### 4. **Visual Analysis** (Optional, MediaPipe)
- Face detection and framing
- Posture analysis
- Eye contact simulation
- Gesture tracking
- Confidence cues
- Visual consistency

### 5. **Voice Emotion** (Optional, Hugging Face)
- Emotion timeline (happy, sad, angry, fear, calm)
- Confidence timeline
- Vocal assurance metrics
- Tone consistency

---

## Troubleshooting

### Issue: "Video file not found"
**Solution:** Ensure video path is absolute and file exists
```bash
# ❌ Wrong
python pitch_coach_api.py
# Upload: "pitch.mp4"

# ✅ Correct
# Upload: "C:\Users\...\pitch.mp4"
```

### Issue: API returns 500 error
**Solution:** Check Python environment and dependencies
```bash
cd C:\Users\asus\Desktop\FullProject\Track3\pitch
python -m pip install -r requirements_pitch_coach.txt
```

### Issue: Analysis takes too long (10+ minutes)
**Solution:** Use smaller models and skip optional analysis
```javascript
// In Track3PitchCoach form:
whisperSize: "tiny"  // Instead of "large-v3"
skipVisual: true     // Skip visual analysis
skipVoiceEmotion: true // Skip voice emotion
```

### Issue: "No module named 'faster_whisper'"
**Solution:** Install pitch coach requirements in venv
```bash
cd Track3/pitch
.\.venv\Scripts\Activate.ps1
pip install -r requirements_pitch_coach.txt
```

---

## Testing Checklist

### Manual Testing
```
✓ API health check: curl http://127.0.0.1:5057/pitch/health
✓ Hub page loads: http://localhost:5173/#track-c
✓ Pitch Coach card visible and active (green)
✓ Click "Pitch Coach" → Opens upload form
✓ Upload a small video (< 30 seconds)
✓ Click "Analyze Pitch"
✓ Wait for analysis to complete
✓ View results with scores
✓ Click back button → Returns to hub
```

### Sample Test Videos
Create a short test video:
```bash
# Using ffmpeg to create a 10-second test video
ffmpeg -f lavfi -i testsrc=duration=10:size=1280x720:rate=30 \
  -f lavfi -i sine=frequency=1000:duration=10 \
  -pix_fmt yuv420p test_pitch.mp4
```

---

## Next Steps

### Soon Ready
- Marketing Agent (same structure as Pitch Coach)
- Scenario planning for Execution Agent
- Historical execution comparison

### Enhancement Ideas
- Support for Zoom/Teams recordings
- Slide deck analysis (alongside video)
- Competitor pitch analysis
- Fundraising email feedback
- Demo video coaching

---

## Status

```
Track C Features:
✅ Execution Agent    - ACTIVE
✅ Pitch Coach       - ACTIVE
⏳ Marketing Agent    - Coming Soon
```

**Total Time to Integrate:** ~30 minutes
**Lines of Code Added:** ~1000 (API + Component)
**Dependencies:** Inherited from existing Pitch Coach setup
