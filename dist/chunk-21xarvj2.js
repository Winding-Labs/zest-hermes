var qe="Signed out on this machine, but Zest could not confirm the session ended on the server (offline, or it had already expired). The local credentials are deleted.";async function Je(e){let o=await e.auth.get();if(o)return{...o,isNew:!1};return{...await e.auth.login(),isNew:!0}}
export{qe,Je};

//# debugId=7242931512C9D52264756E2164756E21
