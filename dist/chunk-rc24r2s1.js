import{jc as e}from"./chunk-8f17f647.js";import{readdirSync as c,readFileSync as m}from"node:fs";import{join as l}from"node:path";var _=l(e,"skills"),a=l(e,"hermes-agent","skills"),y=l(e,"memories","MEMORY.md"),f=l(e,"memories","USER.md"),E=`
§
`;function u(n){let t=0;try{let r=c(n,{withFileTypes:!0});for(let o of r)if(o.isDirectory())t+=u(l(n,o.name));else if(o.name==="SKILL.md")t++}catch{}return t}function s(n){try{return m(n,"utf-8")}catch{return null}}function i(n){return n.split(E).filter((t)=>t.trim().length>0).length}function b(){let n=u(_)+u(a),t=s(y),r=s(f);return{available_skills_count:n>0?n:null,memory_chars:t?.length??null,memory_entry_count:t?i(t):null,user_entry_count:r?i(r):null,user_chars:r?.length??null}}
export{b as ic};
