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
      proxies: []
    }
  },

  created() {
    console.log(debounce)
    this.getProxies()
  },

  methods: {
    getProxies() {
      chrome.storage.sync.get(null, res => {
        this.proxies = res.proxies.length ? res.proxies : []
      })
    }
  }
}
</script>

<style lang="stylus">
</style>
