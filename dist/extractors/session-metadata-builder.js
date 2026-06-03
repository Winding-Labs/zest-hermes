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
export {
  buildSessionMetadata
};
