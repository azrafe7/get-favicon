"use strict";

(async () => {
  
  const DEBUG = true;
  let debug = {
    log: DEBUG ? console.log.bind(console) : () => {} // log or NO_OP
  }

  let manifest = chrome.runtime.getManifest();
  console.log(manifest.name + " v" + manifest.version);

  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    debug.log("[favicon:CTX]", msg);
    const { event, data } = msg;

    if (event === 'log') {
      console.log("LOG", data);
    } else if (event === 'actionClicked') {
    }
  });

})();
