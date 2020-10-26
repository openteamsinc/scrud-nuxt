const JsonLdParser = require("jsonld-streaming-parser").JsonLdParser;
const { JSONPath } = require("jsonpath-plus");

function RdfContext() {

  /* Get the context-type URI for a given 'jsonpath' parsing the 'jsonld' specified
      ('$', {
         "@context": "https://schema.org",
         "@type": "Person",
         "address": {
             "@type": "PostalAddress",
             "addressLocality": "Colorado Springs",
             "addressRegion": "CO",
             "postalCode": "80840",
             "streetAddress": "100 Main Street"
           },
         }) ->  ['https://schema.org/Person']
  */
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
      console.error(`Failed to parse the resource context and types: Context=${context}; Types=${types}`);
      return [];
    }
  }

  /* Get the supertype of a given type giving a path to the ld context source and using to retrieve such context source
     a given callback function:
      ('http://schema.org/Vehicle', './jsonld-tests/tree.jsonld', callbackFileResolver) -> ['http://schema.org/Product']
      ('http://schema.org/Vehicle', 'http://mock.com/api/jsonld-tests/tree.jsonld', callbackHTTPResolver) -> ['http://schema.org/Product']
      ('http://schema.org/Thing', 'http://mock.com/api/jsonld-tests/tree.jsonld', callbackHTTPResolver) -> []
  */
  this.supertype = async (type, contextUrl, callbackResourceResolver) => {
    const parser = new JsonLdParser();
    const stream = await callbackResourceResolver(contextUrl);
    const supertypes = [];
    return new Promise((resolve) => {
        parser.import(stream)
              .on('data', (quad) => {
                let subjectValue = quad['subject']['value'];
                let supertypeQuad = supertype(quad);
                let objectValue = quad['object']['value'];
                if (subjectValue === type && supertypeQuad && !supertypes.includes(objectValue)) {
                  supertypes.push(objectValue);
                }
              })
              .on('error', function(err){
                console.error(err);
                resolve(supertypes);
              })
              .on('end', function(){
                resolve(supertypes);
              })
    })
  }

  function supertype(quad) {
    return quad['predicate']['value'].includes('#subClassOf');
  }
}

module.exports = RdfContext;