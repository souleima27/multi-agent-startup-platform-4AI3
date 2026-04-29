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
PITCH_AGENT_PATH = BASE_DIR / "pitch" / "agentic_pitch_coach.py"
UPLOADS_DIR = BASE_DIR / "pitch_coach_uploads"
OUTPUT_DIR = BASE_DIR / "pitch_coach_outputs"
UPLOADS_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)

HOST = "127.0.0.1"
PORT = 5057

def resolve_python():
    """Find Python executable"""
    candidates = [
        Path(os.getenv("PYTHON_EXECUTABLE", "")),
        Path(r"C:\Users\asus\AppData\Local\Programs\Python\Python312\python.exe"),
        Path(sys.executable),
    ]
    for candidate in candidates:
        if candidate and candidate.exists():
            return str(candidate)
    return sys.executable

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
            })
            return

        if self.path == "/pitch/health":
            self._send_json({
                "ok": True,
                "agent_script": str(PITCH_AGENT_PATH),
                "python": resolve_python(),
                "output_dir": str(OUTPUT_DIR),
                "pitch_agent_exists": PITCH_AGENT_PATH.exists(),
            })
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

            result = subprocess.run(
                cmd,
                cwd=str(BASE_DIR),
                capture_output=True,
                text=True,
                timeout=600,
            )

            if result.returncode != 0:
                self._send_json({
                    "error": "Pitch coach analysis failed",
                    "returncode": result.returncode,
                    "stderr_tail": (result.stderr or "")[-2000:],
                }, status=500)
                return

            # Check for output files
            reports_dir = session_output / "reports"
            report_files = {}

            if (reports_dir / "agentic_pitch_coach_full_report.json").exists():
                with open(reports_dir / "agentic_pitch_coach_full_report.json") as f:
                    report_files["full_report"] = json.load(f)

            if (reports_dir / "agentic_pitch_coach_scorecard.json").exists():
                with open(reports_dir / "agentic_pitch_coach_scorecard.json") as f:
                    report_files["scorecard"] = json.load(f)

            if (reports_dir / "agentic_pitch_coach_report.md").exists():
                with open(reports_dir / "agentic_pitch_coach_report.md") as f:
                    report_files["markdown"] = f.read()

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
            }

            self._send_json(response)

        except subprocess.TimeoutExpired:
            self._send_json({"error": "Analysis timed out after 10 minutes"}, status=500)
        except Exception as error:
            import traceback
            self._send_json({
                "error": str(error),
                "traceback": traceback.format_exc()
            }, status=500)

    def log_message(self, format, *args):
        return

def main():
    server = ThreadingHTTPServer((HOST, PORT), PitchCoachHandler)
    print(f"Pitch Coach API listening on http://{HOST}:{PORT}")
    server.serve_forever()

if __name__ == "__main__":
    main()
