function getProxyById(proxies, id) {
  if (!id) {
    // eslint-disable-next-line
    id = 'direct'
  }
  // TODO: return proxy string format with protocol
}

module.exports.pacScriptData = preferences => {
  const { domainProxyList, proxies } = this.preferences
  const domains = Object.keys(domainProxyList)
  let func = 'function FindProxyForURL(url, host) {\n'

  domains.forEach(domain => {
    const proxyId = domainProxyList[domain]

    func += `if(url.indexOf(${domain}))\n`
    func += `return ${getProxyById(proxies, proxyId)}\n`
  })

  func += '}\n'
  func = '}\n'
  return func
}

// TODO: implement pac script
