<template>
  <b-container fluid>
    <b-row class="my-1 mx-1">
      <b-form-group class="col-5" label="First Name" label-for="name">
        <b-form-input
          id="name"
          type="text"
          required
          :validated="validatedName"
          :state="validatedName"
          v-model="first_name">
        </b-form-input>
      </b-form-group>

      <b-form-group class="col-5" label="Last Name" label-for="surname">
        <b-form-input
          type="text"
          id="surname"
          required
          :validated="validatedSurname"
          :state="validatedSurname"
          v-model="last_name">
        </b-form-input>
      </b-form-group>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'FormName',
  data () {
    return {
      first_name: '',
      last_name: ''
    }
  },
  computed: {
    validatedName () {
      if (this.first_name.length > 0) {
        return !this.hasNumber(this.first_name)
      } else {
        return null
      }
    },
    validatedSurname () {
      if (this.last_name.length > 0) {
        return !this.hasNumber(this.last_name)
      } else {
        return null
      }
    }
  },
  mounted () {
  },
  methods: {
    hasNumber(str) {
      var matches = str.match(/\d+/g);
      if (matches != null) {
        return matches
      }
    }
  }
}
</script>

<style>
</style>