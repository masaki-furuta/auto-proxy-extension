// OnInstall handler
chrome.runtime.onInstalled.addListener(details => {
  console.log(details)
})

chrome.webRequest.onBeforeRequest.addListener(
  details => {
    console.log(details)
  },
  {
    urls: ['http://*/*', 'https://*/*']
  },
  ['requestBody']
)
