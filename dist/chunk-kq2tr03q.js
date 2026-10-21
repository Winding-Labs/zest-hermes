async function q(t,r,o){let{logger:s,onError:p}=o??{};try{s?.debug("Fetching workspaces for user",r);let{data:e,error:a}=await t.from("workspaces").select(`
        id,
        name,
        created_at,
        teams!inner (
          team_memberships!inner (
            user_id
          )
        )
      `).eq("teams.team_memberships.user_id",r);if(a){let n=a instanceof Error?a.message:String(a);throw s?.error("Failed to fetch workspaces",n),Error(`Failed to fetch workspaces: ${n}`)}if(!e||e.length===0)return s?.info("No workspaces with team assignment found for user"),[];let i=e.map(({teams:n,...c})=>c);return s?.info("Fetched workspaces",i.length),i}catch(e){if(e instanceof Error)p?.(e,{endpoint:"workspace_memberships"});throw e}}async function V(t,r){let{data:o}=await t.from("workspaces").select("name").eq("id",r).maybeSingle();return o?.name??null}
export{q,V};
