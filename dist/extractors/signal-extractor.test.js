// src/extractors/signal-extractor.test.ts
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { existsSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join as join4 } from "node:path";

// src/extractors/signal-extractor.ts
import { readFile, writeFile } from "node:fs/promises";
import { join as join3 } from "node:path";

// ../../packages/plugin-common/src/utils/fs-utils.ts
import { mkdir, stat } from "node:fs/promises";
async function ensureDirectory(dirPath) {
  try {
    await stat(dirPath);
  } catch {
    await mkdir(dirPath, { recursive: true, mode: 448 });
  }
}

// src/utils/bundled-skills.ts
import { readdirSync } from "node:fs";
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

// src/utils/bundled-skills.ts
var BUNDLED_SKILLS_DIR = join2(HERMES_HOME, "hermes-agent", "skills");
var bundledSkills;
function scanBundledSkills() {
  const names = new Set;
  try {
    const categories = readdirSync(BUNDLED_SKILLS_DIR, { withFileTypes: true });
    for (const cat of categories) {
      if (!cat.isDirectory())
        continue;
      const skills = readdirSync(join2(BUNDLED_SKILLS_DIR, cat.name), { withFileTypes: true });
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
    return join3(this.stateDir, `signals-${sanitized}.json`);
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

// src/extractors/signal-extractor.test.ts
var EPOCH_BASE = 1776436892.92733;
function makeMessage(overrides) {
  return {
    session_id: "sess_1",
    role: "assistant",
    content: "",
    tool_call_id: null,
    tool_calls: null,
    tool_name: null,
    timestamp: EPOCH_BASE,
    token_count: null,
    finish_reason: null,
    ...overrides
  };
}
function makeToolCalls(...names) {
  return JSON.stringify(names.map((name, i) => ({
    id: `call_${i}`,
    type: "function",
    function: { name, arguments: "{}" }
  })));
}
function makeToolCallsWithArgs(...calls) {
  return JSON.stringify(calls.map((call, i) => ({
    id: `call_${i}`,
    type: "function",
    function: call
  })));
}
describe("categorizeTool", () => {
  test("classifies MCP tools by server_tool pattern", () => {
    expect(categorizeTool("mcp_time_get_current_time")).toBe("mcp");
    expect(categorizeTool("mcp_github_list_repos")).toBe("mcp");
    expect(categorizeTool("mcp_zest_sync")).toBe("mcp");
  });
  test("does not classify bare mcp_ prefix without server_tool as MCP", () => {
    expect(categorizeTool("mcp_")).toBe("unknown");
    expect(categorizeTool("mcp_solo")).toBe("unknown");
  });
  test("classifies Hermes built-in tools", () => {
    expect(categorizeTool("terminal")).toBe("builtin");
    expect(categorizeTool("read_file")).toBe("builtin");
    expect(categorizeTool("write_file")).toBe("builtin");
    expect(categorizeTool("search_files")).toBe("builtin");
    expect(categorizeTool("list_directory")).toBe("builtin");
    expect(categorizeTool("execute_code")).toBe("builtin");
  });
  test("classifies skill tools", () => {
    expect(categorizeTool("skill_view")).toBe("skill");
    expect(categorizeTool("skill_manage")).toBe("skill");
  });
  test("classifies zest_ tools as builtin", () => {
    expect(categorizeTool("zest_status")).toBe("builtin");
    expect(categorizeTool("zest_check_notifications")).toBe("builtin");
  });
  test("classifies patch and browser_navigate as builtin", () => {
    expect(categorizeTool("patch")).toBe("builtin");
    expect(categorizeTool("browser_navigate")).toBe("builtin");
    expect(categorizeTool("memory")).toBe("builtin");
  });
  test("classifies unknown tools", () => {
    expect(categorizeTool("custom_tool")).toBe("unknown");
    expect(categorizeTool("something_new")).toBe("unknown");
  });
});
describe("extractSignalsFromMessages", () => {
  test("counts tool calls by category", () => {
    const messages = [
      makeMessage({ id: 1, tool_calls: makeToolCalls("terminal", "read_file") }),
      makeMessage({ id: 2, tool_calls: makeToolCalls("mcp_zest_sync") }),
      makeMessage({ id: 3, tool_calls: makeToolCalls("custom_tool") })
    ];
    const signals = extractSignalsFromMessages(messages);
    expect(signals.builtin_usage).toEqual({ terminal: 1, read_file: 1 });
    expect(signals.mcp_usage).toEqual({ mcp_zest_sync: 1 });
    expect(signals.unknown_usage).toEqual({ custom_tool: 1 });
  });
  test("accumulates counts for repeated tool names", () => {
    const messages = [
      makeMessage({ id: 1, tool_calls: makeToolCalls("terminal") }),
      makeMessage({ id: 2, tool_calls: makeToolCalls("terminal", "terminal") })
    ];
    const signals = extractSignalsFromMessages(messages);
    expect(signals.builtin_usage.terminal).toBe(3);
  });
  test("skips messages without tool_calls", () => {
    const messages = [
      makeMessage({ id: 1, tool_calls: null }),
      makeMessage({ id: 2, tool_calls: makeToolCalls("terminal") })
    ];
    const signals = extractSignalsFromMessages(messages);
    expect(signals.builtin_usage).toEqual({ terminal: 1 });
  });
  test("handles malformed tool_calls JSON gracefully", () => {
    const messages = [
      makeMessage({ id: 1, tool_calls: "not json" }),
      makeMessage({ id: 2, tool_calls: makeToolCalls("terminal") })
    ];
    const signals = extractSignalsFromMessages(messages);
    expect(signals.builtin_usage).toEqual({ terminal: 1 });
  });
  test("merges into previous signals", () => {
    const previous = {
      mcp_usage: { mcp_zest_sync: 2 },
      skill_usage: {},
      agent_usage: {},
      builtin_usage: { terminal: 5 },
      unknown_usage: {},
      image_count: 0
    };
    const messages = [
      makeMessage({ id: 1, tool_calls: makeToolCalls("terminal", "mcp_zest_sync") })
    ];
    const signals = extractSignalsFromMessages(messages, previous);
    expect(signals.builtin_usage.terminal).toBe(6);
    expect(signals.mcp_usage.mcp_zest_sync).toBe(3);
  });
  test("accumulates skills and memories across previous signals", () => {
    const previous = {
      mcp_usage: {},
      skill_usage: { "skill_manage:create": 1 },
      agent_usage: {},
      builtin_usage: { "memory:add": 1 },
      unknown_usage: {},
      image_count: 0,
      skills: [{ action: "create", name: "first-skill" }],
      memories: [{ action: "add", target: "user" }]
    };
    const messages = [
      makeMessage({
        id: 1,
        tool_calls: makeToolCallsWithArgs({
          name: "skill_manage",
          arguments: JSON.stringify({ action: "create", name: "second-skill" })
        }, { name: "memory", arguments: JSON.stringify({ action: "add", target: "memory" }) })
      })
    ];
    const signals = extractSignalsFromMessages(messages, previous);
    expect(signals.skills).toEqual([
      { action: "create", name: "first-skill" },
      { action: "create", name: "second-skill" }
    ]);
    expect(signals.memories).toEqual([
      { action: "add", target: "user" },
      { action: "add", target: "memory" }
    ]);
  });
  test("routes skill_view to skill_usage with skill name as key", () => {
    const messages = [
      makeMessage({
        id: 1,
        tool_calls: makeToolCallsWithArgs({
          name: "skill_view",
          arguments: JSON.stringify({ name: "ascii-art" })
        })
      })
    ];
    const signals = extractSignalsFromMessages(messages);
    expect(signals.skill_usage).toEqual({ "ascii-art": 1 });
    expect(signals.unknown_usage).toEqual({});
  });
  test("routes skill_manage to skill_usage and records the skill mutation", () => {
    const messages = [
      makeMessage({
        id: 1,
        tool_calls: makeToolCallsWithArgs({
          name: "skill_manage",
          arguments: JSON.stringify({ action: "create", name: "my-skill" })
        })
      })
    ];
    const signals = extractSignalsFromMessages(messages);
    expect(signals.skill_usage).toEqual({ "skill_manage:create": 1 });
    expect(signals.skills).toEqual([{ action: "create", name: "my-skill" }]);
  });
  test("counts skill_manage usage but records no skill when the name is absent", () => {
    const messages = [
      makeMessage({
        id: 1,
        tool_calls: makeToolCallsWithArgs({
          name: "skill_manage",
          arguments: JSON.stringify({ action: "create" })
        })
      })
    ];
    const signals = extractSignalsFromMessages(messages);
    expect(signals.skill_usage).toEqual({ "skill_manage:create": 1 });
    expect(signals.skills).toBeUndefined();
  });
  test("falls back to skill_view as key when arguments are malformed", () => {
    const messages = [
      makeMessage({
        id: 1,
        tool_calls: makeToolCallsWithArgs({ name: "skill_view", arguments: "not json" })
      })
    ];
    const signals = extractSignalsFromMessages(messages);
    expect(signals.skill_usage).toEqual({ skill_view: 1 });
  });
  test("populates tool_metadata for skill_view calls", () => {
    const messages = [
      makeMessage({
        id: 1,
        tool_calls: makeToolCallsWithArgs({
          name: "skill_view",
          arguments: JSON.stringify({ name: "ascii-art" })
        })
      })
    ];
    const signals = extractSignalsFromMessages(messages);
    expect(signals.tool_metadata).toBeDefined();
    expect(signals.tool_metadata?.["ascii-art"]).toEqual({
      description: null,
      category: "skill",
      is_bundled: true
    });
  });
  test("routes memory to builtin_usage and records the write with its target", () => {
    const messages = [
      makeMessage({
        id: 1,
        tool_calls: makeToolCallsWithArgs({
          name: "memory",
          arguments: JSON.stringify({ action: "add", target: "user", content: "test" })
        })
      })
    ];
    const signals = extractSignalsFromMessages(messages);
    expect(signals.builtin_usage).toEqual({ "memory:add": 1 });
    expect(signals.unknown_usage).toEqual({});
    expect(signals.memories).toEqual([{ action: "add", target: "user" }]);
  });
  test("records the memory target for project memories", () => {
    const messages = [
      makeMessage({
        id: 1,
        tool_calls: makeToolCallsWithArgs({
          name: "memory",
          arguments: JSON.stringify({ action: "add", target: "memory", content: "test" })
        })
      })
    ];
    const signals = extractSignalsFromMessages(messages);
    expect(signals.memories).toEqual([{ action: "add", target: "memory" }]);
  });
  test("falls back to an unknown target for an unexpected memory target", () => {
    const messages = [
      makeMessage({
        id: 1,
        tool_calls: makeToolCallsWithArgs({
          name: "memory",
          arguments: JSON.stringify({ action: "add", target: "project", content: "test" })
        })
      })
    ];
    const signals = extractSignalsFromMessages(messages);
    expect(signals.memories).toEqual([{ action: "add", target: "unknown" }]);
  });
  test("counts memory usage but records no write when arguments are malformed", () => {
    const messages = [
      makeMessage({
        id: 1,
        tool_calls: makeToolCallsWithArgs({ name: "memory", arguments: "not json" })
      })
    ];
    const signals = extractSignalsFromMessages(messages);
    expect(signals.builtin_usage).toEqual({ "memory:unknown": 1 });
    expect(signals.memories).toBeUndefined();
  });
  test("handles multiple tool calls in a single message", () => {
    const messages = [
      makeMessage({
        id: 1,
        tool_calls: makeToolCalls("terminal", "read_file", "write_file", "mcp_server_tool")
      })
    ];
    const signals = extractSignalsFromMessages(messages);
    expect(signals.builtin_usage).toEqual({ terminal: 1, read_file: 1, write_file: 1 });
    expect(signals.mcp_usage).toEqual({ mcp_server_tool: 1 });
  });
});
describe("SignalExtractor", () => {
  const TEST_DIR = join4(tmpdir(), "hermes-signal-extractor-test");
  beforeEach(() => {
    if (existsSync(TEST_DIR))
      rmSync(TEST_DIR, { recursive: true });
    mkdirSync(TEST_DIR, { recursive: true });
  });
  afterEach(() => {
    if (existsSync(TEST_DIR))
      rmSync(TEST_DIR, { recursive: true });
  });
  test("processes messages and persists signals per session", async () => {
    const extractor = new SignalExtractor({ stateDir: TEST_DIR });
    await extractor.processMessages([
      makeMessage({ id: 1, session_id: "sess_1", tool_calls: makeToolCalls("terminal") }),
      makeMessage({ id: 2, session_id: "sess_2", tool_calls: makeToolCalls("mcp_zest_sync") })
    ]);
    const signals1 = await extractor.readSessionSignals("sess_1");
    expect(signals1?.builtin_usage).toEqual({ terminal: 1 });
    const signals2 = await extractor.readSessionSignals("sess_2");
    expect(signals2?.mcp_usage).toEqual({ mcp_zest_sync: 1 });
  });
  test("accumulates signals across multiple processMessages calls", async () => {
    const extractor = new SignalExtractor({ stateDir: TEST_DIR });
    await extractor.processMessages([
      makeMessage({ id: 1, session_id: "sess_1", tool_calls: makeToolCalls("terminal") })
    ]);
    await extractor.processMessages([
      makeMessage({
        id: 2,
        session_id: "sess_1",
        tool_calls: makeToolCalls("terminal", "read_file")
      })
    ]);
    const signals = await extractor.readSessionSignals("sess_1");
    expect(signals?.builtin_usage).toEqual({ terminal: 2, read_file: 1 });
  });
  test("returns null for sessions with no signals", async () => {
    const extractor = new SignalExtractor({ stateDir: TEST_DIR });
    const result = await extractor.readSessionSignals("nonexistent");
    expect(result).toBeNull();
  });
  test("skips messages without tool_calls", async () => {
    const extractor = new SignalExtractor({ stateDir: TEST_DIR });
    await extractor.processMessages([
      makeMessage({ id: 1, session_id: "sess_1", tool_calls: null }),
      makeMessage({ id: 2, session_id: "sess_1", role: "user", tool_calls: null })
    ]);
    const signals = await extractor.readSessionSignals("sess_1");
    expect(signals).toBeNull();
  });
});
