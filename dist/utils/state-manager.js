// src/utils/state-manager.ts
import { readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

// ../../packages/plugin-common/src/analytics/events.ts
var AUTH_DEVICE_CODE_INITIATION_FAILED = "auth_device_code_initiation_failed";
var AUTH_DEVICE_CODE_POLLING_FAILED = "auth_device_code_polling_failed";
var AUTH_AGENT_PROVISIONING_FAILED = "auth_agent_provisioning_failed";
var AUTH_SESSION_LOAD_FAILED = "auth_session_load_failed";
var AUTH_SESSION_CLEAR_FAILED = "auth_session_clear_failed";
var AUTH_SESSION_SAVE_FAILED = "auth_session_save_failed";
var SYNC_NOT_AUTHENTICATED = "sync_not_authenticated";
var SYNC_EVENTS_UPLOAD_FAILED = "sync_events_upload_failed";
var SYNC_EVENTS_RETRY_EXHAUSTED = "sync_events_upload_retry_exhausted";
var SYNC_CHAT_UPLOAD_FAILED = "sync_chat_upload_failed";
var SYNC_NETWORK_ERROR = "sync_network_error";
var SYNC_SERVER_OVERLOAD = "sync_server_overload";
var SYNC_DATA_ERROR = "sync_data_error";
var SYNC_AUTH_ERROR = "sync_auth_error";
var SYNC_BLOCKED_NO_WORKSPACE = "sync_blocked_no_workspace";
var AUTH_SESSION_METADATA_LOST = "auth_session_metadata_lost";
var QUEUE_READ_CORRUPTED = "queue_read_corrupted";
var QUEUE_WRITE_FAILED = "queue_write_failed";
var FILE_LOCK_TIMEOUT = "file_lock_timeout";
var FILE_LOCK_CREATE_FAILED = "file_lock_create_failed";
var NOTIFICATION_STATE_WRITE_FAILED = "notification_state_write_failed";
var QUEUE_CAP_EVICTION = "queue_cap_eviction";
var SYNC_STALE_EVENTS_DROPPED = "sync_stale_events_dropped";
var SYNC_DRAIN_THROTTLED = "sync_drain_throttled";
var SYNC_ORPHANED_MESSAGES_DROPPED = "sync_orphaned_messages_dropped";
var EXTRACTION_PROJECT_DIR_NOT_FOUND = "extraction_project_dir_not_found";
var EXTRACTION_SESSION_FAILED = "extraction_session_failed";
var DAEMON_START_FAILED = "daemon_start_failed";
var DAEMON_RESTART_FAILED = "daemon_restart_failed";
var DAEMON_SYNC_CYCLE_FAILED = "daemon_sync_cycle_failed";
var DAEMON_UNHANDLED_ERROR = "daemon_unhandled_error";
var API_WORKSPACE_FETCH_FAILED = "api_workspace_fetch_failed";
var API_PROFILE_UPDATE_FAILED = "api_profile_update_failed";
var API_PROFILE_METADATA_PREFETCH_FAILED = "api_profile_metadata_prefetch_failed";
var API_STANDUP_TEAM_FETCH_FAILED = "api_standup_team_fetch_failed";
var API_STANDUP_PROMPT_FETCH_FAILED = "api_standup_prompt_fetch_failed";
var API_STANDUP_GENERATION_FAILED = "api_standup_generation_failed";
var API_DATA_CONTROLS_FETCH_FAILED = "api_data_controls_fetch_failed";
var SUPABASE_CLIENT_INIT_FAILED = "supabase_client_init_failed";
var SUPABASE_SESSION_READ_FAILED = "supabase_session_read_failed";
var SUPABASE_SESSION_WRITE_FAILED = "supabase_session_write_failed";
var ERROR_TYPES = [
  AUTH_DEVICE_CODE_INITIATION_FAILED,
  AUTH_DEVICE_CODE_POLLING_FAILED,
  AUTH_AGENT_PROVISIONING_FAILED,
  AUTH_SESSION_CLEAR_FAILED,
  AUTH_SESSION_LOAD_FAILED,
  AUTH_SESSION_SAVE_FAILED,
  AUTH_SESSION_METADATA_LOST,
  SYNC_NOT_AUTHENTICATED,
  SYNC_EVENTS_UPLOAD_FAILED,
  SYNC_EVENTS_RETRY_EXHAUSTED,
  SYNC_CHAT_UPLOAD_FAILED,
  SYNC_NETWORK_ERROR,
  SYNC_SERVER_OVERLOAD,
  SYNC_DATA_ERROR,
  SYNC_AUTH_ERROR,
  SYNC_BLOCKED_NO_WORKSPACE,
  QUEUE_READ_CORRUPTED,
  QUEUE_WRITE_FAILED,
  QUEUE_CAP_EVICTION,
  SYNC_STALE_EVENTS_DROPPED,
  SYNC_DRAIN_THROTTLED,
  SYNC_ORPHANED_MESSAGES_DROPPED,
  FILE_LOCK_TIMEOUT,
  FILE_LOCK_CREATE_FAILED,
  NOTIFICATION_STATE_WRITE_FAILED,
  EXTRACTION_PROJECT_DIR_NOT_FOUND,
  EXTRACTION_SESSION_FAILED,
  DAEMON_START_FAILED,
  DAEMON_RESTART_FAILED,
  DAEMON_SYNC_CYCLE_FAILED,
  DAEMON_UNHANDLED_ERROR,
  API_WORKSPACE_FETCH_FAILED,
  API_PROFILE_UPDATE_FAILED,
  API_PROFILE_METADATA_PREFETCH_FAILED,
  API_STANDUP_TEAM_FETCH_FAILED,
  API_STANDUP_PROMPT_FETCH_FAILED,
  API_STANDUP_GENERATION_FAILED,
  API_DATA_CONTROLS_FETCH_FAILED,
  SUPABASE_CLIENT_INIT_FAILED,
  SUPABASE_SESSION_READ_FAILED,
  SUPABASE_SESSION_WRITE_FAILED
];
var errorTypeSet = new Set(ERROR_TYPES);

// ../../packages/plugin-common/src/utils/fs-utils.ts
import { mkdir, stat } from "node:fs/promises";
async function ensureDirectory(dirPath) {
  try {
    await stat(dirPath);
  } catch {
    await mkdir(dirPath, { recursive: true, mode: 448 });
  }
}

// ../../packages/plugin-common/src/utils/file-lock.ts
var noopFileLock = (_path, fn) => fn();
function resolveFileLock(callback) {
  return callback ?? noopFileLock;
}

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

// src/utils/state-manager.ts
var EMPTY_CHECKPOINT = {
  lastSessionStartedAt: null,
  lastMessageId: 0,
  messageIndices: {}
};
function createHermesStateManager(config = {}) {
  const filePath = config.filePath ?? CHECKPOINT_PATH;
  const logger = config.logger;
  const withFileLock = resolveFileLock(config.withFileLock);
  async function read() {
    try {
      return await withFileLock(filePath, async () => {
        try {
          const raw = await readFile(filePath, "utf8");
          const parsed = JSON.parse(raw);
          return {
            lastSessionStartedAt: parsed.lastSessionStartedAt ?? null,
            lastMessageId: parsed.lastMessageId ?? 0,
            messageIndices: parsed.messageIndices ?? {}
          };
        } catch {
          return { ...EMPTY_CHECKPOINT, messageIndices: {} };
        }
      });
    } catch {
      logger?.debug("Failed to read hermes checkpoint, using empty state");
      return { ...EMPTY_CHECKPOINT, messageIndices: {} };
    }
  }
  async function write(checkpoint) {
    try {
      await ensureDirectory(dirname(filePath));
      await withFileLock(filePath, async () => {
        await writeFile(filePath, JSON.stringify(checkpoint, null, 2));
        logger?.debug(`Updated hermes checkpoint: lastMessageId=${checkpoint.lastMessageId}`);
      });
    } catch (error) {
      logger?.error("Failed to write hermes checkpoint:", error);
    }
  }
  return { read, write };
}
export {
  createHermesStateManager
};
