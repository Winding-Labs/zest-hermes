// src/utils/bundled-skills.test.ts
import { afterEach, describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join as join3 } from "node:path";

// src/utils/bundled-skills.ts
import { readdirSync } from "node:fs";
import { join as join2 } from "node:path";

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

// src/utils/bundled-skills.ts
var BUNDLED_SKILLS_DIR = join2(HERMES_HOME, "hermes-agent", "skills");
function scanBundledSkills(dir = BUNDLED_SKILLS_DIR) {
  const names = new Set;
  try {
    const categories = readdirSync(dir, { withFileTypes: true });
    for (const cat of categories) {
      if (!cat.isDirectory())
        continue;
      const skills = readdirSync(join2(dir, cat.name), { withFileTypes: true });
      for (const skill of skills) {
        if (skill.isDirectory())
          names.add(skill.name);
      }
    }
  } catch {}
  return names;
}

// src/utils/bundled-skills.test.ts
var dirs = [];
function makeTempDir() {
  const dir = mkdtempSync(join3(tmpdir(), "hermes-bundled-skills-test-"));
  dirs.push(dir);
  return dir;
}
afterEach(() => {
  for (const dir of dirs.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});
describe("scanBundledSkills", () => {
  test("collects skill names nested under category directories", () => {
    const root = makeTempDir();
    mkdirSync(join3(root, "creative", "ascii-art"), { recursive: true });
    mkdirSync(join3(root, "productivity", "task-planner"), { recursive: true });
    const names = scanBundledSkills(root);
    expect(names).toEqual(new Set(["ascii-art", "task-planner"]));
  });
  test("ignores files at the category level and at the skill level", () => {
    const root = makeTempDir();
    mkdirSync(join3(root, "creative", "ascii-art"), { recursive: true });
    writeFileSync(join3(root, "README.md"), "not a category");
    writeFileSync(join3(root, "creative", "NOTES.md"), "not a skill");
    const names = scanBundledSkills(root);
    expect(names).toEqual(new Set(["ascii-art"]));
  });
  test("returns an empty set when the directory doesn't exist", () => {
    const names = scanBundledSkills(join3(tmpdir(), "hermes-bundled-skills-does-not-exist"));
    expect(names).toEqual(new Set);
  });
  test("returns an empty set for an empty bundled-skills directory", () => {
    const root = makeTempDir();
    const names = scanBundledSkills(root);
    expect(names).toEqual(new Set);
  });
});
