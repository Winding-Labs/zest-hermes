var Ke="Signed out on this machine, but Zest could not confirm the session ended on the server (offline, or it had already expired). The local credentials are deleted.";async function We(e){let o=await e.auth.get();if(o)return{...o,isNew:!1};return{...await e.auth.login(),isNew:!0}}
export{Ke,We};

//# debugId=03B3B0716CAA889F64756E2164756E21
