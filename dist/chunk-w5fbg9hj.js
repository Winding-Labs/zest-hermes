import{s,e,_,r}from"./chunk-tn04xezw.js";import{ie}from"./chunk-qhskpnnf.js";import{v}from"./chunk-zdpxkcab.js";import{mt}from"./chunk-ge5g74ns.js";async function q(){try{if(!(await s()).enableRemotePersistence)return;if(!await r.auth.identity())return;await ie();let{status:o,message:i}=await v();if(o==="ok")e.debug("sync_complete",{message:i});else e.warn("sync_failed",{status:o,message:i})}catch(t){e.error("sync_cycle_error",t),_(t instanceof Error?t:Error(String(t)),mt,"sync-loop")}}
export{q};

//# debugId=20B875E0C91F9F9B64756E2164756E21
