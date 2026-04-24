import subprocess
import sys
import time
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent

SCRIPTS = [
    "exist_sol_ag.py",
    "final_startup_report_pipeline.py",
    "manager_ag.py",
    "final_reporter.py",
]


def run_script(script_name: str) -> None:
    script_path = BASE_DIR / script_name
    print(f"\n=== RUNNING {script_name} ===")

    try:
        subprocess.run([sys.executable, str(script_path)], check=True, cwd=BASE_DIR)
    except subprocess.CalledProcessError:
        print(f"=== {script_name} FAILED, RETRYING ONCE ===")
        subprocess.run([sys.executable, str(script_path)], check=True, cwd=BASE_DIR)

    print(f"=== DONE {script_name} ===")


def main() -> None:
    start_time = time.perf_counter()

    for script in SCRIPTS:
        run_script(script)

    end_time = time.perf_counter()
    elapsed = end_time - start_time

    print("\n=== PIPELINE COMPLETE ===")
    print(f"Total time: {elapsed:.2f} seconds")


if __name__ == "__main__":
    main()