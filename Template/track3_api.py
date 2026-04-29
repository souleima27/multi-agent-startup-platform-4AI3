import json
import os
import subprocess
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent
RUNNER_PATH = BASE_DIR / "track3_run_agent.py"
INPUT_PATH = BASE_DIR / "track3_bridge_input.json"
OUTPUT_PATH = BASE_DIR / "track3_bridge_output.json"
LOCAL_CONFIG_PATH = BASE_DIR / "track3.local.json"
DEFAULT_RUNNER_PYTHON = Path(r"C:\Users\asus\AppData\Local\Programs\Python\Python312\python.exe")
HOST = "127.0.0.1"
PORT = 5056
TRACK3_CONFIG_KEYS = [
    "JIRA_SYNC_ENABLED",
    "JIRA_BASE_URL",
    "JIRA_USER_EMAIL",
    "JIRA_API_TOKEN",
    "JIRA_PROJECT_KEY",
    "JIRA_ISSUE_TYPE",
    "JIRA_VERIFY_SSL",
    "MODEL_MODE",
    "LLM_API_KEY",
    "LLM_BASE_URL",
    "LLM_PLANNER_MODEL",
    "LLM_CRITIC_MODEL",
    "LLM_VERIFY_SSL",
    "TRACK3_RUNNER_PYTHON",
]
LOCAL_CONFIG_ERROR = ""


def load_local_config() -> bool:
    global LOCAL_CONFIG_ERROR
    if not LOCAL_CONFIG_PATH.exists():
        return False

    try:
        config = json.loads(LOCAL_CONFIG_PATH.read_text(encoding="utf-8"))
    except Exception as error:
        LOCAL_CONFIG_ERROR = f"{type(error).__name__}: {error}"
        return False

    for key in TRACK3_CONFIG_KEYS:
        if key not in config or config[key] is None:
            continue

        value = config[key]
        if isinstance(value, bool):
            os.environ[key] = "true" if value else "false"
        else:
            os.environ[key] = str(value)

    LOCAL_CONFIG_ERROR = ""
    return True


LOCAL_CONFIG_LOADED = load_local_config()
os.environ.setdefault("PYTHONIOENCODING", "utf-8")
os.environ.setdefault("PYTHONUTF8", "1")


def resolve_runner_python() -> str:
    candidates = []

    env_python = os.getenv("TRACK3_RUNNER_PYTHON")
    if env_python:
        candidates.append(Path(env_python))

    candidates.append(DEFAULT_RUNNER_PYTHON)
    candidates.append(Path(sys.executable))

    for candidate in candidates:
        if candidate and candidate.exists():
            return str(candidate)

    return sys.executable


def runtime_snapshot() -> dict:
    return {
        "local_config_loaded": LOCAL_CONFIG_LOADED,
        "local_config_path": str(LOCAL_CONFIG_PATH),
        "local_config_error": LOCAL_CONFIG_ERROR,
        "jira_sync_enabled": os.getenv("JIRA_SYNC_ENABLED", "false"),
        "jira_project_key": os.getenv("JIRA_PROJECT_KEY", ""),
        "jira_base_url_set": bool(os.getenv("JIRA_BASE_URL")),
        "jira_user_email_set": bool(os.getenv("JIRA_USER_EMAIL")),
        "jira_api_token_set": bool(os.getenv("JIRA_API_TOKEN")),
        "model_mode": os.getenv("MODEL_MODE", ""),
        "llm_base_url": os.getenv("LLM_BASE_URL", ""),
        "llm_planner_model": os.getenv("LLM_PLANNER_MODEL", ""),
        "llm_critic_model": os.getenv("LLM_CRITIC_MODEL", ""),
    }


class Track3ApiHandler(BaseHTTPRequestHandler):
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
            self._send_json(
                {
                    "ok": True,
                    "message": "Track3 API is running.",
                    "health": "/track3/health",
                    "run": "/track3/execution/run",
                    "config": runtime_snapshot(),
                }
            )
            return

        if self.path == "/track3/health":
            self._send_json(
                {
                    "ok": True,
                    "runner": str(RUNNER_PATH),
                    "python": resolve_runner_python(),
                    "config": runtime_snapshot(),
                }
            )
            return

        self._send_json({"error": "Not found."}, status=404)

    def do_POST(self):
        if self.path != "/track3/execution/run":
            self._send_json({"error": "Not found."}, status=404)
            return

        try:
            content_length = int(self.headers.get("Content-Length", "0"))
            body = self.rfile.read(content_length) if content_length > 0 else b"{}"
            payload = json.loads(body.decode("utf-8"))

            INPUT_PATH.write_text(
                json.dumps(payload, ensure_ascii=False, indent=2),
                encoding="utf-8",
            )

            result = subprocess.run(
                [resolve_runner_python(), str(RUNNER_PATH), str(INPUT_PATH), str(OUTPUT_PATH)],
                check=True,
                cwd=BASE_DIR,
                capture_output=True,
                text=True,
                env={
                    **os.environ,
                    "PYTHONIOENCODING": os.getenv("PYTHONIOENCODING", "utf-8"),
                    "PYTHONUTF8": os.getenv("PYTHONUTF8", "1"),
                },
            )

            if not OUTPUT_PATH.exists():
                self._send_json({"error": "track3_bridge_output.json was not created."}, status=500)
                return

            response_payload = json.loads(OUTPUT_PATH.read_text(encoding="utf-8"))
            response_payload["_runner"] = {
                "python": resolve_runner_python(),
                "stdout_tail": result.stdout[-1000:],
                "stderr_tail": result.stderr[-1000:],
            }
            self._send_json(response_payload)
        except subprocess.CalledProcessError as error:
            self._send_json(
                {
                    "error": "Track3 runner failed.",
                    "returncode": error.returncode,
                    "stderr_tail": (error.stderr or "")[-1800:],
                    "stdout_tail": (error.stdout or "")[-1000:],
                },
                status=500,
            )
        except Exception as error:
            self._send_json({"error": str(error)}, status=500)

    def log_message(self, format, *args):
        return


def main():
    server = ThreadingHTTPServer((HOST, PORT), Track3ApiHandler)
    print(f"Track3 API listening on http://{HOST}:{PORT}")
    server.serve_forever()


if __name__ == "__main__":
    main()
