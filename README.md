# Zest for Hermes

Track your Hermes sessions in Zest: automatic standups, token and cost
analytics, and a picture of how your team actually works across every AI tool.

## Install

    hermes plugins update zest-hermes

Then run `/zest_login` inside a Hermes session.

Full instructions: https://meetzest.com/docs/plugins/hermes/

## What it captures

Sessions, messages, tool calls, models, per-turn token usage and context
pressure. Everything is redacted on your machine before it is sent, using
the same privacy pipeline every Zest plugin uses.

## Commands

| Command | What it does |
|---|---|
| `/zest_login` | Connect this machine to your Zest workspace |
| `/zest_logout` | Sign out of Zest |
| `/zest_status` | Auth, workspace, sync state, daemon and hook health |
| `/zest_sync` | Force a sync now |
| `/zest_standup` | Generate today's standup |
| `/zest_enable` | Enable remote sync of sessions to Zest |
| `/zest_disable` | Disable remote sync (keep capturing locally only) |
| `/zest_workspace` | View or switch workspace |
| `/zest_privacy` | View or configure privacy redaction |
| `/zest_ignore` | Stop tracking the current folder |
| `/zest_unignore` | Resume tracking the current folder |
| `/zest_list_ignored` | List all ignored folders |
| `/zest_is_ignored` | Check if the current folder is ignored |
| `/zest_check_notifications` | Check for pending Zest notifications |

## Requirements

Node >= 22.13 (the plugin's commands and daemon run under Node;
`node:sqlite` required `--experimental-sqlite` until 22.13.0).

## Notes

Source lives in the Zest monorepo; this repository is the distribution
mirror and is regenerated on every release.

## License

Proprietary — see LICENSE.md. Third-party components included in this
distribution are listed in THIRD-PARTY-NOTICES.md.

Questions: support@winding.ai
