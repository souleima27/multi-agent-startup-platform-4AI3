import subprocess


if __name__ == "__main__":
    subprocess.run(
        [
            "python",
            "-m",
            "py_compile",
            "execution_agent_with_mcp.py",
            "mcp_client_adapter.py",
            "mcp_startup_server.py",
            "pdf_report_generator.py",
        ],
        check=True,
    )
