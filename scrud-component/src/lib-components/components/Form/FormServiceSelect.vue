<template>
  <b-container fluid>
    <b-form-group class="col-10" label="Company services">
      <b-form-select 
        style="margin-top: 8px;"
        v-for="option in options"
        :key="option.value"
        v-model="selected"
        :options="getOptions()"
        :change="onSelection()">
      </b-form-select>
    </b-form-group>
  </b-container>
</template>

<script>
  export default {
    name: 'FormServiceSelect',
    data () {
      return {
        selections: [],
        selected: {},
        options: [
          { value: null, text: 'Please select an option' },
          { value: 'Consulting', text: 'Consulting' },
          { value: 'Training', text: 'Training' },
          { value: 'Support', text: 'Support' },
          { value: 'Bug Fixes', text: 'Bug Fixes'},
          { value: 'Customization', text: 'Customization'},
        ]
      }
    },
    methods: {
      onSelection () {
        if (this.selections.indexOf(this.selected) < 0 && this.selected) {
          this.selections.push(this.selected)
        }
      },
      getOptions () {
        let options = []

        this.options.forEach(option => {
          if (this.selections.indexOf(option.value) < 0) {
            options.push({ value: option.value, text: option.text })
          }
        })

        return options
      }
    }
  }
</script>