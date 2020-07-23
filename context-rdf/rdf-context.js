const JsonLdParser = require("jsonld-streaming-parser").JsonLdParser;

const fs = require('fs');

function RdfContext() {

  this.lookup = (jsonpath) => {
    
  }

  // Get the supertypes
  this.supertypes = async function (url, options) {
    // TODO: Remove example.com when jsonld files are added to openteams api
    return fetch('https://example.com').then(res => {
      const stream = fs.createReadStream(url);
      return getSupertypes(stream);
    })
  }

  async function getSupertypes(stream) {
    return await processSteam(stream);
  }

  function processSteam(stream) {
    return new Promise(resolve => {
      // TODO: Update to use from JsonLdParser.fromHttpResponse when jsonld files are added to openteams api
      const parser = new JsonLdParser();

      let supertypes = []

      parser.import(stream)
        .on('data', (quad) => {
          let type = checkForType(quad);
          type && supertypes.push(type);
        })
        .on('error', () => {
          resolve(undefined);
          throw new Error(
            'A JSON-LD parsing error occurred while attempting to get supertypes. Check the file for syntax errors.');
        })
        .on('end', () => {
          resolve([...new Set(supertypes)]);
        })
    })
  }

  function checkForType(quad) {
    if (quad['predicate']['value'].includes('#type')) {
      return quad['object']['value'];
    }
  }
}

module.exports = RdfContext;
