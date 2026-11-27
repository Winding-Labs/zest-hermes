#!/usr/bin/env node
import"../chunk-68v7wrd3.js";import{e,r}from"../chunk-3cy9ceqd.js";import{fe}from"../chunk-a830exve.js";import{tt}from"../chunk-r3atyj7h.js";async function i(){try{let o=await r.auth.identity();if(!o){console.log("ℹ️  Not authenticated");return}await fe();let t=await r.auth.logout();if(e.info("auth_logout"),console.log(`✅ Signed out (${o.email})`),!t)console.log(tt)}catch(o){if(e.error("Logout failed",o),console.error("❌ Logout failed"),o instanceof Error)console.error(`   ${o.message}`);process.exit(1)}}i();

//# debugId=52DF2E55DF74434B64756E2164756E21
