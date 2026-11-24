import{e}from"./chunk-tn04xezw.js";function de(t){try{let r=JSON.parse(t);if(!Array.isArray(r))return[];return r.filter((n)=>n&&typeof n==="object"&&("function"in n)&&typeof n.function==="object")}catch(r){return e.debug("tool_calls_unparseable",{error:r}),[]}}function pe(t){try{return JSON.parse(t)}catch(r){return e.debug("tool_arguments_unparseable",{error:r}),null}}
export{de,pe};

//# debugId=50D6ADE8B0A953BB64756E2164756E21
