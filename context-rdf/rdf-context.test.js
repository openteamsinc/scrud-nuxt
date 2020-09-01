const RdfContext = require('./rdf-context');
const fs = require('fs');

const offlineResourceSolver = (resourceURL) => {
    return fs.createReadStream(resourceURL);
};

const onlineResourceSolver = async (resourceURL) => {
    const response = await fetch(resourceURL, {method: 'GET'});
    return response.body;
}
describe('Supertype tests', () => {
    it('Get supertypes using offline context - file', async () => {
        const context = new RdfContext();
        const subclassOf = await context.supertype(
            'http://schema.org/Vehicle', './jsonld-tests/tree.jsonld', null, offlineResourceSolver);
        // TODO: Change expected value when updating the jsonld file or add another test using a file that returns a different response
        expect(subclassOf).toEqual('http://schema.org/Product');
      });
    
    it('Get supertypes using online context - HTTP request', async () => {
        const context = fs.createReadStream('./jsonld-tests/tree.jsonld');
        fetch.mockOnce(context);
        const subclassOf = await (new RdfContext()).supertype(
            'http://schema.org/Vehicle', 'http://mock.com/api/jsonld-tests/tree.jsonld', null, onlineResourceSolver);
        expect(subclassOf).toEqual('http://schema.org/Product');
      });
})
