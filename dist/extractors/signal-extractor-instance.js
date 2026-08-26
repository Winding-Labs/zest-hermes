// src/config/constants.ts
import { homedir } from "node:os";
import { join } from "node:path";
var HERMES_HOME = process.env.HERMES_DIR ?? join(homedir(), ".hermes");
var HERMES_ZEST_HOME = process.env.ZEST_HERMES_STATE_DIR ?? join(homedir(), ".hermes-zest");
var HERMES_CONFIG_PATH = join(HERMES_HOME, "config.yaml");
var STATE_DB_PATH = join(HERMES_HOME, "state.db");
var CHECKPOINT_PATH = join(HERMES_ZEST_HOME, "state.json");
var PENDING_FINALIZE_FILE = join(HERMES_ZEST_HOME, "pending-finalize");
var QUEUE_DIR = join(HERMES_ZEST_HOME, "queue");
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
var LOG_RETENTION_DAYS = 7;

// ../../packages/plugin-common/src/logger/logger.ts
import { appendFile } from "node:fs/promises";
import { dirname } from "node:path";

// ../../packages/plugin-common/src/utils/fs-utils.ts
import { mkdir, stat } from "node:fs/promises";
async function ensureDirectory(dirPath) {
  try {
    await stat(dirPath);
  } catch {
    await mkdir(dirPath, { recursive: true, mode: 448 });
  }
}

// ../../packages/plugin-common/src/logger/logger.ts
var levels = { debug: 0, info: 1, warn: 2, error: 3 };
var pendingWrites = new Set;
async function flushLogs() {
  await Promise.all([...pendingWrites]);
}
var beforeExitRegistered = false;
function registerBeforeExit() {
  if (beforeExitRegistered)
    return;
  beforeExitRegistered = true;
  process.on("beforeExit", () => {
    flushLogs();
  });
}
function formatArgs(args) {
  if (args.length === 0)
    return "";
  return ` ${args.map((a) => a instanceof Error ? a.message : JSON.stringify(a)).join(" ")}`;
}
function writeToFile(rotation, logPrefix, level, message, args) {
  const task = (async () => {
    try {
      const logFilePath = rotation.getDatedLogPath(logPrefix);
      await ensureDirectory(dirname(logFilePath));
      const timestamp = new Date().toISOString();
      await appendFile(logFilePath, `[${timestamp}] ${level}: ${message}${formatArgs(args)}
`);
      rotation.cleanupStaleLogs(logPrefix);
    } catch {}
  })();
  pendingWrites.add(task);
  task.finally(() => pendingWrites.delete(task));
}
function createLogger(config) {
  const { prefix, logRotation, logPrefix = "plugin" } = config;
  let minLevel = "info";
  registerBeforeExit();
  const logger = {
    setLevel(level) {
      minLevel = level;
    },
    debug(message, ...args) {
      if (levels.debug >= levels[minLevel]) {
        writeToFile(logRotation, logPrefix, "DEBUG", message, args);
      }
    },
    info(message, ...args) {
      if (levels.info >= levels[minLevel]) {
        writeToFile(logRotation, logPrefix, "INFO", message, args);
      }
    },
    warn(message, ...args) {
      if (levels.warn >= levels[minLevel]) {
        console.warn(`[${prefix}:Warn] ${message}`, ...args);
        writeToFile(logRotation, logPrefix, "WARN", message, args);
      }
    },
    error(message, error) {
      if (levels.error >= levels[minLevel]) {
        console.error(`[${prefix}:Error] ${message}`, error ?? "");
        writeToFile(logRotation, logPrefix, "ERROR", message, error === undefined ? [] : [error]);
      }
    }
  };
  return { logger, flushLogs };
}
// ../../packages/plugin-common/src/log-rotation/log-rotation.ts
import { readdir, unlink } from "node:fs/promises";
import { join as join2 } from "node:path";
var CLEANUP_THROTTLE_MS = 60 * 60 * 1000;
function getDateString() {
  return new Date().toISOString().split("T")[0];
}
function getDatedLogPath(logsDir, logPrefix) {
  const dateStr = getDateString();
  return join2(logsDir, `${logPrefix}-${dateStr}.log`);
}
function parseDateFromFilename(filename, logPrefix) {
  const pattern = new RegExp(`^${logPrefix}-(\\d{4}-\\d{2}-\\d{2})\\.log$`);
  const match = filename.match(pattern);
  if (!match) {
    return null;
  }
  const date = new Date(match[1] + "T00:00:00Z");
  return Number.isNaN(date.getTime()) ? null : date;
}
function createLogRotation(config) {
  const { logsDir, retentionDays, logger } = config;
  const lastCleanupTime = {};
  async function cleanupStaleLogs(logPrefix) {
    const now = Date.now();
    const lastCleanup = lastCleanupTime[logPrefix] || 0;
    if (now - lastCleanup < CLEANUP_THROTTLE_MS) {
      return;
    }
    lastCleanupTime[logPrefix] = now;
    try {
      await ensureDirectory(logsDir);
      const files = await readdir(logsDir);
      const cutoffDate = new Date(now - retentionDays * 24 * 60 * 60 * 1000);
      for (const file of files) {
        const fileDate = parseDateFromFilename(file, logPrefix);
        if (fileDate && fileDate < cutoffDate) {
          const filePath = join2(logsDir, file);
          try {
            await unlink(filePath);
          } catch (error) {
            logger?.error(`Failed to delete old log file ${file}`, error);
          }
        }
      }
    } catch (error) {
      logger?.error("Failed to cleanup old logs", error);
    }
  }
  async function forceCleanupStaleLogs(logPrefix) {
    lastCleanupTime[logPrefix] = 0;
    await cleanupStaleLogs(logPrefix);
  }
  return { cleanupStaleLogs, forceCleanupStaleLogs };
}

// src/log-rotation/log-rotation.ts
function getDatedLogPath2(logPrefix) {
  return getDatedLogPath(LOGS_DIR, logPrefix);
}
var logRotation = createLogRotation({
  logsDir: LOGS_DIR,
  retentionDays: LOG_RETENTION_DAYS
});
var { cleanupStaleLogs, forceCleanupStaleLogs } = logRotation;

// src/utils/logger.ts
var created = createLogger({
  prefix: "Zest",
  logRotation: { getDatedLogPath: getDatedLogPath2, cleanupStaleLogs }
});
var logger = created.logger;
var flushLogger = created.flushLogs;

// src/extractors/signal-extractor.ts
import { readFile, writeFile } from "node:fs/promises";
import { join as join4 } from "node:path";

// src/utils/bundled-skills.ts
import { readdirSync } from "node:fs";
import { join as join3 } from "node:path";
var BUNDLED_SKILLS_DIR = join3(HERMES_HOME, "hermes-agent", "skills");
var bundledSkills;
function scanBundledSkills(dir = BUNDLED_SKILLS_DIR) {
  const names = new Set;
  try {
    const categories = readdirSync(dir, { withFileTypes: true });
    for (const cat of categories) {
      if (!cat.isDirectory())
        continue;
      const skills = readdirSync(join3(dir, cat.name), { withFileTypes: true });
      for (const skill of skills) {
        if (skill.isDirectory())
          names.add(skill.name);
      }
    }
  } catch {}
  return names;
}
function isBundledSkill(name) {
  bundledSkills ??= scanBundledSkills();
  return bundledSkills.has(name);
}

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

// src/extractors/signal-extractor.ts
var HERMES_BUILTIN_TOOLS = new Set([
  "terminal",
  "read_file",
  "write_file",
  "search_files",
  "list_directory",
  "execute_code",
  "patch",
  "browser_navigate",
  "memory"
]);
var SKILL_TOOLS = new Set(["skill_view", "skill_manage"]);
var EMPTY_SIGNALS = {
  mcp_usage: {},
  skill_usage: {},
  agent_usage: {},
  builtin_usage: {},
  unknown_usage: {},
  image_count: 0
};
var MCP_TOOL_REGEX = /^mcp_[a-z0-9]+_.+/;
function categorizeTool(name) {
  if (MCP_TOOL_REGEX.test(name))
    return "mcp";
  if (SKILL_TOOLS.has(name))
    return "skill";
  if (HERMES_BUILTIN_TOOLS.has(name) || name.startsWith("zest_"))
    return "builtin";
  return "unknown";
}
function resolveUsageKey(name, args) {
  if (name === "skill_view") {
    return typeof args?.name === "string" && args.name || "skill_view";
  }
  if (name === "skill_manage") {
    const action = typeof args?.action === "string" ? args.action : "unknown";
    return `skill_manage:${action}`;
  }
  if (name === "memory") {
    const action = typeof args?.action === "string" ? args.action : "unknown";
    return `memory:${action}`;
  }
  return name;
}
function incrementRecord(map, key) {
  map[key] = (map[key] ?? 0) + 1;
}
function incrementSkillUsage(usage, skillKey) {
  const recorded = usage[skillKey];
  if (typeof recorded === "object" && recorded !== null) {
    usage[skillKey] = { ...recorded, count: recorded.count + 1 };
    return;
  }
  usage[skillKey] = (recorded ?? 0) + 1;
}
function extractSignalsFromMessages(messages, previous = EMPTY_SIGNALS) {
  const signals = {
    mcp_usage: { ...previous.mcp_usage },
    skill_usage: { ...previous.skill_usage },
    agent_usage: { ...previous.agent_usage },
    builtin_usage: { ...previous.builtin_usage },
    unknown_usage: { ...previous.unknown_usage },
    image_count: previous.image_count,
    tool_metadata: previous.tool_metadata ? { ...previous.tool_metadata } : undefined,
    skills: previous.skills ? [...previous.skills] : undefined,
    memories: previous.memories ? [...previous.memories] : undefined
  };
  for (const msg of messages) {
    if (!msg.tool_calls)
      continue;
    const toolCalls = parseToolCalls(msg.tool_calls);
    for (const call of toolCalls) {
      const name = call.function.name;
      const category = categorizeTool(name);
      const args = parseArguments(call.function.arguments);
      const key = resolveUsageKey(name, args);
      switch (category) {
        case "mcp":
          incrementRecord(signals.mcp_usage, key);
          break;
        case "skill":
          incrementSkillUsage(signals.skill_usage, key);
          populateSkillMetadata(signals, name, args);
          break;
        case "builtin":
          incrementRecord(signals.builtin_usage, key);
          break;
        case "unknown":
          incrementRecord(signals.unknown_usage, key);
          break;
      }
      collectActivity(signals, name, args);
    }
  }
  return signals;
}
function collectActivity(signals, toolName, args) {
  if (toolName === "skill_manage") {
    const action = typeof args?.action === "string" ? args.action : null;
    const name = typeof args?.name === "string" && args.name ? args.name : null;
    if (!action || !name)
      return;
    signals.skills ??= [];
    signals.skills.push({ action, name });
    return;
  }
  if (toolName === "memory") {
    const action = typeof args?.action === "string" ? args.action : null;
    if (!action)
      return;
    const target = args?.target === "user" || args?.target === "memory" ? args.target : "unknown";
    signals.memories ??= [];
    signals.memories.push({ action, target });
  }
}
function populateSkillMetadata(signals, toolName, args) {
  if (toolName !== "skill_view")
    return;
  const skillName = typeof args?.name === "string" ? args.name : null;
  if (!skillName)
    return;
  signals.tool_metadata ??= {};
  if (signals.tool_metadata[skillName])
    return;
  signals.tool_metadata[skillName] = {
    description: null,
    category: "skill",
    is_bundled: isBundledSkill(skillName)
  };
}
function hasSignalData(signals) {
  return Object.keys(signals.mcp_usage).length > 0 || Object.keys(signals.skill_usage).length > 0 || Object.keys(signals.agent_usage).length > 0 || Object.keys(signals.builtin_usage).length > 0 || Object.keys(signals.unknown_usage).length > 0 || signals.image_count > 0 || (signals.skills?.length ?? 0) > 0 || (signals.memories?.length ?? 0) > 0;
}

class SignalExtractor {
  stateDir;
  logger;
  constructor(config) {
    this.stateDir = config.stateDir;
    this.logger = config.logger;
  }
  async processMessages(messages) {
    const bySession = new Map;
    for (const msg of messages) {
      if (!msg.tool_calls)
        continue;
      const list = bySession.get(msg.session_id) ?? [];
      list.push(msg);
      bySession.set(msg.session_id, list);
    }
    for (const [sessionId, sessionMessages] of bySession) {
      try {
        const state = await this.readState(sessionId);
        const signals = extractSignalsFromMessages(sessionMessages, state.totals);
        const lastId = sessionMessages[sessionMessages.length - 1].id;
        await this.writeState(sessionId, {
          lastMessageId: Math.max(state.lastMessageId, lastId),
          totals: signals
        });
      } catch (error) {
        this.logger?.error(`Failed to extract signals for session ${sessionId}:`, error);
      }
    }
  }
  async readSessionSignals(sessionId) {
    try {
      const state = await this.readState(sessionId);
      return hasSignalData(state.totals) ? state.totals : null;
    } catch {
      return null;
    }
  }
  statePath(sessionId) {
    const sanitized = sessionId.replace(/[^a-zA-Z0-9_-]/g, "_");
    return join4(this.stateDir, `signals-${sanitized}.json`);
  }
  async readState(sessionId) {
    try {
      const raw = await readFile(this.statePath(sessionId), "utf-8");
      return JSON.parse(raw);
    } catch {
      return { lastMessageId: 0, totals: { ...EMPTY_SIGNALS } };
    }
  }
  async writeState(sessionId, state) {
    await ensureDirectory(this.stateDir);
    await writeFile(this.statePath(sessionId), JSON.stringify(state), "utf-8");
  }
}

// src/extractors/signal-extractor-instance.ts
var signalExtractor = new SignalExtractor({
  stateDir: STATE_DIR,
  logger
});
export {
  signalExtractor
};
