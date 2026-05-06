"""Peek at standup notifications in status cache (read-only, no consume).

Implemented in Python rather than Node because this runs on every message -
spawning a Node process would add ~100ms latency per message.
"""

from __future__ import annotations

import json
import os
import time
from pathlib import Path

STATUS_CACHE_FILE = Path(
    os.environ.get("ZEST_STATUS_CACHE_FILE", str(Path.home() / ".hermes-zest" / "status-cache.json"))
)


def peek_pending_notification() -> bool:
    """Check if a non-expired notification exists without consuming it."""
    try:
        data = json.loads(STATUS_CACHE_FILE.read_text())
    except (FileNotFoundError, json.JSONDecodeError):
        return False

    version_check = data.get("versionCheck")
    if version_check and version_check.get("updateAvailable"):
        return True

    notif = data.get("standupNotification")
    if not notif:
        return False

    message = notif.get("message")
    expires_at = notif.get("expiresAt")
    if not message or not expires_at:
        return False

    return time.time() * 1000 <= expires_at
