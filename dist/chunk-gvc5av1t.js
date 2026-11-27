import{e,_,r,s}from"./chunk-3cy9ceqd.js";import{we}from"./chunk-55w59hxh.js";import{v}from"./chunk-tf3k01gg.js";import{St}from"./chunk-01c9hgt2.js";async function K(){try{if(!(await s()).enableRemotePersistence)return;if(!await r.auth.identity())return;await we();let{status:o,message:i}=await v();if(o==="ok")e.debug("sync_complete",{message:i});else e.warn("sync_failed",{status:o,message:i})}catch(t){e.error("sync_cycle_error",t),_(t instanceof Error?t:Error(String(t)),St,"sync-loop")}}
export{K};

//# debugId=509217E0D9996F2A64756E2164756E21
