import{y,b}from"./chunk-r3gwqfxc.js";import{e}from"./chunk-73dk5fc3.js";import{U}from"./chunk-v891sjx0.js";import{Dr}from"./chunk-dbp0nwgc.js";var o=null;async function it(r){if(r.authMode!=="agent"||!r.agentId||!r.provisioningKey)return null;return o??=Dr({sessionManager:U,supabaseUrl:y,supabaseAnonKey:b,logger:e}),o(r.agentId,r.provisioningKey,r.workspaceId)}
export{it};
