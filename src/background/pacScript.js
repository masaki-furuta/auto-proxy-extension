function getProxyById(proxies, id) {
  const proxy = proxies.filter(p => p.id === id)[0]

  return proxy.id === 'direct'
    ? `'DIRECT'`
    : `'${
        proxy.protocol.toLowerCase().indexOf('socks') > -1
          ? proxy.protocol
          : 'PROXY'
      } ${proxy.address}:${proxy.port}'`
}

module.exports.pacScriptData = preferences => {
  const { domainProxyList, proxies, defaultProxy } = preferences
  const domains = Object.keys(domainProxyList)
  let func = 'function FindProxyForURL(url, host) {\n'

  func += `if (isPlainHostName(host) ||
        shExpMatch(host, "*.local") ||
        isInNet(dnsResolve(host), "10.0.0.0", "255.0.0.0") ||
        isInNet(dnsResolve(host), "172.16.0.0",  "255.240.0.0") ||
        isInNet(dnsResolve(host), "192.168.0.0",  "255.255.0.0") ||
        isInNet(dnsResolve(host), "127.0.0.0", "255.255.255.0"))
        return "DIRECT"\n`

  domains.forEach(domain => {
    func += `if(url.indexOf('${domain}') > -1)\n`
    func += `return ${getProxyById(proxies, domainProxyList[domain])};\n`
  })

  func += `return ${getProxyById(proxies, defaultProxy)};\n`
  func += '}\n'

  return func
}
