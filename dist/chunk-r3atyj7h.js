var tt="Signed out on this machine, but Zest could not confirm the session ended on the server (offline, or it had already expired). The local credentials are deleted.";async function rt(e){let o=await e.auth.get();if(o)return{...o,isNew:!1};return{...await e.auth.login(),isNew:!0}}
export{tt,rt};

//# debugId=0B1CC3ADBB4F778564756E2164756E21
