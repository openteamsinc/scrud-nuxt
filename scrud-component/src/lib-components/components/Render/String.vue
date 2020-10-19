<template>
  <b-container fluid class="col string">
    <div class="label">{{ label }}</div>
    <div class="data">{{ data }}</div>
  </b-container>
</template>
<script>

export default {
  name: 'String',
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
.string {
  margin-top: 4px;
  font-family: sans-serif;
}
.data {
  font-size: .875rem;
  border: none;
}
.label {
  font-size: .875rem;
  font-weight: 600;
  opacity: .75;
  margin-bottom: 4px;
}
</style>