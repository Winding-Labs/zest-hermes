import{e,c,N}from"./chunk-3cy9ceqd.js";import{w}from"./chunk-0kyede4h.js";async function oe(r,i={writeStatus:()=>N({hasError:!0,errorType:"privacy_init_failed",errorMessage:"Privacy manager failed to initialize — daemon exiting to avoid uploading unredacted data",lastErrorAt:Date.now(),lastSuccessAt:null}),release:w,flush:c,exit:(a)=>process.exit(a)}){e.error("privacy_manager_init_failed",r),await i.writeStatus(),await i.release(),await i.flush(),i.exit(1)}
export{oe};

//# debugId=DB1179F3CA3CEC5964756E2164756E21
