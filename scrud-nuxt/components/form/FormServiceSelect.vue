<template>
  <b-container fluid>
    <b-form-group class="col-10" label="Company services" label-for="email">
        <b-form-select v-model="selected" :options="options"></b-form-select>
    </b-form-group>
  </b-container>
</template>

<script>
  export default {
    data() {
      return {
        selected: null,
        options: [
          { value: null, text: 'Please select an option' },
          { value: 'Consulting', text: 'Consulting' },
          { value: 'Training', text: 'Training' },
          { value: 'Support', text: 'Support' },
          { value: 'Bug Fixes', text: 'Bug Fixes'},
          { value: 'Customization', text: 'Customization'},
        ]
      }
    }
  }
</script>