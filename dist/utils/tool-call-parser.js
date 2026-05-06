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
export {
  parseToolCalls,
  parseArguments
};
