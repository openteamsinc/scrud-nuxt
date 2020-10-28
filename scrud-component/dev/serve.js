import Vue from 'vue';
import Dev from './serve.vue';
import { BootstrapVue } from 'bootstrap-vue';
import plugin from '@/entry';

Vue.config.productionTip = false;

// Install BootstrapVue
Vue.use(BootstrapVue);
Vue.use(plugin);

new Vue({
  render: (h) => h(Dev),
}).$mount('#app');
