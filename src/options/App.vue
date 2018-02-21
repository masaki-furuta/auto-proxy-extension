<template>
  <div class="section">
    <aside class="menu">
      <p class="menu-label is-size-5">
        Proxies
        <br>
        <span class="is-size-7">Click to set default proxy</span>
      </p>
      <ul class="proxies-list">
        <li class="tags has-addons"
            v-show="defaultProxy">
          <span class="tag"
                @click="setDefaultProxy({id: 'direct'})"
                :class="{'is-primary': isDefault({id: 'direct'})}">
            Use Direct Connection
          </span>
          <a class="tag is-delete is-disabled" />
        </li>
        <transition-group name="list-in"
                          appear>
          <li class="tags has-addons"
              v-for="proxy in proxies"
              :key="proxy.id">
            <span class="tag"
                  @click="setDefaultProxy(proxy)"
                  :class="{'is-primary': isDefault(proxy)}"
                  :title="proxy.protocol + '://' + proxy.address + ':' + proxy.port">
              {{ proxy.name }}
            </span>
            <a @click="deleteProxy(proxy)"
               class="tag is-delete"
               :class="{'is-disabled': isDefault(proxy)}" />
          </li>
        </transition-group>
      </ul>
    </aside>
    <br>
    <nav class="panel">
      <p class="menu-label is-size-5">
        New
        <br>
        <span class="is-size-7">Add new proxy</span>
      </p>
      <div class="panel-block-custom">
        <div class="columns is-mobile">
          <div class="column is-three-fifths">
            <p class="control">
              <input class="input"
                     type="text"
                     v-model.trim="proxy.name"
                     placeholder="Name">
            </p>
            <p class="control">
              <input class="input"
                     type="text"
                     v-model.trim="proxy.address"
                     placeholder="Address">
            </p>
          </div>

          <div class="column">
            <p class="control">
              <span class="select is-fullwidth">
                <select v-model="proxy.protocol">
                  <option selected>HTTP</option>
                  <option>HTTPS</option>
                  <option>SOCKS4</option>
                  <option>SOCKS5</option>
                </select>
              </span>
            </p>
            <p class="control">
              <input class="input"
                     type="number"
                     v-model.trim="proxy.port"
                     placeholder="Port">
            </p>
          </div>
        </div>

        <p class="control">
          <a class="button is-primary is-flex"
             @click="addProxy">Add</a>
        </p>
      </div>
    </nav>
  </div>
</template>

<script>
import debounce from 'lodash.debounce'

export default {
  data() {
    return {
      defaultProxy: null,
      proxy: {
        name: 'Localhost',
        address: '127.0.0.1',
        port: 8080,
        protocol: 'HTTP'
      },
      proxies: []
    }
  },

  created() {
    this.getProxies()
    this.getDefaultProxy()
  },

  methods: {
    isDefault(proxy) {
      return this.defaultProxy === proxy.id
    },

    setDefaultProxy(proxy) {
      this.defaultProxy = proxy.id

      debounce(this.saveDefaultProxy, 250, { trailing: true })()
    },

    addProxy() {
      if (!this.proxy.name) this.proxy.name = 'Unnamed'
      if (!this.proxy.address) this.proxy.address = '127.0.0.1'
      if (!this.proxy.port) this.proxy.address = 8080

      const clone = JSON.parse(JSON.stringify(this.proxy))
      clone.id = Date.now()
      this.proxies.push(clone)

      this.proxy = {
        name: '',
        address: '',
        port: 8080,
        protocol: 'HTTP'
      }

      debounce(this.saveProxies, 250, { trailing: true })()
    },

    deleteProxy(proxy) {
      if (proxy.id === this.defaultProxy) return

      this.proxies = this.proxies.filter(p => p.id !== proxy.id)

      debounce(this.saveProxies, 250, { trailing: true })()
    },

    getProxies() {
      chrome.storage.sync.get(null, res => {
        this.proxies = res.proxies || []
      })
    },

    saveProxies() {
      chrome.storage.sync.set({ proxies: this.proxies })
    },

    getDefaultProxy() {
      chrome.storage.sync.get(null, res => {
        this.defaultProxy = res.defaultProxy || 'direct'
      })
    },

    saveDefaultProxy() {
      chrome.storage.sync.set({ defaultProxy: this.defaultProxy })
    }
  }
}
</script>

<style lang="stylus">
.section {
  padding: 2rem 1rem
}

.proxies-list {
  .tags {
    width: 100%
    margin: 0

    .tag:not(.is-delete) {
      flex: 1
    }

    .tag {
      font-size: large
      cursor: pointer
      transition: all 0.25s ease-out

      &.is-disabled {
        opacity: 0.25
      }
    }
  }
}

.panel-block-custom {
  border: 1px solid rgba(0, 0, 0, 0.1)
  padding: 1.5rem
  padding-bottom: 0
  border-radius: 3px

  .columns {
    margin-bottom: 0

    .column {
      padding-bottom: 0
    }
  }

  .control {
    margin-bottom: 1rem
  }
}
</style>
