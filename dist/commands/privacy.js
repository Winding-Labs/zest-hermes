#!/usr/bin/env node
import{ge}from"../chunk-z9qrs1ch.js";import"../chunk-r3gwqfxc.js";import"../chunk-6zv5fpfm.js";import{e}from"../chunk-73dk5fc3.js";import{l,x}from"../chunk-p5rtvka1.js";import{v}from"../chunk-2f4s2wyh.js";function c(o){let n={};for(let t of o)if(t.startsWith("--approach=")){let s=t.slice(11);if(["detection","encryption","hybrid"].includes(s))n.approach=s}else if(t.startsWith("--aggressive="))n.aggressive=t.slice(13)==="true";else if(t.startsWith("--gitignore="))n.gitignore=t.slice(12)==="true";else if(t.startsWith("--zest-rules="))n.zestRules=t.slice(13)==="true";else if(t.startsWith("--exclude="))n.exclude=t.slice(10).replace(/^["']|["']$/g,"");else if(t.startsWith("--remove-exclude="))n.removeExclude=t.slice(17).replace(/^["']|["']$/g,"");return n}function g(o){if(console.log(`
\uD83D\uDD12 Privacy Settings
`),console.log(`${{detection:"\uD83D\uDD0D",encryption:"\uD83D\uDD10",hybrid:"\uD83D\uDD04"}[o.approach]} Approach: ${o.approach}`),console.log(`${o.aggressiveMode?"⚡":"\uD83C\uDF3F"} Aggressive mode: ${o.aggressiveMode?"enabled":"disabled"}`),console.log(`${o.enableGitignore?"✅":"❌"} Respect .gitignore: ${o.enableGitignore?"yes":"no"}`),console.log(`${o.enableZestRules?"✅":"❌"} Respect .zest.rules: ${o.enableZestRules?"yes":"no"}`),o.customExclusionPatterns.length>0){console.log(`
\uD83D\uDCC1 Custom exclusion patterns (${o.customExclusionPatterns.length}):`);for(let i of o.customExclusionPatterns)console.log(`   - ${i}`)}else console.log(`
\uD83D\uDCC1 Custom exclusion patterns: none`);let s=v().getStats();if(s)console.log(`
\uD83D\uDCCA Session stats:`),console.log(`   - Detections: ${s.totalDetections}`),console.log(`   - Files processed: ${s.filesProcessed}`),console.log(`   - Files excluded: ${s.filesExcluded}`);console.log(`
\uD83D\uDCA1 Use --help to see available options
`)}function d(){console.log(`
\uD83D\uDD12 Privacy Settings Command

Usage: /zest_privacy [options]

Options:
  --approach=<value>       Set privacy approach
                           - detection  - Detect and redact sensitive data
                           - encryption - Encrypt sensitive data (AES-256)
                           - hybrid     - Encrypt highly sensitive, redact others

  --aggressive=<bool>      Enable/disable aggressive detection mode
                           - true  - More patterns, may have false positives
                           - false - Default patterns only (recommended)

  --gitignore=<bool>       Respect .gitignore for file exclusion
                           - true  - Skip files matching .gitignore patterns
                           - false - Process all files

  --zest-rules=<bool>      Respect .zest.rules for file exclusion
                           - true  - Use project .zest.rules file
                           - false - Ignore .zest.rules

  --exclude=<pattern>      Add a custom glob exclusion pattern
                           Example: --exclude="*.secret.js"

  --remove-exclude=<pat>   Remove a custom exclusion pattern
                           Example: --remove-exclude="*.log"

Examples:
  /zest_privacy                           # View current settings
  /zest_privacy --aggressive=true         # Enable aggressive detection
  /zest_privacy --exclude="secrets/**"    # Exclude secrets directory
  /zest_privacy --approach=hybrid         # Use hybrid approach
`)}async function p(){let o=process.argv.slice(2);if(o.includes("--help")||o.includes("-h")){d();return}try{let n=await l(),t=n.privacy??{...ge},s=c(o);if(Object.keys(s).length===0){g(t);return}let i=[];if(s.approach!==void 0)t.approach=s.approach,i.push(`approach -> ${s.approach}`);if(s.aggressive!==void 0)t.aggressiveMode=s.aggressive,i.push(`aggressive mode -> ${s.aggressive?"enabled":"disabled"}`);if(s.gitignore!==void 0)t.enableGitignore=s.gitignore,i.push(`.gitignore respect -> ${s.gitignore?"enabled":"disabled"}`);if(s.zestRules!==void 0)t.enableZestRules=s.zestRules,i.push(`.zest.rules respect -> ${s.zestRules?"enabled":"disabled"}`);if(s.exclude)if(!t.customExclusionPatterns.includes(s.exclude))t.customExclusionPatterns.push(s.exclude),i.push(`added exclusion: ${s.exclude}`);else console.log(`ℹ️  Pattern already exists: ${s.exclude}`);if(s.removeExclude){let r=t.customExclusionPatterns.indexOf(s.removeExclude);if(r!==-1)t.customExclusionPatterns.splice(r,1),i.push(`removed exclusion: ${s.removeExclude}`);else console.log(`ℹ️  Pattern not found: ${s.removeExclude}`)}if(i.length>0){n.privacy=t,await x(n),console.log(`✅ Privacy settings updated:
`);for(let a of i)console.log(`   - ${a}`);let r=v();if(r.isInitialized())await r.updateSettings(t),console.log(`
\uD83D\uDD04 Privacy manager reloaded with new settings`);console.log(`
\uD83D\uDCA1 Changes take effect on the next extraction
`)}}catch(n){e.error("Failed to update privacy settings",n),console.error("❌ Failed to update privacy settings: "+(n instanceof Error?n.message:"Unknown error")),process.exit(1)}}p();
