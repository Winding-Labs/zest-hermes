#!/usr/bin/env node
import"../chunk-2g5dx4dg.js";import{e,r}from"../chunk-tn04xezw.js";import{le}from"../chunk-5qzc8qes.js";import{qe}from"../chunk-21xarvj2.js";async function i(){try{let o=await r.auth.identity();if(!o){console.log("ℹ️  Not authenticated");return}await le();let t=await r.auth.logout();if(e.info("auth_logout"),console.log(`✅ Signed out (${o.email})`),!t)console.log(qe)}catch(o){if(e.error("Logout failed",o),console.error("❌ Logout failed"),o instanceof Error)console.error(`   ${o.message}`);process.exit(1)}}i();

//# debugId=228A9C74DC10B07564756E2164756E21
