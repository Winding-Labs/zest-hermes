import{M}from"./chunk-68v7wrd3.js";import{r,ke}from"./chunk-3cy9ceqd.js";import{O}from"./chunk-176azn5d.js";import{R}from"./chunk-yvqx3a1h.js";import{appendFile as p,readFile as g,rename as _,unlink as w}from"node:fs/promises";var s=`${M}.tmp`;async function de(m,f,e){let a;try{await _(M,s),a=await g(s,"utf-8"),await w(s)}catch(t){e.debug("pending_finalize_skipped",{error:t});return}let n=a.trim().split(`
`).filter((t)=>t&&!f.has(t));if(n.length===0)return;let i=await r.auth.identity();if(!i){await p(M,`${n.join(`
`)}
`,"utf-8"),e.debug("pending_finalize_deferred",{reason:"not_signed_in"});return}let d=m.getSessionsByIds(n),c=O(),o=[];for(let t of d){let l={...R(t),...c};try{await ke({user_id:i.userId,workspace_id:i.workspaceId??null},t.id,{metadata:l,title:t.title??void 0})}catch(u){o.push(t.id),e.warn("pending_finalize_dropped",{sessionId:t.id,error:u})}}if(o.length>0)await p(M,`${o.join(`
`)}
`,"utf-8");e.info("pending_finalize_processed",{count:d.length})}
export{de};

//# debugId=9826B1B79FFE6FB864756E2164756E21
