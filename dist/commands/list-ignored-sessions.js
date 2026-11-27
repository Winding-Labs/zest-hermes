#!/usr/bin/env node
import"../chunk-68v7wrd3.js";import{e}from"../chunk-3cy9ceqd.js";import{f}from"../chunk-n843em6g.js";async function r(){try{let o=await f();if(o.size===0){console.log("No ignored sessions");return}console.log(`Ignored sessions (${o.size}):`);for(let s of o)console.log(`  - ${s}`)}catch(o){e.error("Failed to list ignored sessions",o),console.error("❌ Failed to list ignored sessions: "+(o instanceof Error?o.message:"Unknown error")),process.exit(1)}}r();

//# debugId=BE6C98884F779BED64756E2164756E21
