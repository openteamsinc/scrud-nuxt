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
            'openteams:PartnerProgramApplication': {
              input: 'Form',
              render: ''
            },
            'schema:givenName': {
              input: 'FormName',
              render: 'String'
            },
            'schema:familyName': {
              input: 'FormName',
              render: 'String'
            },
            'schema:email': {
              input: 'FormEmail',
              render: 'Email'
            },
            'schema:telephone': {
              input: 'FormPhoneNumber',
              render: 'String'
            },
            'schema:addressCountry': {
              input: 'FormCountry',
              render: 'String'
            },
            'schema:legalName': {
              input: 'FormCompanyName',
              render: 'String'
            },
            'schema:Address': {
              input: 'FormCompanyAddress',
              render: 'String'
            },
            'schema:url': {
              input: 'FormURL',
              render: 'URL'
            },
            'schema:text': {
              input: 'FormURL',
              render: 'String'
            },
            'schema:number': {
              input: 'FormURL',
              render: 'String'
            },
            '@list': {
              render: 'CardCollection'
            }
          }
        },
        url: 'http://localhost:8000/partner-program-applications/',
        uiType: 'get',
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
