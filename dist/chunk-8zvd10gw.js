import{e}from"./chunk-3cy9ceqd.js";function be(t){try{let r=JSON.parse(t);if(!Array.isArray(r))return[];return r.filter((n)=>n&&typeof n==="object"&&("function"in n)&&typeof n.function==="object")}catch(r){return e.debug("tool_calls_unparseable",{error:r}),[]}}function Se(t){try{return JSON.parse(t)}catch(r){return e.debug("tool_arguments_unparseable",{error:r}),null}}
export{be,Se};

//# debugId=FDA837B9196E0EAC64756E2164756E21
