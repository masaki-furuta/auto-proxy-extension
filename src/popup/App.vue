<template>
  <div class="section">
    <p class="menu-label is-size-5">
      Requests
      <br>
      <span class="is-size-7">Click URL to change proxy. </span>
    </p>
    <template v-if="preferences">
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
                <div class="columns is-mobile">
                  <div class="column is-two-third">
                    <span>{{ domain }}</span>
                  </div>
                  <div class="column">
                    <span class="has-text-grey-lighter is-pulled-right">
                      {{ defaultProxyForDomain() }}
                    </span>
                  </div>
                </div>
              </button>
            </div>
            <div class="dropdown-menu"
                 :id="'dropdown-menu-' + domain"
                 role="menu">
              <div class="dropdown-content">
                <a class="dropdown-item"
                   v-for="proxy in preferences.proxies"
                   :key="proxy.id"
                   @click="setDomainProxy(domain, proxy.id)"
                   :class="{'is-active': isDefaultProxyForDomain(domain, proxy)}">
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
    </template>
    <div class="has-text-centered is-size-7">
      <a href="https://github.com/mubaidr"
         target="_blank">
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
      domainList: [],
      preferences: {
        proxies: [],
        defaultProxy: 'direct',
        domainProxyList: {}
      } // { proxies, defaultProxy, domainProxyList }
    }
  },

  computed: {
    filteredDomains() {
      return this.domainList
        .filter(domain => domain.indexOf(this.domainFilter) > -1)
        .sort()
    }
  },

  created() {
    this.getPreferences()
    this.getDomainList()
  },

  methods: {
    isDefaultProxyForDomain(domain, proxy) {
      const p = this.preferences.domainProxyList[domain] || { id: 'direct' }

      return p.id === proxy.id
    },

    defaultProxyForDomain(domain) {
      return (this.preferences.domainProxyList[domain] || { name: 'Direct' })
        .name
    },

    toggleActiveDomain(domain) {
      if (this.activeDomain === domain) {
        this.activeDomain = ''
      } else {
        this.activeDomain = domain
      }
    },

    getPreferences() {
      chrome.extension.sendMessage({ type: 'getPreferences' }, preferences => {
        this.preferences = preferences
      })
    },

    setPreferences() {
      chrome.extension.sendMessage({
        type: 'setPreferences',
        preferences: this.preferences
      })
    },

    getDomainList() {
      chrome.extension.sendMessage({ type: 'getDomainList' }, domainList => {
        this.domainList = domainList
      })
    },

    setDomainProxy(domain, proxyId) {
      this.toggleActiveDomain(domain)
      this.preferences.domainProxyList[domain] = proxyId
      this.setPreferences()
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
  background-image: url('/assets/icons/arrow_drop_down.png')
  background-position: 100% center
  background-repeat: no-repeat
  background-size: contain

  .dropdown-menu {
    padding-top: 0
  }

  .dropdown-content {
    box-shadow: 0 3px 7px rgba(0, 0, 0, 0.5)
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
