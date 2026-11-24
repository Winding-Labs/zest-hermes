import{M}from"./chunk-2g5dx4dg.js";import{r,Pe}from"./chunk-tn04xezw.js";import{R}from"./chunk-kfmk9mw3.js";import{F}from"./chunk-3yfp0pmg.js";import{appendFile as p,readFile as g,rename as _,unlink as w}from"node:fs/promises";var s=`${M}.tmp`;async function se(m,f,e){let a;try{await _(M,s),a=await g(s,"utf-8"),await w(s)}catch(t){e.debug("pending_finalize_skipped",{error:t});return}let n=a.trim().split(`
`).filter((t)=>t&&!f.has(t));if(n.length===0)return;let i=await r.auth.identity();if(!i){await p(M,`${n.join(`
`)}
`,"utf-8"),e.debug("pending_finalize_deferred",{reason:"not_signed_in"});return}let d=m.getSessionsByIds(n),c=R(),o=[];for(let t of d){let l={...F(t),...c};try{await Pe({user_id:i.userId,workspace_id:i.workspaceId??null},t.id,{metadata:l,title:t.title??void 0})}catch(u){o.push(t.id),e.warn("pending_finalize_dropped",{sessionId:t.id,error:u})}}if(o.length>0)await p(M,`${o.join(`
`)}
`,"utf-8");e.info("pending_finalize_processed",{count:d.length})}
export{se};

//# debugId=B3136F1E476F60D464756E2164756E21
