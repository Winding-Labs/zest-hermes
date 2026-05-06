"""
Zest plugin for Hermes Agent.

Registers slash-commands, LLM tools, lifecycle hooks, and the
zest-daemon CLI subcommand. All command logic lives in Node
(dist/commands/*.js) - Python handlers are thin subprocess wrappers.
"""

import json

from .notifications import peek_pending_notification
from .schemas import (
    ZEST_CHECK_NOTIFICATIONS_SCHEMA,
    ZEST_DISABLE_SCHEMA,
    ZEST_ENABLE_SCHEMA,
    ZEST_IGNORE_SCHEMA,
    ZEST_IS_IGNORED_SCHEMA,
    ZEST_LIST_IGNORED_SCHEMA,
    ZEST_LOGIN_SCHEMA,
    ZEST_LOGOUT_SCHEMA,
    ZEST_PRIVACY_SCHEMA,
    ZEST_STANDUP_SCHEMA,
    ZEST_STATUS_SCHEMA,
    ZEST_SYNC_SCHEMA,
    ZEST_UNIGNORE_SCHEMA,
    ZEST_WORKSPACE_SCHEMA,
)
from .tools import (
    STATE_DIR,
    cli_daemon_handler,
    handle_zest_check_notifications,
    handle_zest_disable,
    handle_zest_enable,
    handle_zest_ignore,
    handle_zest_is_ignored,
    handle_zest_list_ignored,
    handle_zest_login,
    handle_zest_logout,
    handle_zest_privacy,
    handle_zest_standup,
    handle_zest_status,
    handle_zest_sync,
    handle_zest_unignore,
    handle_zest_workspace,
    on_session_start,
    spawn_daemon,
)

TOOLSET = "zest-hermes"

_COMMANDS = [
    ("zest_login", ZEST_LOGIN_SCHEMA, handle_zest_login, "Authenticate with Zest"),
    ("zest_logout", ZEST_LOGOUT_SCHEMA, handle_zest_logout, "Sign out of Zest"),
    ("zest_status", ZEST_STATUS_SCHEMA, handle_zest_status, "Show Zest plugin status"),
    ("zest_sync", ZEST_SYNC_SCHEMA, handle_zest_sync, "Sync queued data to Zest"),
    ("zest_standup", ZEST_STANDUP_SCHEMA, handle_zest_standup, "Generate today's standup"),
    ("zest_privacy", ZEST_PRIVACY_SCHEMA, handle_zest_privacy, "View/configure privacy settings"),
    ("zest_enable", ZEST_ENABLE_SCHEMA, handle_zest_enable, "Enable remote persistence (sync to Zest)"),
    ("zest_disable", ZEST_DISABLE_SCHEMA, handle_zest_disable, "Disable remote persistence"),
    ("zest_workspace", ZEST_WORKSPACE_SCHEMA, handle_zest_workspace, "View or switch workspace"),
    ("zest_ignore", ZEST_IGNORE_SCHEMA, handle_zest_ignore, "Ignore current session"),
    ("zest_unignore", ZEST_UNIGNORE_SCHEMA, handle_zest_unignore, "Unignore current session"),
    ("zest_list_ignored", ZEST_LIST_IGNORED_SCHEMA, handle_zest_list_ignored, "List ignored sessions"),
    ("zest_is_ignored", ZEST_IS_IGNORED_SCHEMA, handle_zest_is_ignored, "Check if current session is ignored"),
    ("zest_check_notifications", ZEST_CHECK_NOTIFICATIONS_SCHEMA, handle_zest_check_notifications, "Retrieve pending Zest notification"),
]


_NOTIFICATION_HINT = (
    "[Zest plugin] There is a pending notification for the user. "
    "Call the zest_check_notifications tool to retrieve and display it."
)


def _on_pre_llm_call(**kwargs):
    if peek_pending_notification():
        return {"context": _NOTIFICATION_HINT}
    return None


def _load_disabled_tools():
    settings_file = STATE_DIR / "settings.json"
    try:
        settings = json.loads(settings_file.read_text())
        return set(settings.get("disabledTools", []))
    except (OSError, json.JSONDecodeError, TypeError):
        return set()


def register(ctx):
    disabled = _load_disabled_tools()

    for name, schema, handler, description in _COMMANDS:
        if name in disabled:
            continue
        ctx.register_tool(
            name=name,
            toolset=TOOLSET,
            schema=schema,
            handler=handler,
            description=description,
        )
        ctx.register_command(
            name,
            lambda raw_args, _h=handler: _h(None, raw_args=raw_args),
            description=description,
        )

    ctx.register_hook("pre_llm_call", _on_pre_llm_call)

    spawn_daemon()

    ctx.register_hook("on_session_start", on_session_start)

    ctx.register_cli_command(
        name="zest-daemon",
        help="Manage the Zest background daemon (start | stop | status)",
        setup_fn=lambda parser: parser.add_argument(
            "action", choices=["start", "stop", "status"]
        ),
        handler_fn=cli_daemon_handler,
    )
