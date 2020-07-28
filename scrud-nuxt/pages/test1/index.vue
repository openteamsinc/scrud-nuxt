<template>
  <div id="schema-test" class="container mb-3 mt-3">
    <vue-form-json-schema
      :model="model"
      :schema="schema"
      :ui-schema="uiSchema"
      v-on:change="onChange"
      v-on:state-change="onChangeState"
      v-on:validated="onValidated"
    ></vue-form-json-schema>
  </div>
</template>

<script>
import VueFormJsonSchema from "vue-form-json-schema/dist/vue-form-json-schema.esm.js";

export default {
  name: "schema-test",
  components: {
    "vue-form-json-schema": VueFormJsonSchema,
  },
  data() {
    return {
      model: {},
      state: {},
      valid: false,
      schema: {
        type: "object",
        properties: {
          firstName: {
            type: "string"
          }
        }
      },
      uiSchema: [
        {
          component: "b-form-input",
          model: "firstName",
          fieldOptions: {
            class: ["form-control"],
            on: ["input"],
            props: {
              type: "text",
              placeholder:
                "I am the <b-form-input> component from BootstrapVue!"
            }
          }
        }
      ]
    };
  },
  methods: {
    onChange(value) {
      this.model = value;
    },
    onChangeState(value) {
      this.state = value;
    },
    onValidated(value) {
      this.valid = value;
    }
  }
};
</script>

<style>
.btn {
  margin: 5px;
  margin-right: 5px;
}
</style>