<template>
  <b-card class="partner-card">
    <b-card-img :src="logo" alt="Image"></b-card-img>
    <b-card-body>
      <b-card-title>{{ displayName }}</b-card-title>
    </b-card-body>
  </b-card>
</template>


<script>
export default {
  name: 'PartnerProfile',
  props: {
    displayName: {
      type: String
    },
    logo: {
      type: String
    }
  },
  methods: {

  }
}
</script>

<style>
.partner-card {
  max-width: 20rem;
  min-width: 20rem;
}

</style>
