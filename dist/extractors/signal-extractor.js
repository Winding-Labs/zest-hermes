// src/extractors/signal-extractor.ts
import { readFile, writeFile } from "node:fs/promises";
import { join as join2 } from "node:path";

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
import { homedir } from "node:os";
import { join } from "node:path";
var BUNDLED_SKILLS_DIR = join(process.env.HERMES_DIR ?? join(homedir(), ".hermes"), "hermes-agent", "skills");
var bundledSkills;
function scanBundledSkills() {
  const names = new Set;
  try {
    const categories = readdirSync(BUNDLED_SKILLS_DIR, { withFileTypes: true });
    for (const cat of categories) {
      if (!cat.isDirectory())
        continue;
      const skills = readdirSync(join(BUNDLED_SKILLS_DIR, cat.name), { withFileTypes: true });
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
function resolveUsageKey(name, argsJson) {
  if (name === "skill_view") {
    const args = parseArguments(argsJson);
    return typeof args?.name === "string" && args.name || "skill_view";
  }
  if (name === "skill_manage") {
    const args = parseArguments(argsJson);
    const action = typeof args?.action === "string" ? args.action : "unknown";
    return `skill_manage:${action}`;
  }
  if (name === "memory") {
    const args = parseArguments(argsJson);
    const action = typeof args?.action === "string" ? args.action : "unknown";
    return `memory:${action}`;
  }
  return name;
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
    image_count: previous.image_count,
    tool_metadata: previous.tool_metadata ? { ...previous.tool_metadata } : undefined
  };
  for (const msg of messages) {
    if (!msg.tool_calls)
      continue;
    const toolCalls = parseToolCalls(msg.tool_calls);
    for (const call of toolCalls) {
      const name = call.function.name;
      const category = categorizeTool(name);
      const key = resolveUsageKey(name, call.function.arguments);
      switch (category) {
        case "mcp":
          incrementRecord(signals.mcp_usage, key);
          break;
        case "skill":
          incrementRecord(signals.skill_usage, key);
          populateSkillMetadata(signals, name, call.function.arguments);
          break;
        case "builtin":
          incrementRecord(signals.builtin_usage, key);
          break;
        case "unknown":
          incrementRecord(signals.unknown_usage, key);
          break;
      }
    }
  }
  return signals;
}
function populateSkillMetadata(signals, toolName, argsJson) {
  if (toolName !== "skill_view")
    return;
  const args = parseArguments(argsJson);
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
    return join2(this.stateDir, `signals-${sanitized}.json`);
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
export {
  extractSignalsFromMessages,
  categorizeTool,
  SignalExtractor
};
