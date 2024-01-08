"use strict";

let manifest = chrome.runtime.getManifest();
console.log("[GetFavIcon:BG]", manifest.name + " v" + manifest.version);

function blobToDataUrl(blob) {
  return new Promise(r => {
    let a = new FileReader();
    a.onload = r;
    a.readAsDataURL(blob)}
  ).then(e => e.target.result);
}

chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  console.log("[GetFavIcon:BG]", msg);
  const { event, data } = msg;
  
  if (event === 'fetchFavIcon') {
    const url = data.url;
    
    console.log("[GetFavIcon:BG] fetch", `'${url}'`);
    let dataURL = null;
    const message = { event:'gotFavIcon', data:null };
    if (url) {
      let res = await fetch(url);
      console.log("[GetFavIcon:BG] fetched", res);
      let img = await fetch(res.url);
      let blob = await img.blob();
      dataURL = await blobToDataUrl(blob);
      console.log("[GetFavIcon:BG] toDataURL", dataURL);
      message.data = { url:res.url, dataURL:dataURL };
    }

    chrome.runtime.sendMessage(message);
  }
});