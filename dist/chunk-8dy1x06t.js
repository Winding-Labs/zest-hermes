import{za as l}from"./chunk-t4spsebh.js";import{Ka as f}from"./chunk-96w5rrkf.js";import{ic as u}from"./chunk-rc24r2s1.js";import{Hc as c,oc as e}from"./chunk-8f17f647.js";import{Xc as b}from"./chunk-vj904c31.js";import{appendFile as g,readFile as _,rename as w,unlink as y}from"node:fs/promises";var o=`${e}.tmp`;async function M(I,S,n,i){let s;try{await w(e,o),s=await _(o,"utf-8"),await y(o)}catch{return}let r=s.trim().split(`
`).filter((t)=>t&&!S.has(t));if(r.length===0)return;let p=I.getSessionsByIds(r),h=u(),a=[];for(let t of p){let d={...b(t),...h},m=t.title??void 0;if(!await f(t.id,d,m)){if(!(i?await l(i,t.id,c,d,n,m):!1))a.push(t.id),n.warn("pending_finalize_dropped",{sessionId:t.id,reason:i?"db_patch_failed":"no_supabase_client"})}}if(a.length>0)await g(e,`${a.join(`
`)}
`,"utf-8");n.info("pending_finalize_processed",{count:p.length})}
export{M as xa};
