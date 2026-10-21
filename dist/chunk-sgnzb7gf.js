import{Or}from"./chunk-f58rmfx0.js";import{Re,fe}from"./chunk-r3gwqfxc.js";import{wt}from"./chunk-mdxmdv3s.js";import{K}from"./chunk-c6hbxrs3.js";import{J}from"./chunk-5nyrssrb.js";import{appendFile as f,readFile as u,rename as b,unlink as I}from"node:fs/promises";var a=`${Re}.tmp`;async function Ke(m,c,e,n){let o;try{await b(Re,a),o=await u(a,"utf-8"),await I(a)}catch{return}let s=o.trim().split(`
`).filter((t)=>t&&!c.has(t));if(s.length===0)return;let r=m.getSessionsByIds(s),l=K(),i=[];for(let t of r){let p={...J(t),...l},d=t.title??void 0;if(!await wt(t.id,p,d)){if(!(n?await Or(n,t.id,fe,p,e,d):!1))i.push(t.id),e.warn("pending_finalize_dropped",{sessionId:t.id,reason:n?"db_patch_failed":"no_supabase_client"})}}if(i.length>0)await f(Re,`${i.join(`
`)}
`,"utf-8");e.info("pending_finalize_processed",{count:r.length})}
export{Ke};
