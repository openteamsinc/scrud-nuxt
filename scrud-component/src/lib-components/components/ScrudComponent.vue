
<template>

    <vue-form-json-schema
      :schema="{}"
      :ui-schema="uiSchema"
    >
    </vue-form-json-schema>

</template>

<script>

import VueFormJsonSchema from 'vue-form-json-schema/dist/vue-form-json-schema.esm.js';
import RdfContext from 'rdf-context'
import CachingClient from 'caching-client'
import { UISchema, UISchemaNode } from '../utils/ui-schema'
import li from 'li'

export default {
  props: {
    scrudResourceURL: {
      type: String
    },
    configMapping: {
      type: Object
    },
    uiType: {
      type: String
    }
  },
  components: {
    'vue-form-json-schema': VueFormJsonSchema
  },
  data () {
    return {
      uiSchemaObject: new UISchema(),
      cachingClient: new CachingClient(),
      uiSchema: [],
      components: [],
      schemaURL: null,
      contextURL: null
    }
  },
  created () {
    // Fetch options to get schema and context URLs then call according method to generate UI
    this.cachingClient.options(this.scrudResourceURL).then(res => {
        res.json().then(body => {
          let requestType = body[this.uiType]

          switch (this.uiType) {
            case 'post':
              this.schemaURL = this.getPostSchemaURL(requestType)
              this.contextURL = this.getPostContextURL(requestType)
              return this.generateUIPost()
            case 'get':
              this.schemaURL = this.getSchemaURL(requestType)
              this.contextURL = this.getContextURL(requestType)
              return this.generateUIGet()
            default:
              break
        }

          this.generateUIPost()
        })
      })
  },
  methods: {
    getPostSchemaURL (data) {
      return data.requestBody.content['application/json'].schema
    },
    getPostContextURL (data) {
      return data.requestBody.content['application/json'].context
    },
    getSchemaURL (data) {
      return data.responses['200'].content['application/json'].schema
    },
    getContextURL (data) {
      return data.responses['200'].content['application/json'].context
    },
    generateUIPost () {
      this.cachingClient.get(this.contextURL).then(res => {
        res.json().then(body => {
          let superType = this.getComponentByRdfType(body['@type'])
          let superTypeNode = new UISchemaNode(superType)
          
          let children = []
          let afterType = false

          Object.keys(body).forEach(key => {
            if (afterType) {
              let component = this.getComponentByRdfType(body[key]['@id'])
              let node = new UISchemaNode(component)

              children.push(node)
            } else {
              afterType = key === '@type'
            }
          })

          superTypeNode.setChildren(children)

          this.uiSchemaObject.addNode(superTypeNode)

          this.uiSchema = this.uiSchemaObject.getUISchema()
        })
      })
    },
    generateUIGet () {
      this.cachingClient.get(this.contextURL).then(res => {
        res.json().then(body => {
          this.cachingClient.get(this.scrudResourceURL).then(res => {
            res.json().then(data => {
              let superType = this.getComponentByRdfType(body.content['@container'])
              let superTypeNode = new UISchemaNode(superType)

              let href = data.content[0].href

              this.cachingClient.get(href).then(ref => {
                let linkHeaders = ref.headers.get('link')
                let linkContext = li.parse(linkHeaders)['http://www.w3.org/ns/json-ld#context']

                this.cachingClient.get(linkContext).then(ld => {
                  ld.json().then(ldJson => {
                    let children = []

                    data.content.forEach(dataItem => {
                      let content = dataItem.content

                      let card = new UISchemaNode('b-card')

                      let cardChildren = []

                      Object.keys(ldJson).forEach(key => {
                        console.log(key)
                        let component = this.getComponentByRdfType(ldJson[key]['@id'])

                        let fieldOptions = {
                          props: {
                            data: content[key]
                          }
                        }

                        let node = new UISchemaNode(component, fieldOptions)

                        cardChildren.push(node)
                      })
                      card.setChildren(cardChildren)
                      children.push(card)
                    })

                    superTypeNode.setChildren(children)
                    
                    this.uiSchemaObject.addNode(superTypeNode)

                    this.uiSchema = this.uiSchemaObject.getUISchema()
                  })
                })
              })
            })
          })
        })
      })
    },
    getComponentByRdfType (type) {
      let match = this.configMapping.components[type]

      if (match) {
        switch (this.uiType) {
          case 'post':
            return match.input
          case 'get':
            return match.render
          default:
            break
        }
      }
      return 'String'
    }
  },
}
</script>

<style lang="scss">
</style>
