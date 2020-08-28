
<template>
    <vue-form-json-schema
      v-model="mapping.model"
      :schema="mapping.schema"
      :ui-schema="mapping.uiSchema"
    >
    </vue-form-json-schema>
</template>

<script>

import VueFormJsonSchema from 'vue-form-json-schema/dist/vue-form-json-schema.esm.js';

import { forIn } from 'lodash'

export default {
  props: {
    mapping: {
      type: Object
    }
  },
  components: {
    'vue-form-json-schema': VueFormJsonSchema
  },
  methods: {
  }
}
</script>

<style lang="scss">
</style>
