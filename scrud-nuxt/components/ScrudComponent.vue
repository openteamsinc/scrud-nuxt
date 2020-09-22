
<template>

    <vue-form-json-schema
      :schema="{}"
      :ui-schema="uiSchema"
    >
    </vue-form-json-schema>

</template>

<script>

import VueFormJsonSchema from 'vue-form-json-schema/dist/vue-form-json-schema.esm.js';
import DemoService from '~/services/DemoService'
import RdfContext from 'rdf-context'
import { UISchema, UISchemaNode } from '~/plugins/ui-schema'
import li from 'li'

export default {
  props: {
    link: {
      type: String
    },
    data: {
      type: Object
    }
  },
  components: {
    'vue-form-json-schema': VueFormJsonSchema
  },
  data () {
    return {
      map: {
        host: 'http://localhost:8000',
        components: {
          '/collections-json-ld/partner-profiles/': 'CardCollection',
          '/json-ld/PartnerProfile/': 'PartnerProfile'
        }
      },
      uiSchemaObject: new UISchema(),
      uiSchema: [],
      components: []
    }
  },
  created () {
    let linkContext = li.parse(this.link)['http://www.w3.org/ns/json-ld#context']
    let linkComponent = this.matchComponent(linkContext)
  },
  methods: {
    matchComponent (url) {
      let toMatch = new URL(url)
      let pathname = toMatch.pathname
      let component = this.map.components[pathname]

      if (component) {
        this.checkContent(url, component)
      } else {
        throw new Error('Scrud resource mapping error: path ' + pathname + ' could not be matched with a component. Check configuration mapping')
      }
    },
    checkContent (url, component) {
      this.components.push(component)
      fetch(url).then(res => {
        res.json().then(body => {
          let envelopeKey

          Object.keys(body.content).forEach(key => {
            envelopeKey = key.includes(':envelopeContents') ? key : undefined
          })
          
          let envelopeContentUrl = body.content[envelopeKey]
          let envelopeContentComponent = this.matchComponent(envelopeContentUrl)

          // TODO: Add auto positioning in the tree structure i.e. remove magic array numbers
          switch (body.content['@container']) {
            case '@list': {
              let children = []

              this.data.content.forEach(data => {
                let fieldOptions = {
                  props: {
                    data: data
                  }
                }
                children.push(new UISchemaNode(this.components[1], fieldOptions))
              })

              this.uiSchemaObject.createNode(this.components[0], {}, children)
            }
          }
          this.uiSchema = this.uiSchemaObject.getUISchema()
        })
        .catch(err => {
          console.log(err)
        })
      })
    }
  },
}
</script>

<style lang="scss">
</style>
