'use strict';Object.defineProperty(exports,'__esModule',{value:true});var VueFormJsonSchema=require('vue-form-json-schema/dist/vue-form-json-schema.esm.js');require('rdf-context');var CachingClient=require('caching-client'),li=require('li'),lodash=require('lodash'),Vue=require('vue'),vueCountryRegionSelect=require('vue-country-region-select');function _interopDefaultLegacy(e){return e&&typeof e==='object'&&'default'in e?e:{'default':e}}var VueFormJsonSchema__default=/*#__PURE__*/_interopDefaultLegacy(VueFormJsonSchema);var CachingClient__default=/*#__PURE__*/_interopDefaultLegacy(CachingClient);var li__default=/*#__PURE__*/_interopDefaultLegacy(li);var Vue__default=/*#__PURE__*/_interopDefaultLegacy(Vue);var vueCountryRegionSelect__default=/*#__PURE__*/_interopDefaultLegacy(vueCountryRegionSelect);function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}var UISchema = /*#__PURE__*/function () {
  function UISchema() {
    _classCallCheck(this, UISchema);

    this.uiSchema = [];
  }

  _createClass(UISchema, [{
    key: "createNode",
    value: function createNode(component) {
      var fieldOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var children = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      this.uiSchema.push(new UISchemaNode(component, fieldOptions, children));
    }
  }, {
    key: "addNode",
    value: function addNode(node) {
      this.uiSchema.push(node);
    }
  }, {
    key: "getUISchema",
    value: function getUISchema() {
      var schema = [];
      this.uiSchema.forEach(function (node) {
        schema.push(node.getSchema());
      });
      return schema;
    }
  }, {
    key: "getNodes",
    value: function getNodes() {
      return this.uiSchema;
    }
  }]);

  return UISchema;
}();

var UISchemaNode = /*#__PURE__*/function () {
  function UISchemaNode(component) {
    var fieldOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var children = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    _classCallCheck(this, UISchemaNode);

    this.node = {
      component: component,
      fieldOptions: fieldOptions,
      children: children
    };
  }

  _createClass(UISchemaNode, [{
    key: "setChildren",
    value: function setChildren(children) {
      this.node.children = children;
    }
  }, {
    key: "setFieldOptions",
    value: function setFieldOptions(fieldOptions) {
      this.node.fieldOptions = fieldOptions;
    }
  }, {
    key: "getSchema",
    value: function getSchema() {
      var schema = {
        component: this.node.component,
        fieldOptions: this.node.fieldOptions,
        children: []
      };
      this.node.children.forEach(function (child) {
        schema.children.push(child.getSchema());
      });
      return schema;
    }
  }, {
    key: "getNode",
    value: function getNode() {
      return this.node;
    }
  }, {
    key: "getChildren",
    value: function getChildren() {
      return this.node.children;
    }
  }, {
    key: "getFieldOptions",
    value: function getFieldOptions() {
      return this.node.fieldOptions;
    }
  }, {
    key: "getComponent",
    value: function getComponent() {
      return this.node.component;
    }
  }]);

  return UISchemaNode;
}();//
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
    'vue-form-json-schema': VueFormJsonSchema__default['default']
  },
  data: function data() {
    return {
      uiSchemaObject: new UISchema(),
      cachingClient: new CachingClient__default['default'](),
      uiSchema: [],
      components: [],
      schemaURL: null,
      contextURL: null
    };
  },
  created: function created() {
    var _this = this;

    // Fetch options to get schema and context URLs then call according method to generate UI
    console.log(this);
    console.log(this._props);
    this.cachingClient.options(this.scrudResourceURL).then(function (res) {
      res.json().then(function (body) {
        var requestType = body[_this.uiType];

        switch (_this.uiType) {
          case 'post':
            _this.schemaURL = _this.getPostSchemaURL(requestType);
            _this.contextURL = _this.getPostContextURL(requestType);
            return _this.generateUIPost();

          case 'get':
            _this.schemaURL = _this.getSchemaURL(requestType);
            _this.contextURL = _this.getContextURL(requestType);
            return _this.generateUIGet();
        }

        _this.generateUIPost();
      });
    });
  },
  methods: {
    getPostSchemaURL: function getPostSchemaURL(data) {
      return data.requestBody.content['application/json'].schema;
    },
    getPostContextURL: function getPostContextURL(data) {
      return data.requestBody.content['application/json'].context;
    },
    getSchemaURL: function getSchemaURL(data) {
      return data.responses['200'].content['application/json'].schema;
    },
    getContextURL: function getContextURL(data) {
      return data.responses['200'].content['application/json'].context;
    },
    generateUIPost: function generateUIPost() {
      var _this2 = this;

      this.cachingClient.get(this.contextURL).then(function (res) {
        res.json().then(function (body) {
          var superType = _this2.getComponentByRdfType(body['@type']);

          var superTypeNode = new UISchemaNode(superType);
          var children = [];
          var afterType = false;
          Object.keys(body).forEach(function (key) {
            if (afterType) {
              var component = _this2.getComponentByRdfType(body[key]['@id']);

              var node = new UISchemaNode(component);
              children.push(node);
            } else {
              afterType = key === '@type';
            }
          });
          superTypeNode.setChildren(children);

          _this2.uiSchemaObject.addNode(superTypeNode);

          _this2.uiSchema = _this2.uiSchemaObject.getUISchema();
        });
      });
    },
    generateUIGet: function generateUIGet() {
      var _this3 = this;

      this.cachingClient.get(this.contextURL).then(function (res) {
        res.json().then(function (body) {
          _this3.cachingClient.get(_this3.scrudResourceURL).then(function (res) {
            res.json().then(function (data) {
              var superType = _this3.getComponentByRdfType(body.content['@container']);

              var superTypeNode = new UISchemaNode(superType);
              var href = data.content[0].href;

              _this3.cachingClient.get(href).then(function (ref) {
                var linkHeaders = ref.headers.get('link');
                var linkContext = li__default['default'].parse(linkHeaders)['http://www.w3.org/ns/json-ld#context'];

                _this3.cachingClient.get(linkContext).then(function (ld) {
                  ld.json().then(function (ldJson) {
                    var children = [];
                    data.content.forEach(function (dataItem) {
                      var content = dataItem.content;
                      var card = new UISchemaNode('b-card');
                      var cardChildren = [];
                      Object.keys(ldJson).forEach(function (key) {
                        console.log(key);

                        var component = _this3.getComponentByRdfType(ldJson[key]['@id']);

                        var fieldOptions = {
                          props: {
                            data: content[key]
                          }
                        };
                        var node = new UISchemaNode(component, fieldOptions);
                        cardChildren.push(node);
                      });
                      card.setChildren(cardChildren);
                      children.push(card);
                    });
                    superTypeNode.setChildren(children);

                    _this3.uiSchemaObject.addNode(superTypeNode);

                    _this3.uiSchema = _this3.uiSchemaObject.getUISchema();
                  });
                });
              });
            });
          });
        });
      });
    },
    getComponentByRdfType: function getComponentByRdfType(type) {
      var match = this.configMapping.components[type];

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
};function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
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
}/* script */
var __vue_script__ = script;
/* template */

var __vue_render__ = function __vue_render__() {
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

var __vue_inject_styles__ = undefined;
/* scoped */

var __vue_scope_id__ = undefined;
/* module identifier */

var __vue_module_identifier__ = "data-v-2e53ad7a";
/* functional template */

var __vue_is_functional_template__ = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, undefined, undefined);//
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
  render: function render(h) {
    return h("b-container", {
      "attrs": {
        "fluid": true
      }
    }, [h("div", [this.data.test])]);
  },
  methods: {
    getValues: function getValues() {
      var h = this.$createElement;
      var nodes = [];
      nodes.push(h("b-row", [h("b-col", ["Name"]), h("b-col", [this.data.givenName.data + " " + this.data.familyName.data])]));
      lodash.forIn(this.data, function (value, key) {
        if (key !== "givenName" && key !== "familyName") {
          nodes.push(h("b-row", [h("b-col", [key]), h("b-col", [value.data])]));
        }
      });
      return nodes;
    }
  }
};/* script */
var __vue_script__$1 = script$1;
/* template */

/* style */

var __vue_inject_styles__$1 = undefined;
/* scoped */

var __vue_scope_id__$1 = undefined;
/* module identifier */

var __vue_module_identifier__$1 = "data-v-3ad96b62";
/* functional template */

var __vue_is_functional_template__$1 = undefined;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$1 = /*#__PURE__*/normalizeComponent({}, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, false, undefined, undefined, undefined);//
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
};function createInjectorSSR(context) {
    if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
    }
    if (!context)
        return () => { };
    if (!('styles' in context)) {
        context._styles = context._styles || {};
        Object.defineProperty(context, 'styles', {
            enumerable: true,
            get: () => context._renderStyles(context._styles)
        });
        context._renderStyles = context._renderStyles || renderStyles;
    }
    return (id, style) => addStyle(id, style, context);
}
function addStyle(id, css, context) {
    const group =  css.media || 'default' ;
    const style = context._styles[group] || (context._styles[group] = { ids: [], css: '' });
    if (!style.ids.includes(id)) {
        style.media = css.media;
        style.ids.push(id);
        let code = css.source;
        style.css += code + '\n';
    }
}
function renderStyles(styles) {
    let css = '';
    for (const key in styles) {
        const style = styles[key];
        css +=
            '<style data-vue-ssr-id="' +
                Array.from(style.ids).join(' ') +
                '"' +
                (style.media ? ' media="' + style.media + '"' : '') +
                '>' +
                style.css +
                '</style>';
    }
    return css;
}/* script */
var __vue_script__$2 = script$2;
/* template */

var __vue_render__$1 = function __vue_render__() {
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

var __vue_inject_styles__$2 = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-c623a7b0_0", {
    source: ".partner-card{max-width:20rem;min-width:20rem}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__$2 = undefined;
/* module identifier */

var __vue_module_identifier__$2 = "data-v-c623a7b0";
/* functional template */

var __vue_is_functional_template__$2 = false;
/* style inject shadow dom */

var __vue_component__$2 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$1,
  staticRenderFns: __vue_staticRenderFns__$1
}, __vue_inject_styles__$2, __vue_script__$2, __vue_scope_id__$2, __vue_is_functional_template__$2, __vue_module_identifier__$2, false, undefined, createInjectorSSR, undefined);//
var script$3 = {
  name: 'CardCollection',
  render: function render(h) {
    return this.getCards();
  },
  methods: {
    getCards: function getCards() {
      var h = this.$createElement;
      var cards = this.$slots.default;
      var elems = [];

      if (cards) {
        cards.forEach(function (card) {
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
};/* script */
var __vue_script__$3 = script$3;
/* template */

/* style */

var __vue_inject_styles__$3 = undefined;
/* scoped */

var __vue_scope_id__$3 = undefined;
/* module identifier */

var __vue_module_identifier__$3 = "data-v-446783b6";
/* functional template */

var __vue_is_functional_template__$3 = undefined;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$3 = /*#__PURE__*/normalizeComponent({}, __vue_inject_styles__$3, __vue_script__$3, __vue_scope_id__$3, __vue_is_functional_template__$3, __vue_module_identifier__$3, false, undefined, undefined, undefined);//
//
//
//
//
//
var script$4 = {};/* script */
var __vue_script__$4 = script$4;
/* template */

var __vue_render__$2 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "form col"
  }, [_vm._t("default")], 2);
};

var __vue_staticRenderFns__$2 = [];
/* style */

var __vue_inject_styles__$4 = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-6781ce92_0", {
    source: ".form{width:50%;margin-left:25%;margin-right:25%;border:1px solid #464646;border-radius:8px;margin-top:10px}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__$4 = undefined;
/* module identifier */

var __vue_module_identifier__$4 = "data-v-6781ce92";
/* functional template */

var __vue_is_functional_template__$4 = false;
/* style inject shadow dom */

var __vue_component__$4 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$2,
  staticRenderFns: __vue_staticRenderFns__$2
}, __vue_inject_styles__$4, __vue_script__$4, __vue_scope_id__$4, __vue_is_functional_template__$4, __vue_module_identifier__$4, false, undefined, createInjectorSSR, undefined);//
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
  data: function data() {
    return {
      email: ''
    };
  },
  mounted: function mounted() {},
  methods: {}
};/* script */
var __vue_script__$5 = script$5;
/* template */

var __vue_render__$3 = function __vue_render__() {
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
      callback: function callback($$v) {
        _vm.email = $$v;
      },
      expression: "email"
    }
  })], 1)], 1)], 1);
};

var __vue_staticRenderFns__$3 = [];
/* style */

var __vue_inject_styles__$5 = undefined;
/* scoped */

var __vue_scope_id__$5 = undefined;
/* module identifier */

var __vue_module_identifier__$5 = "data-v-d77b4ff6";
/* functional template */

var __vue_is_functional_template__$5 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$5 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$3,
  staticRenderFns: __vue_staticRenderFns__$3
}, __vue_inject_styles__$5, __vue_script__$5, __vue_scope_id__$5, __vue_is_functional_template__$5, __vue_module_identifier__$5, false, undefined, undefined, undefined);//
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
  data: function data() {
    return {
      email: ''
    };
  },
  mounted: function mounted() {},
  methods: {}
};/* script */
var __vue_script__$6 = script$6;
/* template */

var __vue_render__$4 = function __vue_render__() {
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
      callback: function callback($$v) {
        _vm.email = $$v;
      },
      expression: "email"
    }
  })], 1)], 1)], 1);
};

var __vue_staticRenderFns__$4 = [];
/* style */

var __vue_inject_styles__$6 = undefined;
/* scoped */

var __vue_scope_id__$6 = undefined;
/* module identifier */

var __vue_module_identifier__$6 = "data-v-742a6a9e";
/* functional template */

var __vue_is_functional_template__$6 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$6 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$4,
  staticRenderFns: __vue_staticRenderFns__$4
}, __vue_inject_styles__$6, __vue_script__$6, __vue_scope_id__$6, __vue_is_functional_template__$6, __vue_module_identifier__$6, false, undefined, undefined, undefined);//
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
  data: function data() {
    return {
      first_name: '',
      last_name: ''
    };
  },
  computed: {
    validatedName: function validatedName() {
      if (this.first_name.length > 0) {
        return !this.hasNumber(this.first_name);
      } else {
        return null;
      }
    },
    validatedSurname: function validatedSurname() {
      if (this.last_name.length > 0) {
        return !this.hasNumber(this.last_name);
      } else {
        return null;
      }
    }
  },
  mounted: function mounted() {},
  methods: {
    hasNumber: function hasNumber(str) {
      var matches = str.match(/\d+/g);

      if (matches != null) {
        return matches;
      }
    }
  }
};/* script */
var __vue_script__$7 = script$7;
/* template */

var __vue_render__$5 = function __vue_render__() {
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
      callback: function callback($$v) {
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
      callback: function callback($$v) {
        _vm.last_name = $$v;
      },
      expression: "last_name"
    }
  })], 1)], 1)], 1);
};

var __vue_staticRenderFns__$5 = [];
/* style */

var __vue_inject_styles__$7 = undefined;
/* scoped */

var __vue_scope_id__$7 = undefined;
/* module identifier */

var __vue_module_identifier__$7 = "data-v-14358e60";
/* functional template */

var __vue_is_functional_template__$7 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$7 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$5,
  staticRenderFns: __vue_staticRenderFns__$5
}, __vue_inject_styles__$7, __vue_script__$7, __vue_scope_id__$7, __vue_is_functional_template__$7, __vue_module_identifier__$7, false, undefined, undefined, undefined);//
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
  data: function data() {
    return {
      phone: ''
    };
  },
  mounted: function mounted() {},
  computed: {},
  methods: {}
};/* script */
var __vue_script__$8 = script$8;
/* template */

var __vue_render__$6 = function __vue_render__() {
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
      callback: function callback($$v) {
        _vm.phone = $$v;
      },
      expression: "phone"
    }
  })], 1)], 1)], 1);
};

var __vue_staticRenderFns__$6 = [];
/* style */

var __vue_inject_styles__$8 = undefined;
/* scoped */

var __vue_scope_id__$8 = undefined;
/* module identifier */

var __vue_module_identifier__$8 = "data-v-226d979e";
/* functional template */

var __vue_is_functional_template__$8 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$8 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$6,
  staticRenderFns: __vue_staticRenderFns__$6
}, __vue_inject_styles__$8, __vue_script__$8, __vue_scope_id__$8, __vue_is_functional_template__$8, __vue_module_identifier__$8, false, undefined, undefined, undefined);//
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
  data: function data() {
    return {
      url: ''
    };
  },
  mounted: function mounted() {},
  methods: {}
};/* script */
var __vue_script__$9 = script$9;
/* template */

var __vue_render__$7 = function __vue_render__() {
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
      callback: function callback($$v) {
        _vm.url = $$v;
      },
      expression: "url"
    }
  })], 1)], 1)], 1);
};

var __vue_staticRenderFns__$7 = [];
/* style */

var __vue_inject_styles__$9 = undefined;
/* scoped */

var __vue_scope_id__$9 = undefined;
/* module identifier */

var __vue_module_identifier__$9 = "data-v-a98fd262";
/* functional template */

var __vue_is_functional_template__$9 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$9 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$7,
  staticRenderFns: __vue_staticRenderFns__$7
}, __vue_inject_styles__$9, __vue_script__$9, __vue_scope_id__$9, __vue_is_functional_template__$9, __vue_module_identifier__$9, false, undefined, undefined, undefined);//
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
  data: function data() {
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
    onSelection: function onSelection() {
      if (this.selections.indexOf(this.selected) < 0 && this.selected) {
        this.selections.push(this.selected);
      }
    },
    getOptions: function getOptions() {
      var _this = this;

      var options = [];
      this.options.forEach(function (option) {
        if (_this.selections.indexOf(option.value) < 0) {
          options.push({
            value: option.value,
            text: option.text
          });
        }
      });
      return options;
    }
  }
};/* script */
var __vue_script__$a = script$a;
/* template */

var __vue_render__$8 = function __vue_render__() {
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
        callback: function callback($$v) {
          _vm.selected = $$v;
        },
        expression: "selected"
      }
    });
  }), 1)], 1);
};

var __vue_staticRenderFns__$8 = [];
/* style */

var __vue_inject_styles__$a = undefined;
/* scoped */

var __vue_scope_id__$a = undefined;
/* module identifier */

var __vue_module_identifier__$a = "data-v-41425a4c";
/* functional template */

var __vue_is_functional_template__$a = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$a = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$8,
  staticRenderFns: __vue_staticRenderFns__$8
}, __vue_inject_styles__$a, __vue_script__$a, __vue_scope_id__$a, __vue_is_functional_template__$a, __vue_module_identifier__$a, false, undefined, undefined, undefined);//
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
  data: function data() {
    return {
      email: ''
    };
  },
  mounted: function mounted() {},
  methods: {}
};/* script */
var __vue_script__$b = script$b;
/* template */

var __vue_render__$9 = function __vue_render__() {
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
      callback: function callback($$v) {
        _vm.email = $$v;
      },
      expression: "email"
    }
  })], 1)], 1)], 1);
};

var __vue_staticRenderFns__$9 = [];
/* style */

var __vue_inject_styles__$b = undefined;
/* scoped */

var __vue_scope_id__$b = undefined;
/* module identifier */

var __vue_module_identifier__$b = "data-v-3f7d7377";
/* functional template */

var __vue_is_functional_template__$b = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$b = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$9,
  staticRenderFns: __vue_staticRenderFns__$9
}, __vue_inject_styles__$b, __vue_script__$b, __vue_scope_id__$b, __vue_is_functional_template__$b, __vue_module_identifier__$b, false, undefined, undefined, undefined);//
Vue__default['default'].use(vueCountryRegionSelect__default['default']);
var script$c = {
  name: 'FormCountry',
  data: function data() {
    return {
      country: '',
      region: ''
    };
  }
};/* script */
var __vue_script__$c = script$c;
/* template */

var __vue_render__$a = function __vue_render__() {
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
      callback: function callback($$v) {
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
      callback: function callback($$v) {
        _vm.region = $$v;
      },
      expression: "region"
    }
  })], 1)], 1)], 1);
};

var __vue_staticRenderFns__$a = [];
/* style */

var __vue_inject_styles__$c = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-603a6850_0", {
    source: ".country{margin-left:18px}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__$c = undefined;
/* module identifier */

var __vue_module_identifier__$c = "data-v-603a6850";
/* functional template */

var __vue_is_functional_template__$c = false;
/* style inject shadow dom */

var __vue_component__$c = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$a,
  staticRenderFns: __vue_staticRenderFns__$a
}, __vue_inject_styles__$c, __vue_script__$c, __vue_scope_id__$c, __vue_is_functional_template__$c, __vue_module_identifier__$c, false, undefined, createInjectorSSR, undefined);//
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
  data: function data() {
    return {};
  },
  mounted: function mounted() {},
  methods: {}
};/* script */
var __vue_script__$d = script$d;
/* template */

var __vue_render__$b = function __vue_render__() {
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

var __vue_inject_styles__$d = undefined;
/* scoped */

var __vue_scope_id__$d = undefined;
/* module identifier */

var __vue_module_identifier__$d = "data-v-505012cf";
/* functional template */

var __vue_is_functional_template__$d = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$d = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$b,
  staticRenderFns: __vue_staticRenderFns__$b
}, __vue_inject_styles__$d, __vue_script__$d, __vue_scope_id__$d, __vue_is_functional_template__$d, __vue_module_identifier__$d, false, undefined, undefined, undefined);//
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
  data: function data() {
    return {};
  },
  mounted: function mounted() {},
  methods: {}
};/* script */
var __vue_script__$e = script$e;
/* template */

var __vue_render__$c = function __vue_render__() {
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

var __vue_inject_styles__$e = undefined;
/* scoped */

var __vue_scope_id__$e = undefined;
/* module identifier */

var __vue_module_identifier__$e = "data-v-65f62469";
/* functional template */

var __vue_is_functional_template__$e = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$e = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$c,
  staticRenderFns: __vue_staticRenderFns__$c
}, __vue_inject_styles__$e, __vue_script__$e, __vue_scope_id__$e, __vue_is_functional_template__$e, __vue_module_identifier__$e, false, undefined, undefined, undefined);//
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
};/* script */
var __vue_script__$f = script$f;
/* template */

var __vue_render__$d = function __vue_render__() {
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

var __vue_inject_styles__$f = undefined;
/* scoped */

var __vue_scope_id__$f = undefined;
/* module identifier */

var __vue_module_identifier__$f = "data-v-6629b85b";
/* functional template */

var __vue_is_functional_template__$f = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$f = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$d,
  staticRenderFns: __vue_staticRenderFns__$d
}, __vue_inject_styles__$f, __vue_script__$f, __vue_scope_id__$f, __vue_is_functional_template__$f, __vue_module_identifier__$f, false, undefined, undefined, undefined);//
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
  data: function data() {
    return {};
  },
  mounted: function mounted() {},
  methods: {}
};/* script */
var __vue_script__$g = script$g;
/* template */

var __vue_render__$e = function __vue_render__() {
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

var __vue_inject_styles__$g = undefined;
/* scoped */

var __vue_scope_id__$g = undefined;
/* module identifier */

var __vue_module_identifier__$g = "data-v-4a1371c3";
/* functional template */

var __vue_is_functional_template__$g = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$g = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$e,
  staticRenderFns: __vue_staticRenderFns__$e
}, __vue_inject_styles__$g, __vue_script__$g, __vue_scope_id__$g, __vue_is_functional_template__$g, __vue_module_identifier__$g, false, undefined, undefined, undefined);//
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
  data: function data() {
    return {};
  },
  mounted: function mounted() {},
  methods: {}
};/* script */
var __vue_script__$h = script$h;
/* template */

var __vue_render__$f = function __vue_render__() {
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

var __vue_inject_styles__$h = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-136e09d9_0", {
    source: ".string{margin-top:4px;font-family:sans-serif}.data{font-size:.875rem;border:none}.label{font-size:.875rem;font-weight:600;opacity:.75;margin-bottom:4px}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__$h = undefined;
/* module identifier */

var __vue_module_identifier__$h = "data-v-136e09d9";
/* functional template */

var __vue_is_functional_template__$h = false;
/* style inject shadow dom */

var __vue_component__$h = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$f,
  staticRenderFns: __vue_staticRenderFns__$f
}, __vue_inject_styles__$h, __vue_script__$h, __vue_scope_id__$h, __vue_is_functional_template__$h, __vue_module_identifier__$h, false, undefined, createInjectorSSR, undefined);/* eslint-disable import/prefer-default-export */var components=/*#__PURE__*/Object.freeze({__proto__:null,ScrudComponent: __vue_component__,Person: __vue_component__$1,PartnerProfile: __vue_component__$2,CardCollection: __vue_component__$3,Form: __vue_component__$4,FormCompanyName: __vue_component__$5,FormEmail: __vue_component__$6,FormName: __vue_component__$7,FormPhoneNumber: __vue_component__$8,FormURL: __vue_component__$9,FormServiceSelect: __vue_component__$a,FormCompanyAddress: __vue_component__$b,FormCountry: __vue_component__$c,Email: __vue_component__$d,URL: __vue_component__$e,Services: __vue_component__$f,Skills: __vue_component__$g,String: __vue_component__$h});var install = function installScrudComponent(Vue) {
  if (install.installed) return;
  install.installed = true;
  Object.entries(components).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        componentName = _ref2[0],
        component = _ref2[1];

    Vue.component(componentName, component);
  });
}; // Create module definition for Vue.use()


var plugin = {
  install: install
}; // To auto-install on non-es builds, when vue is found
// eslint-disable-next-line no-redeclare

/* global window, global */

{
  var GlobalVue = null;

  if (typeof window !== 'undefined') {
    GlobalVue = window.Vue;
  } else if (typeof global !== 'undefined') {
    GlobalVue = global.Vue;
  }

  if (GlobalVue) {
    GlobalVue.use(plugin);
  }
} // Default export is library as a whole, registered via Vue.use()
exports.CardCollection=__vue_component__$3;exports.Email=__vue_component__$d;exports.Form=__vue_component__$4;exports.FormCompanyAddress=__vue_component__$b;exports.FormCompanyName=__vue_component__$5;exports.FormCountry=__vue_component__$c;exports.FormEmail=__vue_component__$6;exports.FormName=__vue_component__$7;exports.FormPhoneNumber=__vue_component__$8;exports.FormServiceSelect=__vue_component__$a;exports.FormURL=__vue_component__$9;exports.PartnerProfile=__vue_component__$2;exports.Person=__vue_component__$1;exports.ScrudComponent=__vue_component__;exports.Services=__vue_component__$f;exports.Skills=__vue_component__$g;exports.String=__vue_component__$h;exports.URL=__vue_component__$e;exports.default=plugin;