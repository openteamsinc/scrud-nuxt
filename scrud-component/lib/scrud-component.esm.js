import VueFormJsonSchema from 'vue-form-json-schema/dist/vue-form-json-schema.esm.js';
import 'rdf-context';
import CachingClient from 'caching-client';
import li from 'li';
import { forIn } from 'lodash';
import Vue from 'vue';
import vueCountryRegionSelect from 'vue-country-region-select';

class UISchema {
  constructor() {
    this.uiSchema = [];
  }

  createNode(component, fieldOptions = {}, children = []) {
    this.uiSchema.push(new UISchemaNode(component, fieldOptions, children));
  }

  addNode(node) {
    this.uiSchema.push(node);
  }

  getUISchema() {
    let schema = [];
    this.uiSchema.forEach(node => {
      schema.push(node.getSchema());
    });
    return schema;
  }

  getNodes() {
    return this.uiSchema;
  }

}

class UISchemaNode {
  constructor(component, fieldOptions = {}, children = []) {
    this.node = {
      component: component,
      fieldOptions: fieldOptions,
      children: children
    };
  }

  setChildren(children) {
    this.node.children = children;
  }

  setFieldOptions(fieldOptions) {
    this.node.fieldOptions = fieldOptions;
  }

  getSchema() {
    let schema = {
      component: this.node.component,
      fieldOptions: this.node.fieldOptions,
      children: []
    };
    this.node.children.forEach(child => {
      schema.children.push(child.getSchema());
    });
    return schema;
  }

  getNode() {
    return this.node;
  }

  getChildren() {
    return this.node.children;
  }

  getFieldOptions() {
    return this.node.fieldOptions;
  }

  getComponent() {
    return this.node.component;
  }

}

//
var script = {
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

  data() {
    return {
      uiSchemaObject: new UISchema(),
      cachingClient: new CachingClient(),
      uiSchema: [],
      components: [],
      schemaURL: null,
      contextURL: null
    };
  },

  created() {
    // Fetch options to get schema and context URLs then call according method to generate UI
    console.log(this);
    console.log(this._props);
    this.cachingClient.options(this.scrudResourceURL).then(res => {
      res.json().then(body => {
        let requestType = body[this.uiType];

        switch (this.uiType) {
          case 'post':
            this.schemaURL = this.getPostSchemaURL(requestType);
            this.contextURL = this.getPostContextURL(requestType);
            return this.generateUIPost();

          case 'get':
            this.schemaURL = this.getSchemaURL(requestType);
            this.contextURL = this.getContextURL(requestType);
            return this.generateUIGet();
        }

        this.generateUIPost();
      });
    });
  },

  methods: {
    getPostSchemaURL(data) {
      return data.requestBody.content['application/json'].schema;
    },

    getPostContextURL(data) {
      return data.requestBody.content['application/json'].context;
    },

    getSchemaURL(data) {
      return data.responses['200'].content['application/json'].schema;
    },

    getContextURL(data) {
      return data.responses['200'].content['application/json'].context;
    },

    generateUIPost() {
      this.cachingClient.get(this.contextURL).then(res => {
        res.json().then(body => {
          let superType = this.getComponentByRdfType(body['@type']);
          let superTypeNode = new UISchemaNode(superType);
          let children = [];
          let afterType = false;
          Object.keys(body).forEach(key => {
            if (afterType) {
              let component = this.getComponentByRdfType(body[key]['@id']);
              let node = new UISchemaNode(component);
              children.push(node);
            } else {
              afterType = key === '@type';
            }
          });
          superTypeNode.setChildren(children);
          this.uiSchemaObject.addNode(superTypeNode);
          this.uiSchema = this.uiSchemaObject.getUISchema();
        });
      });
    },

    generateUIGet() {
      this.cachingClient.get(this.contextURL).then(res => {
        res.json().then(body => {
          this.cachingClient.get(this.scrudResourceURL).then(res => {
            res.json().then(data => {
              let superType = this.getComponentByRdfType(body.content['@container']);
              let superTypeNode = new UISchemaNode(superType);
              let href = data.content[0].href;
              this.cachingClient.get(href).then(ref => {
                let linkHeaders = ref.headers.get('link');
                let linkContext = li.parse(linkHeaders)['http://www.w3.org/ns/json-ld#context'];
                this.cachingClient.get(linkContext).then(ld => {
                  ld.json().then(ldJson => {
                    let children = [];
                    data.content.forEach(dataItem => {
                      let content = dataItem.content;
                      let card = new UISchemaNode('b-card');
                      let cardChildren = [];
                      Object.keys(ldJson).forEach(key => {
                        console.log(key);
                        let component = this.getComponentByRdfType(ldJson[key]['@id']);
                        let fieldOptions = {
                          props: {
                            data: content[key]
                          }
                        };
                        let node = new UISchemaNode(component, fieldOptions);
                        cardChildren.push(node);
                      });
                      card.setChildren(cardChildren);
                      children.push(card);
                    });
                    superTypeNode.setChildren(children);
                    this.uiSchemaObject.addNode(superTypeNode);
                    this.uiSchema = this.uiSchemaObject.getUISchema();
                  });
                });
              });
            });
          });
        });
      });
    },

    getComponentByRdfType(type) {
      let match = this.configMapping.components[type];

      if (match) {
        switch (this.uiType) {
          case 'post':
            return match.input;

          case 'get':
            return match.render;
        }
      }

      return 'String';
    }

  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

/* script */
const __vue_script__ = script;
/* template */

var __vue_render__ = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('vue-form-json-schema', {
    attrs: {
      "schema": {},
      "ui-schema": _vm.uiSchema
    }
  });
};

var __vue_staticRenderFns__ = [];
/* style */

const __vue_inject_styles__ = undefined;
/* scoped */

const __vue_scope_id__ = undefined;
/* module identifier */

const __vue_module_identifier__ = undefined;
/* functional template */

const __vue_is_functional_template__ = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, undefined, undefined);

//
var script$1 = {
  name: 'Person',
  props: {
    data: {
      type: Object
    },
    children: {
      type: Array
    }
  },

  render(h) {
    return h("b-container", {
      "attrs": {
        "fluid": true
      }
    }, [h("div", [this.data.test])]);
  },

  methods: {
    getValues() {
      const h = this.$createElement;
      let nodes = [];
      nodes.push(h("b-row", [h("b-col", ["Name"]), h("b-col", [this.data.givenName.data + " " + this.data.familyName.data])]));
      forIn(this.data, (value, key) => {
        if (key !== "givenName" && key !== "familyName") {
          nodes.push(h("b-row", [h("b-col", [key]), h("b-col", [value.data])]));
        }
      });
      return nodes;
    }

  }
};

/* script */
const __vue_script__$1 = script$1;
/* template */

/* style */

const __vue_inject_styles__$1 = undefined;
/* scoped */

const __vue_scope_id__$1 = undefined;
/* module identifier */

const __vue_module_identifier__$1 = undefined;
/* functional template */

const __vue_is_functional_template__$1 = undefined;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$1 = /*#__PURE__*/normalizeComponent({}, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, false, undefined, undefined, undefined);

//
//
//
//
//
//
//
//
//
//
var script$2 = {
  name: 'PartnerProfile',
  props: {
    data: {
      type: Object
    }
  },
  methods: {}
};

const isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return (id, style) => addStyle(id, style);
}
let HEAD;
const styles = {};
function addStyle(id, css) {
    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        let code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                style.element.setAttribute('media', css.media);
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            const index = style.ids.size - 1;
            const textNode = document.createTextNode(code);
            const nodes = style.element.childNodes;
            if (nodes[index])
                style.element.removeChild(nodes[index]);
            if (nodes.length)
                style.element.insertBefore(textNode, nodes[index]);
            else
                style.element.appendChild(textNode);
        }
    }
}

/* script */
const __vue_script__$2 = script$2;
/* template */

var __vue_render__$1 = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('b-card', {
    staticClass: "partner-card"
  }, [_c('b-card-img', {
    attrs: {
      "src": _vm.data.content.logo,
      "alt": "Image"
    }
  }), _vm._v(" "), _c('b-card-body', [_c('b-card-title', [_vm._v(_vm._s(_vm.data.content.displayName))])], 1)], 1);
};

var __vue_staticRenderFns__$1 = [];
/* style */

const __vue_inject_styles__$2 = function (inject) {
  if (!inject) return;
  inject("data-v-c623a7b0_0", {
    source: ".partner-card{max-width:20rem;min-width:20rem}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


const __vue_scope_id__$2 = undefined;
/* module identifier */

const __vue_module_identifier__$2 = undefined;
/* functional template */

const __vue_is_functional_template__$2 = false;
/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$2 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$1,
  staticRenderFns: __vue_staticRenderFns__$1
}, __vue_inject_styles__$2, __vue_script__$2, __vue_scope_id__$2, __vue_is_functional_template__$2, __vue_module_identifier__$2, false, createInjector, undefined, undefined);

//
var script$3 = {
  name: 'CardCollection',

  render(h) {
    return this.getCards();
  },

  methods: {
    getCards() {
      const h = this.$createElement;
      let cards = this.$slots.default;
      let elems = [];

      if (cards) {
        cards.forEach(card => {
          elems.push(h("div", {
            "class": "col-auto mb-3"
          }, [card]));
        });
      }

      return h("div", {
        "class": "container mt-3"
      }, [h("div", {
        "class": "row"
      }, [elems])]);
    }

  }
};

/* script */
const __vue_script__$3 = script$3;
/* template */

/* style */

const __vue_inject_styles__$3 = undefined;
/* scoped */

const __vue_scope_id__$3 = undefined;
/* module identifier */

const __vue_module_identifier__$3 = undefined;
/* functional template */

const __vue_is_functional_template__$3 = undefined;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$3 = /*#__PURE__*/normalizeComponent({}, __vue_inject_styles__$3, __vue_script__$3, __vue_scope_id__$3, __vue_is_functional_template__$3, __vue_module_identifier__$3, false, undefined, undefined, undefined);

//
//
//
//
//
//
var script$4 = {};

/* script */
const __vue_script__$4 = script$4;
/* template */

var __vue_render__$2 = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "form col"
  }, [_vm._t("default")], 2);
};

var __vue_staticRenderFns__$2 = [];
/* style */

const __vue_inject_styles__$4 = function (inject) {
  if (!inject) return;
  inject("data-v-6781ce92_0", {
    source: ".form{width:50%;margin-left:25%;margin-right:25%;border:1px solid #464646;border-radius:8px;margin-top:10px}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


const __vue_scope_id__$4 = undefined;
/* module identifier */

const __vue_module_identifier__$4 = undefined;
/* functional template */

const __vue_is_functional_template__$4 = false;
/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$4 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$2,
  staticRenderFns: __vue_staticRenderFns__$2
}, __vue_inject_styles__$4, __vue_script__$4, __vue_scope_id__$4, __vue_is_functional_template__$4, __vue_module_identifier__$4, false, createInjector, undefined, undefined);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var script$5 = {
  name: 'FormCompanyName',

  data() {
    return {
      email: ''
    };
  },

  mounted() {},

  methods: {}
};

/* script */
const __vue_script__$5 = script$5;
/* template */

var __vue_render__$3 = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('b-container', {
    attrs: {
      "fluid": ""
    }
  }, [_c('b-row', {
    staticClass: "my-1 mx-1"
  }, [_c('b-form-group', {
    staticClass: "col-10",
    attrs: {
      "label": "Company Name",
      "label-for": "company_name"
    }
  }, [_c('b-form-input', {
    attrs: {
      "id": "company_name",
      "type": "text"
    },
    model: {
      value: _vm.email,
      callback: function ($$v) {
        _vm.email = $$v;
      },
      expression: "email"
    }
  })], 1)], 1)], 1);
};

var __vue_staticRenderFns__$3 = [];
/* style */

const __vue_inject_styles__$5 = undefined;
/* scoped */

const __vue_scope_id__$5 = undefined;
/* module identifier */

const __vue_module_identifier__$5 = undefined;
/* functional template */

const __vue_is_functional_template__$5 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$5 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$3,
  staticRenderFns: __vue_staticRenderFns__$3
}, __vue_inject_styles__$5, __vue_script__$5, __vue_scope_id__$5, __vue_is_functional_template__$5, __vue_module_identifier__$5, false, undefined, undefined, undefined);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var script$6 = {
  name: 'FormEmail',

  data() {
    return {
      email: ''
    };
  },

  mounted() {},

  methods: {}
};

/* script */
const __vue_script__$6 = script$6;
/* template */

var __vue_render__$4 = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('b-container', {
    attrs: {
      "fluid": ""
    }
  }, [_c('b-row', {
    staticClass: "my-1 mx-1"
  }, [_c('b-form-group', {
    staticClass: "col-10",
    attrs: {
      "label": "Email",
      "label-for": "email"
    }
  }, [_c('b-form-input', {
    attrs: {
      "id": "email",
      "type": "email"
    },
    model: {
      value: _vm.email,
      callback: function ($$v) {
        _vm.email = $$v;
      },
      expression: "email"
    }
  })], 1)], 1)], 1);
};

var __vue_staticRenderFns__$4 = [];
/* style */

const __vue_inject_styles__$6 = undefined;
/* scoped */

const __vue_scope_id__$6 = undefined;
/* module identifier */

const __vue_module_identifier__$6 = undefined;
/* functional template */

const __vue_is_functional_template__$6 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$6 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$4,
  staticRenderFns: __vue_staticRenderFns__$4
}, __vue_inject_styles__$6, __vue_script__$6, __vue_scope_id__$6, __vue_is_functional_template__$6, __vue_module_identifier__$6, false, undefined, undefined, undefined);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var script$7 = {
  name: 'FormName',

  data() {
    return {
      first_name: '',
      last_name: ''
    };
  },

  computed: {
    validatedName() {
      if (this.first_name.length > 0) {
        return !this.hasNumber(this.first_name);
      } else {
        return null;
      }
    },

    validatedSurname() {
      if (this.last_name.length > 0) {
        return !this.hasNumber(this.last_name);
      } else {
        return null;
      }
    }

  },

  mounted() {},

  methods: {
    hasNumber(str) {
      var matches = str.match(/\d+/g);

      if (matches != null) {
        return matches;
      }
    }

  }
};

/* script */
const __vue_script__$7 = script$7;
/* template */

var __vue_render__$5 = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('b-container', {
    attrs: {
      "fluid": ""
    }
  }, [_c('b-row', {
    staticClass: "my-1 mx-1"
  }, [_c('b-form-group', {
    staticClass: "col-5",
    attrs: {
      "label": "First Name",
      "label-for": "name"
    }
  }, [_c('b-form-input', {
    attrs: {
      "id": "name",
      "type": "text",
      "required": "",
      "validated": _vm.validatedName,
      "state": _vm.validatedName
    },
    model: {
      value: _vm.first_name,
      callback: function ($$v) {
        _vm.first_name = $$v;
      },
      expression: "first_name"
    }
  })], 1), _vm._v(" "), _c('b-form-group', {
    staticClass: "col-5",
    attrs: {
      "label": "Last Name",
      "label-for": "surname"
    }
  }, [_c('b-form-input', {
    attrs: {
      "type": "text",
      "id": "surname",
      "required": "",
      "validated": _vm.validatedSurname,
      "state": _vm.validatedSurname
    },
    model: {
      value: _vm.last_name,
      callback: function ($$v) {
        _vm.last_name = $$v;
      },
      expression: "last_name"
    }
  })], 1)], 1)], 1);
};

var __vue_staticRenderFns__$5 = [];
/* style */

const __vue_inject_styles__$7 = undefined;
/* scoped */

const __vue_scope_id__$7 = undefined;
/* module identifier */

const __vue_module_identifier__$7 = undefined;
/* functional template */

const __vue_is_functional_template__$7 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$7 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$5,
  staticRenderFns: __vue_staticRenderFns__$5
}, __vue_inject_styles__$7, __vue_script__$7, __vue_scope_id__$7, __vue_is_functional_template__$7, __vue_module_identifier__$7, false, undefined, undefined, undefined);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var script$8 = {
  name: 'FormPhoneNumber',

  data() {
    return {
      phone: ''
    };
  },

  mounted() {},

  computed: {},
  methods: {}
};

/* script */
const __vue_script__$8 = script$8;
/* template */

var __vue_render__$6 = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('b-container', {
    attrs: {
      "fluid": ""
    }
  }, [_c('b-row', {
    staticClass: "my-1 mx-1"
  }, [_c('b-form-group', {
    staticClass: "col-10",
    attrs: {
      "label": "Phone Number",
      "label-for": "phone"
    }
  }, [_c('b-form-input', {
    attrs: {
      "id": "phone",
      "type": "text"
    },
    model: {
      value: _vm.phone,
      callback: function ($$v) {
        _vm.phone = $$v;
      },
      expression: "phone"
    }
  })], 1)], 1)], 1);
};

var __vue_staticRenderFns__$6 = [];
/* style */

const __vue_inject_styles__$8 = undefined;
/* scoped */

const __vue_scope_id__$8 = undefined;
/* module identifier */

const __vue_module_identifier__$8 = undefined;
/* functional template */

const __vue_is_functional_template__$8 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$8 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$6,
  staticRenderFns: __vue_staticRenderFns__$6
}, __vue_inject_styles__$8, __vue_script__$8, __vue_scope_id__$8, __vue_is_functional_template__$8, __vue_module_identifier__$8, false, undefined, undefined, undefined);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var script$9 = {
  name: 'FormURL',
  props: {
    label: {
      type: String
    }
  },

  data() {
    return {
      url: ''
    };
  },

  mounted() {},

  methods: {}
};

/* script */
const __vue_script__$9 = script$9;
/* template */

var __vue_render__$7 = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('b-container', {
    attrs: {
      "fluid": ""
    }
  }, [_c('b-row', {
    staticClass: "my-1 mx-1"
  }, [_c('b-form-group', {
    staticClass: "col-10",
    attrs: {
      "label": _vm.label,
      "label-for": "url"
    }
  }, [_c('b-form-input', {
    attrs: {
      "id": "url",
      "type": "url"
    },
    model: {
      value: _vm.url,
      callback: function ($$v) {
        _vm.url = $$v;
      },
      expression: "url"
    }
  })], 1)], 1)], 1);
};

var __vue_staticRenderFns__$7 = [];
/* style */

const __vue_inject_styles__$9 = undefined;
/* scoped */

const __vue_scope_id__$9 = undefined;
/* module identifier */

const __vue_module_identifier__$9 = undefined;
/* functional template */

const __vue_is_functional_template__$9 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$9 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$7,
  staticRenderFns: __vue_staticRenderFns__$7
}, __vue_inject_styles__$9, __vue_script__$9, __vue_scope_id__$9, __vue_is_functional_template__$9, __vue_module_identifier__$9, false, undefined, undefined, undefined);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var script$a = {
  name: 'FormServiceSelect',

  data() {
    return {
      selections: [],
      selected: {},
      options: [{
        value: null,
        text: 'Please select an option'
      }, {
        value: 'Consulting',
        text: 'Consulting'
      }, {
        value: 'Training',
        text: 'Training'
      }, {
        value: 'Support',
        text: 'Support'
      }, {
        value: 'Bug Fixes',
        text: 'Bug Fixes'
      }, {
        value: 'Customization',
        text: 'Customization'
      }]
    };
  },

  methods: {
    onSelection() {
      if (this.selections.indexOf(this.selected) < 0 && this.selected) {
        this.selections.push(this.selected);
      }
    },

    getOptions() {
      let options = [];
      this.options.forEach(option => {
        if (this.selections.indexOf(option.value) < 0) {
          options.push({
            value: option.value,
            text: option.text
          });
        }
      });
      return options;
    }

  }
};

/* script */
const __vue_script__$a = script$a;
/* template */

var __vue_render__$8 = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('b-container', {
    attrs: {
      "fluid": ""
    }
  }, [_c('b-form-group', {
    staticClass: "col-10",
    attrs: {
      "label": "Company services"
    }
  }, _vm._l(_vm.options, function (option) {
    return _c('b-form-select', {
      key: option.value,
      staticStyle: {
        "margin-top": "8px"
      },
      attrs: {
        "options": _vm.getOptions(),
        "change": _vm.onSelection()
      },
      model: {
        value: _vm.selected,
        callback: function ($$v) {
          _vm.selected = $$v;
        },
        expression: "selected"
      }
    });
  }), 1)], 1);
};

var __vue_staticRenderFns__$8 = [];
/* style */

const __vue_inject_styles__$a = undefined;
/* scoped */

const __vue_scope_id__$a = undefined;
/* module identifier */

const __vue_module_identifier__$a = undefined;
/* functional template */

const __vue_is_functional_template__$a = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$a = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$8,
  staticRenderFns: __vue_staticRenderFns__$8
}, __vue_inject_styles__$a, __vue_script__$a, __vue_scope_id__$a, __vue_is_functional_template__$a, __vue_module_identifier__$a, false, undefined, undefined, undefined);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var script$b = {
  name: 'FormCompanyAddress',

  data() {
    return {
      email: ''
    };
  },

  mounted() {},

  methods: {}
};

/* script */
const __vue_script__$b = script$b;
/* template */

var __vue_render__$9 = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('b-container', {
    attrs: {
      "fluid": ""
    }
  }, [_c('b-row', {
    staticClass: "my-1 mx-1"
  }, [_c('b-form-group', {
    staticClass: "col-10",
    attrs: {
      "label": "Company Name",
      "label-for": "company_name"
    }
  }, [_c('b-form-input', {
    attrs: {
      "id": "company_name",
      "type": "text"
    },
    model: {
      value: _vm.email,
      callback: function ($$v) {
        _vm.email = $$v;
      },
      expression: "email"
    }
  })], 1)], 1)], 1);
};

var __vue_staticRenderFns__$9 = [];
/* style */

const __vue_inject_styles__$b = undefined;
/* scoped */

const __vue_scope_id__$b = undefined;
/* module identifier */

const __vue_module_identifier__$b = undefined;
/* functional template */

const __vue_is_functional_template__$b = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$b = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$9,
  staticRenderFns: __vue_staticRenderFns__$9
}, __vue_inject_styles__$b, __vue_script__$b, __vue_scope_id__$b, __vue_is_functional_template__$b, __vue_module_identifier__$b, false, undefined, undefined, undefined);

//
Vue.use(vueCountryRegionSelect);
var script$c = {
  name: 'FormCountry',

  data() {
    return {
      country: '',
      region: ''
    };
  }

};

/* script */
const __vue_script__$c = script$c;
/* template */

var __vue_render__$a = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', [_c('b-container', {
    staticClass: "country"
  }, [_c('b-form-group', {
    attrs: {
      "label": "Country and Region",
      "label-for": "country-select"
    }
  }, [_c('country-select', {
    staticClass: "country-select select",
    attrs: {
      "country": _vm.country,
      "topCountry": "US"
    },
    model: {
      value: _vm.country,
      callback: function ($$v) {
        _vm.country = $$v;
      },
      expression: "country"
    }
  }), _vm._v(" "), _c('region-select', {
    staticClass: "region-select",
    attrs: {
      "country": _vm.country,
      "region": _vm.region
    },
    model: {
      value: _vm.region,
      callback: function ($$v) {
        _vm.region = $$v;
      },
      expression: "region"
    }
  })], 1)], 1)], 1);
};

var __vue_staticRenderFns__$a = [];
/* style */

const __vue_inject_styles__$c = function (inject) {
  if (!inject) return;
  inject("data-v-603a6850_0", {
    source: ".country{margin-left:18px}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


const __vue_scope_id__$c = undefined;
/* module identifier */

const __vue_module_identifier__$c = undefined;
/* functional template */

const __vue_is_functional_template__$c = false;
/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$c = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$a,
  staticRenderFns: __vue_staticRenderFns__$a
}, __vue_inject_styles__$c, __vue_script__$c, __vue_scope_id__$c, __vue_is_functional_template__$c, __vue_module_identifier__$c, false, createInjector, undefined, undefined);

//
//
//
//
//
var script$d = {
  name: 'Email',
  props: {
    data: {
      type: String
    },
    label: {
      type: String
    }
  },

  data() {
    return {};
  },

  mounted() {},

  methods: {}
};

/* script */
const __vue_script__$d = script$d;
/* template */

var __vue_render__$b = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('b-container', {
    staticClass: "col",
    attrs: {
      "fluid": ""
    }
  }, [_c('a', {
    attrs: {
      "href": "mailto:" + _vm.data
    }
  }, [_vm._v(_vm._s(_vm.data))])]);
};

var __vue_staticRenderFns__$b = [];
/* style */

const __vue_inject_styles__$d = undefined;
/* scoped */

const __vue_scope_id__$d = undefined;
/* module identifier */

const __vue_module_identifier__$d = undefined;
/* functional template */

const __vue_is_functional_template__$d = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$d = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$b,
  staticRenderFns: __vue_staticRenderFns__$b
}, __vue_inject_styles__$d, __vue_script__$d, __vue_scope_id__$d, __vue_is_functional_template__$d, __vue_module_identifier__$d, false, undefined, undefined, undefined);

//
//
//
//
//
var script$e = {
  name: 'URL',
  props: {
    data: {
      type: String
    },
    label: {
      type: String
    }
  },

  data() {
    return {};
  },

  mounted() {},

  methods: {}
};

/* script */
const __vue_script__$e = script$e;
/* template */

var __vue_render__$c = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('b-container', {
    staticClass: "col",
    attrs: {
      "fluid": ""
    }
  }, [_c('a', {
    attrs: {
      "href": {
        data: _vm.data
      }
    }
  }, [_vm._v(_vm._s(_vm.data))])]);
};

var __vue_staticRenderFns__$c = [];
/* style */

const __vue_inject_styles__$e = undefined;
/* scoped */

const __vue_scope_id__$e = undefined;
/* module identifier */

const __vue_module_identifier__$e = undefined;
/* functional template */

const __vue_is_functional_template__$e = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$e = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$c,
  staticRenderFns: __vue_staticRenderFns__$c
}, __vue_inject_styles__$e, __vue_script__$e, __vue_scope_id__$e, __vue_is_functional_template__$e, __vue_module_identifier__$e, false, undefined, undefined, undefined);

//
//
//
//
//
//
//
//
//
//
//
//
//
var script$f = {
  name: 'Services',
  props: {
    data: {
      type: Array
    },
    label: {
      type: String
    }
  }
};

/* script */
const __vue_script__$f = script$f;
/* template */

var __vue_render__$d = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('b-container', {
    attrs: {
      "fluid": ""
    }
  }, [_c('b-list-group', {
    staticClass: "mt-1"
  }, _vm._l(_vm.data, function (service) {
    return _c('b-list-group-item', {
      key: service,
      attrs: {
        "v-if": _vm.data
      }
    }, [_vm._v("\n      " + _vm._s(service) + "\n    ")]);
  }), 1)], 1);
};

var __vue_staticRenderFns__$d = [];
/* style */

const __vue_inject_styles__$f = undefined;
/* scoped */

const __vue_scope_id__$f = undefined;
/* module identifier */

const __vue_module_identifier__$f = undefined;
/* functional template */

const __vue_is_functional_template__$f = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$f = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$d,
  staticRenderFns: __vue_staticRenderFns__$d
}, __vue_inject_styles__$f, __vue_script__$f, __vue_scope_id__$f, __vue_is_functional_template__$f, __vue_module_identifier__$f, false, undefined, undefined, undefined);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
var script$g = {
  name: 'Skills',
  props: {
    data: {
      type: Object
    },
    label: {
      type: String
    }
  },

  data() {
    return {};
  },

  mounted() {},

  methods: {}
};

/* script */
const __vue_script__$g = script$g;
/* template */

var __vue_render__$e = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('b-container', {
    staticClass: "col",
    attrs: {
      "fluid": ""
    }
  }, [_c('h4', _vm._l(_vm.data, function (skill) {
    return _c('b-badge', {
      key: skill,
      staticClass: "mr-1 font-weight-light",
      attrs: {
        "variant": "secondary"
      }
    }, [_vm._v("\n      " + _vm._s(skill) + "\n    ")]);
  }), 1)]);
};

var __vue_staticRenderFns__$e = [];
/* style */

const __vue_inject_styles__$g = undefined;
/* scoped */

const __vue_scope_id__$g = undefined;
/* module identifier */

const __vue_module_identifier__$g = undefined;
/* functional template */

const __vue_is_functional_template__$g = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$g = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$e,
  staticRenderFns: __vue_staticRenderFns__$e
}, __vue_inject_styles__$g, __vue_script__$g, __vue_scope_id__$g, __vue_is_functional_template__$g, __vue_module_identifier__$g, false, undefined, undefined, undefined);

//
//
//
//
//
//
var script$h = {
  name: 'String',
  props: {
    data: {
      type: String
    },
    label: {
      type: String
    }
  },

  data() {
    return {};
  },

  mounted() {},

  methods: {}
};

/* script */
const __vue_script__$h = script$h;
/* template */

var __vue_render__$f = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('b-container', {
    staticClass: "col string",
    attrs: {
      "fluid": ""
    }
  }, [_c('div', {
    staticClass: "label"
  }, [_vm._v(_vm._s(_vm.label))]), _vm._v(" "), _c('div', {
    staticClass: "data"
  }, [_vm._v(_vm._s(_vm.data))])]);
};

var __vue_staticRenderFns__$f = [];
/* style */

const __vue_inject_styles__$h = function (inject) {
  if (!inject) return;
  inject("data-v-136e09d9_0", {
    source: ".string{margin-top:4px;font-family:sans-serif}.data{font-size:.875rem;border:none}.label{font-size:.875rem;font-weight:600;opacity:.75;margin-bottom:4px}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


const __vue_scope_id__$h = undefined;
/* module identifier */

const __vue_module_identifier__$h = undefined;
/* functional template */

const __vue_is_functional_template__$h = false;
/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$h = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$f,
  staticRenderFns: __vue_staticRenderFns__$f
}, __vue_inject_styles__$h, __vue_script__$h, __vue_scope_id__$h, __vue_is_functional_template__$h, __vue_module_identifier__$h, false, createInjector, undefined, undefined);

/* eslint-disable import/prefer-default-export */

var components = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ScrudComponent: __vue_component__,
  Person: __vue_component__$1,
  PartnerProfile: __vue_component__$2,
  CardCollection: __vue_component__$3,
  Form: __vue_component__$4,
  FormCompanyName: __vue_component__$5,
  FormEmail: __vue_component__$6,
  FormName: __vue_component__$7,
  FormPhoneNumber: __vue_component__$8,
  FormURL: __vue_component__$9,
  FormServiceSelect: __vue_component__$a,
  FormCompanyAddress: __vue_component__$b,
  FormCountry: __vue_component__$c,
  Email: __vue_component__$d,
  URL: __vue_component__$e,
  Services: __vue_component__$f,
  Skills: __vue_component__$g,
  String: __vue_component__$h
});

// Import vue components

const install = function installScrudComponent(Vue) {
  if (install.installed) return;
  install.installed = true;
  Object.entries(components).forEach(([componentName, component]) => {
    Vue.component(componentName, component);
  });
}; // Create module definition for Vue.use()


const plugin = {
  install
}; // To auto-install on non-es builds, when vue is found

export default plugin;
export { __vue_component__$3 as CardCollection, __vue_component__$d as Email, __vue_component__$4 as Form, __vue_component__$b as FormCompanyAddress, __vue_component__$5 as FormCompanyName, __vue_component__$c as FormCountry, __vue_component__$6 as FormEmail, __vue_component__$7 as FormName, __vue_component__$8 as FormPhoneNumber, __vue_component__$a as FormServiceSelect, __vue_component__$9 as FormURL, __vue_component__$2 as PartnerProfile, __vue_component__$1 as Person, __vue_component__ as ScrudComponent, __vue_component__$f as Services, __vue_component__$g as Skills, __vue_component__$h as String, __vue_component__$e as URL };
