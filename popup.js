"use strict";

(async () => {

  let manifest = chrome.runtime.getManifest();
  console.log("[GetFavIcon:PU]", manifest.name + " v" + manifest.version);

  let [activeTab] = await chrome.tabs.query({active: true, currentWindow: true});

  function updateFavicon(data) {
    const url = data?.url;
    const dataURL = data?.dataURL;
    console.log("[GetFavIcon:PU] updateFavicon:", url);

    let imgElements = document.querySelectorAll('.favicon-image');
    let width = null;
    let height = null;
    for (const [idx, img] of imgElements.entries()) {
      img.onload = () => {
        img.parentElement.style.setProperty('visibility', 'visible');
        if (idx === 0) {
          width = img.naturalWidth;
          height = img.naturalHeight;
          console.log("[GetFavIcon:PU] onload", width, height);

          if (width && height) {
            let sizeElement = document.querySelector('#size');
            sizeElement.innerText = `${width}×${height}`;
          }
        }
      }

      if (url) {
        img.src = url;
      } else {
        img.parentElement.style.setProperty('display', 'none');
      }
    }

    let urlElement = document.querySelector('#favicon-url');
    if (!url) {
      urlElement.style.setProperty('display', 'none');
      document.querySelector('#no-favicon').style.setProperty('display', 'block');
    }
    urlElement.innerText = url;
    urlElement.href = url;
  }

  console.log("[GetFavIcon:PU] activeTab:", activeTab);
  let favIconUrl = activeTab?.favIconUrl;

  let message = { event:'fetchFavIcon', data: { url:favIconUrl }};
  chrome.runtime.sendMessage(message);

  chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
    console.log("[GetFavIcon:PU] onMessage", msg);
    const { event, data } = msg;

    if (event === 'gotFavIcon') {
      console.log("[GetFavIcon:PU] gotFavIcon", data);
      updateFavicon(data);
    }
  });

})();

