<template>
  <div class="contain">
    <b-row>

      <b-col class="left-pane">
        <b-form @submit="onSubmit">

          <b-row>
            <b-col>
              <b-form-group
                id="url-input-group"
                label="URL"
                label-for="url-input"
              >
                <b-form-input
                  id="url-input"
                  v-model="form.url"
                  placeholder="Enter URL"
                  aria-describedby="url-input-feedback url-input-feedback-slash"
                  :state="urlState"
                  required
                  trim
                >
                </b-form-input>
                <b-form-invalid-feedback id="url-input-feedback">
                  Enter a valid URL
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
            
            <b-col v-if="!hasOptions">
              <label class="mr-sm-2" for="inline-form-custom-select-pref">Request Type</label>
              <b-form-select
                id="inline-form-custom-select-pref"
                class="mb-2 mr-sm-2 mb-sm-0"
                :value="null"
                :options="this.options"
                disabled
              ></b-form-select>
            </b-col>
            <b-col v-else>
              <label class="mr-sm-2" for="inline-form-custom-select-pref">Request Type</label>
              <b-form-select
                id="inline-form-custom-select-pref"
                class="mb-2 mr-sm-2 mb-sm-0"
                :options="this.options"
                v-model="requestType"
              ></b-form-select>
            </b-col>
          </b-row>

          <b-button class="request-btn" type="submit" variant="primary">{{ submitTitle }}</b-button>
          
          <div v-if="this.hasSchema && this.requestType === 'POST'">
            <div
              v-for="(param, key) in this.schema.properties"
              :key="key"
            >
              <b-form-group
                :id="key"
                :label="key"
                :label-for="key"
              >
                <b-form-input
                  :id="key"
                  :placeholder="key"
                  v-model="schema.properties[key].value"
                  trim
                >
                </b-form-input>
              </b-form-group>
            </div>
          </div>

        </b-form>
      </b-col>

      <b-col class="right-pane">

        <b-card class="mt-3" header="Results">
          <pre class="m-0">{{ form.results }}</pre>
        </b-card>

      </b-col>

    </b-row>
  </div>
</template>

<script>

  import DemoService from '~/services/DemoService'
  import li from 'li'

  export default {
    data () {
      return {
        form: {
          url: '',
          results: {}
        },
        requestType: 'OPTIONS',
        submitTitle: 'Get Options',
        options: [{ text: 'Choose...', value: null }],
        postData: undefined,
        currentUrl: undefined,
        hasOptions: false,
        hasSchema: false,
        schema: undefined
      }
    },
    computed: {
      urlState() {
        try {
          if (this.currentUrl !== this.form.url) {
            this.options = [{ text: 'Choose...', value: null }]
            this.hasOptions = false
            this.submitTitle = 'Get Options'
            this.requestType = 'OPTIONS'
            this.schema = undefined
            this.hasSchema = false
            this.postData = undefined
          }
          let url = new URL(this.form.url)
          return true
        } catch(e) {
          return false
        }
      }
    },
    created () {
    },
    components: {
    },
    methods: {
      onSubmit (evt) {
        evt.preventDefault()

        switch (this.requestType) {
          case 'OPTIONS':
            this.handleOptions()
            break
          case 'GET':
            this.handleGet()
            break
          case 'POST':
            this.handlePost()
            break
        }
      },
      handleOptions () {
        const service = new DemoService()

        service.options(this.form.url).then(res => {
          res.json().then(body => {
            this.currentUrl = this.form.url
            this.form.results = body

            Object.keys(body).forEach(key => {
              this.options.push(key.toUpperCase())
            })

            this.submitTitle = 'Make Request'
            this.hasOptions = true

            let schema = body.post.requestBody.content['application/json'].schema

            console.log(schema)

            if (schema) {
              service.get(schema).then(res => {
                res.json().then(body => {
                  this.schema = {}
                  this.schema['id'] = body['$id']
                  this.schema['description'] = body.description

                  this.schema.properties = {}

                  Object.keys(body.properties).forEach(key => {
                    this.schema.properties[key] = body.properties[key]
                    this.schema.properties[key].value = undefined
                  })

                  this.hasSchema = true;
                })
              })
            }

          }).catch(e => {
            this.form.results = 'Error: Enter a valid endpoint'
          })
        }).catch(e => {
          this.form.results = 'Error. Valid endpoint, add slash to end of url'
        })
      },
      handleGet () {
        const service = new DemoService()

        service.get(this.form.url).then(res => {
          let link = res.headers.get('link')
          let linkContext = li.parse(link)['http://www.w3.org/ns/json-ld#context']

          res.json().then(body => {
            this.currentUrl = this.form.url
            this.form.results = body
          })
        })
      },
      handlePost () {
        const service = new DemoService()

        let data = {}

        Object.keys(this.schema.properties).forEach(key => {
          data[key] = this.schema.properties[key].value
        })

        service.post(this.form.url, data).then(res => {
          console.log(res)
        })
      }
    }
  }
</script>

<style>
.contain {
  padding: 8px;
  margin: 4px;
  border: 1px;
  border-style: solid;
  border-radius: 4px;
  border-color: lightgray;
}

.left-pane {
  border-right: solid 1px;
  border-color: lightgray;
}

.right-pane {

}

.request-btn {
  margin-bottom: 8px;
}
</style>