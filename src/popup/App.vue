<template>
  <div class="section">
    <p class="menu-label is-size-5">
      Requests
      <br>
      <span class="is-size-7">Click URL to change proxy for it. </span>
    </p>
    <p class="control">
      <input class="input is-small"
             type="text"
             v-model="domainFilter"
             placeholder="search">
    </p>
    <br>
    <transition-group name="list-out"
                      appear
                      tag="ul">
      <li v-for="domain in filteredDomains"
          :key="domain">
        <div class="dropdown custom is-block"
             @click="toggleActiveDomain(domain)"
             :class="{'is-active': activeDomain === domain}">
          <div class="dropdown-trigger">
            <button class="button is-block"
                    aria-haspopup="true"
                    :aria-controls="'dropdown-menu-' + domain">
              {{ domain }}
            </button>
          </div>
          <div class="dropdown-menu"
               :id="'dropdown-menu-' + domain"
               role="menu">
            <div class="dropdown-content">
              <a class="dropdown-item"
                 v-for="proxy in proxies"
                 :key="proxy.id"
                 :class="{'is-active': isDefault(proxy)}">
                {{ proxy.name }}
              </a>
            </div>
          </div>
        </div>
      </li>
    </transition-group>
    <p v-show="filteredDomains.length === 0">
      No requests captured.
    </p>
    <br>
    <div class="has-text-centered is-size-7">
      <a href="https://github.com/mubaidr">
        mubaidr@GitHub
      </a>
    </div>
  </div>
</template>

<script>
// import debounce from 'lodash.debounce'

export default {
  data() {
    return {
      activeDomain: '',
      domainFilter: '',
      defaultProxy: null,
      proxies: [],
      domains: []
    }
  },

  computed: {
    filteredDomains() {
      return this.domains
        .filter(domain => domain.indexOf(this.domainFilter) > -1)
        .sort()
    }
  },

  created() {
    this.getProxies()
    this.getDefaultProxy()
    this.getDomains()

    chrome.runtime.onMessage.addListener(request => {
      if (request.type === 'domainList') {
        this.domains = request.data || [
          // NOTE: Remove test data
          'cdn.sstatic.net',
          'ajax.googleapis.com',
          'clc.stackoverflow.com'
        ]
      }
    })
  },

  methods: {
    toggleActiveDomain(domain) {
      if (this.activeDomain === domain) {
        this.activeDomain = ''
      } else {
        this.activeDomain = domain
      }
    },

    isDefault(proxy) {
      return proxy.id === this.defaultProxy
    },

    getProxies() {
      chrome.storage.sync.get(null, res => {
        this.proxies = res.proxies.length ? res.proxies : []
      })
    },

    getDefaultProxy() {
      chrome.storage.sync.get(null, res => {
        this.defaultProxy = res.defaultProxy || 'direct'
      })
    },

    getDomains() {
      chrome.extension.sendMessage({ type: 'getDomainList' })
    }
  }
}
</script>

<style lang="stylus">
.section,
.footer {
  padding: 2rem 1rem
}

.dropdown.custom {
  .dropdown-menu {
    padding-top: 0
  }

  .dropdown-content {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5)
  }

  .dropdown-item {
    &.is-active {
      cursor: default
      color: #8cb0ec !important
    }
  }

  .button {
    &.is-block {
      width: 100%
      text-align: left
      justify-content: left
    }
  }
}
</style>
