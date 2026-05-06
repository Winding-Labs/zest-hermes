// src/utils/time.ts
function epochToIso(epoch) {
  return new Date(epoch * 1000).toISOString();
}

// src/extractors/diff-extractor.ts
import { randomUUID } from "node:crypto";
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
      const sessions = this.extractSessions(state);
      const { messages, updatedIndices, rows } = this.extractMessages(state);
      const diffEvents = extractDiffEvents(rows);
      const batchLastMessageId = rows.length > 0 ? Math.max(...rows.map((m) => m.id)) : 0;
      if (sessions.length > 0 || messages.length > 0) {
        await this.stateManager.write({
          lastSessionStartedAt: sessions.length > 0 ? sessions[sessions.length - 1].created_at_epoch : state.lastSessionStartedAt,
          lastMessageId: messages.length > 0 ? Math.max(...messages.map((m) => Number(m.id))) : state.lastMessageId,
          messageIndices: pruneIndices({ ...state.messageIndices, ...updatedIndices })
        });
        this.logger.info(`Extracted ${sessions.length} sessions, ${messages.length} messages`);
      }
      return {
        sessions: sessions.map(({ created_at_epoch: _, ...s }) => s),
        messages,
        diffEvents,
        lastMessageId: batchLastMessageId
      };
    } catch (error) {
      this.logger.error("Failed to poll state.db:", error);
      return { sessions: [], messages: [], diffEvents: [], lastMessageId: 0 };
    }
  }
  extractSessions(state) {
    const rows = this.dbClient.getSessionsAfter(state.lastSessionStartedAt);
    return rows.map((row) => ({
      id: row.id,
      title: row.title ?? undefined,
      created_at: epochToIso(row.started_at),
      created_at_epoch: row.started_at,
      project_id: undefined,
      project_name: undefined
    }));
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
      content: row.content ?? "",
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
