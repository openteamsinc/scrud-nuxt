<template>
  <div class="d-md-flex h-md-100">
  
    <div class="col-md-6 p-0 bg-indigo h-md-100">
      <div class="d-md-flex align-items-center h-100 p-5 text-center justify-content-center">
        <div class="logoarea pt-5 pb-5">
          <div v-if="showComponent">
            <ScrudComponent
              :link="link"
              :data="data"
              :scrudResourceURL="url"
              :configMapping="map"
              :uiType="uiType"
            />
            <p>{{ link }}</p>
            <p>{{ data }}</p>
          </div>
          <button type="button" class="btn btn-primary" @click="generateComponent">Create Component</button>
        </div>
      </div>
    </div>


    <div class="col-md-6 p-0 bg-white h-md-100">
      <div class="d-md-flex align-items-center h-md-100 p-5 justify-content-center">
        <b-form class="col col-lg-4 align-self-right" @submit="createPartnerProfile">
          <b-form-group label="Name" label-for="name">
            <b-form-input id="name" v-model="data.displayName">
            </b-form-input>
          </b-form-group>

          <b-form-group label="Slug" label-for="slug">
            <b-form-input id="slug" v-model="data.slug">
            </b-form-input>
          </b-form-group>

          <b-form-group label="Logo" label-for="logo">
            <b-form-input id="logo" v-model="data.logo">
            </b-form-input>
          </b-form-group>

          <b-button type="submit" variant="primary">Submit</b-button>
          <b-button type="reset" variant="danger">Reset</b-button>
        </b-form>
      </div>
    </div>

  </div>
</template>

<script>
  import {ScrudComponent} from 'scrud-component'

  import DemoService from '~/services/DemoService'

  export default {
    data () {
      return {
        link: "",
        data: {},
        map:{
          host: 'http://localhost:8000',
          components: {
            'schema:legalName': {
              input: 'FormName',
              render: 'String'
            },
            'schema:name': {
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

        // The fetch for partner profiles needs to be done after rendering to prevent the SSR process
        // to encounter the caching client (it uses the Cache API available only from the browser) and showing a 
        // 'ERROR  caches is not defined' message
        const service = new DemoService()

        let response = service.getPartnerProfiles()
          .then(res => {
            this.link = res.headers.get('link')
            return res.json()
          })
          .then(body => {
            this.data = body
          })
      },
      createPartnerProfile (evt) {
        const service = new DemoService()

        evt.preventDefault()

        service.createPartnerProfile(this.data)
      }
    }
  }
</script>

<style>
</style>