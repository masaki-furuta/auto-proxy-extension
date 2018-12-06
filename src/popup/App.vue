<template>
  <div class="section">
    <p class="menu-label is-size-5">Requests</p>
    <span class="is-size-7">
      Click domain to choose proxy for that domain or visit
      <a
        href="./options.html"
        target="_blank"
      >Options</a> to choose a default
      for all domains.
    </span>
    <hr>
    <template v-if="preferences">
      <p class="control">
        <input
          v-model="domainFilter"
          class="input is-small"
          type="text"
          placeholder="Filter domains"
        >
      </p>
      <br>
      <transition-group name="list-out" appear tag="ul">
        <li v-for="domain in filteredDomains" :key="domain">
          <div
            :class="{ 'is-active': activeDomain === domain }"
            class="dropdown custom is-block"
            @click="toggleActiveDomain(domain)"
          >
            <div class="dropdown-trigger">
              <button
                :aria-controls="'dropdown-menu-' + domain"
                class="button is-block"
                aria-haspopup="true"
              >
                <div class="columns is-mobile">
                  <div class="column is-two-third">
                    <span>{{ domain }}</span>
                  </div>
                  <div class="column">
                    <span
                      class="has-text-grey-lighter is-pulled-right"
                    >{{ defaultProxyForDomain(domain) }}</span>
                  </div>
                </div>
              </button>
            </div>
            <div :id="'dropdown-menu-' + domain" class="dropdown-menu" role="menu">
              <div class="dropdown-content">
                <!-- Reset to Default -->
                <a
                  title="Reset Proxy for this domain to default one"
                  :class="{
                    'is-active': isDefaultProxyForDomain(domain, false)
                  }"
                  class="dropdown-item"
                  @click="setDomainProxy(domain, false)"
                >Reset To Default</a>
                <!-- Stored proxy preferences -->
                <a
                  v-for="proxy in preferences.proxies"
                  :class="{
                    'is-active': isDefaultProxyForDomain(domain, proxy)
                  }"
                  :key="proxy.id"
                  class="dropdown-item"
                  @click="setDomainProxy(domain, proxy.id)"
                >{{ proxy.name }}</a>
              </div>
            </div>
          </div>
        </li>
      </transition-group>
      <p v-show="filteredDomains.length === 0">No requests captured.</p>
      <br>
    </template>
    <div class="has-text-centered is-size-7">
      <a href="https://github.com/mubaidr" target="_blank">mubaidr@GitHub</a>
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
      preferences: null, // { proxies, defaultProxy, domainProxyList }
    }
  },

  computed: {
    filteredDomains() {
      return this.domainList
        .filter(domain => domain.indexOf(this.domainFilter) > -1)
        .sort()
    },
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
        preferences: this.preferences,
      })
    },

    getDomainList() {
      chrome.extension.sendMessage({ type: 'getDomainList' }, domainList => {
        this.domainList = domainList
      })
    },

    setDomainProxy(domain, proxyId) {
      if (proxyId) {
        this.$set(this.preferences.domainProxyList, domain, proxyId)
      } else {
        delete this.preferences.domainProxyList[domain]
        this.$set(this, 'preferences', this.preferences)
      }

      this.setPreferences()
    },
  },
}
</script>

<style lang="stylus">
.section, .footer {
  padding: 2rem 1rem;
}

.dropdown.custom {
  margin-bottom: 5px;

  .dropdown-menu {
    top: calc(100% - 5px);
    width: 100%;
  }

  .dropdown-content {
    padding: 0;
    border-radius: 0 0 3px 3px;
    box-shadow: 0 7px 25px rgba(0, 0, 0, 0.5);
  }

  .dropdown-item {
    &.is-active {
      cursor: default;
      color: #8cb0ec !important;
    }
  }

  .button {
    &.is-block {
      width: 100%;
      text-align: left;
      justify-content: left;
    }

    .column:not(.is-two-third) {
      padding-right: 24px;
      position: relative;

      &:before {
        content: ' ';
        position: absolute;
        right: 0;
        width: 24px;
        height: 24px;
        background-image: url('/assets/icons/arrow_drop_down.png');
        background-position: 100% center;
        background-repeat: no-repeat;
        background-size: 24px;
        transition: rotateX 0.25s ease-out;
      }
    }
  }

  &.is-active {
    .button {
      .column:not(.is-two-third) {
        &:before {
          transform: rotateX(180deg);
        }
      }
    }
  }

  .dropdown-icon {
    background-image: url('/assets/icons/arrow_drop_down.png');
    background-position: 90% center;
    background-repeat: no-repeat;
    background-size: 50%;
  }
}
</style>
