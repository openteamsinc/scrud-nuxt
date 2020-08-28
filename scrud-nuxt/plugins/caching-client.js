import Vue from 'vue'

import CachingClient from 'caching-client'

let cachingClient = new CachingClient()

Vue.prototype.$cachingClient = cachingClient