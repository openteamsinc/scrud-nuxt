
<script>
import { forIn } from 'lodash'

export default {
  name: 'Person',
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
      <b-container fluid>
        <div>
          {this.data.test}
        </div>
      </b-container>
    )
  },
  methods: {
    getValues () {
      let nodes = []

      nodes.push(
        <b-row>
          <b-col>
            { "Name" }
          </b-col>
          <b-col>
            { this.data.givenName.data + " " + this.data.familyName.data }
          </b-col>
        </b-row>
      )

      forIn(this.data, (value, key) => {
        if (key !== "givenName" && key !== "familyName") {
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
        }
      })
      return nodes
    }
  }
}
</script>

<style lang="scss">
</style>
