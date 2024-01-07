"use strict";

(async () => {

  let manifest = chrome.runtime.getManifest();
  console.log('popup.js');
  console.log(manifest.name + " v" + manifest.version);

  let [activeTab] = await chrome.tabs.query({active: true, currentWindow: true});

  function updateFavicon(url) {
    console.log("updateFavicon:", url);

    let imgElements = document.querySelectorAll('.favicon-image');
    let width = null;
    let height = null;
    for (const [idx, img] of imgElements.entries()) {
      img.onload = () => {
        img.parentElement.style.setProperty('visibility', 'visible');
        if (idx === 0) {
          width = img.naturalWidth;
          height = img.naturalHeight;
          console.log("onload", width, height);

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

  console.log('activeTab:', activeTab);
  let favIconUrl = activeTab?.favIconUrl;
  updateFavicon(favIconUrl);

  if (favIconUrl) {
    let res = await fetch(favIconUrl);
    console.log('fetch:', res);
    if (res?.url && res?.url != favIconUrl) {
      favIconUrl = res?.url;
      updateFavicon(favIconUrl);
    }
  }

})();

