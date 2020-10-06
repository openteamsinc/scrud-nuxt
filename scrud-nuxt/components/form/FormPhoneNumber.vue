<template>
  <b-container fluid>
    <b-row class="my-1 mx-1">
      <b-form-group class="col-10" label="Phone Number" label-for="phone">
        <b-form-input
          class=""
          id="phone"
          type="text"
          v-model="phone"
        ></b-form-input>
      </b-form-group>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'FormPhoneNumberField',
  data () {
    return {
      phone: ''
    }
  },
  mounted () {
    
  },
  computed: {
  },
  methods: {
    
  }
}
</script>

<style>
</style>