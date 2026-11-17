#!/usr/bin/env node
import"../chunk-yr9x52ks.js";import{e,r}from"../chunk-9daynpjh.js";import{ne}from"../chunk-rrtj6194.js";import{Ke}from"../chunk-dxjc1gvz.js";async function i(){try{let o=await r.auth.identity();if(!o){console.log("ℹ️  Not authenticated");return}await ne();let t=await r.auth.logout();if(e.info("auth_logout"),console.log(`✅ Signed out (${o.email})`),!t)console.log(Ke)}catch(o){if(e.error("Logout failed",o),console.error("❌ Logout failed"),o instanceof Error)console.error(`   ${o.message}`);process.exit(1)}}i();

//# debugId=C47780B10652CCB264756E2164756E21
