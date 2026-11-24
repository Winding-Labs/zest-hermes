import{DatabaseSync as r}from"node:sqlite";class J{db;constructor(e,a){this.db=new r(e,{open:!0,readOnly:a?.readonly??!1})}query(e){let a=this.db;return{all(...n){let t=a.prepare(e);return n.length>0?t.all(...n):t.all()},get(...n){let t=a.prepare(e);return(n.length>0?t.get(...n):t.get())??null}}}close(){this.db.close()}}
export{J};

//# debugId=C15DE8D0ECF16E3764756E2164756E21
