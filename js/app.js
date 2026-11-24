import {parseRoute,routeFor} from "./router.js";
import {readJSON,getDevotional} from "./store.js";
import {render} from "./reader.js";
import {defaults,validate,saved,save,apply} from "./preferences.js";
const $=id=>document.getElementById(id);
const article=$("devotional"),status=$("status"),picker=$("theme-picker"),share=$("share"),custom=$("share-custom"),reader=$("reader"),feedback=$("feedback");
let themes=[{id:"default",name:"Default"}],registry=[],active,controller,prefs;
try{const data=await readJSON("presentation/themes/registry.json");if(Array.isArray(data))themes=data.filter(t=>/^[a-z0-9-]+$/.test(t.id)&&typeof t.name==="string");}catch{}
try{const data=await readJSON("presentation/decorations/registry.json");if(Array.isArray(data))registry=data.filter(d=>["header","divider","footer"].includes(d.category)&&/^[a-z0-9-]+$/.test(d.id)&&d.src===d.category+"s/"+d.id+".svg");}catch{}
if(!themes.some(t=>t.id==="default"))themes.unshift({id:"default",name:"Default"});
for(const t of themes)picker.add(new Option(t.name,t.id));
const keys=["size","spacing","width"];
function sync(){
 for(const k of keys){$(k).value=prefs[k];document.querySelector('output[for="'+k+'"]').textContent=prefs[k]+(k==="size"?"%":k==="width"?" rem":"");}
 for(const el of document.querySelectorAll("#decoration-controls input"))el.checked=prefs[el.name]===el.value;
 apply(prefs,registry);
}
function change(k,v){prefs=validate({...prefs,[k]:v},registry);save({...validate(saved(),registry),[k]:prefs[k]});sync();}
for(const k of keys)$(k).addEventListener("input",()=>change(k,$(k).value));
for(const category of ["header","divider","footer"]){
 const group=document.createElement("fieldset"),legend=document.createElement("legend");legend.textContent=category;group.append(legend);
 for(const d of [{id:"none",name:"None"},...registry.filter(d=>d.category===category)]){
 const label=document.createElement("label"),input=document.createElement("input");input.type="radio";input.name=category;input.value=d.id;input.addEventListener("change",()=>change(category,d.id));label.append(input);
 if(d.src){const preview=document.createElement("span");preview.className="decal-preview";preview.setAttribute("aria-hidden","true");preview.style.setProperty("--decal",'url("presentation/decorations/'+d.src+'")');label.append(preview);}
 label.append(document.createTextNode(d.name));group.append(label);
 }$("decoration-controls").append(group);
}
$("reset").addEventListener("click",()=>{prefs={...defaults};save(prefs);if(active)history.replaceState(null,"",routeFor(active.theme,active.id));sync();});
async function load(){
 controller?.abort();const request=new AbortController();controller=request;
 reader.setAttribute("aria-busy","true");article.hidden=true;share.hidden=custom.hidden=true;status.hidden=false;status.textContent="Loading devotional…";feedback.textContent="";active=null;
 try{
 const route=parseRoute(),theme=themes.some(t=>t.id===route.theme)?route.theme:"default";
 picker.value=theme;$("theme").href="presentation/themes/"+theme+"/theme.css";
 prefs=validate({...saved(),...route.overrides},registry);sync();
 const record=await getDevotional(route.id,request.signal);if(request.signal.aborted)return;
 render(record,article);active={theme,id:route.id};sync();article.hidden=false;status.hidden=true;share.hidden=custom.hidden=false;
 }catch(error){if(!request.signal.aborted){status.textContent=error.message;document.title="Devotional Docket";}}
 finally{if(!request.signal.aborted)reader.setAttribute("aria-busy","false");}
}
prefs=validate(saved(),registry);sync();
picker.addEventListener("change",()=>{if(active){const route=parseRoute();location.hash=routeFor(picker.value,active.id,route.overrides);}});
async function copy(customized){if(!active)return;const url=new URL(location.href);url.hash=routeFor(active.theme,active.id,customized?prefs:undefined);try{await navigator.clipboard.writeText(url.href);feedback.textContent="Link copied.";}catch{feedback.textContent=url.href;}}
share.addEventListener("click",()=>copy(false));custom.addEventListener("click",()=>copy(true));
window.addEventListener("hashchange",load);load();
