#!/usr/bin/env node
import"../chunk-yr9x52ks.js";import{e}from"../chunk-9daynpjh.js";import{ue}from"../chunk-d5ej799t.js";async function s(){try{let o=process.argv[2];if(!o)console.log("❌ No session ID provided"),process.exit(1);if(!await ue(o)){console.log("✓ This session is not in the ignore list"),console.log(`   id: ${o}`);return}console.log("✅ Session unignored"),console.log(`   id: ${o}`),console.log(""),console.log("\uD83D\uDCCA This session will be synced and included in standups again")}catch(o){e.error("Failed to unignore session",o),console.error("❌ Failed to unignore session: "+(o instanceof Error?o.message:"Unknown error")),process.exit(1)}}s();

//# debugId=127A67337B522BBA64756E2164756E21
