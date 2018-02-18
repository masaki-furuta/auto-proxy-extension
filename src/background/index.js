const requestList = {}

// OnInstall handler
chrome.runtime.onInstalled.addListener(details => {
  console.log(details)
})

chrome.webRequest.onBeforeRequest.addListener(
  details => {
    const {
      tabId
    } = details

    const a = document.createElement('a')
    a.href = details.url
    const url = a.host

    if (requestList[tabId]) {
      requestList[tabId].push(url)
    } else {
      requestList[tabId] = [url]
    }

    console.log(requestList)

  }, {
    urls: ['http://*/*', 'https://*/*']
  }, []
)

chrome.tabs.onUpdated.addListener(details => {
  const {
    tabId
  } = details

  requestList[tabId] = []
})

chrome.tabs.onRemoved.addListener(details => {
  const {
    tabId
  } = details

  delete requestList[tabId]
})
