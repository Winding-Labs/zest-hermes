#!/usr/bin/env node
import"../chunk-yr9x52ks.js";import{e}from"../chunk-9daynpjh.js";import{p}from"../chunk-d5ej799t.js";async function r(){try{let o=await p();if(o.size===0){console.log("No ignored sessions");return}console.log(`Ignored sessions (${o.size}):`);for(let s of o)console.log(`  - ${s}`)}catch(o){e.error("Failed to list ignored sessions",o),console.error("❌ Failed to list ignored sessions: "+(o instanceof Error?o.message:"Unknown error")),process.exit(1)}}r();

//# debugId=DE88B10751E37F1764756E2164756E21
