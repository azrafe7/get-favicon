"use strict";

let manifest = chrome.runtime.getManifest();
console.log(manifest.name + " v" + manifest.version);

chrome.action.onClicked.addListener(async (tab) => {
  console.log("[:BG] onClicked");

  let [activeTab] = await chrome.tabs.query({active: true, currentWindow: true});

  // activeTab = await chrome.tabs.get(1900829184);

  console.log(activeTab);
  sendLog(tab.id, activeTab.favIconUrl);

  chrome.tabs.sendMessage(
    tab.id,
    {
      event: "actionClicked",
      data: null,
    }
  );
});

function sendLog(tabId, data) {
  chrome.tabs.sendMessage(tabId,
    {
      event: "log",
      data: data
    }
  );
}

chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  console.log("[:BG onMessage]", msg);
  const { event, data } = msg;

});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log("onUpdated tab", tab);

});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  let [activeTab] = await chrome.tabs.query({active: true, currentWindow: true});
  console.log("onActivated activeInfo", activeInfo);

});
