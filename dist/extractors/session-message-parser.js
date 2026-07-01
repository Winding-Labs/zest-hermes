// src/utils/time.ts
function epochToIso(epoch) {
  return new Date(epoch * 1000).toISOString();
}

// src/extractors/diff-extractor.ts
import { randomUUID } from "node:crypto";

// ../../packages/utils/src/command-xml.ts
var CLAUDE_BUILTIN_COMMANDS = new Set([
  "add-dir",
  "agents",
  "allowed-tools",
  "android",
  "app",
  "autofix-pr",
  "bashes",
  "branch",
  "btw",
  "bug",
  "checkpoint",
  "chrome",
  "clear",
  "color",
  "compact",
  "config",
  "context",
  "continue",
  "copy",
  "cost",
  "desktop",
  "diff",
  "doctor",
  "effort",
  "exit",
  "export",
  "extra-usage",
  "fast",
  "feedback",
  "fork",
  "help",
  "hooks",
  "ide",
  "init",
  "insights",
  "install-github-app",
  "install-slack-app",
  "ios",
  "keybindings",
  "login",
  "logout",
  "mcp",
  "memory",
  "mobile",
  "model",
  "new",
  "output-style",
  "passes",
  "permissions",
  "plan",
  "plugin",
  "powerup",
  "pr-comments",
  "privacy-settings",
  "quit",
  "rc",
  "release-notes",
  "reload-plugins",
  "remote-control",
  "remote-env",
  "rename",
  "reset",
  "resume",
  "review",
  "rewind",
  "sandbox",
  "schedule",
  "security-review",
  "settings",
  "setup-bedrock",
  "skills",
  "stats",
  "status",
  "statusline",
  "stickers",
  "tasks",
  "teleport",
  "terminal-setup",
  "theme",
  "todos",
  "tp",
  "ultraplan",
  "upgrade",
  "usage",
  "vim",
  "voice",
  "web-setup"
]);
// ../../packages/utils/src/date-range.ts
var PERIOD_TYPE_LABELS = {
  ["today" /* Today */]: "Today",
  ["this_week" /* ThisWeek */]: "This Week",
  ["this_month" /* ThisMonth */]: "This Month"
};
var PERIOD_SUMMARY_LABELS = {
  ["today" /* Today */]: "Daily Summary",
  ["this_week" /* ThisWeek */]: "Weekly Summary",
  ["this_month" /* ThisMonth */]: "Monthly Summary",
  custom: "Custom Period"
};
// ../../packages/utils/src/frontmatter.ts
var FRONTMATTER_KEYS = new Set(["name", "description"]);
// ../../packages/utils/src/language-utils.ts
var languageMap = {
  ts: "typescript",
  tsx: "typescriptreact",
  js: "javascript",
  jsx: "javascriptreact",
  mjs: "javascript",
  cjs: "javascript",
  py: "python",
  pyi: "python",
  pyw: "python",
  rs: "rust",
  go: "go",
  java: "java",
  kt: "kotlin",
  kts: "kotlin",
  scala: "scala",
  groovy: "groovy",
  gradle: "groovy",
  c: "c",
  h: "c",
  cpp: "cpp",
  cc: "cpp",
  cxx: "cpp",
  hpp: "cpp",
  hxx: "hpp",
  cs: "csharp",
  rb: "ruby",
  php: "php",
  swift: "swift",
  m: "objective-c",
  mm: "objective-cpp",
  vue: "vue",
  svelte: "svelte",
  astro: "astro",
  dart: "dart",
  ex: "elixir",
  exs: "elixir",
  clj: "clojure",
  cljs: "clojure",
  edn: "clojure",
  hs: "haskell",
  lhs: "haskell",
  lua: "lua",
  erl: "erlang",
  hrl: "erlang",
  pl: "perl",
  pm: "perl",
  coffee: "coffeescript",
  sh: "shellscript",
  bash: "shellscript",
  zsh: "shellscript",
  fish: "shellscript",
  ps1: "powershell",
  psm1: "powershell",
  bat: "bat",
  cmd: "bat",
  md: "markdown",
  mdx: "mdx",
  json: "json",
  jsonc: "jsonc",
  yaml: "yaml",
  yml: "yaml",
  toml: "toml",
  xml: "xml",
  html: "html",
  htm: "html",
  ini: "ini",
  properties: "properties",
  css: "css",
  scss: "scss",
  sass: "sass",
  less: "less",
  sql: "sql",
  graphql: "graphql",
  gql: "graphql",
  proto: "protobuf",
  dockerfile: "dockerfile",
  tf: "terraform",
  r: "r"
};
function getLanguageFromPath(filePath) {
  const ext = filePath.split(".").pop()?.toLowerCase();
  return languageMap[ext || ""] || "plaintext";
}
// ../../packages/utils/src/mcp-registry.ts
var CACHE_TTL_MS = 30 * 60 * 1000;
var CACHE_MAX_SIZE = 100;
class TtlCache {
  map = new Map;
  get(key) {
    const entry = this.map.get(key);
    if (!entry)
      return { hit: false };
    if (Date.now() > entry.expiry) {
      this.map.delete(key);
      return { hit: false };
    }
    return { hit: true, value: entry.value };
  }
  set(key, value) {
    if (this.map.size >= CACHE_MAX_SIZE && !this.map.has(key)) {
      const firstKey = this.map.keys().next().value;
      if (firstKey !== undefined)
        this.map.delete(firstKey);
    }
    this.map.set(key, { value, expiry: Date.now() + CACHE_TTL_MS });
  }
  clear() {
    this.map.clear();
  }
}
var cache = new TtlCache;
var toolCache = new TtlCache;
var serverCache = new TtlCache;
var GENERIC_SEGMENTS = new Set(["mcp", "com", "org", "io", "dev", "server", "api"]);
var VERB_PREFIXES = new Set([
  "get",
  "list",
  "create",
  "delete",
  "update",
  "search",
  "query",
  "fetch",
  "run",
  "execute",
  "resolve",
  "find",
  "read",
  "write",
  "set",
  "send",
  "check",
  "add",
  "remove"
]);
// src/utils/tool-call-parser.ts
function parseToolCalls(json) {
  try {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed))
      return [];
    return parsed.filter((item) => item && typeof item === "object" && ("function" in item) && typeof item.function === "object");
  } catch {
    return [];
  }
}
function parseArguments(argsJson) {
  try {
    return JSON.parse(argsJson);
  } catch {
    return null;
  }
}

// src/extractors/diff-extractor.ts
var FILE_EDIT_TOOLS = new Set(["write_file", "edit_file", "patch"]);
function createAdditionDiff(filePath, content) {
  const lines = content.split(`
`);
  const header = `--- /dev/null
+++ ${filePath}
@@ -0,0 +1,${lines.length} @@
`;
  return header + lines.map((line) => `+${line}`).join(`
`);
}
function extractDiffEvents(messages) {
  const events = [];
  for (const msg of messages) {
    if (!msg.tool_calls)
      continue;
    const toolCalls = parseToolCalls(msg.tool_calls);
    for (const call of toolCalls) {
      if (!FILE_EDIT_TOOLS.has(call.function.name))
        continue;
      const args = parseArguments(call.function.arguments);
      if (!args)
        continue;
      const filePath = args.path;
      if (!filePath || typeof filePath !== "string")
        continue;
      if (call.function.name === "write_file") {
        const content = args.content;
        if (!content || typeof content !== "string")
          continue;
        events.push({
          id: randomUUID(),
          timestamp: epochToIso(msg.timestamp),
          document_uri: filePath,
          language_id: getLanguageFromPath(filePath),
          workspace_folder_uri: null,
          session_id: msg.session_id,
          workspace_id: null,
          payload: {
            tool_name: call.function.name,
            session_id: msg.session_id,
            diff: createAdditionDiff(filePath, content)
          }
        });
      }
      if (call.function.name === "edit_file" || call.function.name === "patch") {
        const diff = args.diff ?? args.patch ?? args.content;
        if (!diff || typeof diff !== "string")
          continue;
        events.push({
          id: randomUUID(),
          timestamp: epochToIso(msg.timestamp),
          document_uri: filePath,
          language_id: getLanguageFromPath(filePath),
          workspace_folder_uri: null,
          session_id: msg.session_id,
          workspace_id: null,
          payload: {
            tool_name: call.function.name,
            session_id: msg.session_id,
            diff
          }
        });
      }
    }
  }
  return events;
}

// src/extractors/inventory-metadata-builder.ts
import { readdirSync, readFileSync } from "node:fs";
import { join as join2 } from "node:path";

// src/config/constants.ts
import { homedir } from "node:os";
import { join } from "node:path";
var HERMES_HOME = process.env.HERMES_DIR ?? join(homedir(), ".hermes");
var HERMES_ZEST_HOME = join(homedir(), ".hermes-zest");
var HERMES_CONFIG_PATH = join(HERMES_HOME, "config.yaml");
var STATE_DB_PATH = join(HERMES_HOME, "state.db");
var CHECKPOINT_PATH = join(HERMES_ZEST_HOME, "state.json");
var PENDING_FINALIZE_FILE = join(HERMES_ZEST_HOME, "pending-finalize");
var QUEUE_DIR = join(HERMES_ZEST_HOME, "queue");
var EVENTS_QUEUE_FILE = join(QUEUE_DIR, "events.jsonl");
var SESSIONS_QUEUE_FILE = join(QUEUE_DIR, "chat-sessions.jsonl");
var MESSAGES_QUEUE_FILE = join(QUEUE_DIR, "chat-messages.jsonl");
var STATE_DIR = join(HERMES_ZEST_HOME, "state");
var LOGS_DIR = join(HERMES_ZEST_HOME, "logs");
var SESSION_FILE = process.env.ZEST_SESSION_FILE ?? join(HERMES_ZEST_HOME, "session.json");
var SETTINGS_FILE = join(HERMES_ZEST_HOME, "settings.json");
var DAEMON_PID_FILE = join(HERMES_ZEST_HOME, "daemon.pid");
var DAEMON_LOG_FILE = join(HERMES_ZEST_HOME, "daemon.log");
var ACTIVE_SESSIONS_FILE = join(HERMES_ZEST_HOME, "active-sessions");
var SYNC_METRICS_FILE = join(HERMES_ZEST_HOME, "sync-metrics.jsonl");
var SYNC_METRICS_RETENTION_MS = 60 * 60 * 1000;
var STATUS_CACHE_FILE = process.env.ZEST_STATUS_CACHE_FILE ?? join(HERMES_ZEST_HOME, "status-cache.json");
var VERSION_CHECK_INTERVAL_MS = 60 * 60 * 1000;
var UPDATE_CHECK_CACHE_TTL_MS = 60 * 60 * 1000;
var STALE_SESSION_AGE_MS = 7 * 24 * 60 * 60 * 1000;
var NOTIFICATION_DURATION_MS = 5 * 60 * 1000;
var STANDUP_NOTIFICATION_THROTTLE_MS = 2 * 60 * 60 * 1000;

// src/extractors/inventory-metadata-builder.ts
var CUSTOM_SKILLS_DIR = join2(HERMES_HOME, "skills");
var BUNDLED_SKILLS_DIR = join2(HERMES_HOME, "hermes-agent", "skills");
var MEMORY_FILE = join2(HERMES_HOME, "memories", "MEMORY.md");
var USER_FILE = join2(HERMES_HOME, "memories", "USER.md");
var ENTRY_SEPARATOR = `
§
`;
function countSkillsIn(dir) {
  let count = 0;
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        count += countSkillsIn(join2(dir, entry.name));
      } else if (entry.name === "SKILL.md") {
        count++;
      }
    }
  } catch {}
  return count;
}
function readFileOrNull(path) {
  try {
    return readFileSync(path, "utf-8");
  } catch {
    return null;
  }
}
function countEntries(content) {
  return content.split(ENTRY_SEPARATOR).filter((s) => s.trim().length > 0).length;
}
function buildInventoryMetadata() {
  const skillsCount = countSkillsIn(CUSTOM_SKILLS_DIR) + countSkillsIn(BUNDLED_SKILLS_DIR);
  const memoryContent = readFileOrNull(MEMORY_FILE);
  const userContent = readFileOrNull(USER_FILE);
  return {
    available_skills_count: skillsCount > 0 ? skillsCount : null,
    memory_chars: memoryContent?.length ?? null,
    memory_entry_count: memoryContent ? countEntries(memoryContent) : null,
    user_entry_count: userContent ? countEntries(userContent) : null,
    user_chars: userContent?.length ?? null
  };
}

// src/extractors/session-metadata-builder.ts
var NORMAL_END_REASONS = new Set([
  "stop",
  "end_turn",
  "tool_calls",
  "max_tokens",
  "cli_close",
  "new_session"
]);
function buildSessionMetadata(row) {
  return {
    trigger: row.source,
    model: row.model,
    ended_at: row.ended_at ? new Date(row.ended_at * 1000).toISOString() : null,
    end_reason: row.end_reason,
    is_error: row.end_reason != null && !NORMAL_END_REASONS.has(row.end_reason),
    input_tokens: row.input_tokens + row.cache_read_tokens + row.cache_write_tokens,
    output_tokens: row.output_tokens,
    cache_read_tokens: row.cache_read_tokens,
    cache_write_tokens: row.cache_write_tokens,
    reasoning_tokens: row.reasoning_tokens,
    cost_usd: row.actual_cost_usd ?? row.estimated_cost_usd ?? null,
    message_count: row.message_count,
    tool_call_count: row.tool_call_count,
    duration_ms: row.ended_at ? Math.round((row.ended_at - row.started_at) * 1000) : null
  };
}

// src/extractors/session-message-parser.ts
var EXTRACTABLE_ROLES = new Set(["user", "assistant"]);
var MAX_TRACKED_SESSIONS = 500;

class SessionMessageParser {
  dbClient;
  stateManager;
  logger;
  constructor(dbClient, stateManager, logger) {
    this.dbClient = dbClient;
    this.stateManager = stateManager;
    this.logger = logger;
  }
  async poll() {
    if (!this.dbClient.isAvailable()) {
      this.logger.debug("state.db not available, skipping");
      return { sessions: [], messages: [], diffEvents: [], lastMessageId: 0 };
    }
    try {
      const state = await this.stateManager.read();
      const inventoryMetadata = buildInventoryMetadata();
      const newSessions = this.extractNewSessions(state, inventoryMetadata);
      const { messages, updatedIndices, rows } = this.extractMessages(state);
      const diffEvents = extractDiffEvents(rows);
      const batchLastMessageId = rows.length > 0 ? Math.max(...rows.map((m) => m.id)) : 0;
      const newSessionIds = new Set(newSessions.map((s) => s.id));
      const activeSessionIds = [...new Set(rows.map((r) => r.session_id))].filter((id) => !newSessionIds.has(id));
      const refreshedSessions = this.refreshSessions(activeSessionIds, inventoryMetadata);
      if (newSessions.length > 0 || messages.length > 0) {
        await this.stateManager.write({
          lastSessionStartedAt: newSessions.length > 0 ? newSessions[newSessions.length - 1].created_at_epoch : state.lastSessionStartedAt,
          lastMessageId: messages.length > 0 ? Math.max(...messages.map((m) => Number(m.id))) : state.lastMessageId,
          messageIndices: pruneIndices({ ...state.messageIndices, ...updatedIndices })
        });
        this.logger.info(`Extracted ${newSessions.length} sessions, ${messages.length} messages`);
      }
      const allSessions = [...newSessions, ...refreshedSessions];
      return {
        sessions: allSessions.map(({ created_at_epoch: _, ...s }) => s),
        messages,
        diffEvents,
        lastMessageId: batchLastMessageId
      };
    } catch (error) {
      this.logger.error("Failed to poll state.db:", error);
      return { sessions: [], messages: [], diffEvents: [], lastMessageId: 0 };
    }
  }
  toExtractedSession(row, inventory) {
    return {
      id: row.id,
      title: row.title ?? undefined,
      created_at: epochToIso(row.started_at),
      created_at_epoch: row.started_at,
      project_id: undefined,
      project_name: undefined,
      metadata: { ...buildSessionMetadata(row), ...inventory }
    };
  }
  extractNewSessions(state, inventory) {
    return this.dbClient.getSessionsAfter(state.lastSessionStartedAt).map((row) => this.toExtractedSession(row, inventory));
  }
  refreshSessions(sessionIds, inventory) {
    if (sessionIds.length === 0)
      return [];
    return this.dbClient.getSessionsByIds(sessionIds).map((row) => this.toExtractedSession(row, inventory));
  }
  extractMessages(state) {
    const rows = this.dbClient.getMessagesAfter(state.lastMessageId);
    const messages = [];
    const updatedIndices = {};
    for (const row of rows) {
      if (!EXTRACTABLE_ROLES.has(row.role))
        continue;
      const sessionId = row.session_id;
      const lastIndex = updatedIndices[sessionId] ?? state.messageIndices[sessionId] ?? -1;
      const nextIndex = lastIndex + 1;
      updatedIndices[sessionId] = nextIndex;
      messages.push(this.toExtractedMessage(row, sessionId, nextIndex));
    }
    return { messages, updatedIndices, rows };
  }
  toExtractedMessage(row, sessionId, messageIndex) {
    return {
      id: String(row.id),
      session_id: sessionId,
      message_index: messageIndex,
      role: row.role,
      content: row.content || summarizeToolCalls(row.tool_calls),
      created_at: epochToIso(row.timestamp),
      metadata: {
        hermes_message_id: row.id,
        tool_name: row.tool_name,
        finish_reason: row.finish_reason,
        token_count: row.token_count
      }
    };
  }
}
function summarizeToolCalls(toolCallsJson) {
  if (!toolCallsJson)
    return "";
  try {
    const calls = JSON.parse(toolCallsJson);
    if (!Array.isArray(calls) || calls.length === 0)
      return "";
    const names = calls.map((c) => c.function?.name).filter(Boolean);
    return names.length > 0 ? `[tool: ${names.join(", ")}]` : "";
  } catch {
    return "";
  }
}
function pruneIndices(indices) {
  const keys = Object.keys(indices);
  if (keys.length <= MAX_TRACKED_SESSIONS)
    return indices;
  keys.sort();
  const keep = keys.slice(-MAX_TRACKED_SESSIONS);
  return Object.fromEntries(keep.map((k) => [k, indices[k]]));
}
export {
  SessionMessageParser
};
