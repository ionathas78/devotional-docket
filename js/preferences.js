const key="devotional-docket.preferences.v1";
export const defaults={size:"100",spacing:"1.7",width:"44",header:"none",divider:"none",footer:"none"};
export function validate(raw,registry){
 const result={...defaults};
 for(const [k,lo,hi] of [["size",80,180],["spacing",1.2,2.4],["width",28,64]]){const n=Number(raw[k]);if(raw[k]!=null&&Number.isFinite(n)&&n>=lo&&n<=hi)result[k]=String(n);}
 for(const k of ["header","divider","footer"])if(raw[k]==="none"||registry.some(d=>d.category===k&&d.id===raw[k]))result[k]=raw[k];
 return result;
}
export function saved(){try{return JSON.parse(localStorage.getItem(key))||{};}catch{return {};}}
export function save(p){try{localStorage.setItem(key,JSON.stringify(p));}catch{}}
export function apply(p,registry){
 const root=document.documentElement;
 root.style.setProperty("--reading-scale",Number(p.size)/100);
 root.style.setProperty("--reading-spacing",p.spacing);
 root.style.setProperty("--reading-width",p.width+"rem");
 document.querySelectorAll(".decal").forEach(el=>el.remove());
 const article=document.querySelector("#devotional");
 function decal(category){const d=registry.find(d=>d.category===category&&d.id===p[category]);if(!d)return null;const el=document.createElement("span");el.className="decal";el.setAttribute("aria-hidden","true");el.style.setProperty("--decal", 'url("presentation/decorations/'+d.src+'")');return el;}
 const header=decal("header"),footer=decal("footer");if(header)article.prepend(header);if(footer)article.append(footer);
 for(const h of article.querySelectorAll("h2")){const divider=decal("divider");if(divider)h.before(divider);}
}
