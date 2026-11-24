import {parseRoute,routeFor} from "./router.js";
import {readJSON,getDevotional} from "./store.js";
import {render} from "./reader.js";
const article=document.querySelector("#devotional"),status=document.querySelector("#status"),picker=document.querySelector("#theme-picker"),share=document.querySelector("#share"),reader=document.querySelector("#reader"),feedback=document.querySelector("#feedback");
let themes=[{id:"default",name:"Default"}],active,controller;
try{const registry=await readJSON("themes/registry.json");if(Array.isArray(registry))themes=registry.filter(t=>/^[a-z0-9-]+$/.test(t.id)&&typeof t.name==="string");}catch{}
if(!themes.some(t=>t.id==="default"))themes.unshift({id:"default",name:"Default"});
for(const theme of themes)picker.add(new Option(theme.name,theme.id));
async function load(){
 controller?.abort();const request=new AbortController();controller=request;
 reader.setAttribute("aria-busy","true");article.hidden=true;share.hidden=true;status.hidden=false;status.textContent="Loading devotional…";feedback.textContent="";active=null;
 try{
  const route=parseRoute();const theme=themes.some(t=>t.id===route.theme)?route.theme:"default";
  picker.value=theme;document.querySelector("#theme").href="themes/"+theme+"/theme.css";
  const record=await getDevotional(route.id,request.signal);
  if(request.signal.aborted)return;
  render(record,article);active={theme,id:route.id};article.hidden=false;status.hidden=true;share.hidden=false;
 }catch(error){if(request.signal.aborted)return;status.textContent=error.message;document.title="Devotional Docket";}
 finally{if(!request.signal.aborted)reader.setAttribute("aria-busy","false");}
}
picker.addEventListener("change",()=>{if(active)location.hash=routeFor(picker.value,active.id);});
share.addEventListener("click",async()=>{if(!active)return;const url=new URL(location.href);url.hash=routeFor(active.theme,active.id);try{await navigator.clipboard.writeText(url.href);feedback.textContent="Link copied.";}catch{feedback.textContent=url.href;}});
window.addEventListener("hashchange",load);load();
