import{L}from"./chunk-2g5dx4dg.js";import{e}from"./chunk-tn04xezw.js";import{readdirSync as s}from"node:fs";import{join as d}from"node:path";var l;function xt(r=L){let n=new Set;try{let t=s(r,{withFileTypes:!0});for(let i of t){if(!i.isDirectory())continue;let c=s(d(r,i.name),{withFileTypes:!0});for(let o of c)if(o.isDirectory())n.add(o.name)}}catch(t){e.debug("bundled_skills_dir_unreadable",{dir:r,error:t})}return n}function ve(r){return l??=xt(),l.has(r)}
export{xt,ve};

//# debugId=C90EC53DD1869E5B64756E2164756E21
