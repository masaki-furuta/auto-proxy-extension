const domainList = {}
let activeTabId = null

function sendDomainList() {
  chrome.extension.sendMessage({
    type: 'domainList',
    data: domainList[activeTabId]
  })
}

// OnInstall handler
chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') {
    chrome.storage.sync.set({
      proxies: [
        {
          id: 'direct',
          name: 'Direct Connection',
          address: '',
          port: '',
          protocol: ''
        }
      ]
    })
  }
})

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
  } else if (status === 'completed') {
    sendDomainList()
  }
})

chrome.tabs.onActivated.addListener(details => {
  activeTabId = details.tabId
})

chrome.runtime.onMessage.addListener(request => {
  if (request.type === 'getDomainList') {
    sendDomainList()
  }
})
