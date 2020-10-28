<template>
  <b-container fluid>
    <b-list-group class="mt-1">
      <b-list-group-item
        :v-if="data"
        v-for="service in data"
        :key="service"
      >
        {{ service }}
      </b-list-group-item>
    </b-list-group>
  </b-container>
</template>
<script>

export default {
  name: 'Services',
  props: {
    data: {
      type: Array
    },
    label: {
      type: String
    }
  }
}
</script>

<style>
</style>