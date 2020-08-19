import CachingClient from '../src/index';

describe('caching-client GET', () => {

    beforeEach(()=>{
        fetch.resetMocks();
        const cachingClient = new CachingClient();
        cachingClient.clearCache();
    });

    it('Check GET request - return Response object', async () => {
        const cachingClient = new CachingClient();
        // Check the cache is clear
        expect(_caches['read-through-cache-v1']).toBeUndefined();

        // Setup mock request
        const url = 'https://mock.com/todo';
        const expectedBody = [{'completed': false, 'id': 1, 'title': 'delectus aut autem', 'userId': 1}, {'completed': false, 'id': 2, 'title': 'quis ut nam facilis et officia qui', 'userId': 1}, {'completed': false, 'id': 3, 'title': 'fugiat veniam minus', 'userId': 1}, {'completed': true, 'id': 4, 'title': 'et porro tempora', 'userId': 1}, {'completed': false, 'id': 5, 'title': 'laboriosam mollitia et enim quasi adipisci quia provident illum', 'userId': 1}, {'completed': false, 'id': 6, 'title': 'qui ullam ratione quibusdam voluptatem quia omnis', 'userId': 1}, {'completed': false, 'id': 7, 'title': 'illo expedita consequatur quia in', 'userId': 1}, {'completed': true, 'id': 8, 'title': 'quo adipisci enim quam ut ab', 'userId': 1}, {'completed': false, 'id': 9, 'title': 'molestiae perspiciatis ipsa', 'userId': 1}, {'completed': true, 'id': 10, 'title': 'illo est ratione doloremque quia maiores aut', 'userId': 1}, {'completed': true, 'id': 11, 'title': 'vero rerum temporibus dolor', 'userId': 1}, {'completed': true, 'id': 12, 'title': 'ipsa repellendus fugit nisi', 'userId': 1}, {'completed': false, 'id': 13, 'title': 'et doloremque nulla', 'userId': 1}, {'completed': true, 'id': 14, 'title': 'repellendus sunt dolores architecto voluptatum', 'userId': 1}, {'completed': true, 'id': 15, 'title': 'ab voluptatum amet voluptas', 'userId': 1}, {'completed': true, 'id': 16, 'title': 'accusamus eos facilis sint et aut voluptatem', 'userId': 1}, {'completed': true, 'id': 17, 'title': 'quo laboriosam deleniti aut qui', 'userId': 1}, {'completed': false, 'id': 18, 'title': 'dolorum est consequatur ea mollitia in culpa', 'userId': 1}, {'completed': true, 'id': 19, 'title': 'molestiae ipsa aut voluptatibus pariatur dolor nihil', 'userId': 1}, {'completed': true, 'id': 20, 'title': 'ullam nobis libero sapiente ad optio sint', 'userId': 1}];
        fetch.mockResponseOnce(JSON.stringify(expectedBody), {url});
        
        // Make the request
        const response = await cachingClient.get(url);
        const expectedResponse = response.clone();
        const responseBody = await response.json();

        // Assert response body is correct
        expect(responseBody).toEqual(expectedBody);

        // Assert the cache entry for the request
        expect(_caches['read-through-cache-v1']).not.toBeUndefined();
        expect(_caches['read-through-cache-v1'][url]).not.toBeUndefined();
        expect(_caches['read-through-cache-v1'][url]).toEqual(expectedResponse);
    });

    it('Check GET request - return parsed body', async () => {
        const cachingClient = new CachingClient();    
        // Check the cache is clear
        expect(_caches['read-through-cache-v1']).toBeUndefined();

        // Setup mock request
        const url = 'https://mock.com/todo';
        const expectedBody = [{'completed': false, 'id': 1, 'title': 'delectus aut autem', 'userId': 1}, {'completed': false, 'id': 2, 'title': 'quis ut nam facilis et officia qui', 'userId': 1}, {'completed': false, 'id': 3, 'title': 'fugiat veniam minus', 'userId': 1}, {'completed': true, 'id': 4, 'title': 'et porro tempora', 'userId': 1}, {'completed': false, 'id': 5, 'title': 'laboriosam mollitia et enim quasi adipisci quia provident illum', 'userId': 1}, {'completed': false, 'id': 6, 'title': 'qui ullam ratione quibusdam voluptatem quia omnis', 'userId': 1}, {'completed': false, 'id': 7, 'title': 'illo expedita consequatur quia in', 'userId': 1}, {'completed': true, 'id': 8, 'title': 'quo adipisci enim quam ut ab', 'userId': 1}, {'completed': false, 'id': 9, 'title': 'molestiae perspiciatis ipsa', 'userId': 1}, {'completed': true, 'id': 10, 'title': 'illo est ratione doloremque quia maiores aut', 'userId': 1}, {'completed': true, 'id': 11, 'title': 'vero rerum temporibus dolor', 'userId': 1}, {'completed': true, 'id': 12, 'title': 'ipsa repellendus fugit nisi', 'userId': 1}, {'completed': false, 'id': 13, 'title': 'et doloremque nulla', 'userId': 1}, {'completed': true, 'id': 14, 'title': 'repellendus sunt dolores architecto voluptatum', 'userId': 1}, {'completed': true, 'id': 15, 'title': 'ab voluptatum amet voluptas', 'userId': 1}, {'completed': true, 'id': 16, 'title': 'accusamus eos facilis sint et aut voluptatem', 'userId': 1}, {'completed': true, 'id': 17, 'title': 'quo laboriosam deleniti aut qui', 'userId': 1}, {'completed': false, 'id': 18, 'title': 'dolorum est consequatur ea mollitia in culpa', 'userId': 1}, {'completed': true, 'id': 19, 'title': 'molestiae ipsa aut voluptatibus pariatur dolor nihil', 'userId': 1}, {'completed': true, 'id': 20, 'title': 'ullam nobis libero sapiente ad optio sint', 'userId': 1}];
        fetch.mockResponseOnce(JSON.stringify(expectedBody), {url});
        
        // Make the request
        const responseBody = await cachingClient.get(url, {json: true});

        // Assert response body is correct
        expect(responseBody).toEqual(expectedBody);

        // Assert the cache entry for the request
        expect(_caches['read-through-cache-v1']).not.toBeUndefined();
        expect(_caches['read-through-cache-v1'][url]).not.toBeUndefined();
    });

    it('Check GET request - return cached request', async () => {
        const cachingClient = new CachingClient();    
        // Check the cache is clear
        expect(_caches['read-through-cache-v1']).toBeUndefined();

        // Setup mock request
        const url = 'https://mock.com/todo';
        const expectedBody = [{'completed': false, 'id': 1, 'title': 'delectus aut autem', 'userId': 1}, {'completed': false, 'id': 2, 'title': 'quis ut nam facilis et officia qui', 'userId': 1}, {'completed': false, 'id': 3, 'title': 'fugiat veniam minus', 'userId': 1}, {'completed': true, 'id': 4, 'title': 'et porro tempora', 'userId': 1}, {'completed': false, 'id': 5, 'title': 'laboriosam mollitia et enim quasi adipisci quia provident illum', 'userId': 1}, {'completed': false, 'id': 6, 'title': 'qui ullam ratione quibusdam voluptatem quia omnis', 'userId': 1}, {'completed': false, 'id': 7, 'title': 'illo expedita consequatur quia in', 'userId': 1}, {'completed': true, 'id': 8, 'title': 'quo adipisci enim quam ut ab', 'userId': 1}, {'completed': false, 'id': 9, 'title': 'molestiae perspiciatis ipsa', 'userId': 1}, {'completed': true, 'id': 10, 'title': 'illo est ratione doloremque quia maiores aut', 'userId': 1}, {'completed': true, 'id': 11, 'title': 'vero rerum temporibus dolor', 'userId': 1}, {'completed': true, 'id': 12, 'title': 'ipsa repellendus fugit nisi', 'userId': 1}, {'completed': false, 'id': 13, 'title': 'et doloremque nulla', 'userId': 1}, {'completed': true, 'id': 14, 'title': 'repellendus sunt dolores architecto voluptatum', 'userId': 1}, {'completed': true, 'id': 15, 'title': 'ab voluptatum amet voluptas', 'userId': 1}, {'completed': true, 'id': 16, 'title': 'accusamus eos facilis sint et aut voluptatem', 'userId': 1}, {'completed': true, 'id': 17, 'title': 'quo laboriosam deleniti aut qui', 'userId': 1}, {'completed': false, 'id': 18, 'title': 'dolorum est consequatur ea mollitia in culpa', 'userId': 1}, {'completed': true, 'id': 19, 'title': 'molestiae ipsa aut voluptatibus pariatur dolor nihil', 'userId': 1}, {'completed': true, 'id': 20, 'title': 'ullam nobis libero sapiente ad optio sint', 'userId': 1}];
        fetch.mockResponseOnce(JSON.stringify(expectedBody), {url, method: CachingClient.GET,
                                                              headers:{
                                                                  'Last-modified': 'Mon, 13 July 2020 12:12:12 GMT',
                                                                  ETag: 'XXXXX',
                                                              }})
            .mockResponseOnce(null, {url, method: CachingClient.HEAD,
                                      headers:{
                                        'Last-modified': 'Mon, 13 July 2020 12:12:12 GMT',
                                        ETag: 'XXXXX',
                                      }});
        
        // Make the request
        const responseBody = await cachingClient.get(url, {json: true});

        // Assert response body is correct
        expect(responseBody).toEqual(expectedBody);

        // Assert the cache entry for the request
        expect(_caches['read-through-cache-v1']).not.toBeUndefined();
        expect(_caches['read-through-cache-v1'][url]).not.toBeUndefined();

        // Make the request again
        const responseBodyCached = await cachingClient.get(url, {json: true});
        // Assert response body is correct
        expect(responseBodyCached).toEqual(expectedBody);
        // Assert fetch has been called (one for the inital GET request and one for the HEAD to check
        // the available cached response freshness).
        expect(fetch).toHaveBeenCalled();
        expect(fetch).toHaveBeenCalledTimes(2);
        // Assert methods of the request: (1) GET, (2) HEAD
        expect(fetch.mock.calls[0][0]['method']).toBe(CachingClient.GET);
        expect(fetch.mock.calls[1][0]['method']).toBe(CachingClient.HEAD);
    });

    it('Check GET request - update cached request and dispatch update event', async () => {
        const cachingClient = new CachingClient();
        // Check the cache is clear
        expect(_caches['read-through-cache-v1']).toBeUndefined();

        // Setup mock request
        const url = 'https://mock.com/todo';
        const expectedBody = [{'completed': false, 'id': 1, 'title': 'delectus aut autem', 'userId': 1}, {'completed': false, 'id': 2, 'title': 'quis ut nam facilis et officia qui', 'userId': 1}, {'completed': false, 'id': 3, 'title': 'fugiat veniam minus', 'userId': 1}, {'completed': true, 'id': 4, 'title': 'et porro tempora', 'userId': 1}, {'completed': false, 'id': 5, 'title': 'laboriosam mollitia et enim quasi adipisci quia provident illum', 'userId': 1}, {'completed': false, 'id': 6, 'title': 'qui ullam ratione quibusdam voluptatem quia omnis', 'userId': 1}, {'completed': false, 'id': 7, 'title': 'illo expedita consequatur quia in', 'userId': 1}, {'completed': true, 'id': 8, 'title': 'quo adipisci enim quam ut ab', 'userId': 1}, {'completed': false, 'id': 9, 'title': 'molestiae perspiciatis ipsa', 'userId': 1}, {'completed': true, 'id': 10, 'title': 'illo est ratione doloremque quia maiores aut', 'userId': 1}, {'completed': true, 'id': 11, 'title': 'vero rerum temporibus dolor', 'userId': 1}, {'completed': true, 'id': 12, 'title': 'ipsa repellendus fugit nisi', 'userId': 1}, {'completed': false, 'id': 13, 'title': 'et doloremque nulla', 'userId': 1}, {'completed': true, 'id': 14, 'title': 'repellendus sunt dolores architecto voluptatum', 'userId': 1}, {'completed': true, 'id': 15, 'title': 'ab voluptatum amet voluptas', 'userId': 1}, {'completed': true, 'id': 16, 'title': 'accusamus eos facilis sint et aut voluptatem', 'userId': 1}, {'completed': true, 'id': 17, 'title': 'quo laboriosam deleniti aut qui', 'userId': 1}, {'completed': false, 'id': 18, 'title': 'dolorum est consequatur ea mollitia in culpa', 'userId': 1}, {'completed': true, 'id': 19, 'title': 'molestiae ipsa aut voluptatibus pariatur dolor nihil', 'userId': 1}, {'completed': true, 'id': 20, 'title': 'ullam nobis libero sapiente ad optio sint', 'userId': 1}];
        fetch.mockResponseOnce(JSON.stringify(expectedBody), {url, method: CachingClient.GET,
                                                              headers:{
                                                                  'Last-modified': 'Mon, 13 July 2020 12:12:12 GMT',
                                                                  ETag: 'XXXXX',
                                                              }})
            .mockResponseOnce(null, {url, method: CachingClient.HEAD,
                                      headers:{
                                        'Last-modified': 'Mon, 14 July 2020 12:12:12 GMT',
                                        ETag: 'XXXXX',
                                      }})
            .mockResponseOnce(JSON.stringify(expectedBody), {url, method: CachingClient.GET,
                                                            headers:{
                                                                'Last-modified': 'Mon, 14 July 2020 12:12:12 GMT',
                                                                ETag: 'XXXXX',
                                                            }});

        // Make the request passing a callback to recieve event of cache update
        const cacheUpdateHandler = jest.fn((event) => {
                                            expect(event).not.toBeUndefined();
                                            expect(event.detail).not.toBeUndefined();
                                            expect(event.detail.url).toEqual(url);

                                          });
        const responseBody = await cachingClient.get(url, {json: true, callback: cacheUpdateHandler});

        // Assert response body is correct
        expect(responseBody).toEqual(expectedBody);

        // Assert the cache entry for the request
        expect(_caches['read-through-cache-v1']).not.toBeUndefined();
        expect(_caches['read-through-cache-v1'][url]).not.toBeUndefined();

        // Make the request again
        const responseBodyCached = await cachingClient.get(url, {json: true});
        // Assert response body is correct
        expect(responseBodyCached).toEqual(expectedBody);
        // Assert fetch has been called (one for the inital GET request, one for the HEAD to check
        // the available cached response freshness and one to update the cached response).
        expect(fetch).toHaveBeenCalled();
        expect(fetch).toHaveBeenCalledTimes(3);
        expect(cacheUpdateHandler).toHaveBeenCalled();
        expect(cacheUpdateHandler).toHaveBeenCalledTimes(1);
    });

    it('Check GET request - envelop properties handling', async () => {
        const cachingClient = new CachingClient();    
        // Check the cache is clear
        expect(_caches['read-through-cache-v1']).toBeUndefined();

        // Setup mock request and values
        // Unwrapped resource
        const unwrappResourceUrl = 'https://mock.com/todo/1';
        const unwrappResourceExpectedBody = {
            id: '1',
            task: 'Some Task'
          }
        const unwrappResourceExpectedHeaders = {
            'Last-modified': 'Mon, 13 July 2020 12:12:12 GMT',
            ETag: 'XXXXX',
        };
        
        // Resource
        const url = 'https://mock.com/enveloptodo/1';
        const expectedBody = {
            url: unwrappResourceUrl,
            last_modified: 'Mon, 13 July 2020 12:12:12 GMT',
            etag: 'XXXXX',
            content: {
              id: '1',
              task: 'Some Task'
            }
          };
        
        // JSON Schema for the resource
        const schemaURL = 'https://mock.com/schemas/todo.json';
        const schemaBody = {
            $id: 'https://api.openteams.com/json-schema/Envelope',
            $schema: 'http://json-schema.org/draft-04/schema',
            title: 'Resource Envelope',
            description: 'A resource wrapper providing the url and http caching headers for a contained resource',
            properties: {
              url: {
                type: 'string',
                format: 'uri'
              },
              last_modified: {
                type: 'string'
              },
              etag: {
                type: 'string'
              },
              content: {
                  properties: {
                    type: ['object', 'array', 'string', 'number', 'boolean']
                }
              }
            }
          };
        
        fetch.mockResponseOnce(
                JSON.stringify(expectedBody),
                { url, headers: { 'Link': "<https://mock.com/schemas/todo.json>;rel='describedBy';"}})
             .mockResponseOnce(
                JSON.stringify(schemaBody), {url});

        // Make the request
        const responseBody = await cachingClient.get(url, {json: true});

        // Assert response body is correct
        expect(responseBody).toEqual(expectedBody);

        // Assert the cache entry for the request
        expect(_caches['read-through-cache-v1']).not.toBeUndefined();
        expect(_caches['read-through-cache-v1'][url]).not.toBeUndefined();
        expect(await _caches['read-through-cache-v1'][url].clone().json()).toEqual(expectedBody);

        // Assert the cache entry for the json schema
        expect(await _caches['read-through-cache-v1'][schemaURL]).not.toBeUndefined();
        expect(await _caches['read-through-cache-v1'][schemaURL].clone().json()).toEqual(schemaBody);

        // Assert the cache for the unwrapped resource
        expect(await _caches['read-through-cache-v1'][unwrappResourceUrl]).not.toBeUndefined();
        expect(await _caches['read-through-cache-v1'][unwrappResourceUrl].clone().json()).toEqual(unwrappResourceExpectedBody);
        const cacheHeaders = _caches['read-through-cache-v1'][unwrappResourceUrl].clone().headers;
        expect(cacheHeaders.get('ETag')).toEqual(unwrappResourceExpectedHeaders['ETag']);
        expect(cacheHeaders.get('Last-modified')).toEqual(unwrappResourceExpectedHeaders['Last-modified']);
    });

});

describe('caching-client POST', () => {

  beforeEach(()=>{
      fetch.resetMocks();
      const cachingClient = new CachingClient();
      cachingClient.clearCache();
  });

  it('Check POST request - return Response object', async () => {
      const cachingClient = new CachingClient();
      // Check the cache is clear
      expect(_caches['read-through-cache-v1']).toBeUndefined();

      // Setup mock request
      const url = 'https://mock.com/todo';
      const postBody = {'completed': false, 'title': 'delectus aut autem', 'userId': 1};
      const expectedBody = {'id': 1, 'completed': false, 'title': 'delectus aut autem', 'userId': 1};
      fetch.mockResponseOnce(JSON.stringify(expectedBody), {url, method: CachingClient.POST});
      
      // Make the request
      const response = await cachingClient.post(url);
      const expectedResponse = response.clone();
      const responseBody = await response.json();

      // Assert response body is correct
      expect(responseBody).toEqual(expectedBody);

      // Assert the cache entry for the request
      expect(_caches['read-through-cache-v1']).not.toBeUndefined();
      expect(_caches['read-through-cache-v1'][url]).not.toBeUndefined();
      expect(_caches['read-through-cache-v1'][url]).toEqual(expectedResponse);
  });

  it('Check POST request - return parsed body', async () => {
      const cachingClient = new CachingClient();    
      // Check the cache is clear
      expect(_caches['read-through-cache-v1']).toBeUndefined();

      // Setup mock request
      const url = 'https://mock.com/todo';
      const postBody = {'completed': false, 'title': 'delectus aut autem', 'userId': 1};
      const expectedBody = {'id': 1, 'completed': false, 'title': 'delectus aut autem', 'userId': 1};
      fetch.mockResponseOnce(JSON.stringify(expectedBody), {url, method: CachingClient.POST});
      
      // Make the request
      const responseBody = await cachingClient.post(url, postBody, {json: true});

      // Assert response body is correct
      expect(responseBody).toEqual(expectedBody);

      // Assert the cache entry for the request
      expect(_caches['read-through-cache-v1']).not.toBeUndefined();
      expect(_caches['read-through-cache-v1'][url]).not.toBeUndefined();
  });

  it('Check POST request - return cached request', async () => {
      const cachingClient = new CachingClient();    
      // Check the cache is clear
      expect(_caches['read-through-cache-v1']).toBeUndefined();

      // Setup mock request
      const url = 'https://mock.com/todo';
      const postBody = {'completed': false, 'title': 'delectus aut autem', 'userId': 1};
      const expectedBody = {'id': 1, 'completed': false, 'title': 'delectus aut autem', 'userId': 1};
      fetch.mockResponseOnce(JSON.stringify(expectedBody), {url, method: CachingClient.POST,
                                                            headers:{
                                                                'Last-modified': 'Mon, 13 July 2020 12:12:12 GMT',
                                                                ETag: 'XXXXX',
                                                            }})
          .mockResponseOnce(null, {url, method: CachingClient.HEAD,
                                    headers:{
                                      'Last-modified': 'Mon, 13 July 2020 12:12:12 GMT',
                                      ETag: 'XXXXX',
                                    }});
      // Make the POST request
      const responseBody = await cachingClient.post(url, postBody, {json: true});

      // Assert response body is correct
      expect(responseBody).toEqual(expectedBody);

      // Assert the cache entry for the request
      expect(_caches['read-through-cache-v1']).not.toBeUndefined();
      expect(_caches['read-through-cache-v1'][url]).not.toBeUndefined();

      // Make a GET request
      const responseBodyCached = await cachingClient.get(url, {json: true});

      // Assert response body is correct
      expect(responseBodyCached).toEqual(expectedBody);
      // Assert fetch has been called (one for the inital POST request and one for the HEAD to check
      // the available cached response freshness when doing the GET request).
      expect(fetch).toHaveBeenCalled();
      expect(fetch).toHaveBeenCalledTimes(2);
      // Assert methods of the request: (1) POST, (2) HEAD
      expect(fetch.mock.calls[0][0]['method']).toBe(CachingClient.POST);
      expect(fetch.mock.calls[1][0]['method']).toBe(CachingClient.HEAD);
  });

  it('Check POST request - envelop properties handling', async () => {
      const cachingClient = new CachingClient();    
      // Check the cache is clear
      expect(_caches['read-through-cache-v1']).toBeUndefined();

      // Setup mock request and values
      // Unwrapped resource
      const unwrappResourceUrl = 'https://mock.com/todo/1';
      const unwrappResourceExpectedBody = {
          id: '1',
          task: 'Some Task'
        }
      const unwrappResourceExpectedHeaders = {
          'Last-modified': 'Mon, 13 July 2020 12:12:12 GMT',
          ETag: 'XXXXX',
      };
      
      // Resource
      const url = 'https://mock.com/enveloptodo';
      const expectedBody = {
          url: unwrappResourceUrl,
          last_modified: 'Mon, 13 July 2020 12:12:12 GMT',
          etag: 'XXXXX',
          content: {
            id: '1',
            task: 'Some Task'
          }
        };
      
      // JSON Schema for the resource
      const schemaURL = 'https://mock.com/schemas/todo.json';
      const schemaBody = {
          $id: 'https://api.openteams.com/json-schema/Envelope',
          $schema: 'http://json-schema.org/draft-04/schema',
          title: 'Resource Envelope',
          description: 'A resource wrapper providing the url and http caching headers for a contained resource',
          properties: {
            url: {
              type: 'string',
              format: 'uri'
            },
            last_modified: {
              type: 'string'
            },
            etag: {
              type: 'string'
            },
            content: {
                properties: {
                  type: ['object', 'array', 'string', 'number', 'boolean']
              }
            }
          }
        };
      
      fetch.mockResponseOnce(
              JSON.stringify(expectedBody),
              { url, method: CachingClient.POST, headers: { 'Link': "<https://mock.com/schemas/todo.json>;rel='describedBy';"}})
           .mockResponseOnce(
              JSON.stringify(schemaBody), {url});

      // Make the request
      const responseBody = await cachingClient.post(url, unwrappResourceExpectedBody, {json: true});

      // Assert response body is correct
      expect(responseBody).toEqual(expectedBody);

      // Assert the cache entry for the request
      expect(_caches['read-through-cache-v1']).not.toBeUndefined();
      expect(_caches['read-through-cache-v1'][url]).not.toBeUndefined();
      expect(await _caches['read-through-cache-v1'][url].clone().json()).toEqual(expectedBody);

      // Assert the cache entry for the json schema
      expect(await _caches['read-through-cache-v1'][schemaURL]).not.toBeUndefined();
      expect(await _caches['read-through-cache-v1'][schemaURL].clone().json()).toEqual(schemaBody);

      // Assert the cache for the unwrapped resource
      expect(await _caches['read-through-cache-v1'][unwrappResourceUrl]).not.toBeUndefined();
      expect(await _caches['read-through-cache-v1'][unwrappResourceUrl].clone().json()).toEqual(unwrappResourceExpectedBody);
      const cacheHeaders = _caches['read-through-cache-v1'][unwrappResourceUrl].clone().headers;
      expect(cacheHeaders.get('ETag')).toEqual(unwrappResourceExpectedHeaders['ETag']);
      expect(cacheHeaders.get('Last-modified')).toEqual(unwrappResourceExpectedHeaders['Last-modified']);
  });

});
