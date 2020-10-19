<template>
  <b-container fluid>
    <b-row class="my-1 mx-1">
      <b-form-group class="col-10" label="Email" label-for="email">
        <b-form-input
          class=""
          id="email"
          type="email"
          v-model="email"
        ></b-form-input>
      </b-form-group>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'FormEmail',
  data () {
    return {
      email: ''
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