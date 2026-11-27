#!/usr/bin/env node
import"../chunk-68v7wrd3.js";import{e}from"../chunk-3cy9ceqd.js";import{me}from"../chunk-n843em6g.js";async function s(){try{let o=process.argv[2];if(!o)console.log("❌ No session ID provided"),process.exit(1);if(!await me(o)){console.log("✓ This session is already ignored"),console.log(`   id: ${o}`);return}console.log("✅ Session ignored"),console.log(`   id: ${o}`),console.log(""),console.log("\uD83D\uDEAB This session will no longer be synced or included in standups"),console.log("\uD83D\uDCA1 Use /zest_unignore to reverse")}catch(o){e.error("Failed to ignore session",o),console.error("❌ Failed to ignore session: "+(o instanceof Error?o.message:"Unknown error")),process.exit(1)}}s();

//# debugId=26D1F8A1B451710F64756E2164756E21
