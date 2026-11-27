#!/usr/bin/env node
import"../chunk-68v7wrd3.js";import{e}from"../chunk-3cy9ceqd.js";import{he}from"../chunk-n843em6g.js";async function s(){try{let o=process.argv[2];if(!o)console.log("❌ No session ID provided"),process.exit(1);if(await he(o))console.log("\uD83D\uDEAB This session is ignored (not being tracked)"),console.log(`   id: ${o}`),console.log("\uD83D\uDCA1 Use /zest_unignore to re-enable tracking");else console.log("✓ This session is being tracked"),console.log(`   id: ${o}`)}catch(o){e.error("Failed to check session ignore status",o),console.error("❌ Failed to check: "+(o instanceof Error?o.message:"Unknown error")),process.exit(1)}}s();

//# debugId=FE4407C7199C0EFA64756E2164756E21
