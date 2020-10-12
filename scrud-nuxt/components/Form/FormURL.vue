<template>
  <b-container fluid>
    <b-row class="my-1 mx-1">
      <b-form-group class="col-10" :label="label" label-for="url">
        <b-form-input
          class=""
          id="url"
          type="url"
          v-model="url"
        ></b-form-input>
      </b-form-group>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'FormURL',
  props: {
    label: {
      type: String
    }
  },
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