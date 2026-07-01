// src/extractors/inventory-metadata-builder.ts
import { readdirSync, readFileSync } from "node:fs";
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

// src/extractors/inventory-metadata-builder.ts
var CUSTOM_SKILLS_DIR = join2(HERMES_HOME, "skills");
var BUNDLED_SKILLS_DIR = join2(HERMES_HOME, "hermes-agent", "skills");
var MEMORY_FILE = join2(HERMES_HOME, "memories", "MEMORY.md");
var USER_FILE = join2(HERMES_HOME, "memories", "USER.md");
var ENTRY_SEPARATOR = `
§
`;
function countSkillsIn(dir) {
  let count = 0;
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        count += countSkillsIn(join2(dir, entry.name));
      } else if (entry.name === "SKILL.md") {
        count++;
      }
    }
  } catch {}
  return count;
}
function readFileOrNull(path) {
  try {
    return readFileSync(path, "utf-8");
  } catch {
    return null;
  }
}
function countEntries(content) {
  return content.split(ENTRY_SEPARATOR).filter((s) => s.trim().length > 0).length;
}
function buildInventoryMetadata() {
  const skillsCount = countSkillsIn(CUSTOM_SKILLS_DIR) + countSkillsIn(BUNDLED_SKILLS_DIR);
  const memoryContent = readFileOrNull(MEMORY_FILE);
  const userContent = readFileOrNull(USER_FILE);
  return {
    available_skills_count: skillsCount > 0 ? skillsCount : null,
    memory_chars: memoryContent?.length ?? null,
    memory_entry_count: memoryContent ? countEntries(memoryContent) : null,
    user_entry_count: userContent ? countEntries(userContent) : null,
    user_chars: userContent?.length ?? null
  };
}
export {
  buildInventoryMetadata
};
