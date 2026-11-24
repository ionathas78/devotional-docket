export const demoId = "00000000-0000-4000-8000-000000000001";
export function parseRoute(hash = location.hash) {
  if (!hash || hash === "#/") return {theme:"default",id:demoId};
  const [path,query=""]=hash.split("?");
  const match = /^#\/([a-z0-9-]+)\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i.exec(path);
  if (!match) throw new Error("Invalid devotional link.");
  return {theme:match[1].toLowerCase(),id:match[2].toLowerCase(),overrides:Object.fromEntries(new URLSearchParams(query))};
}
export function routeFor(theme,id,preferences){const query=preferences?new URLSearchParams(preferences).toString():"";return "#/"+theme+"/"+id+(query?"?"+query:"");}
