// src/config/constants.ts
import { homedir } from "node:os";
import { join } from "node:path";
var HERMES_HOME = process.env.HERMES_DIR ?? join(homedir(), ".hermes");
var HERMES_ZEST_HOME = join(homedir(), ".hermes-zest");
var HERMES_CONFIG_PATH = join(HERMES_HOME, "config.yaml");
var STATE_DB_PATH = join(HERMES_HOME, "state.db");
var CHECKPOINT_PATH = join(HERMES_ZEST_HOME, "state.json");
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
var POLL_INTERVAL_MS = 5000;
var VERSION_CHECK_INTERVAL_MS = 60 * 60 * 1000;
var UPDATE_CHECK_CACHE_TTL_MS = 60 * 60 * 1000;
var STALE_SESSION_AGE_MS = 7 * 24 * 60 * 60 * 1000;
var NOTIFICATION_DURATION_MS = 5 * 60 * 1000;
var STANDUP_NOTIFICATION_THROTTLE_MS = 2 * 60 * 60 * 1000;

// src/db/hermes-db-client.ts
import { Database } from "bun:sqlite";
import { existsSync } from "node:fs";

class HermesDbSqliteClient {
  dbPath;
  logger;
  db = null;
  constructor(dbPath, logger) {
    this.dbPath = dbPath;
    this.logger = logger;
  }
  isAvailable() {
    return existsSync(this.dbPath);
  }
  getSessionsAfter(epoch) {
    const db = this.ensureDb();
    return epoch !== null ? db.query("SELECT * FROM sessions WHERE started_at > ? ORDER BY started_at ASC").all(epoch) : db.query("SELECT * FROM sessions ORDER BY started_at ASC").all();
  }
  getMessagesAfter(lastId) {
    const db = this.ensureDb();
    return db.query("SELECT * FROM messages WHERE id > ? ORDER BY id ASC").all(lastId);
  }
  getWatermarks() {
    const db = this.ensureDb();
    const row = db.query("SELECT (SELECT max(started_at) FROM sessions) as max_epoch, (SELECT max(id) FROM messages) as max_id").get();
    return {
      maxSessionEpoch: row.max_epoch,
      maxMessageId: row.max_id ?? 0
    };
  }
  close() {
    try {
      this.db?.close();
    } catch {}
    this.db = null;
  }
  ensureDb() {
    if (this.db)
      return this.db;
    this.db = new Database(this.dbPath, { readonly: true });
    return this.db;
  }
}

// src/utils/ignored-sessions.ts
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join as join3 } from "node:path";

// src/utils/logger.ts
import { createWriteStream, mkdirSync } from "node:fs";
import { join as join2 } from "node:path";
var stream = null;
var streamFailed = false;
var currentDate = "";
function getStream() {
  const today = new Date().toISOString().split("T")[0];
  if (stream && today !== currentDate) {
    stream.end();
    stream = null;
    streamFailed = false;
  }
  currentDate = today;
  if (stream)
    return stream;
  if (streamFailed)
    return null;
  try {
    mkdirSync(LOGS_DIR, { recursive: true });
    const logFile = join2(LOGS_DIR, `plugin-${today}.log`);
    stream = createWriteStream(logFile, { flags: "a" });
    stream.on("error", () => {
      streamFailed = true;
      stream = null;
    });
    return stream;
  } catch {
    streamFailed = true;
    return null;
  }
}
function log(level, msg, ...args) {
  const timestamp = new Date().toISOString();
  const suffix = args.length ? ` ${args.map((a) => a instanceof Error ? a.message : JSON.stringify(a)).join(" ")}` : "";
  const line = `[${timestamp}] [${level}] ${msg}${suffix}
`;
  try {
    getStream()?.write(line);
  } catch {}
}
var logger = {
  debug: (msg, ...args) => log("DEBUG", msg, ...args),
  info: (msg, ...args) => log("INFO", msg, ...args),
  warn: (msg, ...args) => {
    console.warn(`[Zest:Warn] ${msg}`, ...args);
    log("WARN", msg, ...args);
  },
  error: (msg, ...args) => {
    console.error(`[Zest:Error] ${msg}`);
    log("ERROR", msg, ...args);
  }
};

// src/utils/ignored-sessions.ts
var IGNORED_SESSIONS_FILE = join3(HERMES_ZEST_HOME, "ignored-sessions.json");
async function loadIgnoredSessions() {
  try {
    const content = await readFile(IGNORED_SESSIONS_FILE, "utf-8");
    const parsed = JSON.parse(content);
    if (!Array.isArray(parsed)) {
      logger.warn("ignored_sessions_invalid_format", { expected: "array" });
      return new Set;
    }
    return new Set(parsed.filter((id) => typeof id === "string"));
  } catch (error) {
    if (error.code !== "ENOENT") {
      logger.warn("ignored_sessions_load_failed", error);
    }
    return new Set;
  }
}

// src/utils/state-manager.ts
import { readFile as readFile2, writeFile as writeFile2 } from "node:fs/promises";
import { dirname as dirname2 } from "node:path";

// ../../packages/plugin-common/src/analytics/events.ts
var AUTH_DEVICE_CODE_INITIATION_FAILED = "auth_device_code_initiation_failed";
var AUTH_DEVICE_CODE_POLLING_FAILED = "auth_device_code_polling_failed";
var AUTH_SESSION_LOAD_FAILED = "auth_session_load_failed";
var AUTH_SESSION_CLEAR_FAILED = "auth_session_clear_failed";
var AUTH_SESSION_SAVE_FAILED = "auth_session_save_failed";
var SYNC_NOT_AUTHENTICATED = "sync_not_authenticated";
var SYNC_EVENTS_UPLOAD_FAILED = "sync_events_upload_failed";
var SYNC_EVENTS_RETRY_EXHAUSTED = "sync_events_upload_retry_exhausted";
var SYNC_CHAT_UPLOAD_FAILED = "sync_chat_upload_failed";
var SYNC_NETWORK_ERROR = "sync_network_error";
var SYNC_SERVER_OVERLOAD = "sync_server_overload";
var SYNC_DATA_ERROR = "sync_data_error";
var SYNC_AUTH_ERROR = "sync_auth_error";
var SYNC_BLOCKED_NO_WORKSPACE = "sync_blocked_no_workspace";
var AUTH_SESSION_METADATA_LOST = "auth_session_metadata_lost";
var QUEUE_READ_CORRUPTED = "queue_read_corrupted";
var QUEUE_WRITE_FAILED = "queue_write_failed";
var FILE_LOCK_TIMEOUT = "file_lock_timeout";
var FILE_LOCK_CREATE_FAILED = "file_lock_create_failed";
var NOTIFICATION_STATE_WRITE_FAILED = "notification_state_write_failed";
var QUEUE_CAP_EVICTION = "queue_cap_eviction";
var SYNC_STALE_EVENTS_DROPPED = "sync_stale_events_dropped";
var SYNC_DRAIN_THROTTLED = "sync_drain_throttled";
var SYNC_ORPHANED_MESSAGES_DROPPED = "sync_orphaned_messages_dropped";
var EXTRACTION_PROJECT_DIR_NOT_FOUND = "extraction_project_dir_not_found";
var EXTRACTION_SESSION_FAILED = "extraction_session_failed";
var DAEMON_START_FAILED = "daemon_start_failed";
var DAEMON_RESTART_FAILED = "daemon_restart_failed";
var DAEMON_SYNC_CYCLE_FAILED = "daemon_sync_cycle_failed";
var DAEMON_UNHANDLED_ERROR = "daemon_unhandled_error";
var API_WORKSPACE_FETCH_FAILED = "api_workspace_fetch_failed";
var API_PROFILE_UPDATE_FAILED = "api_profile_update_failed";
var API_PROFILE_METADATA_PREFETCH_FAILED = "api_profile_metadata_prefetch_failed";
var API_STANDUP_TEAM_FETCH_FAILED = "api_standup_team_fetch_failed";
var API_STANDUP_PROMPT_FETCH_FAILED = "api_standup_prompt_fetch_failed";
var API_STANDUP_GENERATION_FAILED = "api_standup_generation_failed";
var API_DATA_CONTROLS_FETCH_FAILED = "api_data_controls_fetch_failed";
var SUPABASE_CLIENT_INIT_FAILED = "supabase_client_init_failed";
var SUPABASE_SESSION_READ_FAILED = "supabase_session_read_failed";
var SUPABASE_SESSION_WRITE_FAILED = "supabase_session_write_failed";
var ERROR_TYPES = [
  AUTH_DEVICE_CODE_INITIATION_FAILED,
  AUTH_DEVICE_CODE_POLLING_FAILED,
  AUTH_SESSION_CLEAR_FAILED,
  AUTH_SESSION_LOAD_FAILED,
  AUTH_SESSION_SAVE_FAILED,
  AUTH_SESSION_METADATA_LOST,
  SYNC_NOT_AUTHENTICATED,
  SYNC_EVENTS_UPLOAD_FAILED,
  SYNC_EVENTS_RETRY_EXHAUSTED,
  SYNC_CHAT_UPLOAD_FAILED,
  SYNC_NETWORK_ERROR,
  SYNC_SERVER_OVERLOAD,
  SYNC_DATA_ERROR,
  SYNC_AUTH_ERROR,
  SYNC_BLOCKED_NO_WORKSPACE,
  QUEUE_READ_CORRUPTED,
  QUEUE_WRITE_FAILED,
  QUEUE_CAP_EVICTION,
  SYNC_STALE_EVENTS_DROPPED,
  SYNC_DRAIN_THROTTLED,
  SYNC_ORPHANED_MESSAGES_DROPPED,
  FILE_LOCK_TIMEOUT,
  FILE_LOCK_CREATE_FAILED,
  NOTIFICATION_STATE_WRITE_FAILED,
  EXTRACTION_PROJECT_DIR_NOT_FOUND,
  EXTRACTION_SESSION_FAILED,
  DAEMON_START_FAILED,
  DAEMON_RESTART_FAILED,
  DAEMON_SYNC_CYCLE_FAILED,
  DAEMON_UNHANDLED_ERROR,
  API_WORKSPACE_FETCH_FAILED,
  API_PROFILE_UPDATE_FAILED,
  API_PROFILE_METADATA_PREFETCH_FAILED,
  API_STANDUP_TEAM_FETCH_FAILED,
  API_STANDUP_PROMPT_FETCH_FAILED,
  API_STANDUP_GENERATION_FAILED,
  API_DATA_CONTROLS_FETCH_FAILED,
  SUPABASE_CLIENT_INIT_FAILED,
  SUPABASE_SESSION_READ_FAILED,
  SUPABASE_SESSION_WRITE_FAILED
];
var errorTypeSet = new Set(ERROR_TYPES);

// ../../packages/plugin-common/src/utils/fs-utils.ts
import { mkdir as mkdir2, stat } from "node:fs/promises";
async function ensureDirectory(dirPath) {
  try {
    await stat(dirPath);
  } catch {
    await mkdir2(dirPath, { recursive: true, mode: 448 });
  }
}

// ../../packages/plugin-common/src/utils/file-lock.ts
var noopFileLock = (_path, fn) => fn();
function resolveFileLock(callback) {
  return callback ?? noopFileLock;
}

// src/utils/state-manager.ts
var EMPTY_CHECKPOINT = {
  lastSessionStartedAt: null,
  lastMessageId: 0,
  messageIndices: {}
};
function createHermesStateManager(config = {}) {
  const filePath = config.filePath ?? CHECKPOINT_PATH;
  const logger2 = config.logger;
  const withFileLock = resolveFileLock(config.withFileLock);
  async function read() {
    try {
      return await withFileLock(filePath, async () => {
        try {
          const raw = await readFile2(filePath, "utf8");
          const parsed = JSON.parse(raw);
          return {
            lastSessionStartedAt: parsed.lastSessionStartedAt ?? null,
            lastMessageId: parsed.lastMessageId ?? 0,
            messageIndices: parsed.messageIndices ?? {}
          };
        } catch {
          return { ...EMPTY_CHECKPOINT, messageIndices: {} };
        }
      });
    } catch {
      logger2?.debug("Failed to read hermes checkpoint, using empty state");
      return { ...EMPTY_CHECKPOINT, messageIndices: {} };
    }
  }
  async function write(checkpoint) {
    try {
      await ensureDirectory(dirname2(filePath));
      await withFileLock(filePath, async () => {
        await writeFile2(filePath, JSON.stringify(checkpoint, null, 2));
        logger2?.debug(`Updated hermes checkpoint: lastMessageId=${checkpoint.lastMessageId}`);
      });
    } catch (error) {
      logger2?.error("Failed to write hermes checkpoint:", error);
    }
  }
  return { read, write };
}

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
  constructor(dbClient, stateManager, logger2) {
    this.dbClient = dbClient;
    this.stateManager = stateManager;
    this.logger = logger2;
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

// src/extractors/index.ts
class ExtractionManager {
  dbClient;
  stateManager;
  parser;
  signalExtractor;
  signalLastMessageId = 0;
  pollTimer = null;
  queue = null;
  logger;
  constructor(config) {
    const dbPath = config.dbPath ?? STATE_DB_PATH;
    const stateManager = config.stateManager ?? createHermesStateManager({ logger: config.logger });
    this.stateManager = stateManager;
    this.logger = config.logger;
    this.signalExtractor = config.signalExtractor;
    this.dbClient = new HermesDbSqliteClient(dbPath, config.logger);
    this.parser = new SessionMessageParser(this.dbClient, stateManager, config.logger);
  }
  async skipExistingEntries() {
    const checkpoint = await this.stateManager.read();
    if (checkpoint.lastMessageId > 0 || checkpoint.lastSessionStartedAt !== null)
      return;
    if (!this.dbClient.isAvailable())
      return;
    const { maxSessionEpoch, maxMessageId } = this.dbClient.getWatermarks();
    await this.stateManager.write({
      lastSessionStartedAt: maxSessionEpoch,
      lastMessageId: maxMessageId,
      messageIndices: {}
    });
    this.signalLastMessageId = maxMessageId;
    this.logger.info("extraction_watermark_initialized", {
      maxSessionEpoch,
      maxMessageId
    });
  }
  async start(queue) {
    this.queue = queue;
    await this.skipExistingEntries();
    await this.pollAndScheduleNext();
  }
  async pollAndScheduleNext() {
    await this.doPoll();
    this.pollTimer = setTimeout(() => this.pollAndScheduleNext(), POLL_INTERVAL_MS);
  }
  async doPoll() {
    if (!this.queue)
      return;
    try {
      const { sessions, messages, diffEvents, lastMessageId } = await this.parser.poll();
      const ignoredIds = await loadIgnoredSessions();
      for (const session of sessions) {
        if (session.id && ignoredIds.has(session.id)) {
          this.logger.debug("session_ignored_skip", { sessionId: session.id });
          continue;
        }
        await this.queue.enqueueChatSession(session);
      }
      for (const message of messages) {
        if (message.session_id && ignoredIds.has(message.session_id))
          continue;
        await this.queue.enqueueChatMessage(message);
      }
      for (const event of diffEvents) {
        if (event.session_id && ignoredIds.has(event.session_id))
          continue;
        await this.queue.enqueueEvent(event);
      }
      if (lastMessageId > this.signalLastMessageId) {
        const rawMessages = this.dbClient.getMessagesAfter(this.signalLastMessageId);
        const filtered = rawMessages.filter((m) => !ignoredIds.has(m.session_id));
        await this.signalExtractor.processMessages(filtered);
        this.signalLastMessageId = lastMessageId;
      }
    } catch (error) {
      this.logger.error("Poll cycle failed:", error);
    }
  }
  async stop() {
    if (this.pollTimer) {
      clearTimeout(this.pollTimer);
      this.pollTimer = null;
    }
    this.queue = null;
    this.dbClient.close();
  }
}
export {
  ExtractionManager
};
