import{k,L}from"./chunk-68v7wrd3.js";import{e}from"./chunk-3cy9ceqd.js";import{readdirSync as m,readFileSync as c}from"node:fs";import{join as l}from"node:path";var _=l(k,"skills"),a=l(k,"memories","MEMORY.md"),y=l(k,"memories","USER.md"),f=`
§
`;function u(n){let r=0;try{let t=m(n,{withFileTypes:!0});for(let o of t)if(o.isDirectory())r+=u(l(n,o.name));else if(o.name==="SKILL.md")r++}catch(t){e.debug("inventory_skills_dir_unreadable",{dir:n,error:t})}return r}function s(n){try{return c(n,"utf-8")}catch(r){return e.debug("inventory_file_unreadable",{path:n,error:r}),null}}function i(n){return n.split(f).filter((r)=>r.trim().length>0).length}function O(){let n=u(_)+u(L),r=s(a),t=s(y);return{available_skills_count:n>0?n:null,memory_chars:r?.length??null,memory_entry_count:r?i(r):null,user_entry_count:t?i(t):null,user_chars:t?.length??null}}
export{O};

//# debugId=9E822DC99173F10A64756E2164756E21
