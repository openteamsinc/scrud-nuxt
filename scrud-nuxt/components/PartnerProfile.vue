<template>
  <b-card class="partner-card">
    <b-card-img :src="logo" alt="Image"></b-card-img>
    <b-card-body>
      <b-card-title>{{ displayName }}</b-card-title>
    </b-card-body>

    <b-button variant="danger" @click="deleteProfile">Delete</b-button>
    <b-button v-b-modal.url @click="getProfile">Edit</b-button>
    <b-modal :id="url" hide-backdrop content-class="shadow" title="Edit Partner Profile">
      <b-form class="col align-self-right">
        <b-form-group label="Name" label-for="name">
          <b-form-input id="name" v-model="data.display_name">
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
      </b-form>

      <template v-slot:modal-footer>
        <div class="w-100">
          <b-button type="submit" @click="submit" variant="primary">Submit</b-button>
          <b-button type="reset" variant="danger">Cancel</b-button>
        </div>
      </template>
    </b-modal>
  </b-card>
</template>


<script>
import DemoService from '~/services/DemoService'
const service = new DemoService()

export default {
  name: 'PartnerProfile',
  props: {
    displayName: {
      type: String
    },
    logo: {
      type: String
    },
    url: {
      type: String
    }
  },
  data () {
    return {
      data: {
        name: '',
        display_name: '',
        slug: '',
        logo: '',
        id: ''
      },
    }
  },
  mounted () {

  },
  methods: {
    getProfile () {
      this.$bvModal.show(this.url)
      service.getPartnerProfile(this.url)
        .then(res => {
          this.data.display_name = res.display_name
          this.data.slug = res.slug
          this.data.logo = res.logo
        })
    },
    submit () {
      this.$bvModal.hide(this.url)
      service.editPartnerProfile(this.url, this.data)
        .then(res => {
          console.log(res)
        })
    },
    deleteProfile () {
      service.deletePartnerProfile(this.url)
        .then(res => {
          console.log(res)
        })
    }
  }
}
</script>

<style>
.partner-card {
  max-width: 20rem;
}

</style>
