function node(tag,text){const el=document.createElement(tag);if(text!==undefined)el.textContent=text;return el;}
export function render(record,target){
 const fragment=document.createDocumentFragment();
 fragment.append(node("h1",record.title));
 if(record.date){const date=node("time",record.date);date.dateTime=record.date;fragment.append(date);}
 for(const block of record.blocks){
  switch(block.type){
   case "paragraph":fragment.append(node("p",block.text));break;
   case "heading":fragment.append(node("h2",block.text));break;
   case "quote":{const quote=node("blockquote");quote.append(node("p",block.text));if(block.source)quote.append(node("cite",block.source));fragment.append(quote);break;}
   case "image":{const url=new URL(block.src,location.href);if(!["http:","https:"].includes(url.protocol))break;const figure=node("figure");const img=node("img");img.src=url.href;img.alt=block.alt||"";figure.append(img);if(block.caption)figure.append(node("figcaption",block.caption));fragment.append(figure);break;}
   case "references":{const section=node("section");section.append(node("h2",block.title||"References"));const list=node("ul");for(const item of block.items||[])list.append(node("li",item));section.append(list);fragment.append(section);break;}
  }
 }
 target.replaceChildren(fragment);
 document.title=record.title+" | Devotional Docket";
}
