const requestList = {}

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

    if (requestList[tabId]) {
      requestList[tabId].push(url)
    } else {
      requestList[tabId] = [url]
    }
  },
  {
    urls: ['http://*/*', 'https://*/*']
  },
  []
)

chrome.tabs.onReplaced.addListener(details => {
  const { tabId } = details
  delete requestList[tabId]
})

chrome.tabs.onRemoved.addListener(details => {
  const { tabId } = details
  delete requestList[tabId]
})

chrome.tabs.onUpdated.addListener(details => {
  const { tabId, status } = details
  if (status === 'loading') {
    delete requestList[tabId]
  }
})
