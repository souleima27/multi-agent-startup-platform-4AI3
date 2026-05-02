#!/usr/bin/env python3
"""
Pitch Coach API Server for Track C
Handles video file uploads and generates unique execution IDs for each analysis
"""

import json
import os
import subprocess
import sys
import uuid
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import tempfile
import hashlib
from urllib.parse import parse_qs
from io import BytesIO
import time

BASE_DIR = Path(__file__).resolve().parent
PITCH_AGENT_PATH = Path(__file__).resolve().parent.parent / "Track3" / "pitch" / "agentic_pitch_coach.py"
UPLOADS_DIR = BASE_DIR / "pitch_coach_uploads"
OUTPUT_DIR = BASE_DIR / "pitch_coach_outputs"
CONFIG_FILE = BASE_DIR / "pitch_coach.config.json"
UPLOADS_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)

HOST = "127.0.0.1"
PORT = 5057

# Load configuration
def load_config():
    """Load Pitch Coach configuration from JSON file"""
    if not CONFIG_FILE.exists():
        return {}
    try:
        with open(CONFIG_FILE, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"[Pitch Coach] Warning: Could not load config file: {e}")
        return {}

CONFIG = load_config()

def resolve_python():
    """Find Python executable"""
    candidates = []
    
    # Only add env python if it's actually set and not empty
    env_python = os.getenv("PYTHON_EXECUTABLE", "").strip()
    if env_python:
        candidates.append(Path(env_python))
    
    # Add default candidates
    candidates.extend([
        Path(r"C:\Users\asus\AppData\Local\Programs\Python\Python312\python.exe"),
        Path(sys.executable),
    ])
    
    # Return first one that exists
    for candidate in candidates:
        try:
            if candidate.exists():
                return str(candidate)
        except Exception:
            continue
    
    return sys.executable

def is_mediapipe_available():
    """Check if MediaPipe is installed"""
    try:
        import mediapipe
        return True
    except ImportError:
        return False

def generate_execution_id():
    """Generate unique execution ID"""
    return f"pitch_{int(time.time() * 1000)}_{uuid.uuid4().hex[:8]}"

def calculate_file_hash(file_path):
    """Calculate hash of video file"""
    hash_md5 = hashlib.md5()
    with open(file_path, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()[:12]

def sanitize_response(data):
    """
    Recursively remove sensitive paths and internal analysis data from response.
    ONLY removes:
    - File system paths (frame_paths, file_path, etc.)
    - Internal agent state (agent_state, raw_state_full)
    - Tool tracking data (tool_results, completed_tools, decisions)
    
    KEEPS:
    - All analysis results (scores, recommendations, strengths, insights)
    - Scorecard criteria and evidence
    - Full reports and markdown
    """
    if isinstance(data, dict):
        # Create new dict with filtered keys
        sanitized = {}
        for key, value in data.items():
            # Skip ONLY these sensitive internal keys
            SKIP_KEYS = {
                'frame_paths',          # Frame image paths
                'frames',               # Frame data/metadata
                'frame_data',           # Frame image data
                'file_path',            # Internal file paths
                'video_path',           # Video file path
                'audio_path',           # Audio file path
                'agent_state',          # Full internal state
                'raw_state_full',       # Raw unprocessed state
                'observations',         # Internal observations with file paths
                'tool_results',         # Tool execution internals
                'completed_tools',      # Tool tracking
                'warnings',             # Internal warnings with file paths
                'decisions',            # Internal decisions
                'output_dir',           # Output directory paths
                'report_plan',          # Internal report planning
                'strategy',             # Internal strategy (but keep if in full_report)
                'judge_result',         # Internal judge results
                'runtime_warnings',     # Internal warnings
                'created_at',           # Internal timestamp
            }
            
            # Skip internal keys, but keep everything analysis-related
            if key in SKIP_KEYS:
                continue
            
            # Recursively sanitize nested data
            if isinstance(value, (dict, list)):
                sanitized[key] = sanitize_response(value)
            else:
                # Don't include file paths in string values
                if isinstance(value, str):
                    # Check for file paths - skip if found
                    if any(x in value for x in ['\\', '.tmp', 'uploads', 'outputs', 'pitch_coach', ':\\']):
                        continue
                sanitized[key] = value
        return sanitized
    elif isinstance(data, list):
        return [sanitize_response(item) for item in data]
    else:
        return data

class PitchCoachHandler(BaseHTTPRequestHandler):
    def _cors_origin(self) -> str:
        origin = self.headers.get("Origin", "")
        if origin.startswith("http://127.0.0.1:") or origin.startswith("http://localhost:"):
            return origin
        return "*"

    def _send_json(self, payload: dict, status: int = 200):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", self._cors_origin())
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", self.headers.get("Access-Control-Request-Headers", "Content-Type"))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", self._cors_origin())
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", self.headers.get("Access-Control-Request-Headers", "Content-Type"))
        self.end_headers()

    def do_GET(self):
        if self.path == "/":
            self._send_json({
                "ok": True,
                "message": "Pitch Coach API is running.",
                "health": "/pitch/health",
                "analyze": "/pitch/analyze",
                "config": "/pitch/config",
            })
            return

        if self.path == "/pitch/health":
            api_key_set = bool(CONFIG.get("openai_api_key")) and CONFIG.get("openai_api_key") != "your_api_key_here"
            self._send_json({
                "ok": True,
                "agent_script": str(PITCH_AGENT_PATH),
                "agent_exists": PITCH_AGENT_PATH.exists(),
                "python": resolve_python(),
                "output_dir": str(OUTPUT_DIR),
                "config_file": str(CONFIG_FILE),
                "config_exists": CONFIG_FILE.exists(),
                "llm_api_key_set": api_key_set,
                "llm_base_url": CONFIG.get("openai_base_url", "Not configured"),
                "llm_model": CONFIG.get("openai_model", "Not configured"),
                "mediapipe_available": is_mediapipe_available(),
            })
            return

        if self.path == "/pitch/config":
            self._send_json({
                "config_file": str(CONFIG_FILE),
                "exists": CONFIG_FILE.exists(),
                "config": {
                    "openai_api_key_set": bool(CONFIG.get("openai_api_key")) and CONFIG.get("openai_api_key") != "your_api_key_here",
                    "openai_base_url": CONFIG.get("openai_base_url", ""),
                    "openai_model": CONFIG.get("openai_model", ""),
                    "enable_llm_analysis": CONFIG.get("enable_llm_analysis", True),
                }
            })
            return

        # Handle PDF download: /pitch/download/{execution_id}
        if self.path.startswith("/pitch/download/"):
            parts = self.path.split("/")
            if len(parts) >= 4:
                execution_id = parts[3]
                session_dir = OUTPUT_DIR / execution_id
                pdf_path = session_dir / "reports" / "agentic_pitch_coach_report.pdf"
                
                if pdf_path.exists():
                    try:
                        with open(pdf_path, 'rb') as f:
                            pdf_content = f.read()
                        
                        # Check if PDF is empty
                        if len(pdf_content) == 0:
                            print(f"[Pitch Coach] ⚠️  PDF is empty, trying markdown instead")
                            # Try to send markdown as text file
                            md_path = session_dir / "reports" / "agentic_pitch_coach_report.md"
                            if md_path.exists():
                                with open(md_path, 'r') as f:
                                    md_content = f.read()
                                self.send_response(200)
                                self.send_header('Content-Type', 'text/plain; charset=utf-8')
                                self.send_header('Content-Length', len(md_content.encode('utf-8')))
                                self.send_header('Content-Disposition', f'attachment; filename="pitch_report_{execution_id}.txt"')
                                self.send_header("Access-Control-Allow-Origin", self._cors_origin())
                                self.end_headers()
                                self.wfile.write(md_content.encode('utf-8'))
                                print(f"[Pitch Coach] Markdown report downloaded instead: {execution_id}")
                                return
                        
                        self.send_response(200)
                        self.send_header('Content-Type', 'application/pdf')
                        self.send_header('Content-Length', len(pdf_content))
                        self.send_header('Content-Disposition', f'attachment; filename="pitch_report_{execution_id}.pdf"')
                        self.send_header("Access-Control-Allow-Origin", self._cors_origin())
                        self.end_headers()
                        self.wfile.write(pdf_content)
                        print(f"[Pitch Coach] PDF downloaded: {execution_id}")
                        return
                    except Exception as e:
                        print(f"[Pitch Coach] Error serving PDF: {e}")
                        self._send_json({"error": "Could not read PDF"}, status=500)
                        return
                
                self._send_json({"error": "PDF not found"}, status=404)
                return

        self._send_json({"error": "Not found."}, status=404)

    def parse_multipart_form(self):
        """Parse multipart/form-data with binary file support"""
        content_type = self.headers.get("Content-Type", "")
        if "multipart/form-data" not in content_type:
            return None, None

        try:
            boundary = content_type.split("boundary=")[1].encode()
        except IndexError:
            return None, None

        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length)

        parts = {}
        sections = body.split(b"--" + boundary)

        for section in sections:
            if not section or section == b"--\r\n" or section == b"--":
                continue

            section = section.lstrip(b"\r\n")
            if b"\r\n\r\n" not in section:
                continue

            headers_part, content = section.split(b"\r\n\r\n", 1)
            content = content.rstrip(b"\r\n")

            try:
                headers_text = headers_part.decode("utf-8", errors="ignore")
            except:
                continue

            try:
                if "filename=" in headers_text:
                    # File part - keep as binary
                    filename = headers_text.split('filename="')[1].split('"')[0]
                    parts["file"] = (filename, content)
                else:
                    # Form field - decode as text
                    name = headers_text.split('name="')[1].split('"')[0]
                    try:
                        parts[name] = content.decode("utf-8")
                    except:
                        parts[name] = content.decode("utf-8", errors="ignore")
            except:
                continue

        return parts.get("file"), parts

    def do_POST(self):
        if self.path != "/pitch/analyze":
            self._send_json({"error": "Not found."}, status=404)
            return

        try:
            file_data, form_data = self.parse_multipart_form()

            if not file_data:
                self._send_json({"error": "No video file uploaded"}, status=400)
                return

            filename, file_content = file_data

            # Validate file type
            valid_extensions = [".mp4", ".mov", ".mkv"]
            if not any(filename.lower().endswith(ext) for ext in valid_extensions):
                self._send_json({"error": "Invalid file type. Use MP4, MOV, or MKV"}, status=400)
                return

            # Generate execution ID
            execution_id = generate_execution_id()
            execution_timestamp = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

            # Save uploaded file
            session_upload_dir = UPLOADS_DIR / execution_id
            session_upload_dir.mkdir(exist_ok=True)
            video_path = session_upload_dir / filename
            video_path.write_bytes(file_content)

            # Calculate file hash
            file_hash = calculate_file_hash(video_path)

            # Create session output directory
            session_output = OUTPUT_DIR / execution_id
            session_output.mkdir(exist_ok=True)

            # Extract form parameters
            coaching_mode = form_data.get("coaching_mode", "investor") if form_data else "investor"
            skip_visual = form_data.get("skip_visual", "false") == "true" if form_data else False
            skip_voice_emotion = form_data.get("skip_voice_emotion", "false") == "true" if form_data else False
            whisper_size = form_data.get("whisper_size", "medium") if form_data else "medium"

            # Auto-skip visual if MediaPipe not available
            if not skip_visual and not is_mediapipe_available():
                print("[Pitch Coach] ⚠️  MediaPipe not available - automatically skipping visual analysis")
                skip_visual = True

            # Build command
            cmd = [
                resolve_python(),
                str(PITCH_AGENT_PATH),
                "--video", str(video_path),
                "--output", str(session_output),
                "--coaching-mode", coaching_mode,
                "--whisper-size", whisper_size,
            ]

            if skip_visual:
                cmd.append("--skip-visual")
            if skip_voice_emotion:
                cmd.append("--skip-voice-emotion")

            # Run the pitch coach agent
            print(f"[Pitch Coach] Execution ID: {execution_id}")
            print(f"[Pitch Coach] Running: {' '.join(cmd)}")
            print(f"[Pitch Coach] Working Directory: {PITCH_AGENT_PATH.parent}")

            # Prepare environment with LLM credentials
            env = os.environ.copy()
            if CONFIG.get("openai_api_key") and CONFIG["openai_api_key"] != "your_api_key_here":
                env["OPENAI_API_KEY"] = CONFIG["openai_api_key"]
            if CONFIG.get("openai_base_url"):
                env["OPENAI_BASE_URL"] = CONFIG["openai_base_url"]
            if CONFIG.get("openai_model"):
                env["OPENAI_MODEL"] = CONFIG["openai_model"]

            result = subprocess.run(
                cmd,
                cwd=str(PITCH_AGENT_PATH.parent),
                capture_output=True,
                text=True,
                timeout=600,
                env=env,
            )

            if result.returncode != 0:
                # Log full error details to console for debugging
                print(f"[Pitch Coach] ❌ FAILED - Return Code: {result.returncode}")
                print(f"[Pitch Coach] STDERR:\n{result.stderr}")
                print(f"[Pitch Coach] STDOUT:\n{result.stdout}")
                
                self._send_json({
                    "error": "Pitch coach analysis failed",
                    "returncode": result.returncode,
                    "stderr_tail": (result.stderr or "")[-2000:],
                }, status=500)
                return

            # Check for output files
            reports_dir = session_output / "reports"
            report_files = {}

            print(f"[Pitch Coach] Looking for reports in: {reports_dir}")
            print(f"[Pitch Coach] Reports dir exists: {reports_dir.exists()}")
            if reports_dir.exists():
                print(f"[Pitch Coach] Files in reports dir: {list(reports_dir.glob('*'))}")

            if (reports_dir / "agentic_pitch_coach_full_report.json").exists():
                with open(reports_dir / "agentic_pitch_coach_full_report.json") as f:
                    full_report = json.load(f)
                    print(f"[Pitch Coach] Full report keys: {list(full_report.keys())}")
                    # Sanitize before sending to user
                    report_files["full_report"] = sanitize_response(full_report)

            if (reports_dir / "agentic_pitch_coach_scorecard.json").exists():
                with open(reports_dir / "agentic_pitch_coach_scorecard.json") as f:
                    scorecard = json.load(f)
                    print(f"[Pitch Coach] Scorecard keys: {list(scorecard.keys())}")
                    # Sanitize before sending to user
                    report_files["scorecard"] = sanitize_response(scorecard)

            if (reports_dir / "agentic_pitch_coach_report.md").exists():
                with open(reports_dir / "agentic_pitch_coach_report.md") as f:
                    markdown = f.read()
                    print(f"[Pitch Coach] Markdown report length: {len(markdown)} chars")
                    report_files["markdown"] = markdown

            # Check for PDF
            pdf_exists = (reports_dir / "agentic_pitch_coach_report.pdf").exists()
            print(f"[Pitch Coach] PDF exists: {pdf_exists}")

            # Build response with execution metadata
            response = {
                "ok": True,
                "_execution_meta": {
                    "execution_id": execution_id,
                    "timestamp": execution_timestamp,
                    "file_hash": file_hash,
                    "filename": filename,
                    "file_size_kb": round(len(file_content) / 1024, 2),
                    "coaching_mode": coaching_mode,
                    "skip_visual": skip_visual,
                    "skip_voice_emotion": skip_voice_emotion,
                },
                "reports": report_files,
                "pdf_available": pdf_exists,
                "pdf_download_url": f"/pitch/download/{execution_id}" if pdf_exists else None,
            }
            
            # Debug: Show what we're sending
            print(f"[Pitch Coach] Response structure:")
            print(f"  - Has full_report: {'full_report' in report_files}")
            print(f"  - Has scorecard: {'scorecard' in report_files}")
            print(f"  - Has markdown: {'markdown' in report_files}")
            if "scorecard" in report_files:
                print(f"  - Scorecard keys: {list(report_files['scorecard'].keys())}")
            if "full_report" in report_files:
                print(f"  - Full report keys: {list(report_files['full_report'].keys())}")

            self._send_json(response)

        except subprocess.TimeoutExpired:
            self._send_json({"error": "Analysis timed out after 10 minutes"}, status=500)
        except Exception as error:
            import traceback
            error_trace = traceback.format_exc()
            print(f"[Pitch Coach] ❌ EXCEPTION: {error}")
            print(f"[Pitch Coach] Traceback:\n{error_trace}")
            self._send_json({
                "error": str(error),
                "traceback": error_trace
            }, status=500)

    def log_message(self, format, *args):
        return

def main():
    # Print startup info
    print(f"\n{'='*70}")
    print(f"🎤 Pitch Coach API v1.0")
    print(f"{'='*70}")
    print(f"Listening on: http://{HOST}:{PORT}")
    print(f"Config file: {CONFIG_FILE}")
    print(f"Agent script: {PITCH_AGENT_PATH}")
    print(f"Output dir: {OUTPUT_DIR}")
    
    # Check configuration status
    api_key_set = bool(CONFIG.get("openai_api_key")) and CONFIG.get("openai_api_key") != "your_api_key_here"
    print(f"\n📋 Configuration Status:")
    print(f"  ✅ Agent script exists" if PITCH_AGENT_PATH.exists() else f"  ❌ Agent script missing")
    print(f"  {'✅' if api_key_set else '❌'} OpenAI API Key {'configured' if api_key_set else 'NOT configured'}")
    print(f"  {'✅' if CONFIG.get('openai_base_url') else '❌'} Base URL: {CONFIG.get('openai_base_url', 'NOT set')}")
    print(f"  {'✅' if CONFIG.get('openai_model') else '❌'} Model: {CONFIG.get('openai_model', 'NOT set')}")
    print(f"  {'✅' if is_mediapipe_available() else '⚠️ '} MediaPipe {'available (visual analysis enabled)' if is_mediapipe_available() else 'not installed (visual analysis will be skipped)'}")
    
    if not api_key_set:
        print(f"\n⚠️  LLM credentials not configured!")
        print(f"   Edit {CONFIG_FILE} and add your:")
        print(f"   - openai_api_key")
        print(f"   - openai_base_url")
        print(f"   - openai_model")
        print(f"   Then restart this API.\n")
    
    print(f"\n📚 Endpoints:")
    print(f"  GET  http://{HOST}:{PORT}/              → API info")
    print(f"  GET  http://{HOST}:{PORT}/pitch/health   → Health check")
    print(f"  GET  http://{HOST}:{PORT}/pitch/config   → Config status")
    print(f"  POST http://{HOST}:{PORT}/pitch/analyze  → Analyze video")
    print(f"\n{'='*70}\n")
    
    server = ThreadingHTTPServer((HOST, PORT), PitchCoachHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n\n[Pitch Coach] Shutting down...")
        server.shutdown()

if __name__ == "__main__":
    main()
