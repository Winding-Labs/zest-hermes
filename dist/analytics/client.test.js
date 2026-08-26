var __defProp = Object.defineProperty;
var __returnValue = (v) => v;
function __exportSetter(name, newValue) {
  this[name] = __returnValue.bind(null, newValue);
}
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: __exportSetter.bind(all, name)
    });
};

// src/analytics/client.test.ts
import { describe, expect, test } from "bun:test";

// ../../packages/analytics/src/events.ts
var EVENTS = {
  USER_CREATED: "User Created",
  WORKSPACE_CREATED: "Workspace Created",
  EXTENSION_INSTALL_CLICKED: "Extension Install Clicked",
  EXTENSION_GUIDE_VIEWED: "Extension Guide Viewed",
  EXTENSION_INSTALLED: "Extension Installed",
  EXTENSION_SYNC_STATUS_CHANGED: "sync_status_changed",
  EXTENSION_FORCED_SIGNOUT_RECOVERY: "forced_signout_recovery_clicked",
  EXTENSION_SIGNED_OUT: "extension_signed_out",
  FIRST_DATA_SENT: "First Data Sent",
  ONBOARDING_STEP_COMPLETED: "Onboarding Step Completed",
  ONBOARDING_STARTED: "Onboarding Started",
  ONBOARDING_STEP_VIEWED: "Onboarding Step Viewed",
  ONBOARDING_COMPLETED: "Onboarding Completed",
  HOME_TOUR_OPENED: "Home Tour Opened",
  HOME_TOUR_STEP_VIEWED: "Home Tour Step Viewed",
  HOME_TOUR_COMPLETED: "Home Tour Completed",
  HOME_TOUR_SKIPPED: "Home Tour Skipped",
  HOME_TOUR_INSTALL_COPY: "Home Tour Install Command Copied",
  HOME_TOUR_INSTALL_OPEN: "Home Tour Install Link Opened",
  SEE_HOW_ZEST_WORKS_TILE_CLICKED: "See How Zest Works Tile Clicked",
  SEE_HOW_ZEST_WORKS_DISMISSED: "See How Zest Works Dismissed",
  NAV_LINK_CLICKED: "Nav Link Clicked",
  WORKSPACE_SWITCHED: "Workspace Switched",
  TEAM_SWITCHED: "Team Switched",
  ASK_ZEST_CONVERSATION_STARTED: "Ask Zest Conversation Started",
  ASK_ZEST_QUICK_ACTION_CLICKED: "Ask Zest Quick Action Clicked",
  ASK_ZEST_PROMPT_SELECTED: "Ask Zest Prompt Selected",
  ASK_ZEST_MENU_OPENED: "Ask Zest Menu Opened",
  ASK_ZEST_CHAT_FAILED: "Ask Zest Chat Failed",
  ASK_ZEST_REPORT_EMAIL_LANDED: "Ask Zest Report Email Landed",
  STANDUP_GENERATED: "Standup Generated",
  STANDUP_VIEWED: "Standup Viewed",
  STANDUP_SHARED: "Standup Shared",
  TEAM_STANDUP_GENERATED: "Team Standup Generated",
  TEAM_STANDUP_VIEWED: "Team Standup Viewed",
  MY_METRICS_VIEWED: "My Metrics Viewed",
  LEADERBOARD_VIEWED: "Leaderboard Viewed",
  TIMELINE_VIEWED: "Timeline Viewed",
  METRICS_CARD_CLICKED: "Metrics Card Clicked",
  USER_INVITED: "User Invited",
  INVITE_LINK_CREATED: "Invite Link Created",
  TEAM_CREATED: "Team Created",
  ORG_MEMBERS_DETECTED: "Org Members Detected",
  WORKSPACE_MEMBERS_PROVISIONED: "Workspace Members Provisioned",
  WORKSPACE_SETTINGS_VIEWED: "Workspace Settings Viewed",
  TEAM_SETTINGS_VIEWED: "Team Settings Viewed",
  GITHUB_CONNECT_STARTED: "GitHub Connect Started",
  GITHUB_CONNECTION_REQUESTED: "GitHub Connection Requested",
  GITHUB_CONNECTED: "GitHub Connected",
  AGENT_GITHUB_CONNECT_STARTED: "Agent GitHub Connect Started",
  AGENT_GITHUB_CONNECTED: "Agent GitHub Connected",
  AGENT_GITHUB_CONNECT_FAILED: "Agent GitHub Connect Failed",
  AGENT_GITHUB_DISCONNECTED: "Agent GitHub Disconnected",
  SLACK_CONNECT_STARTED: "Slack Connect Started",
  SLACK_CONNECTED: "Slack Connected",
  SLACK_MESSAGE_SENT: "Slack Message Sent",
  CLI_SIGNED_IN: "CLI Signed In",
  PLAN_SELECTED: "Plan Selected",
  PAYMENT_SETUP_COMPLETED: "Payment Setup Completed",
  PAYMENT_SETUP_FAILED: "Payment Setup Failed",
  SUBSCRIPTION_CREATED: "Subscription Created",
  SUBSCRIPTION_UPDATED: "Subscription Updated",
  SUBSCRIPTION_UPGRADED: "Subscription Upgraded",
  SUBSCRIPTION_DOWNGRADED: "Subscription Downgraded",
  SUBSCRIPTION_CANCELED: "Subscription Canceled",
  USER_CHURNED: "User Churned",
  PAYMENT_SUCCEEDED: "Payment Succeeded",
  PAYMENT_FAILED: "Payment Failed",
  BILLING_PORTAL_OPENED: "Billing Portal Opened",
  SUBSCRIPTION_GATE_SHOWN: "Subscription Gate Shown",
  STARTUP_DISCOUNT_APPLIED: "Startup Discount Applied",
  SIGNUP_PLAN_SELECTED: "Signup Plan Selected",
  SIGNUP_CARD_ENTERED: "Signup Card Entered",
  SIGNUP_PAYMENT_SKIPPED: "Signup Payment Skipped",
  SIGNUP_STARTER_SELECTED: "Signup Starter Selected",
  CREDIT_LIMIT_REACHED: "Credit Limit Reached",
  SUBSCRIPTION_PROVISIONED: "Subscription Provisioned",
  MEMBERS_SUSPENDED: "Members Suspended",
  REPORT_CREATED: "Report Created",
  REPORT_UPDATED: "Report Updated",
  REPORT_DELETED: "Report Deleted",
  REPORT_RUN_COMPLETED: "Report Run Completed",
  REPORT_DELIVERY_FAILED: "Report Delivery Failed",
  ADMIN_IMPERSONATION_STARTED: "Admin Impersonation Started",
  ADMIN_IMPERSONATION_ENDED: "Admin Impersonation Ended",
  ADMIN_IMPERSONATION_ASK_ZEST_RUN: "Admin Impersonation Ask Zest Run"
};
var GA4_EVENT_MAP = {
  [EVENTS.USER_CREATED]: "sign_up"
};

// ../../packages/analytics/src/utils.ts
var GA4_PII_KEYS = new Set([
  "email",
  "email_address",
  "name",
  "full_name",
  "first_name",
  "last_name",
  "profile_name",
  "user_name",
  "username",
  "phone",
  "phone_number",
  "ip",
  "$ip"
]);

// ../../node_modules/.bun/posthog-node@5.34.2+63120419cc93e79b/node_modules/posthog-node/dist/extensions/error-tracking/modifiers/module.node.mjs
import { dirname, posix, sep } from "path";
function createModulerModifier() {
  const getModuleFromFileName = createGetModuleFromFilename();
  return async (frames) => {
    for (const frame of frames)
      frame.module = getModuleFromFileName(frame.filename);
    return frames;
  };
}
function createGetModuleFromFilename(basePath = process.argv[1] ? dirname(process.argv[1]) : process.cwd(), isWindows = sep === "\\") {
  const normalizedBase = isWindows ? normalizeWindowsPath(basePath) : basePath;
  return (filename) => {
    if (!filename)
      return;
    const normalizedFilename = isWindows ? normalizeWindowsPath(filename) : filename;
    let { dir, base: file, ext } = posix.parse(normalizedFilename);
    if (ext === ".js" || ext === ".mjs" || ext === ".cjs")
      file = file.slice(0, -1 * ext.length);
    const decodedFile = decodeURIComponent(file);
    if (!dir)
      dir = ".";
    const n = dir.lastIndexOf("/node_modules");
    if (n > -1)
      return `${dir.slice(n + 14).replace(/\//g, ".")}:${decodedFile}`;
    if (dir.startsWith(normalizedBase)) {
      const moduleName = dir.slice(normalizedBase.length + 1).replace(/\//g, ".");
      return moduleName ? `${moduleName}:${decodedFile}` : decodedFile;
    }
    return decodedFile;
  };
}
function normalizeWindowsPath(path) {
  return path.replace(/^[A-Z]:/, "").replace(/\\/g, "/");
}
// ../../node_modules/.bun/@posthog+core@1.29.2/node_modules/@posthog/core/dist/utils/type-utils.mjs
var nativeIsArray = Array.isArray;
var ObjProto = Object.prototype;
var type_utils_hasOwnProperty = ObjProto.hasOwnProperty;
var type_utils_toString = ObjProto.toString;
var isArray = nativeIsArray || function(obj) {
  return type_utils_toString.call(obj) === "[object Array]";
};
var isObject = (x) => x === Object(x) && !isArray(x);
var isUndefined = (x) => x === undefined;
var isString = (x) => type_utils_toString.call(x) == "[object String]";
var isEmptyString = (x) => isString(x) && x.trim().length === 0;
var isNumber = (x) => type_utils_toString.call(x) == "[object Number]" && x === x;
var isPlainError = (x) => x instanceof Error;
function isPrimitive(value) {
  return value === null || typeof value != "object";
}
function isBuiltin(candidate, className) {
  return Object.prototype.toString.call(candidate) === `[object ${className}]`;
}
function isErrorEvent(event) {
  return isBuiltin(event, "ErrorEvent");
}
function isEvent(candidate) {
  return typeof Event != "undefined" && isInstanceOf(candidate, Event);
}
function isInstanceOf(candidate, base) {
  try {
    return candidate instanceof base;
  } catch {
    return false;
  }
}

// ../../node_modules/.bun/@posthog+core@1.29.2/node_modules/@posthog/core/dist/utils/number-utils.mjs
function clampToRange(value, min, max, logger, fallbackValue) {
  if (min > max) {
    logger.warn("min cannot be greater than max.");
    min = max;
  }
  if (isNumber(value))
    if (value > max) {
      logger.warn(" cannot be  greater than max: " + max + ". Using max value instead.");
      return max;
    } else {
      if (!(value < min))
        return value;
      logger.warn(" cannot be less than min: " + min + ". Using min value instead.");
      return min;
    }
  logger.warn(" must be a number. using max or fallback. max: " + max + ", fallback: " + fallbackValue);
  return clampToRange(fallbackValue || max, min, max, logger);
}

// ../../node_modules/.bun/@posthog+core@1.29.2/node_modules/@posthog/core/dist/utils/bucketed-rate-limiter.mjs
var ONE_DAY_IN_MS = 86400000;

class BucketedRateLimiter {
  constructor(options) {
    this._buckets = {};
    this._onBucketRateLimited = options._onBucketRateLimited;
    this._bucketSize = clampToRange(options.bucketSize, 0, 100, options._logger);
    this._refillRate = clampToRange(options.refillRate, 0, this._bucketSize, options._logger);
    this._refillInterval = clampToRange(options.refillInterval, 0, ONE_DAY_IN_MS, options._logger);
  }
  _applyRefill(bucket, now) {
    const elapsedMs = now - bucket.lastAccess;
    const refillIntervals = Math.floor(elapsedMs / this._refillInterval);
    if (refillIntervals > 0) {
      const tokensToAdd = refillIntervals * this._refillRate;
      bucket.tokens = Math.min(bucket.tokens + tokensToAdd, this._bucketSize);
      bucket.lastAccess = bucket.lastAccess + refillIntervals * this._refillInterval;
    }
  }
  consumeRateLimit(key) {
    const now = Date.now();
    const keyStr = String(key);
    let bucket = this._buckets[keyStr];
    if (bucket)
      this._applyRefill(bucket, now);
    else {
      bucket = {
        tokens: this._bucketSize,
        lastAccess: now
      };
      this._buckets[keyStr] = bucket;
    }
    if (bucket.tokens === 0)
      return true;
    bucket.tokens--;
    if (bucket.tokens === 0)
      this._onBucketRateLimited?.(key);
    return bucket.tokens === 0;
  }
  stop() {
    this._buckets = {};
  }
}
// ../../node_modules/.bun/@posthog+core@1.29.2/node_modules/@posthog/core/dist/vendor/uuidv7.mjs
/*! For license information please see uuidv7.mjs.LICENSE.txt */
// ../../node_modules/.bun/@posthog+core@1.29.2/node_modules/@posthog/core/dist/utils/user-agent-utils.mjs
var MOBILE = "Mobile";
var IOS = "iOS";
var ANDROID = "Android";
var TABLET = "Tablet";
var ANDROID_TABLET = ANDROID + " " + TABLET;
var APPLE = "Apple";
var APPLE_WATCH = APPLE + " Watch";
var SAFARI = "Safari";
var BLACKBERRY = "BlackBerry";
var SAMSUNG = "Samsung";
var SAMSUNG_BROWSER = SAMSUNG + "Browser";
var SAMSUNG_INTERNET = SAMSUNG + " Internet";
var CHROME = "Chrome";
var CHROME_OS = CHROME + " OS";
var CHROME_IOS = CHROME + " " + IOS;
var INTERNET_EXPLORER = "Internet Explorer";
var INTERNET_EXPLORER_MOBILE = INTERNET_EXPLORER + " " + MOBILE;
var OPERA = "Opera";
var OPERA_MINI = OPERA + " Mini";
var EDGE = "Edge";
var MICROSOFT_EDGE = "Microsoft " + EDGE;
var FIREFOX = "Firefox";
var FIREFOX_IOS = FIREFOX + " " + IOS;
var NINTENDO = "Nintendo";
var PLAYSTATION = "PlayStation";
var XBOX = "Xbox";
var ANDROID_MOBILE = ANDROID + " " + MOBILE;
var MOBILE_SAFARI = MOBILE + " " + SAFARI;
var WINDOWS = "Windows";
var WINDOWS_PHONE = WINDOWS + " Phone";
var GENERIC = "Generic";
var GENERIC_MOBILE = GENERIC + " " + MOBILE.toLowerCase();
var GENERIC_TABLET = GENERIC + " " + TABLET.toLowerCase();
var KONQUEROR = "Konqueror";
var BROWSER_VERSION_REGEX_SUFFIX = "(\\d+(\\.\\d+)?)";
var DEFAULT_BROWSER_VERSION_REGEX = new RegExp("Version/" + BROWSER_VERSION_REGEX_SUFFIX);
var XBOX_REGEX = new RegExp(XBOX, "i");
var PLAYSTATION_REGEX = new RegExp(PLAYSTATION + " \\w+", "i");
var NINTENDO_REGEX = new RegExp(NINTENDO + " \\w+", "i");
var BLACKBERRY_REGEX = new RegExp(BLACKBERRY + "|PlayBook|BB10", "i");
var windowsVersionMap = {
  "NT3.51": "NT 3.11",
  "NT4.0": "NT 4.0",
  "5.0": "2000",
  "5.1": "XP",
  "5.2": "XP",
  "6.0": "Vista",
  "6.1": "7",
  "6.2": "8",
  "6.3": "8.1",
  "6.4": "10",
  "10.0": "10"
};
var versionRegexes = {
  [INTERNET_EXPLORER_MOBILE]: [
    new RegExp("rv:" + BROWSER_VERSION_REGEX_SUFFIX)
  ],
  [MICROSOFT_EDGE]: [
    new RegExp(EDGE + "?\\/" + BROWSER_VERSION_REGEX_SUFFIX)
  ],
  [CHROME]: [
    new RegExp("(" + CHROME + "|CrMo)\\/" + BROWSER_VERSION_REGEX_SUFFIX)
  ],
  [CHROME_IOS]: [
    new RegExp("CriOS\\/" + BROWSER_VERSION_REGEX_SUFFIX)
  ],
  "UC Browser": [
    new RegExp("(UCBrowser|UCWEB)\\/" + BROWSER_VERSION_REGEX_SUFFIX)
  ],
  [SAFARI]: [
    DEFAULT_BROWSER_VERSION_REGEX
  ],
  [MOBILE_SAFARI]: [
    DEFAULT_BROWSER_VERSION_REGEX
  ],
  [OPERA]: [
    new RegExp("(" + OPERA + "|OPR)\\/" + BROWSER_VERSION_REGEX_SUFFIX)
  ],
  [FIREFOX]: [
    new RegExp(FIREFOX + "\\/" + BROWSER_VERSION_REGEX_SUFFIX)
  ],
  [FIREFOX_IOS]: [
    new RegExp("FxiOS\\/" + BROWSER_VERSION_REGEX_SUFFIX)
  ],
  [KONQUEROR]: [
    new RegExp("Konqueror[:/]?" + BROWSER_VERSION_REGEX_SUFFIX, "i")
  ],
  [BLACKBERRY]: [
    new RegExp(BLACKBERRY + " " + BROWSER_VERSION_REGEX_SUFFIX),
    DEFAULT_BROWSER_VERSION_REGEX
  ],
  [ANDROID_MOBILE]: [
    new RegExp("android\\s" + BROWSER_VERSION_REGEX_SUFFIX, "i")
  ],
  [SAMSUNG_INTERNET]: [
    new RegExp(SAMSUNG_BROWSER + "\\/" + BROWSER_VERSION_REGEX_SUFFIX)
  ],
  [INTERNET_EXPLORER]: [
    new RegExp("(rv:|MSIE )" + BROWSER_VERSION_REGEX_SUFFIX)
  ],
  Mozilla: [
    new RegExp("rv:" + BROWSER_VERSION_REGEX_SUFFIX)
  ]
};
var osMatchers = [
  [
    new RegExp(XBOX + "; " + XBOX + " (.*?)[);]", "i"),
    (match) => [
      XBOX,
      match && match[1] || ""
    ]
  ],
  [
    new RegExp(NINTENDO, "i"),
    [
      NINTENDO,
      ""
    ]
  ],
  [
    new RegExp(PLAYSTATION, "i"),
    [
      PLAYSTATION,
      ""
    ]
  ],
  [
    BLACKBERRY_REGEX,
    [
      BLACKBERRY,
      ""
    ]
  ],
  [
    new RegExp(WINDOWS, "i"),
    (_, user_agent) => {
      if (/Phone/.test(user_agent) || /WPDesktop/.test(user_agent))
        return [
          WINDOWS_PHONE,
          ""
        ];
      if (new RegExp(MOBILE).test(user_agent) && !/IEMobile\b/.test(user_agent))
        return [
          WINDOWS + " " + MOBILE,
          ""
        ];
      const match = /Windows NT ([0-9.]+)/i.exec(user_agent);
      if (match && match[1]) {
        const version = match[1];
        let osVersion = windowsVersionMap[version] || "";
        if (/arm/i.test(user_agent))
          osVersion = "RT";
        return [
          WINDOWS,
          osVersion
        ];
      }
      return [
        WINDOWS,
        ""
      ];
    }
  ],
  [
    /((iPhone|iPad|iPod).*?OS (\d+)_(\d+)_?(\d+)?|iPhone)/,
    (match) => {
      if (match && match[3]) {
        const versionParts = [
          match[3],
          match[4],
          match[5] || "0"
        ];
        return [
          IOS,
          versionParts.join(".")
        ];
      }
      return [
        IOS,
        ""
      ];
    }
  ],
  [
    /(watch.*\/(\d+\.\d+\.\d+)|watch os,(\d+\.\d+),)/i,
    (match) => {
      let version = "";
      if (match && match.length >= 3)
        version = isUndefined(match[2]) ? match[3] : match[2];
      return [
        "watchOS",
        version
      ];
    }
  ],
  [
    new RegExp("(" + ANDROID + " (\\d+)\\.(\\d+)\\.?(\\d+)?|" + ANDROID + ")", "i"),
    (match) => {
      if (match && match[2]) {
        const versionParts = [
          match[2],
          match[3],
          match[4] || "0"
        ];
        return [
          ANDROID,
          versionParts.join(".")
        ];
      }
      return [
        ANDROID,
        ""
      ];
    }
  ],
  [
    /Mac OS X (\d+)[_.](\d+)[_.]?(\d+)?/i,
    (match) => {
      const result = [
        "Mac OS X",
        ""
      ];
      if (match && match[1]) {
        const versionParts = [
          match[1],
          match[2],
          match[3] || "0"
        ];
        result[1] = versionParts.join(".");
      }
      return result;
    }
  ],
  [
    /Mac/i,
    [
      "Mac OS X",
      ""
    ]
  ],
  [
    /CrOS/,
    [
      CHROME_OS,
      ""
    ]
  ],
  [
    /Linux|debian/i,
    [
      "Linux",
      ""
    ]
  ]
];
// ../../node_modules/.bun/@posthog+core@1.29.2/node_modules/@posthog/core/dist/utils/index.mjs
var isError = (x) => x instanceof Error;

// ../../node_modules/.bun/@posthog+core@1.29.2/node_modules/@posthog/core/dist/logs/logs-utils.mjs
var OTLP_SEVERITY_MAP = {
  trace: {
    text: "TRACE",
    number: 1
  },
  debug: {
    text: "DEBUG",
    number: 5
  },
  info: {
    text: "INFO",
    number: 9
  },
  warn: {
    text: "WARN",
    number: 13
  },
  error: {
    text: "ERROR",
    number: 17
  },
  fatal: {
    text: "FATAL",
    number: 21
  }
};
var DEFAULT_OTLP_SEVERITY = OTLP_SEVERITY_MAP.info;
// ../../node_modules/.bun/@posthog+core@1.29.2/node_modules/@posthog/core/dist/error-tracking/index.mjs
var exports_error_tracking = {};
__export(exports_error_tracking, {
  DEFAULT_EXCEPTION_STEPS_CONFIG: () => DEFAULT_EXCEPTION_STEPS_CONFIG,
  DOMExceptionCoercer: () => DOMExceptionCoercer,
  EXCEPTION_STEP_INTERNAL_FIELDS: () => EXCEPTION_STEP_INTERNAL_FIELDS,
  ErrorCoercer: () => ErrorCoercer,
  ErrorEventCoercer: () => ErrorEventCoercer,
  ErrorPropertiesBuilder: () => ErrorPropertiesBuilder,
  EventCoercer: () => EventCoercer,
  ExceptionStepsBuffer: () => ExceptionStepsBuffer,
  ObjectCoercer: () => ObjectCoercer,
  PrimitiveCoercer: () => PrimitiveCoercer,
  PromiseRejectionEventCoercer: () => PromiseRejectionEventCoercer,
  ReduceableCache: () => ReduceableCache,
  StringCoercer: () => StringCoercer,
  chromeStackLineParser: () => chromeStackLineParser,
  createDefaultStackParser: () => createDefaultStackParser,
  createStackParser: () => createStackParser,
  geckoStackLineParser: () => geckoStackLineParser,
  getUtf8ByteLength: () => getUtf8ByteLength,
  nodeStackLineParser: () => nodeStackLineParser,
  opera10StackLineParser: () => opera10StackLineParser,
  opera11StackLineParser: () => opera11StackLineParser,
  resolveExceptionStepsConfig: () => resolveExceptionStepsConfig,
  reverseAndStripFrames: () => reverseAndStripFrames,
  stripReservedExceptionStepFields: () => stripReservedExceptionStepFields,
  winjsStackLineParser: () => winjsStackLineParser
});

// ../../node_modules/.bun/@posthog+core@1.29.2/node_modules/@posthog/core/dist/error-tracking/chunk-ids.mjs
var parsedStackResults;
var lastKeysCount;
var cachedFilenameChunkIds;
function getFilenameToChunkIdMap(stackParser) {
  const chunkIdMap = globalThis._posthogChunkIds;
  if (!chunkIdMap)
    return;
  const chunkIdKeys = Object.keys(chunkIdMap);
  if (cachedFilenameChunkIds && chunkIdKeys.length === lastKeysCount)
    return cachedFilenameChunkIds;
  lastKeysCount = chunkIdKeys.length;
  cachedFilenameChunkIds = chunkIdKeys.reduce((acc, stackKey) => {
    if (!parsedStackResults)
      parsedStackResults = {};
    const result = parsedStackResults[stackKey];
    if (result)
      acc[result[0]] = result[1];
    else {
      const parsedStack = stackParser(stackKey);
      for (let i = parsedStack.length - 1;i >= 0; i--) {
        const stackFrame = parsedStack[i];
        const filename = stackFrame?.filename;
        const chunkId = chunkIdMap[stackKey];
        if (filename && chunkId) {
          acc[filename] = chunkId;
          parsedStackResults[stackKey] = [
            filename,
            chunkId
          ];
          break;
        }
      }
    }
    return acc;
  }, {});
  return cachedFilenameChunkIds;
}

// ../../node_modules/.bun/@posthog+core@1.29.2/node_modules/@posthog/core/dist/error-tracking/error-properties-builder.mjs
var MAX_CAUSE_RECURSION = 4;

class ErrorPropertiesBuilder {
  constructor(coercers, stackParser, modifiers = []) {
    this.coercers = coercers;
    this.stackParser = stackParser;
    this.modifiers = modifiers;
  }
  buildFromUnknown(input, hint = {}) {
    const providedMechanism = hint && hint.mechanism;
    const mechanism = providedMechanism || {
      handled: true,
      type: "generic"
    };
    const coercingContext = this.buildCoercingContext(mechanism, hint, 0);
    const exceptionWithCause = coercingContext.apply(input);
    const parsingContext = this.buildParsingContext(hint);
    const exceptionWithStack = this.parseStacktrace(exceptionWithCause, parsingContext);
    const exceptionList = this.convertToExceptionList(exceptionWithStack, mechanism);
    return {
      $exception_list: exceptionList,
      $exception_level: "error"
    };
  }
  async modifyFrames(exceptionList) {
    for (const exc of exceptionList)
      if (exc.stacktrace && exc.stacktrace.frames && isArray(exc.stacktrace.frames))
        exc.stacktrace.frames = await this.applyModifiers(exc.stacktrace.frames);
    return exceptionList;
  }
  coerceFallback(ctx) {
    return {
      type: "Error",
      value: "Unknown error",
      stack: ctx.syntheticException?.stack,
      synthetic: true
    };
  }
  parseStacktrace(err, ctx) {
    let cause;
    if (err.cause != null)
      cause = this.parseStacktrace(err.cause, ctx);
    let stack;
    if (err.stack != "" && err.stack != null)
      stack = this.applyChunkIds(this.stackParser(err.stack, err.synthetic ? ctx.skipFirstLines : 0), ctx.chunkIdMap);
    return {
      ...err,
      cause,
      stack
    };
  }
  applyChunkIds(frames, chunkIdMap) {
    return frames.map((frame) => {
      if (frame.filename && chunkIdMap)
        frame.chunk_id = chunkIdMap[frame.filename];
      return frame;
    });
  }
  applyCoercers(input, ctx) {
    for (const adapter of this.coercers)
      if (adapter.match(input))
        return adapter.coerce(input, ctx);
    return this.coerceFallback(ctx);
  }
  async applyModifiers(frames) {
    let newFrames = frames;
    for (const modifier of this.modifiers)
      newFrames = await modifier(newFrames);
    return newFrames;
  }
  convertToExceptionList(exceptionWithStack, mechanism) {
    const currentException = {
      type: exceptionWithStack.type,
      value: exceptionWithStack.value,
      mechanism: {
        type: mechanism.type ?? "generic",
        handled: mechanism.handled ?? true,
        synthetic: exceptionWithStack.synthetic ?? false
      }
    };
    if (exceptionWithStack.stack)
      currentException.stacktrace = {
        type: "raw",
        frames: exceptionWithStack.stack
      };
    const exceptionList = [
      currentException
    ];
    if (exceptionWithStack.cause != null)
      exceptionList.push(...this.convertToExceptionList(exceptionWithStack.cause, {
        ...mechanism,
        handled: true
      }));
    return exceptionList;
  }
  buildParsingContext(hint) {
    const context = {
      chunkIdMap: getFilenameToChunkIdMap(this.stackParser),
      skipFirstLines: hint.skipFirstLines ?? 1
    };
    return context;
  }
  buildCoercingContext(mechanism, hint, depth = 0) {
    const coerce = (input, depth2) => {
      if (!(depth2 <= MAX_CAUSE_RECURSION))
        return;
      {
        const ctx = this.buildCoercingContext(mechanism, hint, depth2);
        return this.applyCoercers(input, ctx);
      }
    };
    const context = {
      ...hint,
      syntheticException: depth == 0 ? hint.syntheticException : undefined,
      mechanism,
      apply: (input) => coerce(input, depth),
      next: (input) => coerce(input, depth + 1)
    };
    return context;
  }
}
// ../../node_modules/.bun/@posthog+core@1.29.2/node_modules/@posthog/core/dist/error-tracking/parsers/base.mjs
var UNKNOWN_FUNCTION = "?";
function createFrame(platform, filename, func, lineno, colno) {
  const frame = {
    platform,
    filename,
    function: func === "<anonymous>" ? UNKNOWN_FUNCTION : func,
    in_app: true
  };
  if (!isUndefined(lineno))
    frame.lineno = lineno;
  if (!isUndefined(colno))
    frame.colno = colno;
  return frame;
}

// ../../node_modules/.bun/@posthog+core@1.29.2/node_modules/@posthog/core/dist/error-tracking/parsers/safari.mjs
var extractSafariExtensionDetails = (func, filename) => {
  const isSafariExtension = func.indexOf("safari-extension") !== -1;
  const isSafariWebExtension = func.indexOf("safari-web-extension") !== -1;
  return isSafariExtension || isSafariWebExtension ? [
    func.indexOf("@") !== -1 ? func.split("@")[0] : UNKNOWN_FUNCTION,
    isSafariExtension ? `safari-extension:${filename}` : `safari-web-extension:${filename}`
  ] : [
    func,
    filename
  ];
};

// ../../node_modules/.bun/@posthog+core@1.29.2/node_modules/@posthog/core/dist/error-tracking/parsers/chrome.mjs
var chromeRegexNoFnName = /^\s*at (\S+?)(?::(\d+))(?::(\d+))\s*$/i;
var chromeRegex = /^\s*at (?:(.+?\)(?: \[.+\])?|.*?) ?\((?:address at )?)?(?:async )?((?:<anonymous>|[-a-z]+:|.*bundle|\/)?.*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i;
var chromeEvalRegex = /\((\S*)(?::(\d+))(?::(\d+))\)/;
var chromeStackLineParser = (line, platform) => {
  const noFnParts = chromeRegexNoFnName.exec(line);
  if (noFnParts) {
    const [, filename, line2, col] = noFnParts;
    return createFrame(platform, filename, UNKNOWN_FUNCTION, +line2, +col);
  }
  const parts = chromeRegex.exec(line);
  if (parts) {
    const isEval = parts[2] && parts[2].indexOf("eval") === 0;
    if (isEval) {
      const subMatch = chromeEvalRegex.exec(parts[2]);
      if (subMatch) {
        parts[2] = subMatch[1];
        parts[3] = subMatch[2];
        parts[4] = subMatch[3];
      }
    }
    const [func, filename] = extractSafariExtensionDetails(parts[1] || UNKNOWN_FUNCTION, parts[2]);
    return createFrame(platform, filename, func, parts[3] ? +parts[3] : undefined, parts[4] ? +parts[4] : undefined);
  }
};

// ../../node_modules/.bun/@posthog+core@1.29.2/node_modules/@posthog/core/dist/error-tracking/parsers/gecko.mjs
var geckoREgex = /^\s*(.*?)(?:\((.*?)\))?(?:^|@)?((?:[-a-z]+)?:\/.*?|\[native code\]|[^@]*(?:bundle|\d+\.js)|\/[\w\-. /=]+)(?::(\d+))?(?::(\d+))?\s*$/i;
var geckoEvalRegex = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i;
var geckoStackLineParser = (line, platform) => {
  const parts = geckoREgex.exec(line);
  if (parts) {
    const isEval = parts[3] && parts[3].indexOf(" > eval") > -1;
    if (isEval) {
      const subMatch = geckoEvalRegex.exec(parts[3]);
      if (subMatch) {
        parts[1] = parts[1] || "eval";
        parts[3] = subMatch[1];
        parts[4] = subMatch[2];
        parts[5] = "";
      }
    }
    let filename = parts[3];
    let func = parts[1] || UNKNOWN_FUNCTION;
    [func, filename] = extractSafariExtensionDetails(func, filename);
    return createFrame(platform, filename, func, parts[4] ? +parts[4] : undefined, parts[5] ? +parts[5] : undefined);
  }
};

// ../../node_modules/.bun/@posthog+core@1.29.2/node_modules/@posthog/core/dist/error-tracking/parsers/winjs.mjs
var winjsRegex = /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:[-a-z]+):.*?):(\d+)(?::(\d+))?\)?\s*$/i;
var winjsStackLineParser = (line, platform) => {
  const parts = winjsRegex.exec(line);
  return parts ? createFrame(platform, parts[2], parts[1] || UNKNOWN_FUNCTION, +parts[3], parts[4] ? +parts[4] : undefined) : undefined;
};

// ../../node_modules/.bun/@posthog+core@1.29.2/node_modules/@posthog/core/dist/error-tracking/parsers/opera.mjs
var opera10Regex = / line (\d+).*script (?:in )?(\S+)(?:: in function (\S+))?$/i;
var opera10StackLineParser = (line, platform) => {
  const parts = opera10Regex.exec(line);
  return parts ? createFrame(platform, parts[2], parts[3] || UNKNOWN_FUNCTION, +parts[1]) : undefined;
};
var opera11Regex = / line (\d+), column (\d+)\s*(?:in (?:<anonymous function: ([^>]+)>|([^)]+))\(.*\))? in (.*):\s*$/i;
var opera11StackLineParser = (line, platform) => {
  const parts = opera11Regex.exec(line);
  return parts ? createFrame(platform, parts[5], parts[3] || parts[4] || UNKNOWN_FUNCTION, +parts[1], +parts[2]) : undefined;
};

// ../../node_modules/.bun/@posthog+core@1.29.2/node_modules/@posthog/core/dist/error-tracking/parsers/node.mjs
var FILENAME_MATCH = /^\s*[-]{4,}$/;
var FULL_MATCH = /at (?:async )?(?:(.+?)\s+\()?(?:(.+):(\d+):(\d+)?|([^)]+))\)?/;
var nodeStackLineParser = (line, platform) => {
  const lineMatch = line.match(FULL_MATCH);
  if (lineMatch) {
    let object;
    let method;
    let functionName;
    let typeName;
    let methodName;
    if (lineMatch[1]) {
      functionName = lineMatch[1];
      let methodStart = functionName.lastIndexOf(".");
      if (functionName[methodStart - 1] === ".")
        methodStart--;
      if (methodStart > 0) {
        object = functionName.slice(0, methodStart);
        method = functionName.slice(methodStart + 1);
        const objectEnd = object.indexOf(".Module");
        if (objectEnd > 0) {
          functionName = functionName.slice(objectEnd + 1);
          object = object.slice(0, objectEnd);
        }
      }
      typeName = undefined;
    }
    if (method) {
      typeName = object;
      methodName = method;
    }
    if (method === "<anonymous>") {
      methodName = undefined;
      functionName = undefined;
    }
    if (functionName === undefined) {
      methodName = methodName || UNKNOWN_FUNCTION;
      functionName = typeName ? `${typeName}.${methodName}` : methodName;
    }
    let filename = lineMatch[2]?.startsWith("file://") ? lineMatch[2].slice(7) : lineMatch[2];
    const isNative = lineMatch[5] === "native";
    if (filename?.match(/\/[A-Z]:/))
      filename = filename.slice(1);
    if (!filename && lineMatch[5] && !isNative)
      filename = lineMatch[5];
    return {
      filename: filename ? decodeURI(filename) : undefined,
      module: undefined,
      function: functionName,
      lineno: _parseIntOrUndefined(lineMatch[3]),
      colno: _parseIntOrUndefined(lineMatch[4]),
      in_app: filenameIsInApp(filename || "", isNative),
      platform
    };
  }
  if (line.match(FILENAME_MATCH))
    return {
      filename: line,
      platform
    };
};
function filenameIsInApp(filename, isNative = false) {
  const isInternal = isNative || filename && !filename.startsWith("/") && !filename.match(/^[A-Z]:/) && !filename.startsWith(".") && !filename.match(/^[a-zA-Z]([a-zA-Z0-9.\-+])*:\/\//);
  return !isInternal && filename !== undefined && !filename.includes("node_modules/");
}
function _parseIntOrUndefined(input) {
  return parseInt(input || "", 10) || undefined;
}

// ../../node_modules/.bun/@posthog+core@1.29.2/node_modules/@posthog/core/dist/error-tracking/parsers/index.mjs
var WEBPACK_ERROR_REGEXP = /\(error: (.*)\)/;
var STACKTRACE_FRAME_LIMIT = 50;
function reverseAndStripFrames(stack) {
  if (!stack.length)
    return [];
  const localStack = Array.from(stack);
  localStack.reverse();
  return localStack.slice(0, STACKTRACE_FRAME_LIMIT).map((frame) => ({
    ...frame,
    filename: frame.filename || getLastStackFrame(localStack).filename,
    function: frame.function || UNKNOWN_FUNCTION
  }));
}
function getLastStackFrame(arr) {
  return arr[arr.length - 1] || {};
}
function createDefaultStackParser() {
  return createStackParser("web:javascript", chromeStackLineParser, geckoStackLineParser);
}
function createStackParser(platform, ...parsers) {
  return (stack, skipFirstLines = 0) => {
    const frames = [];
    const lines = stack.split(`
`);
    for (let i = skipFirstLines;i < lines.length; i++) {
      const line = lines[i];
      if (line.length > 1024)
        continue;
      const cleanedLine = WEBPACK_ERROR_REGEXP.test(line) ? line.replace(WEBPACK_ERROR_REGEXP, "$1") : line;
      if (!cleanedLine.match(/\S*Error: /)) {
        for (const parser of parsers) {
          const frame = parser(cleanedLine, platform);
          if (frame) {
            frames.push(frame);
            break;
          }
        }
        if (frames.length >= STACKTRACE_FRAME_LIMIT)
          break;
      }
    }
    return reverseAndStripFrames(frames);
  };
}
// ../../node_modules/.bun/@posthog+core@1.29.2/node_modules/@posthog/core/dist/error-tracking/coercers/dom-exception-coercer.mjs
class DOMExceptionCoercer {
  match(err) {
    return this.isDOMException(err) || this.isDOMError(err);
  }
  coerce(err, ctx) {
    const hasStack = isString(err.stack);
    return {
      type: this.getType(err),
      value: this.getValue(err),
      stack: hasStack ? err.stack : undefined,
      cause: err.cause ? ctx.next(err.cause) : undefined,
      synthetic: false
    };
  }
  getType(candidate) {
    return this.isDOMError(candidate) ? "DOMError" : "DOMException";
  }
  getValue(err) {
    const name = err.name || (this.isDOMError(err) ? "DOMError" : "DOMException");
    const message = err.message ? `${name}: ${err.message}` : name;
    return message;
  }
  isDOMException(err) {
    return isBuiltin(err, "DOMException");
  }
  isDOMError(err) {
    return isBuiltin(err, "DOMError");
  }
}
// ../../node_modules/.bun/@posthog+core@1.29.2/node_modules/@posthog/core/dist/error-tracking/coercers/error-coercer.mjs
class ErrorCoercer {
  match(err) {
    return isPlainError(err);
  }
  coerce(err, ctx) {
    return {
      type: this.getType(err),
      value: this.getMessage(err, ctx),
      stack: this.getStack(err),
      cause: err.cause ? ctx.next(err.cause) : undefined,
      synthetic: false
    };
  }
  getType(err) {
    return err.name || err.constructor.name;
  }
  getMessage(err, _ctx) {
    const message = err.message;
    if (message.error && typeof message.error.message == "string")
      return String(message.error.message);
    return String(message);
  }
  getStack(err) {
    return err.stacktrace || err.stack || undefined;
  }
}
// ../../node_modules/.bun/@posthog+core@1.29.2/node_modules/@posthog/core/dist/error-tracking/coercers/error-event-coercer.mjs
class ErrorEventCoercer {
  constructor() {}
  match(err) {
    return isErrorEvent(err) && err.error != null;
  }
  coerce(err, ctx) {
    const exceptionLike = ctx.apply(err.error);
    if (!exceptionLike)
      return {
        type: "ErrorEvent",
        value: err.message,
        stack: ctx.syntheticException?.stack,
        synthetic: true
      };
    return exceptionLike;
  }
}
// ../../node_modules/.bun/@posthog+core@1.29.2/node_modules/@posthog/core/dist/error-tracking/coercers/string-coercer.mjs
var ERROR_TYPES_PATTERN = /^(?:[Uu]ncaught (?:exception: )?)?(?:((?:Eval|Internal|Range|Reference|Syntax|Type|URI|)Error): )?(.*)$/i;

class StringCoercer {
  match(input) {
    return typeof input == "string";
  }
  coerce(input, ctx) {
    const [type, value] = this.getInfos(input);
    return {
      type: type ?? "Error",
      value: value ?? input,
      stack: ctx.syntheticException?.stack,
      synthetic: true
    };
  }
  getInfos(candidate) {
    let type = "Error";
    let value = candidate;
    const groups = candidate.match(ERROR_TYPES_PATTERN);
    if (groups) {
      type = groups[1];
      value = groups[2];
    }
    return [
      type,
      value
    ];
  }
}
// ../../node_modules/.bun/@posthog+core@1.29.2/node_modules/@posthog/core/dist/error-tracking/types.mjs
var severityLevels = [
  "fatal",
  "error",
  "warning",
  "log",
  "info",
  "debug"
];

// ../../node_modules/.bun/@posthog+core@1.29.2/node_modules/@posthog/core/dist/error-tracking/coercers/utils.mjs
function extractExceptionKeysForMessage(err, maxLength = 40) {
  const keys = Object.keys(err);
  keys.sort();
  if (!keys.length)
    return "[object has no keys]";
  for (let i = keys.length;i > 0; i--) {
    const serialized = keys.slice(0, i).join(", ");
    if (!(serialized.length > maxLength)) {
      if (i === keys.length)
        return serialized;
      return serialized.length <= maxLength ? serialized : `${serialized.slice(0, maxLength)}...`;
    }
  }
  return "";
}

// ../../node_modules/.bun/@posthog+core@1.29.2/node_modules/@posthog/core/dist/error-tracking/coercers/object-coercer.mjs
class ObjectCoercer {
  match(candidate) {
    return typeof candidate == "object" && candidate !== null;
  }
  coerce(candidate, ctx) {
    const errorProperty = this.getErrorPropertyFromObject(candidate);
    if (errorProperty)
      return ctx.apply(errorProperty);
    return {
      type: this.getType(candidate),
      value: this.getValue(candidate),
      stack: ctx.syntheticException?.stack,
      level: this.isSeverityLevel(candidate.level) ? candidate.level : "error",
      synthetic: true
    };
  }
  getType(err) {
    return isEvent(err) ? err.constructor.name : "Error";
  }
  getValue(err) {
    if ("name" in err && typeof err.name == "string") {
      let message = `'${err.name}' captured as exception`;
      if ("message" in err && typeof err.message == "string")
        message += ` with message: '${err.message}'`;
      return message;
    }
    if ("message" in err && typeof err.message == "string")
      return err.message;
    const className = this.getObjectClassName(err);
    const keys = extractExceptionKeysForMessage(err);
    return `${className && className !== "Object" ? `'${className}'` : "Object"} captured as exception with keys: ${keys}`;
  }
  isSeverityLevel(x) {
    return isString(x) && !isEmptyString(x) && severityLevels.indexOf(x) >= 0;
  }
  getErrorPropertyFromObject(obj) {
    for (const prop in obj)
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        const value = obj[prop];
        if (isError(value))
          return value;
      }
  }
  getObjectClassName(obj) {
    try {
      const prototype = Object.getPrototypeOf(obj);
      return prototype ? prototype.constructor.name : undefined;
    } catch (e) {
      return;
    }
  }
}
// ../../node_modules/.bun/@posthog+core@1.29.2/node_modules/@posthog/core/dist/error-tracking/coercers/event-coercer.mjs
class EventCoercer {
  match(err) {
    return isEvent(err);
  }
  coerce(evt, ctx) {
    const constructorName = evt.constructor.name;
    return {
      type: constructorName,
      value: `${constructorName} captured as exception with keys: ${extractExceptionKeysForMessage(evt)}`,
      stack: ctx.syntheticException?.stack,
      synthetic: true
    };
  }
}
// ../../node_modules/.bun/@posthog+core@1.29.2/node_modules/@posthog/core/dist/error-tracking/coercers/primitive-coercer.mjs
class PrimitiveCoercer {
  match(candidate) {
    return isPrimitive(candidate);
  }
  coerce(value, ctx) {
    return {
      type: "Error",
      value: `Primitive value captured as exception: ${String(value)}`,
      stack: ctx.syntheticException?.stack,
      synthetic: true
    };
  }
}
// ../../node_modules/.bun/@posthog+core@1.29.2/node_modules/@posthog/core/dist/error-tracking/coercers/promise-rejection-event.mjs
class PromiseRejectionEventCoercer {
  match(err) {
    return isBuiltin(err, "PromiseRejectionEvent") || this.isCustomEventWrappingRejection(err);
  }
  isCustomEventWrappingRejection(err) {
    if (!isEvent(err))
      return false;
    try {
      const detail = err.detail;
      return detail != null && typeof detail == "object" && "reason" in detail;
    } catch {
      return false;
    }
  }
  coerce(err, ctx) {
    const reason = this.getUnhandledRejectionReason(err);
    if (isPrimitive(reason))
      return {
        type: "UnhandledRejection",
        value: `Non-Error promise rejection captured with value: ${String(reason)}`,
        stack: ctx.syntheticException?.stack,
        synthetic: true
      };
    return ctx.apply(reason);
  }
  getUnhandledRejectionReason(error) {
    try {
      if ("reason" in error)
        return error.reason;
      if ("detail" in error && error.detail != null && typeof error.detail == "object" && "reason" in error.detail)
        return error.detail.reason;
    } catch {}
    return error;
  }
}
// ../../node_modules/.bun/@posthog+core@1.29.2/node_modules/@posthog/core/dist/error-tracking/utils.mjs
class ReduceableCache {
  constructor(_maxSize) {
    this._maxSize = _maxSize;
    this._cache = new Map;
  }
  get(key) {
    const value = this._cache.get(key);
    if (value === undefined)
      return;
    this._cache.delete(key);
    this._cache.set(key, value);
    return value;
  }
  set(key, value) {
    this._cache.set(key, value);
  }
  reduce() {
    while (this._cache.size >= this._maxSize) {
      const value = this._cache.keys().next().value;
      if (value)
        this._cache.delete(value);
    }
  }
}
// ../../node_modules/.bun/@posthog+core@1.29.2/node_modules/@posthog/core/dist/error-tracking/exception-steps.mjs
var EXCEPTION_STEP_INTERNAL_FIELDS = {
  MESSAGE: "$message",
  TIMESTAMP: "$timestamp"
};
var RESERVED_EXCEPTION_STEP_KEYS = new Set([
  EXCEPTION_STEP_INTERNAL_FIELDS.MESSAGE,
  EXCEPTION_STEP_INTERNAL_FIELDS.TIMESTAMP
]);
var DEFAULT_EXCEPTION_STEPS_CONFIG = {
  enabled: true,
  max_bytes: 32768
};
function resolveExceptionStepsConfig(config) {
  if (!config)
    return {
      ...DEFAULT_EXCEPTION_STEPS_CONFIG
    };
  return {
    enabled: config.enabled ?? DEFAULT_EXCEPTION_STEPS_CONFIG.enabled,
    max_bytes: normalizePositiveInteger(config.max_bytes, DEFAULT_EXCEPTION_STEPS_CONFIG.max_bytes)
  };
}
function stripReservedExceptionStepFields(properties) {
  if (!properties)
    return {
      sanitizedProperties: {},
      droppedKeys: []
    };
  const droppedKeys = [];
  const sanitizedProperties = Object.keys(properties).reduce((acc, key) => {
    if (RESERVED_EXCEPTION_STEP_KEYS.has(key)) {
      droppedKeys.push(key);
      return acc;
    }
    acc[key] = properties[key];
    return acc;
  }, {});
  return {
    sanitizedProperties,
    droppedKeys
  };
}

class ExceptionStepsBuffer {
  constructor(config) {
    this._entries = [];
    this._totalBytes = 0;
    this._config = resolveExceptionStepsConfig(config);
  }
  setConfig(config) {
    this._config = resolveExceptionStepsConfig(config);
    this._trimToMaxBytes();
  }
  add(step) {
    const serialized = normalizeAndSerializeStep(step);
    if (!serialized)
      return;
    const bytes = getUtf8ByteLength(serialized.json);
    if (bytes > this._config.max_bytes)
      return;
    this._entries.push({
      step: serialized.step,
      bytes
    });
    this._totalBytes += bytes;
    this._trimToMaxBytes();
  }
  getAttachable() {
    return this._entries.map((e) => e.step);
  }
  clear() {
    this._entries = [];
    this._totalBytes = 0;
  }
  size() {
    return this._entries.length;
  }
  _trimToMaxBytes() {
    while (this._totalBytes > this._config.max_bytes && this._entries.length > 0) {
      const evicted = this._entries.shift();
      if (evicted)
        this._totalBytes -= evicted.bytes;
    }
  }
}
function normalizePositiveInteger(input, fallback) {
  if (!isNumber(input) || input === 1 / 0 || input === -1 / 0)
    return fallback;
  const normalized = Math.floor(input);
  if (normalized < 0)
    return fallback;
  return normalized;
}
function normalizeAndSerializeStep(step) {
  const json = safeStringify(step);
  if (!json)
    return;
  try {
    const parsed = JSON.parse(json);
    if (!isObject(parsed))
      return;
    const parsedStep = parsed;
    const message = parsedStep[EXCEPTION_STEP_INTERNAL_FIELDS.MESSAGE];
    const timestamp = parsedStep[EXCEPTION_STEP_INTERNAL_FIELDS.TIMESTAMP];
    if (!isString(message) || message.trim().length === 0)
      return;
    if (!isString(timestamp) && !isNumber(timestamp))
      return;
    return {
      step: parsedStep,
      json
    };
  } catch {
    return;
  }
}
function safeStringify(value) {
  const seen = new WeakSet;
  try {
    return JSON.stringify(value, (_key, replacementValue) => {
      if (typeof replacementValue == "bigint")
        return replacementValue.toString();
      if (typeof replacementValue == "function" || typeof replacementValue == "symbol")
        return;
      if (replacementValue instanceof Date)
        return replacementValue.toISOString();
      if (replacementValue instanceof Error)
        return {
          name: replacementValue.name,
          message: replacementValue.message,
          stack: replacementValue.stack
        };
      if (replacementValue && typeof replacementValue == "object") {
        if (seen.has(replacementValue))
          return "[Circular]";
        seen.add(replacementValue);
      }
      return replacementValue;
    });
  } catch {
    return;
  }
}
function getUtf8ByteLength(value) {
  if (typeof TextEncoder != "undefined")
    return new TextEncoder().encode(value).length;
  const encoded = encodeURIComponent(value);
  let byteLength = 0;
  for (let i = 0;i < encoded.length; i++)
    if (encoded[i] === "%") {
      byteLength += 1;
      i += 2;
    } else
      byteLength += 1;
  return byteLength;
}
// ../../node_modules/.bun/posthog-node@5.34.2+63120419cc93e79b/node_modules/posthog-node/dist/extensions/error-tracking/modifiers/context-lines.node.mjs
import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";
var LRU_FILE_CONTENTS_CACHE = new exports_error_tracking.ReduceableCache(25);
var LRU_FILE_CONTENTS_FS_READ_FAILED = new exports_error_tracking.ReduceableCache(20);
var DEFAULT_LINES_OF_CONTEXT = 7;
var MAX_CONTEXTLINES_COLNO = 1000;
var MAX_CONTEXTLINES_LINENO = 1e4;
async function addSourceContext(frames) {
  const filesToLines = {};
  for (let i = frames.length - 1;i >= 0; i--) {
    const frame = frames[i];
    const filename = frame?.filename;
    if (!frame || typeof filename != "string" || typeof frame.lineno != "number" || shouldSkipContextLinesForFile(filename) || shouldSkipContextLinesForFrame(frame))
      continue;
    const filesToLinesOutput = filesToLines[filename];
    if (!filesToLinesOutput)
      filesToLines[filename] = [];
    filesToLines[filename].push(frame.lineno);
  }
  const files = Object.keys(filesToLines);
  if (files.length == 0)
    return frames;
  const readlinePromises = [];
  for (const file of files) {
    if (LRU_FILE_CONTENTS_FS_READ_FAILED.get(file))
      continue;
    const filesToLineRanges = filesToLines[file];
    if (!filesToLineRanges)
      continue;
    filesToLineRanges.sort((a, b) => a - b);
    const ranges = makeLineReaderRanges(filesToLineRanges);
    if (ranges.every((r) => rangeExistsInContentCache(file, r)))
      continue;
    const cache = emplace(LRU_FILE_CONTENTS_CACHE, file, {});
    readlinePromises.push(getContextLinesFromFile(file, ranges, cache));
  }
  await Promise.all(readlinePromises).catch(() => {});
  if (frames && frames.length > 0)
    addSourceContextToFrames(frames, LRU_FILE_CONTENTS_CACHE);
  LRU_FILE_CONTENTS_CACHE.reduce();
  return frames;
}
function getContextLinesFromFile(path, ranges, output) {
  return new Promise((resolve) => {
    const stream = createReadStream(path);
    const lineReaded = createInterface({
      input: stream
    });
    function destroyStreamAndResolve() {
      stream.destroy();
      resolve();
    }
    let lineNumber = 0;
    let currentRangeIndex = 0;
    const range = ranges[currentRangeIndex];
    if (range === undefined)
      return void destroyStreamAndResolve();
    let rangeStart = range[0];
    let rangeEnd = range[1];
    function onStreamError() {
      LRU_FILE_CONTENTS_FS_READ_FAILED.set(path, 1);
      lineReaded.close();
      lineReaded.removeAllListeners();
      destroyStreamAndResolve();
    }
    stream.on("error", onStreamError);
    lineReaded.on("error", onStreamError);
    lineReaded.on("close", destroyStreamAndResolve);
    lineReaded.on("line", (line) => {
      lineNumber++;
      if (lineNumber < rangeStart)
        return;
      output[lineNumber] = snipLine(line, 0);
      if (lineNumber >= rangeEnd) {
        if (currentRangeIndex === ranges.length - 1) {
          lineReaded.close();
          lineReaded.removeAllListeners();
          return;
        }
        currentRangeIndex++;
        const range2 = ranges[currentRangeIndex];
        if (range2 === undefined) {
          lineReaded.close();
          lineReaded.removeAllListeners();
          return;
        }
        rangeStart = range2[0];
        rangeEnd = range2[1];
      }
    });
  });
}
function addSourceContextToFrames(frames, cache) {
  for (const frame of frames)
    if (frame.filename && frame.context_line === undefined && typeof frame.lineno == "number") {
      const contents = cache.get(frame.filename);
      if (contents === undefined)
        continue;
      addContextToFrame(frame.lineno, frame, contents);
    }
}
function addContextToFrame(lineno, frame, contents) {
  if (frame.lineno === undefined || contents === undefined)
    return;
  frame.pre_context = [];
  for (let i = makeRangeStart(lineno);i < lineno; i++) {
    const line = contents[i];
    if (line === undefined)
      return void clearLineContext(frame);
    frame.pre_context.push(line);
  }
  if (contents[lineno] === undefined)
    return void clearLineContext(frame);
  frame.context_line = contents[lineno];
  const end = makeRangeEnd(lineno);
  frame.post_context = [];
  for (let i = lineno + 1;i <= end; i++) {
    const line = contents[i];
    if (line === undefined)
      break;
    frame.post_context.push(line);
  }
}
function clearLineContext(frame) {
  delete frame.pre_context;
  delete frame.context_line;
  delete frame.post_context;
}
function shouldSkipContextLinesForFile(path) {
  return path.startsWith("node:") || path.endsWith(".min.js") || path.endsWith(".min.cjs") || path.endsWith(".min.mjs") || path.startsWith("data:");
}
function shouldSkipContextLinesForFrame(frame) {
  if (frame.lineno !== undefined && frame.lineno > MAX_CONTEXTLINES_LINENO)
    return true;
  if (frame.colno !== undefined && frame.colno > MAX_CONTEXTLINES_COLNO)
    return true;
  return false;
}
function rangeExistsInContentCache(file, range) {
  const contents = LRU_FILE_CONTENTS_CACHE.get(file);
  if (contents === undefined)
    return false;
  for (let i = range[0];i <= range[1]; i++)
    if (contents[i] === undefined)
      return false;
  return true;
}
function makeLineReaderRanges(lines) {
  if (!lines.length)
    return [];
  let i = 0;
  const line = lines[0];
  if (typeof line != "number")
    return [];
  let current = makeContextRange(line);
  const out = [];
  while (true) {
    if (i === lines.length - 1) {
      out.push(current);
      break;
    }
    const next = lines[i + 1];
    if (typeof next != "number")
      break;
    if (next <= current[1])
      current[1] = next + DEFAULT_LINES_OF_CONTEXT;
    else {
      out.push(current);
      current = makeContextRange(next);
    }
    i++;
  }
  return out;
}
function makeContextRange(line) {
  return [
    makeRangeStart(line),
    makeRangeEnd(line)
  ];
}
function makeRangeStart(line) {
  return Math.max(1, line - DEFAULT_LINES_OF_CONTEXT);
}
function makeRangeEnd(line) {
  return line + DEFAULT_LINES_OF_CONTEXT;
}
function emplace(map, key, contents) {
  const value = map.get(key);
  if (value === undefined) {
    map.set(key, contents);
    return contents;
  }
  return value;
}
function snipLine(line, colno) {
  let newLine = line;
  const lineLength = newLine.length;
  if (lineLength <= 150)
    return newLine;
  if (colno > lineLength)
    colno = lineLength;
  let start = Math.max(colno - 60, 0);
  if (start < 5)
    start = 0;
  let end = Math.min(start + 140, lineLength);
  if (end > lineLength - 5)
    end = lineLength;
  if (end === lineLength)
    start = Math.max(end - 140, 0);
  newLine = newLine.slice(start, end);
  if (start > 0)
    newLine = `...${newLine}`;
  if (end < lineLength)
    newLine += "...";
  return newLine;
}

// ../../node_modules/.bun/posthog-node@5.34.2+63120419cc93e79b/node_modules/posthog-node/dist/extensions/error-tracking/modifiers/relative-path.node.mjs
import { isAbsolute, relative, sep as sep2 } from "path";
function createRelativePathModifier(basePath = process.cwd()) {
  const isWindows = sep2 === "\\";
  const toUnix = (p) => isWindows ? p.replace(/\\/g, "/") : p;
  const normalizedBase = toUnix(basePath);
  return async (frames) => {
    for (const frame of frames)
      if (!(!frame.filename || frame.filename.startsWith("node:") || frame.filename.startsWith("data:"))) {
        if (isAbsolute(frame.filename))
          frame.filename = toUnix(relative(normalizedBase, toUnix(frame.filename)));
      }
    return frames;
  };
}

// ../../node_modules/.bun/posthog-node@5.34.2+63120419cc93e79b/node_modules/posthog-node/dist/extensions/error-tracking/autocapture.mjs
function makeUncaughtExceptionHandler(captureFn, onFatalFn) {
  let calledFatalError = false;
  return Object.assign((error) => {
    const userProvidedListenersCount = global.process.listeners("uncaughtException").filter((listener) => listener.name !== "domainUncaughtExceptionClear" && listener._posthogErrorHandler !== true).length;
    const processWouldExit = userProvidedListenersCount === 0;
    captureFn(error, {
      mechanism: {
        type: "onuncaughtexception",
        handled: false
      }
    });
    if (!calledFatalError && processWouldExit) {
      calledFatalError = true;
      onFatalFn(error);
    }
  }, {
    _posthogErrorHandler: true
  });
}
function addUncaughtExceptionListener(captureFn, onFatalFn) {
  globalThis.process?.on("uncaughtException", makeUncaughtExceptionHandler(captureFn, onFatalFn));
}
function addUnhandledRejectionListener(captureFn) {
  globalThis.process?.on("unhandledRejection", (reason) => captureFn(reason, {
    mechanism: {
      type: "onunhandledrejection",
      handled: false
    }
  }));
}

// ../../node_modules/.bun/posthog-node@5.34.2+63120419cc93e79b/node_modules/posthog-node/dist/extensions/error-tracking/index.mjs
var SHUTDOWN_TIMEOUT = 2000;

class ErrorTracking {
  constructor(client, options, _logger) {
    this.client = client;
    this._exceptionAutocaptureEnabled = options.enableExceptionAutocapture || false;
    this._logger = _logger;
    this._rateLimiter = new BucketedRateLimiter({
      refillRate: 1,
      bucketSize: 10,
      refillInterval: 1e4,
      _logger: this._logger
    });
    this.startAutocaptureIfEnabled();
  }
  static isPreviouslyCapturedError(x) {
    return isObject(x) && "__posthog_previously_captured_error" in x && x.__posthog_previously_captured_error === true;
  }
  static async buildEventMessage(error, hint, distinctId, additionalProperties) {
    const properties = {
      ...additionalProperties
    };
    const exceptionProperties = this.errorPropertiesBuilder.buildFromUnknown(error, hint);
    exceptionProperties.$exception_list = await this.errorPropertiesBuilder.modifyFrames(exceptionProperties.$exception_list);
    return {
      event: "$exception",
      distinctId,
      properties: {
        ...exceptionProperties,
        ...properties
      },
      _originatedFromCaptureException: true
    };
  }
  startAutocaptureIfEnabled() {
    if (this.isEnabled()) {
      addUncaughtExceptionListener(this.onException.bind(this), this.onFatalError.bind(this));
      addUnhandledRejectionListener(this.onException.bind(this));
    }
  }
  onException(exception, hint) {
    this.client.addPendingPromise((async () => {
      if (!ErrorTracking.isPreviouslyCapturedError(exception)) {
        const eventMessage = await ErrorTracking.buildEventMessage(exception, hint);
        const exceptionProperties = eventMessage.properties;
        const exceptionType = exceptionProperties?.$exception_list[0]?.type ?? "Exception";
        const isRateLimited = this._rateLimiter.consumeRateLimit(exceptionType);
        if (isRateLimited)
          return void this._logger.info("Skipping exception capture because of client rate limiting.", {
            exception: exceptionType
          });
        return this.client.capture(eventMessage);
      }
    })());
  }
  async onFatalError(exception) {
    console.error(exception);
    await this.client.shutdown(SHUTDOWN_TIMEOUT);
    process.exit(1);
  }
  isEnabled() {
    return !this.client.isDisabled && this._exceptionAutocaptureEnabled;
  }
  shutdown() {
    this._rateLimiter.stop();
  }
}

// ../../node_modules/.bun/posthog-node@5.34.2+63120419cc93e79b/node_modules/posthog-node/dist/client.mjs
var _emittedDeprecations = new Set;

// ../../node_modules/.bun/posthog-node@5.34.2+63120419cc93e79b/node_modules/posthog-node/dist/extensions/sentry-integration.mjs
var NAME = "posthog-node";
function createEventProcessor(_posthog, { organization, projectId, prefix, severityAllowList = [
  "error"
], sendExceptionsToPostHog = true } = {}) {
  return (event) => {
    const shouldProcessLevel = severityAllowList === "*" || severityAllowList.includes(event.level);
    if (!shouldProcessLevel)
      return event;
    if (!event.tags)
      event.tags = {};
    const userId = event.tags[PostHogSentryIntegration.POSTHOG_ID_TAG];
    if (userId === undefined)
      return event;
    const uiHost = _posthog.options.host ?? "https://us.i.posthog.com";
    const personUrl = new URL(`/project/${_posthog.apiKey}/person/${userId}`, uiHost).toString();
    event.tags["PostHog Person URL"] = personUrl;
    const exceptions = event.exception?.values || [];
    const exceptionList = exceptions.map((exception) => ({
      ...exception,
      stacktrace: exception.stacktrace ? {
        ...exception.stacktrace,
        type: "raw",
        frames: (exception.stacktrace.frames || []).map((frame) => ({
          ...frame,
          platform: "node:javascript"
        }))
      } : undefined
    }));
    const properties = {
      $exception_message: exceptions[0]?.value || event.message,
      $exception_type: exceptions[0]?.type,
      $exception_level: event.level,
      $exception_list: exceptionList,
      $sentry_event_id: event.event_id,
      $sentry_exception: event.exception,
      $sentry_exception_message: exceptions[0]?.value || event.message,
      $sentry_exception_type: exceptions[0]?.type,
      $sentry_tags: event.tags
    };
    if (organization && projectId)
      properties["$sentry_url"] = (prefix || "https://sentry.io/organizations/") + organization + "/issues/?project=" + projectId + "&query=" + event.event_id;
    if (sendExceptionsToPostHog)
      _posthog.capture({
        event: "$exception",
        distinctId: userId,
        properties
      });
    return event;
  };
}
class PostHogSentryIntegration {
  static #_ = this.POSTHOG_ID_TAG = "posthog_distinct_id";
  constructor(_posthog, organization, prefix, severityAllowList, sendExceptionsToPostHog) {
    this.name = NAME;
    this.name = NAME;
    this.setupOnce = function(addGlobalEventProcessor, getCurrentHub) {
      const projectId = getCurrentHub()?.getClient()?.getDsn()?.projectId;
      addGlobalEventProcessor(createEventProcessor(_posthog, {
        organization,
        projectId,
        prefix,
        severityAllowList,
        sendExceptionsToPostHog: sendExceptionsToPostHog ?? true
      }));
    };
  }
}
// ../../node_modules/.bun/posthog-node@5.34.2+63120419cc93e79b/node_modules/posthog-node/dist/entrypoints/index.node.mjs
ErrorTracking.errorPropertiesBuilder = new exports_error_tracking.ErrorPropertiesBuilder([
  new exports_error_tracking.EventCoercer,
  new exports_error_tracking.ErrorCoercer,
  new exports_error_tracking.ObjectCoercer,
  new exports_error_tracking.StringCoercer,
  new exports_error_tracking.PrimitiveCoercer
], exports_error_tracking.createStackParser("node:javascript", exports_error_tracking.nodeStackLineParser), [
  createModulerModifier(),
  addSourceContext,
  createRelativePathModifier()
]);
// ../../packages/plugin-common/src/analytics/events.ts
var AUTH_DEVICE_CODE_INITIATION_FAILED = "auth_device_code_initiation_failed";
var AUTH_DEVICE_CODE_POLLING_FAILED = "auth_device_code_polling_failed";
var AUTH_AGENT_PROVISIONING_FAILED = "auth_agent_provisioning_failed";
var AUTH_SESSION_LOAD_FAILED = "auth_session_load_failed";
var AUTH_SESSION_CLEAR_FAILED = "auth_session_clear_failed";
var AUTH_SESSION_SAVE_FAILED = "auth_session_save_failed";
var SYNC_NOT_AUTHENTICATED = "sync_not_authenticated";
var SYNC_CHAT_UPLOAD_FAILED = "sync_chat_upload_failed";
var SYNC_NETWORK_ERROR = "sync_network_error";
var SYNC_SERVER_OVERLOAD = "sync_server_overload";
var SYNC_DATA_ERROR = "sync_data_error";
var SYNC_AUTH_ERROR = "sync_auth_error";
var SYNC_BLOCKED_NO_WORKSPACE = "sync_blocked_no_workspace";
var SYNC_STUCK = "sync_stuck";
var AUTH_SESSION_METADATA_LOST = "auth_session_metadata_lost";
var QUEUE_READ_CORRUPTED = "queue_read_corrupted";
var QUEUE_WRITE_FAILED = "queue_write_failed";
var FILE_LOCK_TIMEOUT = "file_lock_timeout";
var FILE_LOCK_CREATE_FAILED = "file_lock_create_failed";
var NOTIFICATION_STATE_WRITE_FAILED = "notification_state_write_failed";
var QUEUE_CAP_EVICTION = "queue_cap_eviction";
var QUEUE_LEGACY_ENTRIES_DROPPED = "queue_legacy_entries_dropped";
var QUEUE_MISMATCHED_ENTRIES_PURGED = "queue_mismatched_entries_purged";
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
  SYNC_CHAT_UPLOAD_FAILED,
  SYNC_NETWORK_ERROR,
  SYNC_SERVER_OVERLOAD,
  SYNC_DATA_ERROR,
  SYNC_AUTH_ERROR,
  SYNC_BLOCKED_NO_WORKSPACE,
  SYNC_STUCK,
  QUEUE_READ_CORRUPTED,
  QUEUE_WRITE_FAILED,
  QUEUE_CAP_EVICTION,
  QUEUE_LEGACY_ENTRIES_DROPPED,
  QUEUE_MISMATCHED_ENTRIES_PURGED,
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
// ../../packages/plugin-common/src/analytics/anonymous-id.ts
var cachedIds = new Map;

// ../../packages/plugin-common/src/analytics/properties.ts
import { release } from "node:os";
function buildStandardProperties(version2) {
  return {
    plugin_version: version2,
    node_version: process.version,
    os_platform: process.platform,
    os_version: release()
  };
}
function buildUserProperties(session) {
  if (!session)
    return {};
  return {
    user_id: session.userId,
    email: session.email,
    workspace_id: session.workspaceId,
    workspace_name: session.workspaceName
  };
}

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

// ../../packages/plugin-common/src/auth/session-io.ts
import { mkdir as mkdir2, readFile, unlink, writeFile } from "node:fs/promises";
import { dirname as dirname2 } from "node:path";
async function readSessionFile(filePath) {
  try {
    const content = await readFile(filePath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    if (error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}
async function writeSessionFile(filePath, session) {
  await mkdir2(dirname2(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(session, null, 2), {
    encoding: "utf-8",
    mode: 384
  });
}
async function deleteSessionFile(filePath) {
  try {
    await unlink(filePath);
  } catch (error) {
    if (error.code === "ENOENT") {
      return;
    }
    throw error;
  }
}
function isSessionStructureValid(session) {
  return Boolean(session.accessToken && session.refreshToken && session.userId && session.email);
}
function isRefreshTokenExpired(session) {
  return Boolean(session.refreshTokenExpiresAt && session.refreshTokenExpiresAt < Date.now());
}

// ../../packages/plugin-common/src/auth/session-manager.ts
function createSessionManager(config) {
  const { sessionFilePath, logger: logger2, onError } = config;
  const withFileLock = resolveFileLock(config.withFileLock);
  async function loadSession() {
    try {
      const session = await readSessionFile(sessionFilePath);
      if (!session)
        return null;
      if (!isSessionStructureValid(session)) {
        logger2?.warn("Invalid session structure, clearing session");
        await clearSession("invalid_structure");
        return null;
      }
      return session;
    } catch (error) {
      logger2?.error("Failed to load session file", error);
      if (error instanceof Error)
        onError?.(error, "load");
      return null;
    }
  }
  async function saveSession(session) {
    try {
      await withFileLock(sessionFilePath, async () => {
        await writeSessionFile(sessionFilePath, session);
      });
      logger2?.info("Session saved successfully");
    } catch (error) {
      logger2?.error("Failed to save session", error);
      if (error instanceof Error)
        onError?.(error, "save");
      throw error;
    }
  }
  async function clearSession(reason = "unspecified") {
    try {
      await deleteSessionFile(sessionFilePath);
      logger2?.info("Session cleared", { reason });
    } catch (error) {
      logger2?.error("Failed to clear session", error);
      if (error instanceof Error)
        onError?.(error, "clear");
      throw error;
    }
  }
  async function getValidSession() {
    const session = await loadSession();
    if (!session) {
      logger2?.debug("getValidSession: No session found");
      return null;
    }
    if (isRefreshTokenExpired(session)) {
      logger2?.warn("getValidSession: Refresh token expired, user must re-authenticate");
      await clearSession("refresh_expired");
      return null;
    }
    return session;
  }
  async function reconcileWorkspaceName(session, workspaces) {
    if (!session.workspaceId)
      return session.workspaceName;
    const current = workspaces.find((ws) => ws.id === session.workspaceId);
    if (!current)
      return session.workspaceName;
    if (current.name !== session.workspaceName) {
      try {
        await updateWorkspaceInSession(current.id, current.name);
      } catch (error) {
        logger2?.debug("Failed to update workspace name in session (non-critical)", error);
      }
    }
    return current.name;
  }
  async function updateWorkspaceInSession(workspaceId, workspaceName) {
    try {
      await withFileLock(sessionFilePath, async () => {
        const session = await readSessionFile(sessionFilePath);
        if (!session) {
          logger2?.debug("Cannot update workspace: session file does not exist");
          return;
        }
        if (!isSessionStructureValid(session)) {
          throw new Error("Cannot update workspace: session file has invalid structure");
        }
        session.workspaceId = workspaceId;
        session.workspaceName = workspaceName;
        await writeSessionFile(sessionFilePath, session);
      });
      logger2?.info("Workspace metadata updated in session");
    } catch (error) {
      logger2?.error("Failed to update workspace in session", error);
      if (error instanceof Error)
        onError?.(error, "save");
      throw error;
    }
  }
  async function clearSessionIfStale(staleRefreshToken) {
    const current = await loadSession();
    if (current && current.refreshToken === staleRefreshToken) {
      await clearSession("stale_refresh");
    } else {
      logger2?.info("Session refresh token changed on disk, skipping clear");
    }
  }
  return {
    loadSession,
    saveSession,
    clearSession,
    clearSessionIfStale,
    getValidSession,
    reconcileWorkspaceName,
    updateWorkspaceInSession,
    getSessionFilePath: () => sessionFilePath
  };
}

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
var LOG_RETENTION_DAYS = 7;

// ../../packages/plugin-common/src/logger/logger.ts
import { appendFile } from "node:fs/promises";
import { dirname as dirname3 } from "node:path";
var levels = { debug: 0, info: 1, warn: 2, error: 3 };
var pendingWrites = new Set;
async function flushLogs() {
  await Promise.all([...pendingWrites]);
}
var beforeExitRegistered = false;
function registerBeforeExit() {
  if (beforeExitRegistered)
    return;
  beforeExitRegistered = true;
  process.on("beforeExit", () => {
    flushLogs();
  });
}
function formatArgs(args) {
  if (args.length === 0)
    return "";
  return ` ${args.map((a) => a instanceof Error ? a.message : JSON.stringify(a)).join(" ")}`;
}
function writeToFile(rotation, logPrefix, level, message, args) {
  const task = (async () => {
    try {
      const logFilePath = rotation.getDatedLogPath(logPrefix);
      await ensureDirectory(dirname3(logFilePath));
      const timestamp = new Date().toISOString();
      await appendFile(logFilePath, `[${timestamp}] ${level}: ${message}${formatArgs(args)}
`);
      rotation.cleanupStaleLogs(logPrefix);
    } catch {}
  })();
  pendingWrites.add(task);
  task.finally(() => pendingWrites.delete(task));
}
function createLogger2(config) {
  const { prefix, logRotation, logPrefix = "plugin" } = config;
  let minLevel = "info";
  registerBeforeExit();
  const logger2 = {
    setLevel(level) {
      minLevel = level;
    },
    debug(message, ...args) {
      if (levels.debug >= levels[minLevel]) {
        writeToFile(logRotation, logPrefix, "DEBUG", message, args);
      }
    },
    info(message, ...args) {
      if (levels.info >= levels[minLevel]) {
        writeToFile(logRotation, logPrefix, "INFO", message, args);
      }
    },
    warn(message, ...args) {
      if (levels.warn >= levels[minLevel]) {
        console.warn(`[${prefix}:Warn] ${message}`, ...args);
        writeToFile(logRotation, logPrefix, "WARN", message, args);
      }
    },
    error(message, error) {
      if (levels.error >= levels[minLevel]) {
        console.error(`[${prefix}:Error] ${message}`, error ?? "");
        writeToFile(logRotation, logPrefix, "ERROR", message, error === undefined ? [] : [error]);
      }
    }
  };
  return { logger: logger2, flushLogs };
}
// ../../packages/plugin-common/src/log-rotation/log-rotation.ts
import { readdir, unlink as unlink2 } from "node:fs/promises";
import { join as join2 } from "node:path";
var CLEANUP_THROTTLE_MS = 60 * 60 * 1000;
function getDateString() {
  return new Date().toISOString().split("T")[0];
}
function getDatedLogPath(logsDir, logPrefix) {
  const dateStr = getDateString();
  return join2(logsDir, `${logPrefix}-${dateStr}.log`);
}
function parseDateFromFilename(filename, logPrefix) {
  const pattern = new RegExp(`^${logPrefix}-(\\d{4}-\\d{2}-\\d{2})\\.log$`);
  const match = filename.match(pattern);
  if (!match) {
    return null;
  }
  const date = new Date(match[1] + "T00:00:00Z");
  return Number.isNaN(date.getTime()) ? null : date;
}
function createLogRotation(config) {
  const { logsDir, retentionDays, logger: logger2 } = config;
  const lastCleanupTime = {};
  async function cleanupStaleLogs(logPrefix) {
    const now = Date.now();
    const lastCleanup = lastCleanupTime[logPrefix] || 0;
    if (now - lastCleanup < CLEANUP_THROTTLE_MS) {
      return;
    }
    lastCleanupTime[logPrefix] = now;
    try {
      await ensureDirectory(logsDir);
      const files = await readdir(logsDir);
      const cutoffDate = new Date(now - retentionDays * 24 * 60 * 60 * 1000);
      for (const file of files) {
        const fileDate = parseDateFromFilename(file, logPrefix);
        if (fileDate && fileDate < cutoffDate) {
          const filePath = join2(logsDir, file);
          try {
            await unlink2(filePath);
          } catch (error) {
            logger2?.error(`Failed to delete old log file ${file}`, error);
          }
        }
      }
    } catch (error) {
      logger2?.error("Failed to cleanup old logs", error);
    }
  }
  async function forceCleanupStaleLogs(logPrefix) {
    lastCleanupTime[logPrefix] = 0;
    await cleanupStaleLogs(logPrefix);
  }
  return { cleanupStaleLogs, forceCleanupStaleLogs };
}

// src/log-rotation/log-rotation.ts
function getDatedLogPath2(logPrefix) {
  return getDatedLogPath(LOGS_DIR, logPrefix);
}
var logRotation = createLogRotation({
  logsDir: LOGS_DIR,
  retentionDays: LOG_RETENTION_DAYS
});
var { cleanupStaleLogs, forceCleanupStaleLogs } = logRotation;

// src/utils/logger.ts
var created = createLogger2({
  prefix: "Zest",
  logRotation: { getDatedLogPath: getDatedLogPath2, cleanupStaleLogs }
});
var logger2 = created.logger;
var flushLogger = created.flushLogs;

// src/auth/session-manager.ts
var sessionManager = createSessionManager({
  sessionFilePath: SESSION_FILE,
  logger: logger2
});
var {
  loadSession,
  saveSession,
  clearSession,
  getValidSession,
  reconcileWorkspaceName,
  updateWorkspaceInSession
} = sessionManager;

// src/utils/plugin-version.ts
function getPluginVersion() {
  return "0.1.4";
}

// src/analytics/client.ts
async function defaultSessionLoader() {
  return await loadSession();
}
async function resolveSession(load = () => defaultSessionLoader()) {
  try {
    return await load();
  } catch (error) {
    logger2.debug("Could not load session for analytics context", error);
    return null;
  }
}
function enrichProperties(session, extra) {
  return {
    ...buildStandardProperties(getPluginVersion()),
    ...buildUserProperties(session),
    ...extra
  };
}

// src/analytics/client.test.ts
var SESSION = {
  accessToken: "access",
  refreshToken: "refresh",
  userId: "user-abc",
  email: "dev@example.com",
  workspaceId: "ws-1",
  workspaceName: "Zest"
};
describe("resolveSession", () => {
  test("reads the session on every call instead of caching the first one", async () => {
    const sessions = [
      SESSION,
      { ...SESSION, userId: "user-xyz", email: "other@example.com" },
      null
    ];
    let call = 0;
    const load = async () => sessions[call++] ?? null;
    expect((await resolveSession(load))?.userId).toBe("user-abc");
    expect((await resolveSession(load))?.userId).toBe("user-xyz");
    expect(await resolveSession(load)).toBeNull();
    expect(call).toBe(3);
  });
  test("picks up a session that appears after the process started", async () => {
    let onDisk = null;
    const load = async () => onDisk;
    expect(await resolveSession(load)).toBeNull();
    onDisk = SESSION;
    expect((await resolveSession(load))?.userId).toBe("user-abc");
  });
  test("degrades to no session when the loader throws, never propagating", async () => {
    const load = async () => {
      throw new Error("session file unreadable");
    };
    expect(await resolveSession(load)).toBeNull();
  });
});
describe("enrichProperties", () => {
  test("carries the identifying fields of the session it is given", () => {
    const properties = enrichProperties(SESSION);
    expect(properties).toMatchObject({
      user_id: "user-abc",
      email: "dev@example.com",
      workspace_id: "ws-1",
      workspace_name: "Zest"
    });
  });
  test("reflects a workspace switch rather than a stale workspace", () => {
    const switched = enrichProperties({ ...SESSION, workspaceId: "ws-2", workspaceName: "Second" });
    expect(switched).toMatchObject({ workspace_id: "ws-2", workspace_name: "Second" });
  });
  test("attaches no identity at all without a session", () => {
    const properties = enrichProperties(null);
    expect(properties).not.toHaveProperty("user_id");
    expect(properties).not.toHaveProperty("email");
    expect(properties).not.toHaveProperty("workspace_id");
  });
  test("keeps caller properties and the standard environment fields", () => {
    const properties = enrichProperties(null, { error_type: "sync_not_authenticated" });
    expect(properties.error_type).toBe("sync_not_authenticated");
    expect(properties).toHaveProperty("os_platform");
    expect(properties).toHaveProperty("plugin_version");
  });
});
