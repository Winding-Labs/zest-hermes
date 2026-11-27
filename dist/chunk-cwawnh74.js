import{L}from"./chunk-68v7wrd3.js";import{e}from"./chunk-3cy9ceqd.js";import{readdirSync as s}from"node:fs";import{join as d}from"node:path";var l;function It(r=L){let n=new Set;try{let t=s(r,{withFileTypes:!0});for(let i of t){if(!i.isDirectory())continue;let c=s(d(r,i.name),{withFileTypes:!0});for(let o of c)if(o.isDirectory())n.add(o.name)}}catch(t){e.debug("bundled_skills_dir_unreadable",{dir:r,error:t})}return n}function ve(r){return l??=It(),l.has(r)}
export{It,ve};

//# debugId=546699E52FC314F464756E2164756E21
