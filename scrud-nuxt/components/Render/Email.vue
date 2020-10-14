<template>
  <b-container fluid class="col">
    <a :href="`mailto:${data}`">{{ data }}</a>
  </b-container>
</template>
<script>

export default {
  name: 'Email',
  props: {
    data: {
      type: String
    },
    label: {
      type: String
    }
  },
  data () {
    return {
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