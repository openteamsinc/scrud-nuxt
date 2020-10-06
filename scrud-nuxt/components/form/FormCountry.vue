<template>
  <div>
    <country-select class="country-select" v-model="country" :country="country" topCountry="US" />
    <region-select class="region-select" v-model="region" :country="country" :region="region" />
  </div>
</template>

<script>
import Vue from 'vue'
import vueCountryRegionSelect from 'vue-country-region-select'
Vue.use(vueCountryRegionSelect)

export default {
  name: 'FormCountryField',
  data () {
    return {
      country: '',
      region: ''
    }
  },
}
</script>

<style>
.country-select {
  
}
.region-select {

}
</style>