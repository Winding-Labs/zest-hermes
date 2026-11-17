import{b}from"./chunk-yr9x52ks.js";import{e}from"./chunk-9daynpjh.js";import{readdirSync as m,readFileSync as c}from"node:fs";import{join as l}from"node:path";var _=l(b,"skills"),a=l(b,"hermes-agent","skills"),y=l(b,"memories","MEMORY.md"),f=l(b,"memories","USER.md"),g=`
§
`;function u(n){let r=0;try{let t=m(n,{withFileTypes:!0});for(let o of t)if(o.isDirectory())r+=u(l(n,o.name));else if(o.name==="SKILL.md")r++}catch(t){e.debug("inventory_skills_dir_unreadable",{dir:n,error:t})}return r}function s(n){try{return c(n,"utf-8")}catch(r){return e.debug("inventory_file_unreadable",{path:n,error:r}),null}}function i(n){return n.split(g).filter((r)=>r.trim().length>0).length}function C(){let n=u(_)+u(a),r=s(y),t=s(f);return{available_skills_count:n>0?n:null,memory_chars:r?.length??null,memory_entry_count:r?i(r):null,user_entry_count:t?i(t):null,user_chars:t?.length??null}}
export{C};

//# debugId=FFDB88CE5B94612064756E2164756E21
