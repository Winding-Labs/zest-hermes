import{O}from"./chunk-yr9x52ks.js";import{r,we}from"./chunk-9daynpjh.js";import{C}from"./chunk-d3j4ypwq.js";import{I}from"./chunk-zctqr2nn.js";import{appendFile as p,readFile as g,rename as _,unlink as w}from"node:fs/promises";var s=`${O}.tmp`;async function le(m,f,e){let a;try{await _(O,s),a=await g(s,"utf-8"),await w(s)}catch(t){e.debug("pending_finalize_skipped",{error:t});return}let n=a.trim().split(`
`).filter((t)=>t&&!f.has(t));if(n.length===0)return;let i=await r.auth.identity();if(!i){await p(O,`${n.join(`
`)}
`,"utf-8"),e.debug("pending_finalize_deferred",{reason:"not_signed_in"});return}let d=m.getSessionsByIds(n),c=C(),o=[];for(let t of d){let l={...I(t),...c};try{await we({user_id:i.userId,workspace_id:i.workspaceId??null},t.id,{metadata:l,title:t.title??void 0})}catch(u){o.push(t.id),e.warn("pending_finalize_dropped",{sessionId:t.id,error:u})}}if(o.length>0)await p(O,`${o.join(`
`)}
`,"utf-8");e.info("pending_finalize_processed",{count:d.length})}
export{le};

//# debugId=EDC850A8E99A4E3264756E2164756E21
