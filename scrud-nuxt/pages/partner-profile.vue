<template>
  <div class="d-md-flex h-md-100">
  
    <div class="col-md-6 p-0 bg-indigo h-md-100">
      <div class="d-md-flex align-items-center h-100 p-5 text-center justify-content-center">
        <div class="logoarea pt-5 pb-5">
          <ScrudComponent
            :mapping="mapping"
          />
        </div>
      </div>
    </div>


    <div class="col-md-6 p-0 bg-white h-md-100">
      <div class="d-md-flex align-items-center h-md-100 p-5 justify-content-center">
        <b-form class="col col-lg-4 align-self-right" @submit="createPartnerProfile" v-if="show">
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
        show: true,
        data: {
          name: '',
          display_name: '',
          slug: '',
          logo: '',
          id: ''
        },
        mapping: {
          model: {},
          state: {},
          valid: false,
          schema: {},
          uiSchema: [
          ]
        }
      }
    },
    mounted () {
      this.$cachingClient.clearCache()
      const service = new DemoService()
      service.getPartnerProfiles()
        .then(res => {
          this.mapResourses(res.content)
        })
    },
    components: {
      ScrudComponent
    },
    methods: {
      createPartnerProfile (evt) {
        const service = new DemoService()
        evt.preventDefault()
        console.log(this.data)
        service.createPartnerProfile(this.data)
      },
      mapResourses (res) {
        let children = []
        console.log('res', res)
        res.forEach(elem => {
          console.log(elem.content.displayName)
          children.push({
            component: 'PartnerProfile',
            fieldOptions: {
              props: {
                displayName: elem.content.displayName,
                logo: elem.content.logo || 'http://bamflash.com/wp-content/uploads/2013/05/placeholder.png'
              }
            }
          })
        })
        console.log(children)
        this.mapping = {
          model: {},
          state: {},
          valid: false,
          schema: {},
          uiSchema: [
            {
              component: 'CardCollection',
              children: children
            }
          ]
        }
      }
    }
  }
</script>

<style>
</style>