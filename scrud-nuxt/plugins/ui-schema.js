

class UISchema {

  constructor() {
    this.uiSchema = [];
  }

  createNode(component, fieldOptions={}, children=[]) {
    this.uiSchema.push(
      new UISchemaNode(component, fieldOptions, children)
    )
  }

  addNode(node) {
    this.uiSchema.push(node)
  }

  getUISchema() {
    let schema = []

    this.uiSchema.forEach(node => {
      schema.push(node.getSchema())
    })

    return schema
  }

  getNodes() {
    return this.uiSchema
  }
}

class UISchemaNode {
  constructor(component, fieldOptions={}, children=[]) {
    this.node = {
      component: component,
      fieldOptions: fieldOptions,
      children: children
    }
  }

  setChildren(children) {
    this.node.children = children
  }

  setFieldOptions(fieldOptions) {
    this.node.fieldOptions = fieldOptions
  }

  getSchema() {
    let schema = {
      component: this.node.component,
      fieldOptions: this.node.fieldOptions,
      children: []
    }

    this.node.children.forEach(child => {
      schema.children.push(child.getSchema())
    })

    return schema
  }

  getNode() {
    return this.node
  }

  getChildren() {
    return this.node.children
  }

  getFieldOptions() {
    return this.node.fieldOptions
  }

  getComponent() {
    return this.node.component
  }
}

export { UISchema, UISchemaNode}