let preferences = {}
const domainList = {} // domain list of current opended tabs
let activeTabId = null // active tab id

// preferences
function getPreferences() {
  chrome.storage.sync.get(null, res => {
    ;({ preferences } = res)
  })
  chrome.tabs.query({ active: true }, tab => {
    activeTabId = tab[0].id
  })
}

getPreferences()

// install listner
chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') {
    preferences = {
      proxies: [
        {
          id: 'direct',
          name: 'Direct Connection',
          address: '',
          port: '',
          protocol: ''
        }
      ],
      defaultProxy: 'direct',
      domainProxyList: {}
    }

    chrome.storage.sync.set({ preferences })
  }
})

// request listner
chrome.webRequest.onBeforeRequest.addListener(
  details => {
    const { tabId } = details

    const a = document.createElement('a')
    a.href = details.url
    const url = a.host

    if (domainList[tabId]) {
      if (domainList[tabId].indexOf(url) === -1) {
        domainList[tabId].push(url)
      }
    } else {
      domainList[tabId] = [url]
    }
  },
  {
    urls: ['http://*/*', 'https://*/*']
  },
  []
)

// tab listners
chrome.tabs.onActivated.addListener(details => {
  activeTabId = details.tabId
})

chrome.tabs.onReplaced.addListener(details => {
  const { tabId } = details

  delete domainList[tabId]
})

chrome.tabs.onRemoved.addListener(details => {
  const { tabId } = details

  delete domainList[tabId]
})

chrome.tabs.onUpdated.addListener(details => {
  const { tabId, status } = details

  if (status === 'loading') {
    delete domainList[tabId]
  }
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case 'getPreferences':
      sendResponse(preferences)
      break
    case 'setPreferences':
      ;({ preferences } = request)
      chrome.storage.sync.set({ preferences })
      break
    case 'getDomainList':
      sendResponse(domainList[activeTabId])
      break
    default:
      break
  }
})
