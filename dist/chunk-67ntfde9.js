function e(r){try{let t=JSON.parse(r);if(!Array.isArray(t))return[];return t.filter((n)=>n&&typeof n==="object"&&("function"in n)&&typeof n.function==="object")}catch{return[]}}function o(r){try{return JSON.parse(r)}catch{return null}}
export{e as ac,o as bc};
