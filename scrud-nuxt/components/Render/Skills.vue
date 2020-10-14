<template>
  <b-container fluid class="col">
    <h4>
      <b-badge
        class="mr-1 font-weight-light"
        variant="secondary"
        v-for="skill in data"
        :key="skill"
      >
        {{ skill }}
      </b-badge>
    </h4>
  </b-container>
</template>
<script>

export default {
  name: 'Skills',
  props: {
    data: {
      type: Object
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