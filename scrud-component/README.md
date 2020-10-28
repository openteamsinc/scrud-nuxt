# scrud-component

Vue plugin for the `ScrudComponent`

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:8080
$ npm run serve

# build for production
$ npm run build
```

For more build options check the `package.json` `scripts` section


## Usage

Clone this repo at the same level of the project that will be using the `ScrudComponent` and install it using npm:

```bash
$ npm install --save ./scrud-nuxt/scrud-component
```

Now your `package.json` should reflect the new dependency as `"scrud-component": "file:../scrud-nuxt/scrud-component"` and setup your project as with any other [Vue plugin](https://nuxtjs.org/guide/plugins/#vue-plugins):

* Create a `.js` at `~plugins/` something like `scrud-component.js`

* The content of the file should look something like:

```js
import Vue from 'vue'
import plugin from 'scrud-component'

Vue.use(plugin)
```

* Add the plugin to `nuxt.config.js`:

```js
/*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [
    { src: '~plugins/scrud-component.js', ssr: false }
  ],

```
The ssr false option is needed since the `scrud-component` uses as HTTP Client the `Caching Client` which uses the Browser Cache API (i.e `caches` global variable).


An example use of the `ScrudComponent` can be seen at the [`dev/serve.vue`](dev/serve.vue) file and the [`scrud-nuxt` app](../scrud-nuxt/README.md)).
