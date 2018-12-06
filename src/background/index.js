import { pacScriptData } from "./pacScript";

let preferences = {};
const domainList = {}; // domain list of current opended tabs
let activeTabId = null; // active tab id

// preferences
function setProxy() {
  const config = {
    mode: "pac_script",
    rules: {
      bypassList: ["<local>"]
    },
    pacScript: {
      data: pacScriptData(preferences)
    }
  };

  chrome.proxy.settings.set({
    value: config,
    scope: "regular"
  });
}

function getPreferences() {
  chrome.storage.sync.get(null, res => {
    ({ preferences } = res);

    if (preferences && preferences.defaultProxy) {
      setProxy();
    }
  });

  chrome.tabs.query(
    {
      active: true
    },
    tab => {
      activeTabId = tab[0].id;
    }
  );
}

getPreferences();

// install listner
chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === "install") {
    preferences = {
      proxies: [
        {
          id: "direct",
          name: "Direct",
          address: "",
          port: "",
          protocol: ""
        }
      ],
      defaultProxy: "direct",
      domainProxyList: {},
      customDomainList: ""
    };

    chrome.storage.sync.set(
      {
        preferences
      },
      () => {
        getPreferences();
      }
    );
  }
});

// request listner
chrome.webRequest.onBeforeRequest.addListener(
  details => {
    const { tabId } = details;

    const a = document.createElement("a");
    a.href = details.url;

    const url = a.host.replace("www.", "");

    if (domainList[tabId]) {
      if (domainList[tabId].indexOf(url) === -1) {
        domainList[tabId].push(url);
      }
    } else {
      domainList[tabId] = [url];
    }
  },
  {
    urls: ["http://*/*", "https://*/*"]
  },
  []
);

// tab listners
chrome.tabs.onActivated.addListener(details => {
  activeTabId = details.tabId;
});

chrome.tabs.onReplaced.addListener(details => {
  const { tabId } = details;

  delete domainList[tabId];
});

chrome.tabs.onRemoved.addListener(details => {
  const { tabId } = details;

  delete domainList[tabId];
});

chrome.tabs.onUpdated.addListener(details => {
  const { tabId, status } = details;

  if (status === "loading") {
    delete domainList[tabId];
  }
});

// message listner
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case "getPreferences":
      sendResponse(preferences);
      break;

    case "setPreferences":
      ({ preferences } = request);
      chrome.storage.sync.set({
        preferences
      });
      setProxy();
      break;

    case "getDomainList":
      sendResponse(domainList[activeTabId]);
      break;

    default:
      break;
  }
});

/* debug */
chrome.proxy.onProxyError.addListener(err => {
  console.log(`${err.error} : ${err.details}`);
});
