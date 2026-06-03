// src/extractors/session-metadata-builder.test.ts
import { describe, expect, test } from "bun:test";

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
    tool_call_count: row.tool_call_count
  };
}

// src/extractors/session-metadata-builder.test.ts
function makeSession(overrides = {}) {
  return {
    id: "20260507_120000_abc",
    source: "cli",
    user_id: null,
    model: "anthropic/claude-sonnet-4-5",
    started_at: 1746612000,
    ended_at: 1746612300,
    end_reason: "stop",
    message_count: 12,
    tool_call_count: 4,
    input_tokens: 1500,
    output_tokens: 500,
    cache_read_tokens: 200,
    cache_write_tokens: 100,
    reasoning_tokens: 0,
    estimated_cost_usd: 0.05,
    actual_cost_usd: null,
    title: "Test session",
    ...overrides
  };
}
function meta(overrides = {}) {
  return buildSessionMetadata(makeSession(overrides));
}
describe("buildSessionMetadata", () => {
  test("maps all fields from a completed session", () => {
    const m = meta();
    expect(m.trigger).toBe("cli");
    expect(m.model).toBe("anthropic/claude-sonnet-4-5");
    expect(m.ended_at).toBe(new Date(1746612300 * 1000).toISOString());
    expect(m.end_reason).toBe("stop");
    expect(m.is_error).toBe(false);
    expect(m.input_tokens).toBe(1800);
    expect(m.output_tokens).toBe(500);
    expect(m.cache_read_tokens).toBe(200);
    expect(m.cache_write_tokens).toBe(100);
    expect(m.reasoning_tokens).toBe(0);
    expect(m.cost_usd).toBe(0.05);
    expect(m.message_count).toBe(12);
    expect(m.tool_call_count).toBe(4);
  });
  test("ended_at is null for open sessions", () => {
    const m = meta({ ended_at: null, end_reason: null });
    expect(m.ended_at).toBeNull();
    expect(m.end_reason).toBeNull();
    expect(m.is_error).toBe(false);
  });
  test("prefers actual_cost_usd over estimated", () => {
    expect(meta({ actual_cost_usd: 0.08, estimated_cost_usd: 0.05 }).cost_usd).toBe(0.08);
  });
  test("falls back to estimated_cost_usd when actual is null", () => {
    expect(meta({ actual_cost_usd: null, estimated_cost_usd: 0.05 }).cost_usd).toBe(0.05);
  });
  test("cost_usd is null when both are null", () => {
    expect(meta({ actual_cost_usd: null, estimated_cost_usd: null }).cost_usd).toBeNull();
  });
  test("trigger maps from Hermes source field", () => {
    expect(meta({ source: "telegram" }).trigger).toBe("telegram");
    expect(meta({ source: "cron" }).trigger).toBe("cron");
    expect(meta({ source: "slack" }).trigger).toBe("slack");
  });
  describe("is_error classification", () => {
    test.each([
      "stop",
      "end_turn",
      "tool_calls",
      "max_tokens"
    ])("is_error is false for normal end_reason '%s'", (reason) => {
      expect(meta({ end_reason: reason }).is_error).toBe(false);
    });
    test.each([
      "error",
      "rate_limit",
      "content_filter",
      "unknown_error"
    ])("is_error is true for error end_reason '%s'", (reason) => {
      expect(meta({ end_reason: reason }).is_error).toBe(true);
    });
    test("is_error is false when end_reason is null (session still open)", () => {
      expect(meta({ end_reason: null }).is_error).toBe(false);
    });
  });
});
