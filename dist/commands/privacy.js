#!/usr/bin/env node
import{Na as c,Pa as g}from"../chunk-9pt19t16.js";import{Tb as a}from"../chunk-h7xvd0mn.js";import"../chunk-g0d0jsnj.js";import"../chunk-w54cnhzs.js";import"../chunk-8f17f647.js";import{Yc as r}from"../chunk-05pbbjzv.js";import{hd as l}from"../chunk-8g1a4231.js";import"../chunk-99vkbd8m.js";function p(t){let o={};for(let s of t)if(s.startsWith("--approach=")){let e=s.slice(11);if(["detection","encryption","hybrid"].includes(e))o.approach=e}else if(s.startsWith("--aggressive="))o.aggressive=s.slice(13)==="true";else if(s.startsWith("--gitignore="))o.gitignore=s.slice(12)==="true";else if(s.startsWith("--zest-rules="))o.zestRules=s.slice(13)==="true";else if(s.startsWith("--exclude="))o.exclude=s.slice(10).replace(/^["']|["']$/g,"");else if(s.startsWith("--remove-exclude="))o.removeExclude=s.slice(17).replace(/^["']|["']$/g,"");return o}function u(t){if(console.log(`
\uD83D\uDD12 Privacy Settings
`),console.log(`${{detection:"\uD83D\uDD0D",encryption:"\uD83D\uDD10",hybrid:"\uD83D\uDD04"}[t.approach]} Approach: ${t.approach}`),console.log(`${t.aggressiveMode?"⚡":"\uD83C\uDF3F"} Aggressive mode: ${t.aggressiveMode?"enabled":"disabled"}`),console.log(`${t.enableGitignore?"✅":"❌"} Respect .gitignore: ${t.enableGitignore?"yes":"no"}`),console.log(`${t.enableZestRules?"✅":"❌"} Respect .zest.rules: ${t.enableZestRules?"yes":"no"}`),t.customExclusionPatterns.length>0){console.log(`
\uD83D\uDCC1 Custom exclusion patterns (${t.customExclusionPatterns.length}):`);for(let n of t.customExclusionPatterns)console.log(`   - ${n}`)}else console.log(`
\uD83D\uDCC1 Custom exclusion patterns: none`);let e=r().getStats();if(e)console.log(`
\uD83D\uDCCA Session stats:`),console.log(`   - Detections: ${e.totalDetections}`),console.log(`   - Files processed: ${e.filesProcessed}`),console.log(`   - Files excluded: ${e.filesExcluded}`);console.log(`
\uD83D\uDCA1 Use --help to see available options
`)}function h(){console.log(`
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
`)}async function f(){let t=process.argv.slice(2);if(t.includes("--help")||t.includes("-h")){h();return}try{let o=await c(),s=o.privacy??{...l},e=p(t);if(Object.keys(e).length===0){u(s);return}let n=[];if(e.approach!==void 0)s.approach=e.approach,n.push(`approach -> ${e.approach}`);if(e.aggressive!==void 0)s.aggressiveMode=e.aggressive,n.push(`aggressive mode -> ${e.aggressive?"enabled":"disabled"}`);if(e.gitignore!==void 0)s.enableGitignore=e.gitignore,n.push(`.gitignore respect -> ${e.gitignore?"enabled":"disabled"}`);if(e.zestRules!==void 0)s.enableZestRules=e.zestRules,n.push(`.zest.rules respect -> ${e.zestRules?"enabled":"disabled"}`);if(e.exclude)if(!s.customExclusionPatterns.includes(e.exclude))s.customExclusionPatterns.push(e.exclude),n.push(`added exclusion: ${e.exclude}`);else console.log(`ℹ️  Pattern already exists: ${e.exclude}`);if(e.removeExclude){let i=s.customExclusionPatterns.indexOf(e.removeExclude);if(i!==-1)s.customExclusionPatterns.splice(i,1),n.push(`removed exclusion: ${e.removeExclude}`);else console.log(`ℹ️  Pattern not found: ${e.removeExclude}`)}if(n.length>0){o.privacy=s,await g(o),console.log(`✅ Privacy settings updated:
`);for(let d of n)console.log(`   - ${d}`);let i=r();if(i.isInitialized())await i.updateSettings(s),console.log(`
\uD83D\uDD04 Privacy manager reloaded with new settings`);console.log(`
\uD83D\uDCA1 Changes take effect on the next extraction
`)}}catch(o){a.error("Failed to update privacy settings",o),console.error("❌ Failed to update privacy settings: "+(o instanceof Error?o.message:"Unknown error")),process.exit(1)}}f();
