"""Recreate .venv with Python 3.11 and write result to venv_result.txt."""
import os
import shutil
import subprocess
import sys

PROJECT = r"H:\MiriArt\miriart-ai"
LOG = os.path.join(PROJECT, "venv_result.txt")

def log(msg):
    with open(LOG, "a", encoding="utf-8") as f:
        f.write(msg + "\n")

def main():
    with open(LOG, "w", encoding="utf-8") as f:
        f.write("started\n")
    log("=== venv recreate script ===\n")

    # Try current user's AppData, then ProgramFiles
    candidates = [
        os.path.join(os.environ.get("LOCALAPPDATA", ""), "Programs", "Python", "Python311", "python.exe"),
        os.path.join(os.environ.get("ProgramFiles", ""), "Python311", "python.exe"),
        r"C:\Users\RYUzFAM\AppData\Local\Programs\Python\Python311\python.exe",
    ]
    py311 = None
    for p in candidates:
        if p and os.path.exists(p):
            py311 = p
            break
    if not py311:
        log("ERROR: Python 3.11 not found. Tried: " + str(candidates))
        return 1

    log("Using: " + py311)
    venv_path = os.path.join(PROJECT, ".venv")

    if os.path.isdir(venv_path):
        log("Removing existing .venv...")
        shutil.rmtree(venv_path, ignore_errors=False)
    log("Creating .venv...")
    r = subprocess.run([py311, "-m", "venv", venv_path], capture_output=True, text=True, cwd=PROJECT)
    log("venv exitcode: " + str(r.returncode))
    if r.stdout:
        log("stdout: " + r.stdout)
    if r.stderr:
        log("stderr: " + r.stderr)

    scriptspy = os.path.join(venv_path, "Scripts", "python.exe")
    if os.path.exists(scriptspy):
        log("OK: Scripts\\python.exe exists")
    else:
        log("FAIL: Scripts\\python.exe missing")
    return 0

if __name__ == "__main__":
    sys.exit(main())
