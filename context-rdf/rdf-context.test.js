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
    it('Get supertype using offline context - file', async () => {
        const context = new RdfContext();
        const subClass = await context.supertype('Person', './jsonld-tests/tree.jsonld', null, offlineResourceSolver);
        // TODO: Change expected value when updating the jsonld file or add another test using a file that returns a different response
        expect(subClass).toEqual({});
      });
    
    it('Get supertype using online context - HTTP request', async () => {
        const context = fs.createReadStream('./jsonld-tests/tree.jsonld');
        fetch.mockOnce(context);
        const isSubclass = await (new RdfContext()).supertype(
            'Person', 'http://mock.com/api/jsonld-tests/tree.jsonld', null, onlineResourceSolver);
        expect(isSubclass).toEqual({});
      });
})
