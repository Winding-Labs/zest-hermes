import{b}from"./chunk-yr9x52ks.js";import{e}from"./chunk-9daynpjh.js";import{readdirSync as s}from"node:fs";import{join as c}from"node:path";var a=c(b,"hermes-agent","skills"),l;function St(t=a){let n=new Set;try{let r=s(t,{withFileTypes:!0});for(let i of r){if(!i.isDirectory())continue;let d=s(c(t,i.name),{withFileTypes:!0});for(let o of d)if(o.isDirectory())n.add(o.name)}}catch(r){e.debug("bundled_skills_dir_unreadable",{dir:t,error:r})}return n}function fe(t){return l??=St(),l.has(t)}
export{St,fe};

//# debugId=50FD1E2F77EFB56264756E2164756E21
