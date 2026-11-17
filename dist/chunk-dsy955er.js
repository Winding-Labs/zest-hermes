import{e}from"./chunk-9daynpjh.js";function ge(t){try{let r=JSON.parse(t);if(!Array.isArray(r))return[];return r.filter((n)=>n&&typeof n==="object"&&("function"in n)&&typeof n.function==="object")}catch(r){return e.debug("tool_calls_unparseable",{error:r}),[]}}function he(t){try{return JSON.parse(t)}catch(r){return e.debug("tool_arguments_unparseable",{error:r}),null}}
export{ge,he};

//# debugId=AE4F135DC79F4CB664756E2164756E21
