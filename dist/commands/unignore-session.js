#!/usr/bin/env node
import"../chunk-68v7wrd3.js";import{e}from"../chunk-3cy9ceqd.js";import{_e}from"../chunk-n843em6g.js";async function s(){try{let o=process.argv[2];if(!o)console.log("❌ No session ID provided"),process.exit(1);if(!await _e(o)){console.log("✓ This session is not in the ignore list"),console.log(`   id: ${o}`);return}console.log("✅ Session unignored"),console.log(`   id: ${o}`),console.log(""),console.log("\uD83D\uDCCA This session will be synced and included in standups again")}catch(o){e.error("Failed to unignore session",o),console.error("❌ Failed to unignore session: "+(o instanceof Error?o.message:"Unknown error")),process.exit(1)}}s();

//# debugId=1D81C7E781A1A43064756E2164756E21
