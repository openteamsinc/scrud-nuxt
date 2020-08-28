
<script>
import { forIn } from 'lodash'

export default {
  props: {
    data: {
      type: Object
    },
    children: {
      type: Array
    }
  },
  render (h) {
    return (
      <div style="border: solid">
        <b-col>{ this.getValues() }</b-col>
      </div>
    )
  },
  methods: {
    getValues () {
      let nodes = []

      forIn(this.data, (value, key) => {
          nodes.push(
            <b-row>
              <b-col>
                { key }
              </b-col>
              <b-col>
                { value.data }
              </b-col>
            </b-row>
          )
      })
      return nodes
    }
  }
}
</script>

<style lang="scss">
</style>
