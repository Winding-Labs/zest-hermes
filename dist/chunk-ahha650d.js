import{T}from"./chunk-wxrcde7h.js";import{readdirSync as i,readFileSync as c}from"node:fs";import{join as e}from"node:path";var m=e(T,"skills"),_=e(T,"hermes-agent","skills"),a=e(T,"memories","MEMORY.md"),y=e(T,"memories","USER.md"),f=`
§
`;function o(n){let t=0;try{let r=i(n,{withFileTypes:!0});for(let l of r)if(l.isDirectory())t+=o(e(n,l.name));else if(l.name==="SKILL.md")t++}catch{}return t}function u(n){try{return c(n,"utf-8")}catch{return null}}function s(n){return n.split(f).filter((t)=>t.trim().length>0).length}function V(){let n=o(m)+o(_),t=u(a),r=u(y);return{available_skills_count:n>0?n:null,memory_chars:t?.length??null,memory_entry_count:t?s(t):null,user_entry_count:r?s(r):null,user_chars:r?.length??null}}
export{V};
