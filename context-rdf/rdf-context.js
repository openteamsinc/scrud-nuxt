const JsonLdParser = require("jsonld-streaming-parser").JsonLdParser;
const { JSONPath } = require("jsonpath-plus");
const fs = require('fs');

function RdfContext() {

  // Get the context-type URI for a given 'jsonpath' parsing the 'jsonld' specified
  // ('$', {
  //        "@context": "https://schema.org",
  //        "@type": "Person",
  //        "address": {
  //            "@type": "PostalAddress",
  //            "addressLocality": "Colorado Springs",
  //            "addressRegion": "CO",
  //            "postalCode": "80840",
  //            "streetAddress": "100 Main Street"
  //          },
  //        })
  this.lookup = async (jsonpath, jsonld) => {
    const parsedPath = JSONPath({
      path: jsonpath,
      json: jsonld
    });
    const context = jsonld['@context'];
    const types = parsedPath.map((result)=>{return result['@type']});
    if (context && types.length){
      const contextTypes = types.map((type) => {return `${context}/${type}`});
      return contextTypes;
    } else {
      throw new Error(`Failed to parse the resource context and types: Context=${context}; Types=${types}`)
    }

  }

  // Get the supertype of a given type giving a path to the ld context source and using to retrieve such context source
  // a given callback function:
  // ('http://schema.org/Vehicle', './jsonld-tests/tree.jsonld', callbackFileResolver) -> 'http://schema.org/Product'
  // ('http://schema.org/Vehicle', 'http://mock.com/api/jsonld-tests/tree.jsonld', callbackHTTPResolver) -> 'http://schema.org/Product'
  this.supertype = async (type, contextUrl, callbackResourceResolver) => {
    const parser = new JsonLdParser();
    const stream = await callbackResourceResolver(contextUrl);
    return new Promise((resolve, reject) => {
        parser.import(stream)
              .on('data', (quad) => {
                let value = quad['subject']['value'];
                if (value === type && supertype(quad)) {
                  resolve(quad['object']['value']);
                }
              })
              .on('error', function(err){
                reject(err);
              })
              .on('end', function(){
                resolve('');
              })
    })
  }

  function supertype(quad) {
    return quad['predicate']['value'].includes('#subClassOf');
  }
}

module.exports = RdfContext;