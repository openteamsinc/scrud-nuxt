<template>
  <b-container fluid>
    <b-row class="my-1 mx-1">
      <b-form-group class="col-10" label="Company Website" label-for="company_url">
        <b-form-input
          class=""
          id="company_url"
          type="url"
          v-model="url"
        ></b-form-input>
      </b-form-group>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'formCompanyUrl',
  data () {
    return {
      url: ''
    }
  },
  mounted () {
    
  },
  methods: {
    
  }
}
</script>

<style>
</style>