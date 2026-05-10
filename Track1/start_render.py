import os
import signal
import subprocess
import sys
import time


PORT = os.getenv("PORT", "10000")


def start_process(args: list[str]) -> subprocess.Popen:
    return subprocess.Popen(args, stdout=sys.stdout, stderr=sys.stderr)


def main() -> int:
    os.environ.setdefault("MCP_BASE_URL", "http://127.0.0.1:8000/mcp")
    os.environ.setdefault("A2A_BASE_URL", "http://127.0.0.1:8001/a2a")

    children = [
        start_process([sys.executable, "-u", "mcp_server.py"]),
        start_process([sys.executable, "-u", "a2a_server.py"]),
        start_process([
            sys.executable,
            "-m",
            "uvicorn",
            "api:app",
            "--host",
            "0.0.0.0",
            "--port",
            PORT,
        ]),
    ]

    def stop_children(*_args) -> None:
        for child in children:
            if child.poll() is None:
                child.terminate()

    signal.signal(signal.SIGTERM, stop_children)
    signal.signal(signal.SIGINT, stop_children)

    try:
        while True:
            for child in children:
                code = child.poll()
                if code is not None:
                    stop_children()
                    return code
            time.sleep(1)
    finally:
        stop_children()


if __name__ == "__main__":
    raise SystemExit(main())
