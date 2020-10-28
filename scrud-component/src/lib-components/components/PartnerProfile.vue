<template>
  <b-card class="partner-card">
    <b-card-img :src="data.content.logo" alt="Image"></b-card-img>
    <b-card-body>
      <b-card-title>{{ data.content.displayName }}</b-card-title>
    </b-card-body>
  </b-card>
</template>


<script>
export default {
  name: 'PartnerProfile',
  props: {
    data: {
      type: Object
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
