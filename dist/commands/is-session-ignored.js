#!/usr/bin/env node
import"../chunk-2g5dx4dg.js";import{e}from"../chunk-tn04xezw.js";import{me}from"../chunk-gfcmqeyr.js";async function s(){try{let o=process.argv[2];if(!o)console.log("❌ No session ID provided"),process.exit(1);if(await me(o))console.log("\uD83D\uDEAB This session is ignored (not being tracked)"),console.log(`   id: ${o}`),console.log("\uD83D\uDCA1 Use /zest_unignore to re-enable tracking");else console.log("✓ This session is being tracked"),console.log(`   id: ${o}`)}catch(o){e.error("Failed to check session ignore status",o),console.error("❌ Failed to check: "+(o instanceof Error?o.message:"Unknown error")),process.exit(1)}}s();

//# debugId=D7800AA7D55B4E6364756E2164756E21
