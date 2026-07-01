"""
Node command dispatch and daemon lifecycle for zest-hermes.

Every slash-command handler delegates to a compiled Node script in dist/commands/.
The Python side owns only daemon PID management (spawn/stop/status) because
Hermes hooks run in-process and need synchronous lifecycle control.
"""

from __future__ import annotations

import atexit
import fcntl
import json
import os
import shlex
import signal
import subprocess
import time
from pathlib import Path

PLUGIN_ROOT = Path(__file__).parent
DIST_DIR = PLUGIN_ROOT / "dist"
COMMANDS_DIR = DIST_DIR / "commands"
HOOKS_DIR = DIST_DIR / "hooks"
DAEMON_ENTRY = DIST_DIR / "daemon" / "index.js"

STATE_DIR = Path.home() / ".hermes-zest"
PIDFILE = STATE_DIR / "daemon.pid"
DAEMON_LOG = STATE_DIR / "daemon.log"
ACTIVE_SESSIONS_FILE = STATE_DIR / "active-sessions"
CURRENT_SESSION_FILE = STATE_DIR / "current-session-id"


def _run_hook(script_name: str, raw_args: str = "") -> str:
    """Run a Node hook script and return its stdout."""
    return _run_script(HOOKS_DIR / script_name, raw_args)


def _run_command(script_name: str, raw_args: str = "") -> str:
    """Run a Node command script and return its stdout as a JSON string."""
    return _run_script(COMMANDS_DIR / script_name, raw_args)


def _run_script(script_path: Path, raw_args: str = "") -> str:
    """Run a Node script and return its stdout."""
    cmd = ["node", str(script_path)]
    if raw_args:
        cmd.extend(shlex.split(raw_args))
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
        output = result.stdout.strip()
        if result.returncode != 0:
            error_msg = result.stderr.strip() or output or "Command failed"
            return json.dumps({"error": error_msg})
        return output or json.dumps({"ok": True})
    except subprocess.TimeoutExpired:
        return json.dumps({"error": "Command timed out after 120s"})
    except Exception as exc:
        return json.dumps({"error": str(exc)})


# -- Session tracking --


def on_session_start(**kwargs):
    """Hook: persist session_id so slash-commands can reference the active session."""
    session_id = kwargs.get("session_id")
    if session_id:
        STATE_DIR.mkdir(parents=True, exist_ok=True)
        CURRENT_SESSION_FILE.write_text(session_id)


def on_session_end(**kwargs):
    """Hook: per-turn extraction (Hermes on_session_end = end of turn, not session)."""
    _run_hook("extract-turn.js")


def on_session_finalize(**kwargs):
    """Hook: mark session for deferred finalization.

    Hermes dispatches this hook BEFORE writing ended_at to state.db,
    so reading the session here yields stale data. Instead we write
    the session_id to a pending file that extract-turn picks up on
    the next conversation turn, when ended_at is guaranteed to exist.
    """
    session_id = kwargs.get("session_id")
    if session_id:
        STATE_DIR.mkdir(parents=True, exist_ok=True)
        with open(STATE_DIR / "pending-finalize", "a") as f:
            f.write(session_id + "\n")


def _read_current_session_id() -> str | None:
    try:
        return CURRENT_SESSION_FILE.read_text().strip() or None
    except OSError:
        return None


# -- Slash-command / tool handlers --


def handle_zest_login(params, **kwargs):
    return _run_command("login.js")


def handle_zest_logout(params, **kwargs):
    return _run_command("logout.js")


def handle_zest_status(params, **kwargs):
    return _run_command("status.js")


def handle_zest_sync(params, **kwargs):
    return _run_command("sync.js")


def handle_zest_standup(params, **kwargs):
    return _run_command("standup.js")


def handle_zest_enable(params, **kwargs):
    return _run_command("enable.js")


def handle_zest_disable(params, **kwargs):
    return _run_command("disable.js")


def handle_zest_ignore(params, **kwargs):
    session_id = _read_current_session_id()
    if not session_id:
        return json.dumps({"error": "No active session"})
    return _run_command("ignore-session.js", session_id)


def handle_zest_unignore(params, **kwargs):
    session_id = _read_current_session_id()
    if not session_id:
        return json.dumps({"error": "No active session"})
    return _run_command("unignore-session.js", session_id)


def handle_zest_list_ignored(params, **kwargs):
    return _run_command("list-ignored-sessions.js")


def handle_zest_is_ignored(params, **kwargs):
    session_id = _read_current_session_id()
    if not session_id:
        return json.dumps({"error": "No active session"})
    return _run_command("is-session-ignored.js", session_id)


def handle_zest_workspace(params, **kwargs):
    raw_args = kwargs.get("raw_args", "")
    if not raw_args and isinstance(params, dict):
        raw_args = params.get("raw_args", "")
    return _run_command("workspace.js", raw_args)


def handle_zest_privacy(params, **kwargs):
    raw_args = kwargs.get("raw_args", "")
    if not raw_args and isinstance(params, dict):
        raw_args = params.get("raw_args", "")
    return _run_command("privacy.js", raw_args)


def handle_zest_check_notifications(params, **kwargs):
    return _run_command("check-notifications.js")


# -- Daemon lifecycle --


def _read_pidfile() -> int | None:
    if not PIDFILE.exists():
        return None
    try:
        return int(PIDFILE.read_text().strip())
    except (ValueError, OSError):
        return None


def _pid_alive(pid: int) -> bool:
    try:
        os.kill(pid, 0)
    except (ProcessLookupError, PermissionError):
        return False
    except OSError:
        return False
    return True


def _register_hermes_pid() -> None:
    """Write the Hermes process PID to active-sessions so the daemon can detect orphans."""
    STATE_DIR.mkdir(parents=True, exist_ok=True)
    hermes_pid = str(os.getpid())
    with open(ACTIVE_SESSIONS_FILE, "a+") as f:
        fcntl.flock(f, fcntl.LOCK_EX)
        f.seek(0)
        known_pids = {l.strip() for l in f.readlines() if l.strip()}
        # Prune dead PIDs to prevent unbounded growth after unclean exits
        known_pids = {p for p in known_pids if _pid_alive(int(p))}
        known_pids.add(hermes_pid)
        f.seek(0)
        f.truncate()
        f.write("\n".join(sorted(known_pids)) + "\n")
    atexit.register(_on_hermes_exit, hermes_pid)


def _on_hermes_exit(hermes_pid: str) -> None:
    """Remove our PID from active-sessions on clean exit.

    If this was the last session, send SIGTERM to the daemon so it
    shuts down immediately instead of waiting ~90s for orphan detection.
    """
    remaining = 0
    try:
        with open(ACTIVE_SESSIONS_FILE, "r+") as f:
            fcntl.flock(f, fcntl.LOCK_EX)
            lines = [l.strip() for l in f.readlines() if l.strip() and l.strip() != hermes_pid]
            f.seek(0)
            f.truncate()
            if lines:
                f.write("\n".join(lines) + "\n")
            remaining = len(lines)
    except OSError:
        return

    if remaining == 0:
        daemon_pid = _read_pidfile()
        if daemon_pid is not None and _pid_alive(daemon_pid):
            try:
                os.kill(daemon_pid, signal.SIGTERM)
            except OSError:
                pass


def _is_our_daemon(pid: int) -> bool:
    try:
        result = subprocess.run(
            ["ps", "-p", str(pid), "-o", "command="],
            capture_output=True,
            text=True,
        )
        return str(DAEMON_ENTRY) in result.stdout
    except (OSError, subprocess.SubprocessError):
        return False


def _ensure_daemon_running() -> dict:
    """Spawn daemon if not already running. Idempotent via pidfile."""
    STATE_DIR.mkdir(parents=True, exist_ok=True)

    existing_pid = _read_pidfile()
    if existing_pid is not None and _pid_alive(existing_pid):
        return {"status": "already-running", "pid": existing_pid}

    log_file = open(DAEMON_LOG, "a")
    try:
        proc = subprocess.Popen(
            ["node", str(DAEMON_ENTRY)],
            stdout=log_file,
            stderr=log_file,
            stdin=subprocess.DEVNULL,
            start_new_session=True,
        )
    finally:
        log_file.close()
    PIDFILE.write_text(str(proc.pid))

    time.sleep(0.3)
    if not _pid_alive(proc.pid):
        PIDFILE.unlink(missing_ok=True)
        return {"status": "crashed-on-start", "pid": proc.pid, "log": str(DAEMON_LOG)}

    return {"status": "started", "pid": proc.pid}


def _force_stop_daemon() -> dict:
    """Send SIGTERM to daemon regardless of refcount."""
    pid = _read_pidfile()
    if pid is None:
        return {"status": "not-running"}

    if not _pid_alive(pid):
        PIDFILE.unlink(missing_ok=True)
        return {"status": "stale-pidfile-cleared", "pid": pid}

    if not _is_our_daemon(pid):
        PIDFILE.unlink(missing_ok=True)
        return {"status": "stale-pid-recycled", "pid": pid}

    try:
        os.kill(pid, signal.SIGTERM)
    except OSError as err:
        return {"status": "error", "pid": pid, "error": str(err)}

    for _ in range(20):
        if not _pid_alive(pid):
            PIDFILE.unlink(missing_ok=True)
            return {"status": "stopped", "pid": pid}
        time.sleep(0.1)

    return {"status": "timeout", "pid": pid, "error": "daemon did not exit after SIGTERM"}


def spawn_daemon(**kwargs) -> dict:
    """Register Hermes PID and ensure the daemon is running."""
    _register_hermes_pid()
    return _ensure_daemon_running()


def stop_daemon(**kwargs) -> dict:
    """Stop the daemon. Accepts **kwargs for hook compatibility."""
    return _force_stop_daemon()


def daemon_status(**kwargs) -> dict:
    pid = _read_pidfile()
    if pid is None:
        return {"status": "not-running"}
    alive = _pid_alive(pid)
    return {"status": "running" if alive else "stale", "pid": pid}


def cli_provision_handler(args) -> None:
    """Run the zest-provision Node command with the parsed CLI flags.

    Streams Node's stdout/stderr straight to the terminal (the command prints
    user-facing messages itself) and propagates its exit code.
    """
    cmd = ["node", str(COMMANDS_DIR / "provision.js"), f"--agent-id={args.agent_id}"]
    cmd.append(f"--provisioning-key={args.provisioning_key}")
    if getattr(args, "workspace_id", None):
        cmd.append(f"--workspace-id={args.workspace_id}")

    result = subprocess.run(cmd, text=True)
    if result.returncode != 0:
        raise SystemExit(result.returncode)


def cli_daemon_handler(args) -> None:
    action = getattr(args, "action", None)
    if action == "start":
        result = _ensure_daemon_running()
    elif action == "stop":
        result = _force_stop_daemon()
    elif action == "status":
        result = daemon_status()
    else:
        result = {"status": "error", "error": f"unknown action: {action!r}"}
    print(result)
