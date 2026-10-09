import{mkdir as t,stat as e}from"node:fs/promises";async function c(r){try{await e(r)}catch{await t(r,{recursive:!0,mode:448})}}
export{c};
