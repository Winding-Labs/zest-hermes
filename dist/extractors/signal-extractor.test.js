// src/extractors/signal-extractor.test.ts
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { existsSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join as join2 } from "node:path";

// src/extractors/signal-extractor.ts
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

// ../../packages/plugin-common/src/utils/fs-utils.ts
import { mkdir, stat } from "node:fs/promises";
async function ensureDirectory(dirPath) {
  try {
    await stat(dirPath);
  } catch {
    await mkdir(dirPath, { recursive: true, mode: 448 });
  }
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

// src/extractors/signal-extractor.ts
var HERMES_BUILTIN_TOOLS = new Set([
  "terminal",
  "read_file",
  "write_file",
  "search_files",
  "list_directory",
  "execute_code"
]);
var EMPTY_SIGNALS = {
  mcp_usage: {},
  skill_usage: {},
  agent_usage: {},
  builtin_usage: {},
  unknown_usage: {},
  image_count: 0
};
function categorizeTool(name) {
  if (name.startsWith("mcp__"))
    return "mcp";
  if (HERMES_BUILTIN_TOOLS.has(name))
    return "builtin";
  return "unknown";
}
function incrementRecord(map, key) {
  map[key] = (map[key] ?? 0) + 1;
}
function extractSignalsFromMessages(messages, previous = EMPTY_SIGNALS) {
  const signals = {
    mcp_usage: { ...previous.mcp_usage },
    skill_usage: { ...previous.skill_usage },
    agent_usage: { ...previous.agent_usage },
    builtin_usage: { ...previous.builtin_usage },
    unknown_usage: { ...previous.unknown_usage },
    image_count: previous.image_count
  };
  for (const msg of messages) {
    if (!msg.tool_calls)
      continue;
    const toolCalls = parseToolCalls(msg.tool_calls);
    for (const call of toolCalls) {
      const name = call.function.name;
      const category = categorizeTool(name);
      switch (category) {
        case "mcp":
          incrementRecord(signals.mcp_usage, name);
          break;
        case "builtin":
          incrementRecord(signals.builtin_usage, name);
          break;
        case "unknown":
          incrementRecord(signals.unknown_usage, name);
          break;
      }
    }
  }
  return signals;
}
function hasSignalData(signals) {
  return Object.keys(signals.mcp_usage).length > 0 || Object.keys(signals.skill_usage).length > 0 || Object.keys(signals.agent_usage).length > 0 || Object.keys(signals.builtin_usage).length > 0 || Object.keys(signals.unknown_usage).length > 0 || signals.image_count > 0;
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
    return join(this.stateDir, `signals-${sanitized}.json`);
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
describe("categorizeTool", () => {
  test("classifies MCP tools by prefix", () => {
    expect(categorizeTool("mcp__zest__sync")).toBe("mcp");
    expect(categorizeTool("mcp__server__tool_name")).toBe("mcp");
  });
  test("classifies Hermes built-in tools", () => {
    expect(categorizeTool("terminal")).toBe("builtin");
    expect(categorizeTool("read_file")).toBe("builtin");
    expect(categorizeTool("write_file")).toBe("builtin");
    expect(categorizeTool("search_files")).toBe("builtin");
    expect(categorizeTool("list_directory")).toBe("builtin");
    expect(categorizeTool("execute_code")).toBe("builtin");
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
      makeMessage({ id: 2, tool_calls: makeToolCalls("mcp__zest__sync") }),
      makeMessage({ id: 3, tool_calls: makeToolCalls("custom_tool") })
    ];
    const signals = extractSignalsFromMessages(messages);
    expect(signals.builtin_usage).toEqual({ terminal: 1, read_file: 1 });
    expect(signals.mcp_usage).toEqual({ mcp__zest__sync: 1 });
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
      mcp_usage: { mcp__zest__sync: 2 },
      skill_usage: {},
      agent_usage: {},
      builtin_usage: { terminal: 5 },
      unknown_usage: {},
      image_count: 0
    };
    const messages = [
      makeMessage({ id: 1, tool_calls: makeToolCalls("terminal", "mcp__zest__sync") })
    ];
    const signals = extractSignalsFromMessages(messages, previous);
    expect(signals.builtin_usage.terminal).toBe(6);
    expect(signals.mcp_usage.mcp__zest__sync).toBe(3);
  });
  test("handles multiple tool calls in a single message", () => {
    const messages = [
      makeMessage({
        id: 1,
        tool_calls: makeToolCalls("terminal", "read_file", "write_file", "mcp__server__tool")
      })
    ];
    const signals = extractSignalsFromMessages(messages);
    expect(signals.builtin_usage).toEqual({ terminal: 1, read_file: 1, write_file: 1 });
    expect(signals.mcp_usage).toEqual({ mcp__server__tool: 1 });
  });
});
describe("SignalExtractor", () => {
  const TEST_DIR = join2(tmpdir(), "hermes-signal-extractor-test");
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
      makeMessage({ id: 2, session_id: "sess_2", tool_calls: makeToolCalls("mcp__zest__sync") })
    ]);
    const signals1 = await extractor.readSessionSignals("sess_1");
    expect(signals1?.builtin_usage).toEqual({ terminal: 1 });
    const signals2 = await extractor.readSessionSignals("sess_2");
    expect(signals2?.mcp_usage).toEqual({ mcp__zest__sync: 1 });
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
