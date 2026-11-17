#!/usr/bin/env node
import"../chunk-yr9x52ks.js";import{e}from"../chunk-9daynpjh.js";import{ce}from"../chunk-d5ej799t.js";async function s(){try{let o=process.argv[2];if(!o)console.log("❌ No session ID provided"),process.exit(1);if(!await ce(o)){console.log("✓ This session is already ignored"),console.log(`   id: ${o}`);return}console.log("✅ Session ignored"),console.log(`   id: ${o}`),console.log(""),console.log("\uD83D\uDEAB This session will no longer be synced or included in standups"),console.log("\uD83D\uDCA1 Use /zest_unignore to reverse")}catch(o){e.error("Failed to ignore session",o),console.error("❌ Failed to ignore session: "+(o instanceof Error?o.message:"Unknown error")),process.exit(1)}}s();

//# debugId=F1341A4D6B0F1EE664756E2164756E21
