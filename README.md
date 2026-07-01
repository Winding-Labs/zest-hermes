# Zest - Hermes Agent Plugin

Zest tracks your coding sessions and generates AI-powered daily standups automatically. Install the plugin to sync work activity, switch workspaces, manage privacy settings, and get standup summaries - all from inside Hermes.

## Features

- **Automatic session tracking** - Captures Hermes sessions in the background via a lightweight daemon. Only activity after the plugin starts is tracked; pre-existing sessions and historical data are never accessed.
- **AI-powered standups** - Generate daily standup summaries with key accomplishments, files changed, and time breakdowns
- **Multi-workspace support** - Switch between team workspaces to organize work by project or team
- **Privacy controls** - Sensitive data (API keys, tokens, secrets) is automatically redacted before sync with configurable strategies (detection, encryption, hybrid)
- **Session management** - Ignore/unignore specific sessions to control what gets synced and analyzed
- **Local-first architecture** - All data is processed locally; remote sync is optional and can be toggled on/off

## Installation

1. **Install the plugin**:

   ```bash
   hermes plugins install https://github.com/Winding-Labs/zest-hermes --enable
   ```

2. **Authenticate with Zest**:

   ```
   /zest_login
   ```

3. **Start coding!** The plugin works automatically in the background.

> The `--enable` flag adds `zest-hermes` to Hermes' plugin allow-list for you -
> there is no `plugins:` block to hand-edit.

## Agent mode

Agents provisioned from the Zest dashboard authenticate with a one-time
provisioning key instead of the interactive `/zest_login` flow. The dashboard's
"Add agent" wizard hands you the exact command - run it on the agent's Hermes box:

```bash
hermes zest-provision --agent-id <uuid> --provisioning-key <uuid> --workspace-id <uuid>
```

This writes `~/.hermes-zest/settings.json` (mode `0600`) with `authMode: "agent"`
and the provisioning key. On the next daemon boot the plugin exchanges the key for
session credentials and starts syncing - no `/zest_login` needed. Re-running the
command is safe: it merges into existing settings, preserving your privacy and log
preferences.

## Updating

```bash
hermes plugins update zest-hermes
```

## Available Commands

- `/zest_login` - Authenticate with Zest (opens browser)
- `/zest_logout` - Sign out from Zest
- `/zest_status` - View authentication and sync status
- `/zest_sync` - Manually trigger immediate sync
- `/zest_enable` - Enable remote persistence (syncing)
- `/zest_disable` - Disable remote persistence (local only)
- `/zest_standup` - Generate today's standup summary
- `/zest_privacy` - View or configure privacy settings
- `/zest_workspace` - View or switch workspace
- `/zest_ignore` - Ignore the current session (excluded from sync and standups)
- `/zest_unignore` - Unignore the current session

## How It Works

1. Plugin starts tracking immediately upon installation
2. Data is queued locally in `~/.hermes-zest/queue/`
3. After authentication (`/zest_login`), data syncs automatically
4. Background daemon runs continuously (auto-starts, auto-restarts)
5. All your coding activity is captured for analysis in Zest

## Troubleshooting

**Plugin not loading?**

```bash
hermes plugins list                 # Check if installed and enabled
hermes plugins enable zest-hermes   # Enable if disabled
```

**Authentication issues?**

```
/zest_status    # Check current status
/zest_logout    # Sign out
/zest_login     # Sign back in
```

**Data not syncing?**

```
/zest_status    # Check daemon and sync status
/zest_sync      # Try manual sync
```

## Privacy Policy

This plugin collects coding session data (messages, tool uses, session metadata) to generate standup summaries and track developer activity. Only messages exchanged after the plugin starts are tracked - the plugin never accesses previous chats or historical data.

For complete privacy information, see our privacy policy: https://meetzest.com/privacy

### Data Collection
- Session messages and tool uses recorded after the plugin starts (no historical data)
- Session metadata (start time, duration, title)
- User profile and workspace information
- Analytics events (PostHog)

### Data Controls
- Privacy settings with configurable redaction strategies (detection, encryption, hybrid)
- Aggressive mode for broader pattern matching
- Custom glob exclusion patterns (e.g., `*.env`, `*.secret.js`)
- `.gitignore` and `.zest.rules` file pattern support
- Session ignore/unignore for selective exclusion
- Remote sync toggle - disable to keep all data local
- All data processing happens locally first; sync is optional

## Support

- **Email:** support@meetzest.com
- **Website:** https://meetzest.com
