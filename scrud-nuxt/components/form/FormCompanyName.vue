<template>
  <b-container fluid>
    <b-row class="my-1 mx-1">
      <b-form-group class="col-10" label="Company Name" label-for="company_name">
        <b-form-input
          class=""
          id="company_name"
          type="text"
          v-model="company_name"
        ></b-form-input>
      </b-form-group>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'formCompanyName',
  data () {
    return {
      company_name: ''
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