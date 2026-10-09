import{Cr}from"./chunk-4xzyj18x.js";import{Re,fe}from"./chunk-wxrcde7h.js";import{bt}from"./chunk-pf9evxj2.js";import{V}from"./chunk-ahha650d.js";import{K}from"./chunk-te881tgn.js";import{appendFile as f,readFile as u,rename as b,unlink as I}from"node:fs/promises";var a=`${Re}.tmp`;async function nt(m,c,e,n){let o;try{await b(Re,a),o=await u(a,"utf-8"),await I(a)}catch{return}let s=o.trim().split(`
`).filter((t)=>t&&!c.has(t));if(s.length===0)return;let r=m.getSessionsByIds(s),l=V(),i=[];for(let t of r){let p={...K(t),...l},d=t.title??void 0;if(!await bt(t.id,p,d)){if(!(n?await Cr(n,t.id,fe,p,e,d):!1))i.push(t.id),e.warn("pending_finalize_dropped",{sessionId:t.id,reason:n?"db_patch_failed":"no_supabase_client"})}}if(i.length>0)await f(Re,`${i.join(`
`)}
`,"utf-8");e.info("pending_finalize_processed",{count:r.length})}
export{nt};
