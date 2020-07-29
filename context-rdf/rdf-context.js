const JsonLdParser = require("jsonld-streaming-parser").JsonLdParser;
const { JSONPath } = require("jsonpath-plus");
const fs = require('fs');

function RdfContext() {

  // Not functional, need endpoints to be implemented to test. Currently using local files and the fs library
  this.lookup = (jsonpath, contextUrl) => {
    return new Promise(resolve => {
      const parser = new JsonLdParser();

      let context = fs.readFileSync('../jsonld-tests/example-semantic-context.json');

      let parsed = JSONPath({
        path: jsonpath,
        json: context
      });

      let contextLd = fs.createReadStream('../jsonld-tests/example-semantic-context.json');

      parser.import(contextLd)
        .on('data', (quad) => {
          resolve(quad)
        })
    })
  }

  // Not functional, need endpoints to be implemented to test. Currently using local files and the fs library
  this.supertype = (type, contextUrl, schemaUrl) => {
    return new Promise(resolve => {
      const parser = new JsonLdParser();

      // TODO: Change to make an http request to get the context when endpoints are implemented
      const stream = fs.createReadStream('../jsonld-tests/tree.jsonld');

      parser.import(stream)
        .on('data', (quad) => {
          let value = quad['subject']['value'];

          if (value === type && supertype(quad)) {
            resolve(quad['object']['value']);
          }
        })
    })
  }

  function supertype(quad) {
    return quad['predicate']['value'].includes('#subClassOf');
  }
}

module.exports = RdfContext;