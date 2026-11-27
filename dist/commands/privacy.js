#!/usr/bin/env node
import{ee,e,y,s,h}from"../chunk-3cy9ceqd.js";import"../chunk-68v7wrd3.js";function v(t){let o={};for(let i of t)if(i.startsWith("--approach=")){let c=i.slice(11);if(["detection","encryption","hybrid"].includes(c))o.approach=c}else if(i.startsWith("--aggressive="))o.aggressive=i.slice(13)==="true";else if(i.startsWith("--gitignore="))o.gitignore=i.slice(12)==="true";else if(i.startsWith("--zest-rules="))o.zestRules=i.slice(13)==="true";else if(i.startsWith("--exclude="))o.exclude=i.slice(10).replace(/^["']|["']$/g,"");else if(i.startsWith("--remove-exclude="))o.removeExclude=i.slice(17).replace(/^["']|["']$/g,"");return o}var f={detection:"\uD83D\uDD0D",encryption:"#️⃣",hybrid:"\uD83D\uDD04"};function m(t,o,i,c){if(console.log(`
\uD83D\uDD12 Privacy Settings
`),console.log(i),console.log(`${t.aggressiveMode?"⚡":"\uD83C\uDF3F"} Aggressive mode: ${t.aggressiveMode?"enabled":"disabled"}`),console.log(`${t.enableGitignore?"✅":"❌"} Respect .gitignore: ${t.enableGitignore?"yes":"no"}`),console.log(`${t.enableZestRules?"✅":"❌"} Respect .zest.rules: ${t.enableZestRules?"yes":"no"}`),t.customExclusionPatterns.length>0){console.log(`
\uD83D\uDCC1 Custom exclusion patterns (${t.customExclusionPatterns.length}):`);for(let l of t.customExclusionPatterns)console.log(`   ${c} ${l}`)}else console.log(`
\uD83D\uDCC1 Custom exclusion patterns: none`);let d=o();if(d)console.log(`
\uD83D\uDCCA Session stats:`),console.log(`   ${c} Detections: ${d.totalDetections}`),console.log(`   ${c} Files processed: ${d.filesProcessed}`),console.log(`   ${c} Files excluded: ${d.filesExcluded}`);console.log(`
\uD83D\uDCA1 Use --help to see available options
`)}function x(t,o){console.log(`
\uD83D\uDD12 Privacy Settings Command

Usage: ${t} [options]

Options:
  --approach=<value>       detection | encryption | hybrid (kept for older settings)
                           Every approach replaces each secret with [REDACTED];
                           none can switch redaction off

  --aggressive=<bool>      Enable/disable aggressive detection mode
                           ${o} true  - More patterns, may have false positives
                           ${o} false - Default patterns only (recommended)

  --gitignore=<bool>       Respect .gitignore for file exclusion
                           ${o} true  - Skip files matching .gitignore patterns
                           ${o} false - Process all files

  --zest-rules=<bool>      Respect .zest.rules for file exclusion
                           ${o} true  - Use project .zest.rules file
                           ${o} false - Ignore .zest.rules

  --exclude=<pattern>      Add a custom glob exclusion pattern
                           Example: --exclude="*.secret.js"

  --remove-exclude=<pat>   Remove a custom exclusion pattern
                           Example: --remove-exclude="*.log"

Examples:
  ${t}                           # View current settings
  ${t} --aggressive=true         # Enable aggressive detection
  ${t} --exclude="secrets/**"    # Exclude secrets directory
  ${t} --approach=hybrid         # Use hybrid approach
`)}function P(t){console.log(`
\uD83D\uDD12 Privacy Settings Command

Usage: ${t} [options]

Options:
  --aggressive=<bool>      Enable/disable aggressive detection mode
  --gitignore=<bool>       Respect .gitignore for file exclusion
  --zest-rules=<bool>      Respect .zest.rules for file exclusion
  --exclude=<pattern>      Add a custom glob exclusion pattern
  --remove-exclude=<pat>   Remove a custom exclusion pattern

Examples:
  ${t}
  ${t} --aggressive=true
  ${t} --exclude="secrets/**"
`)}function u(t){let o=t.editableApproach,i=o?.arrow??"->",c=o?.bullet??"-";function d(l){let n=l.approach??"detection";if(o)return`${f[n]} Approach: ${n}`;return`\uD83D\uDD0D Approach: ${t.showStoredApproach?n:"detection"}`}return async(l=[])=>{if(l.includes("--help")||l.includes("-h")){if(o)x(t.usage,c);else P(t.usage);return}try{let n=await t.loadSettings(),a=n.privacy??{...t.defaultPrivacy},r=v(l);if(!o&&l.some((p)=>p.startsWith("--approach="))){console.log("❌ Approach cannot be changed — detection is the only supported mode"),process.exit(1);return}if(Object.keys(r).length===0){m(a,t.getStats,d(a),c);return}let g=[];if(r.approach!==void 0)a.approach=r.approach,g.push(`approach ${i} ${r.approach}`);if(r.aggressive!==void 0)a.aggressiveMode=r.aggressive,g.push(`aggressive mode ${i} ${r.aggressive?"enabled":"disabled"}`);if(r.gitignore!==void 0)a.enableGitignore=r.gitignore,g.push(`.gitignore respect ${i} ${r.gitignore?"enabled":"disabled"}`);if(r.zestRules!==void 0)a.enableZestRules=r.zestRules,g.push(`.zest.rules respect ${i} ${r.zestRules?"enabled":"disabled"}`);if(r.exclude)if(!a.customExclusionPatterns.includes(r.exclude))a.customExclusionPatterns.push(r.exclude),g.push(`added exclusion: ${r.exclude}`);else console.log(`ℹ️  Pattern already exists: ${r.exclude}`);if(r.removeExclude){let p=a.customExclusionPatterns.indexOf(r.removeExclude);if(p!==-1)a.customExclusionPatterns.splice(p,1),g.push(`removed exclusion: ${r.removeExclude}`);else console.log(`ℹ️  Pattern not found: ${r.removeExclude}`)}if(g.length>0){n.privacy=a,await t.saveSettings(n),console.log(`✅ Privacy settings updated:
`);for(let p of g)console.log(`   ${c} ${p}`);if(o){if(o.privacyManager.isInitialized())await o.privacyManager.updateSettings(a),console.log(`
\uD83D\uDD04 Privacy manager reloaded with new settings`);console.log(`
\uD83D\uDCA1 Changes take effect on the next extraction
`)}}}catch(n){if(t.logger.error("Failed to update privacy settings",n),o)console.error("❌ Failed to update privacy settings: "+(n instanceof Error?n.message:"Unknown error"));else if(console.error("❌ Failed to update privacy settings"),n instanceof Error)console.error(`   ${n.message}`);process.exit(1)}}}var b=u({loadSettings:s,saveSettings:h,logger:e,defaultPrivacy:ee,getStats:()=>y.getStats(),usage:"/zest_privacy",editableApproach:{bullet:"-",arrow:"->",privacyManager:y}});b(process.argv.slice(2));

//# debugId=4D5A8B900CED050F64756E2164756E21
