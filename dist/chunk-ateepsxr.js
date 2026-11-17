import{e,y,r,s}from"./chunk-9daynpjh.js";import{de}from"./chunk-6ea5eb7n.js";import{S}from"./chunk-f8yb9tv0.js";import{ft}from"./chunk-7sscbw73.js";async function q(){try{if(!(await s()).enableRemotePersistence)return;if(!await r.auth.identity())return;await de();let{status:o,message:i}=await S();if(o==="ok")e.debug("sync_complete",{message:i});else e.warn("sync_failed",{status:o,message:i})}catch(t){e.error("sync_cycle_error",t),y(t instanceof Error?t:Error(String(t)),ft,"sync-loop")}}
export{q};

//# debugId=0E44EA0BDD5A5B0A64756E2164756E21
