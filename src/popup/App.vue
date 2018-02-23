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
                      {{ defaultProxyForDomain(domain) }}
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
export default {
  data() {
    return {
      activeDomain: null,
      domainFilter: '',
      domainList: [],
      preferences: null // { proxies, defaultProxy, domainProxyList }
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
      const p =
        this.preferences.domainProxyList[domain] ||
        this.preferences.defaultProxy

      return p === proxy.id
    },

    defaultProxyForDomain(domain) {
      const proxyId =
        this.preferences.domainProxyList[domain] ||
        this.preferences.defaultProxy

      return this.preferences.proxies.filter(proxy => proxy.id === proxyId)[0]
        .name
    },

    toggleActiveDomain(domain) {
      if (this.activeDomain === domain) {
        this.activeDomain = null
      } else {
        this.activeDomain = domain
      }
    },

    getPreferences() {
      chrome.extension.sendMessage({ type: 'getPreferences' }, preferences => {
        this.$set(this, 'preferences', preferences)
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
      this.$set(this.preferences.domainProxyList, domain, proxyId)

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
  margin-bottom: 5px

  .dropdown-menu {
    top: calc(100% - 5px)
    width: 100%
  }

  .dropdown-content {
    padding: 0
    border-radius: 0 0 3px 3px
    box-shadow: 0 7px 25px rgba(0, 0, 0, 0.5)
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

    .column:not(.is-two-third) {
      padding-right: 24px
      background-image: url('/assets/icons/arrow_drop_down.png')
      background-position: 100% center
      background-repeat: no-repeat
      background-size: 24px
    }
  }

  &.is-active {
    .button {
      .column:not(.is-two-third) {
        // TODO: rotate background
      }
    }
  }

  .dropdown-icon {
    background-image: url('/assets/icons/arrow_drop_down.png')
    background-position: 90% center
    background-repeat: no-repeat
    background-size: 50%
  }
}
</style>
