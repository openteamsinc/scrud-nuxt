import Vue from 'vue';
import Dev from './serve.vue';
import { BootstrapVue } from 'bootstrap-vue';

Vue.config.productionTip = false;

// Install BootstrapVue
Vue.use(BootstrapVue);

new Vue({
  render: (h) => h(Dev),
}).$mount('#app');
