export async function readJSON(path,signal){
 const response=await fetch(path,{signal});
 if(!response.ok) throw new Error("Unable to load requested content.");
 return response.json();
}
export async function getDevotional(id,signal){
 const record=await readJSON("data/devotionals/"+id.slice(0,2)+"/"+id+".json",signal);
 if(record.id!==id || typeof record.title!=="string" || !Array.isArray(record.blocks)) throw new Error("Invalid devotional record.");
 return record;
}
