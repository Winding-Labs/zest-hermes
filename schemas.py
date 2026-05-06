"""
Tool schemas exposed to the LLM via Hermes's tool registry.

These are primarily slash-commands, but registering them as tools too
lets the LLM invoke them proactively (e.g. "run my standup").
"""

ZEST_LOGIN_SCHEMA = {
    "name": "zest_login",
    "description": "Authenticate with Zest - opens a browser for device-code login, registers the MCP server, and starts the background daemon.",
    "parameters": {
        "type": "object",
        "properties": {},
        "required": [],
    },
}

ZEST_LOGOUT_SCHEMA = {
    "name": "zest_logout",
    "description": "Sign out of Zest - stops the background daemon and clears the session.",
    "parameters": {
        "type": "object",
        "properties": {},
        "required": [],
    },
}

ZEST_STATUS_SCHEMA = {
    "name": "zest_status",
    "description": "Show Zest plugin status: authentication, sync stats, pending queue, daemon health, and remote sync toggle.",
    "parameters": {
        "type": "object",
        "properties": {},
        "required": [],
    },
}

ZEST_SYNC_SCHEMA = {
    "name": "zest_sync",
    "description": "Trigger an immediate sync of all queued coding sessions, messages, and code diffs to Zest.",
    "parameters": {
        "type": "object",
        "properties": {},
        "required": [],
    },
}

ZEST_STANDUP_SCHEMA = {
    "name": "zest_standup",
    "description": "Generate today's standup report from coding sessions. Returns a URL to the standup on the Zest dashboard.",
    "parameters": {
        "type": "object",
        "properties": {},
        "required": [],
    },
}

ZEST_ENABLE_SCHEMA = {
    "name": "zest_enable",
    "description": "Enable remote persistence - data will sync to Zest every 60 seconds.",
    "parameters": {
        "type": "object",
        "properties": {},
        "required": [],
    },
}

ZEST_DISABLE_SCHEMA = {
    "name": "zest_disable",
    "description": "Disable remote persistence - data will queue locally only, not synced to Zest.",
    "parameters": {
        "type": "object",
        "properties": {},
        "required": [],
    },
}

ZEST_WORKSPACE_SCHEMA = {
    "name": "zest_workspace",
    "description": "View current workspace or switch to a different one. Without arguments lists all workspaces. Pass a workspace number or name to switch.",
    "parameters": {
        "type": "object",
        "properties": {
            "raw_args": {
                "type": "string",
                "description": "Workspace number or name to switch to",
            },
        },
        "required": [],
    },
}

ZEST_IGNORE_SCHEMA = {
    "name": "zest_ignore",
    "description": "Ignore the current Hermes session - it will no longer be synced or included in standups.",
    "parameters": {
        "type": "object",
        "properties": {},
        "required": [],
    },
}

ZEST_UNIGNORE_SCHEMA = {
    "name": "zest_unignore",
    "description": "Unignore the current Hermes session - it will be synced and included in standups again.",
    "parameters": {
        "type": "object",
        "properties": {},
        "required": [],
    },
}

ZEST_LIST_IGNORED_SCHEMA = {
    "name": "zest_list_ignored",
    "description": "List all currently ignored Hermes session IDs.",
    "parameters": {
        "type": "object",
        "properties": {},
        "required": [],
    },
}

ZEST_IS_IGNORED_SCHEMA = {
    "name": "zest_is_ignored",
    "description": "Check if the current Hermes session is ignored.",
    "parameters": {
        "type": "object",
        "properties": {},
        "required": [],
    },
}

ZEST_PRIVACY_SCHEMA = {
    "name": "zest_privacy",
    "description": "View or configure privacy redaction settings (approach, aggressive mode, .gitignore/.zest.rules respect, custom exclusion patterns). Without arguments shows current settings.",
    "parameters": {
        "type": "object",
        "properties": {
            "raw_args": {
                "type": "string",
                "description": "CLI-style flags, e.g. '--approach=detection --aggressive=true --exclude=\"*.secret.js\"'",
            },
        },
        "required": [],
    },
}

ZEST_CHECK_NOTIFICATIONS_SCHEMA = {
    "name": "zest_check_notifications",
    "description": "Retrieve and display a pending Zest notification (e.g. standup ready, first data collected). Call this when the pre_llm_call context indicates a notification is waiting.",
    "parameters": {
        "type": "object",
        "properties": {},
        "required": [],
    },
}
