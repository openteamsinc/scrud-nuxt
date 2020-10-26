<script>
import Vue from 'vue';
import { ScrudComponent } from '@/entry';

export default Vue.extend({
  name: 'ServeDev',
  data () {
      return {
        map: {
          host: 'http://localhost:8000',
          components: {
            'schema:legalName': {
              input: 'FormName',
              render: 'String'
            },
            'schema:identifier': {
              input: 'FormName',
              render: 'String'
            },
            'schema:logo': {
              input: 'FormURL',
              render: 'URL'
            },
            '@list': {
              render: 'CardCollection'
            }
          }
        },
        url: 'http://localhost:8000/partner-profiles/',
        uiType: 'post',
        showComponent: false
      }
    },
    components: {
      ScrudComponent
    },
    methods: {
      generateComponent () {
        this.showComponent = !this.showComponent
      }
    }
});
</script>

<template>
  <div id="app">
    <div v-if="showComponent">
      <ScrudComponent
        :scrudResourceURL="url"
        :configMapping="map"
        :uiType="uiType"
      />
    </div>
    <b-btn @click="generateComponent" variant="primary">Create Component</b-btn>
  </div>
</template>
