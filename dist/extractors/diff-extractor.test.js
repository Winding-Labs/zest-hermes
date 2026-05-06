// src/extractors/diff-extractor.test.ts
import { describe, expect, test } from "bun:test";

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
// src/utils/time.ts
function epochToIso(epoch) {
  return new Date(epoch * 1000).toISOString();
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

// src/extractors/diff-extractor.test.ts
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
function makeToolCall(name, args) {
  return JSON.stringify([
    {
      id: "call_1",
      type: "function",
      function: { name, arguments: JSON.stringify(args) }
    }
  ]);
}
describe("extractDiffEvents", () => {
  test("extracts write_file as creation diff", () => {
    const messages = [
      makeMessage({
        id: 1,
        tool_calls: makeToolCall("write_file", {
          path: "/tmp/hello.ts",
          content: `console.log("hello");
`
        })
      })
    ];
    const events = extractDiffEvents(messages);
    expect(events).toHaveLength(1);
    expect(events[0].document_uri).toBe("/tmp/hello.ts");
    expect(events[0].language_id).toBe("typescript");
    expect(events[0].session_id).toBe("sess_1");
    expect(events[0].timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    const payload = events[0].payload;
    expect(payload.tool_name).toBe("write_file");
    expect(payload.diff).toContain("+console.log");
    expect(payload.diff).toContain("--- /dev/null");
    expect(payload.diff).toContain("+++ /tmp/hello.ts");
  });
  test("generates proper unified diff header", () => {
    const messages = [
      makeMessage({
        id: 1,
        tool_calls: makeToolCall("write_file", {
          path: "file.txt",
          content: `line1
line2
line3`
        })
      })
    ];
    const events = extractDiffEvents(messages);
    const diff = events[0].payload.diff;
    expect(diff).toContain("@@ -0,0 +1,3 @@");
    expect(diff).toContain("+line1");
    expect(diff).toContain("+line2");
    expect(diff).toContain("+line3");
  });
  test("skips non-file-editing tools", () => {
    const messages = [
      makeMessage({
        id: 1,
        tool_calls: makeToolCall("terminal", { command: "ls" })
      }),
      makeMessage({
        id: 2,
        tool_calls: makeToolCall("read_file", { path: "/tmp/file.txt" })
      }),
      makeMessage({
        id: 3,
        tool_calls: makeToolCall("search_files", { pattern: "*.ts" })
      })
    ];
    const events = extractDiffEvents(messages);
    expect(events).toHaveLength(0);
  });
  test("skips messages without tool_calls", () => {
    const messages = [
      makeMessage({ id: 1, tool_calls: null }),
      makeMessage({ id: 2, role: "user", tool_calls: null })
    ];
    const events = extractDiffEvents(messages);
    expect(events).toHaveLength(0);
  });
  test("skips write_file without content", () => {
    const messages = [
      makeMessage({
        id: 1,
        tool_calls: makeToolCall("write_file", { path: "/tmp/file.txt" })
      })
    ];
    const events = extractDiffEvents(messages);
    expect(events).toHaveLength(0);
  });
  test("skips write_file without path", () => {
    const messages = [
      makeMessage({
        id: 1,
        tool_calls: makeToolCall("write_file", { content: "hello" })
      })
    ];
    const events = extractDiffEvents(messages);
    expect(events).toHaveLength(0);
  });
  test("handles malformed tool_calls JSON gracefully", () => {
    const messages = [makeMessage({ id: 1, tool_calls: "not json" })];
    const events = extractDiffEvents(messages);
    expect(events).toHaveLength(0);
  });
  test("handles malformed arguments JSON gracefully", () => {
    const messages = [
      makeMessage({
        id: 1,
        tool_calls: JSON.stringify([
          {
            id: "call_1",
            type: "function",
            function: { name: "write_file", arguments: "not json" }
          }
        ])
      })
    ];
    const events = extractDiffEvents(messages);
    expect(events).toHaveLength(0);
  });
  test("extracts multiple write_file calls from separate messages", () => {
    const messages = [
      makeMessage({
        id: 1,
        tool_calls: makeToolCall("write_file", {
          path: "/tmp/a.ts",
          content: "a"
        })
      }),
      makeMessage({
        id: 2,
        tool_calls: makeToolCall("write_file", {
          path: "/tmp/b.py",
          content: "b"
        })
      })
    ];
    const events = extractDiffEvents(messages);
    expect(events).toHaveLength(2);
    expect(events[0].document_uri).toBe("/tmp/a.ts");
    expect(events[0].language_id).toBe("typescript");
    expect(events[1].document_uri).toBe("/tmp/b.py");
    expect(events[1].language_id).toBe("python");
  });
  test("generates unique IDs for each event", () => {
    const messages = [
      makeMessage({
        id: 1,
        tool_calls: makeToolCall("write_file", { path: "a.ts", content: "a" })
      }),
      makeMessage({
        id: 2,
        tool_calls: makeToolCall("write_file", { path: "b.ts", content: "b" })
      })
    ];
    const events = extractDiffEvents(messages);
    expect(events[0].id).not.toBe(events[1].id);
  });
  test("handles future edit_file tool with diff argument", () => {
    const messages = [
      makeMessage({
        id: 1,
        tool_calls: makeToolCall("edit_file", {
          path: "/tmp/file.ts",
          diff: `--- a/file.ts
+++ b/file.ts
@@ -1 +1 @@
-old
+new`
        })
      })
    ];
    const events = extractDiffEvents(messages);
    expect(events).toHaveLength(1);
    expect(events[0].document_uri).toBe("/tmp/file.ts");
    const payload = events[0].payload;
    expect(payload.diff).toContain("-old");
    expect(payload.diff).toContain("+new");
  });
});
