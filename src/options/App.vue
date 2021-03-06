<template>
  <div class="container">
    <div class="section">
      <aside class="menu">
        <p class="menu-label is-size-5">Proxies
          <br>
          <span class="is-size-7">Click to set default proxy.</span>
        </p>
        <template v-if="preferences">
          <transition-group class="proxies-list" name="list-out" appear tag="ul">
            <li v-for="proxy in preferences.proxies" :key="proxy.id" class="tags has-addons">
              <span
                :class="{ 'is-primary': isDefault(proxy) }"
                :title="getProxyTitle(proxy)"
                class="tag"
                @click="setDefaultProxy(proxy)"
              >
                {{ proxy.name.toUpperCase() }}
                <span v-show="isDefault(proxy)">(default)</span>
              </span>
              <a
                :class="{ 'is-disabled': isNotRemoveable(proxy) }"
                class="tag is-delete"
                @click="deleteProxy(proxy)"
              />
            </li>
          </transition-group>
        </template>
      </aside>
      <br>
      <nav class="panel">
        <p class="menu-label is-size-5">New
          <br>
          <span class="is-size-7">Add proxy.</span>
        </p>
        <div class="panel-block-custom">
          <div class="columns is-mobile">
            <div class="column is-three-fifths">
              <p class="control">
                <input v-model.trim="proxy.name" class="input" type="text" placeholder="Name">
              </p>
              <p class="control">
                <input v-model.trim="proxy.address" class="input" type="text" placeholder="Address">
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
                <input v-model.trim="proxy.port" class="input" type="number" placeholder="Port">
              </p>
            </div>
          </div>

          <p class="control">
            <a class="button is-primary is-flex" @click="addProxy">Add</a>
          </p>
        </div>
      </nav>
      <br>
      <footer class="footer">
        <div class="container-fluid">
          <div class="content has-text-centered">
            <p>
              <strong>Auto Proxy</strong> by
              <a href="https://github.com/mubaidr" target="_blank">Muhammad Ubaid Raza</a>.
              <br>The source code is licensed
              <a
                href="http://opensource.org/licenses/mit-license.php"
                target="_blank"
              >MIT</a>.
            </p>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash.debounce'

export default {
  data() {
    return {
      proxy: {
        name: '',
        address: '',
        port: '',
        protocol: 'HTTP',
      },
      preferences: null, // { proxies, defaultProxy, domainProxyList }
    }
  },

  created() {
    this.getPreferences()
  },

  methods: {
    isDefault(proxy) {
      return proxy.id === this.preferences.defaultProxy
    },

    getProxyTitle(proxy) {
      return proxy.id === 'direct'
        ? 'Use Direct Connection'
        : `${proxy.protocol}://${proxy.address}:${proxy.port}`
    },

    isNotRemoveable(proxy) {
      return proxy.id === this.preferences.defaultProxy || proxy.id === 'direct'
    },

    setDefaultProxy(proxy) {
      this.preferences.defaultProxy = proxy.id

      debounce(this.setPreferences, 250, { trailing: true })()
    },

    addProxy() {
      if (!this.proxy.name) this.proxy.name = 'Unnamed'
      if (!this.proxy.address) this.proxy.address = '127.0.0.1'
      if (!this.proxy.port) this.proxy.port = 8080

      const clone = JSON.parse(JSON.stringify(this.proxy))
      clone.id = Date.now()
      this.preferences.proxies.push(clone)

      this.proxy = {
        name: '',
        address: '',
        port: 8080,
        protocol: 'HTTP',
      }

      debounce(this.setPreferences, 250, { trailing: true })()
    },

    deleteProxy(proxy) {
      if (proxy.id === this.preferences.defaultProxy || proxy.id === 'direct')
        return

      this.preferences.proxies = this.preferences.proxies.filter(
        p => p.id !== proxy.id,
      )

      // clear domain proxy list
      const domains = Object.keys(this.preferences.domainProxyList)
      domains.forEach(domain => {
        if (this.preferences.domainProxyList[domain] === proxy.id) {
          delete this.preferences.domainProxyList[domain]
        }
      })

      debounce(this.setPreferences, 250, { trailing: true })()
    },

    getPreferences() {
      chrome.extension.sendMessage({ type: 'getPreferences' }, preferences => {
        this.preferences = preferences
      })
    },

    setPreferences() {
      chrome.extension.sendMessage({
        type: 'setPreferences',
        preferences: this.preferences,
      })
    },
  },
}
</script>

<style lang="stylus">
.container {
  max-width: 470px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.section, .footer {
  padding: 2rem 1rem;
}

.proxies-list {
  .tags {
    width: 100%;
    margin: 0;

    .tag:not(.is-delete) {
      flex: 1;
    }

    .tag {
      font-size: large;
      cursor: pointer;
      transition: all 0.25s ease-out;

      &.is-disabled {
        opacity: 0.25;
      }
    }
  }
}

.panel-block-custom {
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  padding-bottom: 0;
  border-radius: 3px;

  .columns {
    margin-bottom: 0;

    .column {
      padding-bottom: 0;
    }
  }

  .control {
    margin-bottom: 1rem;
  }
}
</style>
