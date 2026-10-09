function pt(r){try{let t=JSON.parse(r);if(!Array.isArray(t))return[];return t.filter((n)=>n&&typeof n==="object"&&("function"in n)&&typeof n.function==="object")}catch{return[]}}function ht(r){try{return JSON.parse(r)}catch{return null}}
export{pt,ht};
