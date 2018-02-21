<template>
  <div>
    <h1>{{ proxies }}</h1>
  </div>
</template>

<script>
import debounce from 'lodash.debounce'

export default {
  data() {
    return {
      defaultProxy: null,
      proxies: []
    }
  },

  created() {
    console.log(debounce)
    this.getProxies()
    this.getDefaultProxy()
  },

  methods: {
    getProxies() {
      chrome.storage.sync.get(null, res => {
        this.proxies = res.proxies.length ? res.proxies : []
      })
    },

    getDefaultProxy() {
      chrome.storage.sync.get(null, res => {
        this.defaultProxy = res.defaultProxy || 'direct'
      })
    }
  }
}
</script>

<style lang="stylus">
</style>
