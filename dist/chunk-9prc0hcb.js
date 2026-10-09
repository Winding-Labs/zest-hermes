import{y,b}from"./chunk-wxrcde7h.js";import{e}from"./chunk-6fyq4kv6.js";import{U}from"./chunk-nc9rvg23.js";import{Pr}from"./chunk-ttk6ayzx.js";var o=null;async function Je(r){if(r.authMode!=="agent"||!r.agentId||!r.provisioningKey)return null;return o??=Pr({sessionManager:U,supabaseUrl:y,supabaseAnonKey:b,logger:e}),o(r.agentId,r.provisioningKey,r.workspaceId)}
export{Je};
