#!/usr/bin/env node
import"../chunk-2g5dx4dg.js";import{e}from"../chunk-tn04xezw.js";import{ye}from"../chunk-gfcmqeyr.js";async function s(){try{let o=process.argv[2];if(!o)console.log("❌ No session ID provided"),process.exit(1);if(!await ye(o)){console.log("✓ This session is not in the ignore list"),console.log(`   id: ${o}`);return}console.log("✅ Session unignored"),console.log(`   id: ${o}`),console.log(""),console.log("\uD83D\uDCCA This session will be synced and included in standups again")}catch(o){e.error("Failed to unignore session",o),console.error("❌ Failed to unignore session: "+(o instanceof Error?o.message:"Unknown error")),process.exit(1)}}s();

//# debugId=DDE1B4775DA712CE64756E2164756E21
