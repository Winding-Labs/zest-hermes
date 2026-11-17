import{e,m,F}from"./chunk-9daynpjh.js";import{x}from"./chunk-5tp97jcn.js";async function me(r,i={writeStatus:()=>F({hasError:!0,errorType:"privacy_init_failed",errorMessage:"Privacy manager failed to initialize — daemon exiting to avoid uploading unredacted data",lastErrorAt:Date.now(),lastSuccessAt:null}),release:x,flush:m,exit:(a)=>process.exit(a)}){e.error("privacy_manager_init_failed",r),await i.writeStatus(),await i.release(),await i.flush(),i.exit(1)}
export{me};

//# debugId=EBA351D4E58DF09B64756E2164756E21
