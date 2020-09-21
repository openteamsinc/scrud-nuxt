const RdfContext = require('./rdf-context');
const fs = require('fs');

const offlineResourceSolver = (resourceURL) => {
    return fs.createReadStream(resourceURL);
};

const onlineResourceSolver = async (resourceURL) => {
    const response = await fetch(resourceURL, {method: 'GET'});
    return response.body;
};

describe('Lookup tests', () => {
    it('Get context-type URI/URL - $', async () => {
        const context = new RdfContext();
        const jsonpath = '$';
        const jsonld = JSON.parse(fs.readFileSync('./jsonld-tests/example-semantic-context.json', 'utf-8'));
        const contextType = await context.lookup(jsonpath, jsonld);
        expect(contextType).toEqual(['https://schema.org/Person']);
      });
    it('Get context-type URI/URL - $.address', async () => {
        const context = new RdfContext();
        const jsonpath = '$.address';
        const jsonld = JSON.parse(fs.readFileSync('./jsonld-tests/example-semantic-context.json', 'utf-8'));
        const contextType = await context.lookup(jsonpath, jsonld);
        expect(contextType).toEqual(['https://schema.org/PostalAddress']);
      });
});

describe('Supertype tests', () => {
    it('Get supertypes using offline context - file - with supertype', async () => {
        const context = new RdfContext();
        const subclassOf = await context.supertype(
            'http://schema.org/Vehicle', './jsonld-tests/tree.jsonld', offlineResourceSolver);
        expect(subclassOf).toEqual(['http://schema.org/Product']);
      });
    
    it('Get supertype using offline context - file - without supertype', async () => {
    const context = new RdfContext();
    const subclassOf = await context.supertype(
        'http://schema.org/Thing', './jsonld-tests/tree.jsonld', offlineResourceSolver);
    expect(subclassOf).toEqual([]);
    });
    
    it('Get supertype using online context - HTTP request - with supertype', async () => {
        const context = fs.createReadStream('./jsonld-tests/tree.jsonld');
        fetch.mockOnce(context);
        const subclassOf = await (new RdfContext()).supertype(
            'http://schema.org/Vehicle', 'http://mock.com/api/jsonld-tests/tree.jsonld', onlineResourceSolver);
        expect(subclassOf).toEqual(['http://schema.org/Product']);
      });
    
    it('Get supertype using online context - HTTP request - without supertype', async () => {
    const context = fs.createReadStream('./jsonld-tests/tree.jsonld');
    fetch.mockOnce(context);
    const subclassOf = await (new RdfContext()).supertype(
        'http://schema.org/Thing', 'http://mock.com/api/jsonld-tests/tree.jsonld', onlineResourceSolver);
    expect(subclassOf).toEqual([]);
    });
});
