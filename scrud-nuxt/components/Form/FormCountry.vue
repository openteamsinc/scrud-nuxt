<template>
  <div>
    <b-container class="country">
      <b-form-group label="Country and Region" label-for="country-select">
        <country-select class="country-select select" v-model="country" :country="country" topCountry="US" />
        <region-select class="region-select" v-model="region" :country="country" :region="region" />
      </b-form-group>
    </b-container>
  </div>
</template>

<script>
import Vue from 'vue'
import vueCountryRegionSelect from 'vue-country-region-select'
Vue.use(vueCountryRegionSelect)

export default {
  name: 'FormCountry',
  data () {
    return {
      country: '',
      region: ''
    }
  },
}
</script>

<style>
.country {
  margin-left: 18px;
}

.country-select {
  
}
.region-select {

}
</style>