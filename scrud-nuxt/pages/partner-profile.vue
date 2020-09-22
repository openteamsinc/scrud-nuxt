<template>
  <div class="d-md-flex h-md-100">
  
    <div class="col-md-6 p-0 bg-indigo h-md-100">
      <div class="d-md-flex align-items-center h-100 p-5 text-center justify-content-center">
        <div class="logoarea pt-5 pb-5">
          <div v-if="showComponent">
            <ScrudComponent
              :link="link"
              :data="data"
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
  import ScrudComponent from '~/components/ScrudComponent'

  import DemoService from '~/services/DemoService'

  export default {
    data () {
      return {
        link: "",
        data: {},
        showComponent: false
      }
    },
    created () {
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
    components: {
      ScrudComponent
    },
    methods: {
      generateComponent () {
        this.showComponent = !this.showComponent
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