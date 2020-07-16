// Based on: 
// * https://jasonwatmore.com/post/2020/04/18/fetch-a-lightweight-fetch-wrapper-to-simplify-http-requests
// * https://github.com/GoogleChrome/samples/tree/gh-pages/service-worker/read-through-caching

const CACHE_VERSION = 1;
const CURRENT_CACHES = {
  'read-through': 'read-through-cache-v' + CACHE_VERSION
};
const cachingClient = {
    clearUnknownCache,
    clearCache,
    get,
    post,
    put,
    delete: _delete
};

// Clears unhandled caches
async function clearUnknownCache(){
    const expectedCacheNames = Object.keys(CURRENT_CACHES).map(function(key) {
        return CURRENT_CACHES[key];
    });
    const cacheNames = await caches.keys()
    return Promise.all(
        cacheNames.map(function(cacheName) {
            if (expectedCacheNames.indexOf(cacheName) === -1) {
                // If this cache name isn't present in the array of "expected" cache names, then delete it.
                console.log('Deleting out of date cache:', cacheName);
                return caches.delete(cacheName);
            }
        })
    );
}

// Clear the current cache
async function clearCache(){
    return await caches.delete(CURRENT_CACHES['read-through']);
}

async function cacheRequest(request, callback) {
    const cache = await caches.open(CURRENT_CACHES['read-through'])
    const response = await cache.match(request);
    if (response) {
        // If there is an entry in the cache for event.request, then response will be defined
        // and we can just return it.
        console.log(' Found response in cache:', response);

        return response;
      }

    // Otherwise, if there is no entry in the cache for event.request, response will be
    // undefined, and we need to fetch() the resource.
    console.log(' No response for %s found in cache. ' +
    'About to fetch from network...', request.url);

    // We call .clone() on the request since we might use it in the call to cache.put() later on.
    // Both fetch() and cache.put() "consume" the request, so we need to make a copy.
    // (see https://fetch.spec.whatwg.org/#dom-request-clone)
    return fetch(request.clone()).then(function(response) {
    console.log('  Response for %s from network is: %O', request.url, response);

    // Optional: add in extra conditions here, e.g. response.type == 'basic' to only cache
    // responses from the same domain. See https://fetch.spec.whatwg.org/#concept-response-type
    if (response.status < 400) {
        // This avoids caching responses that we know are errors (i.e. HTTP status code of 4xx or 5xx).
        // One limitation is that, for non-CORS requests, we get back a filtered opaque response
        // (https://fetch.spec.whatwg.org/#concept-filtered-response-opaque) which will always have a
        // .status of 0, regardless of whether the underlying HTTP call was successful. Since we're
        // blindly caching those opaque responses, we run the risk of caching a transient error response.
        //
        // We need to call .clone() on the response object to save a copy of it to the cache.
        // (https://fetch.spec.whatwg.org/#dom-request-clone)
        cache.put(request, response.clone());
    }

    // Return the original response object, which will be used to fulfill the resource request.
    return response;
    });
}

// Requests available
async function get(url, json, options) {
    const requestOptions = {
        method: 'GET',
        ...options
    };
    const response = await cacheRequest(new Request(url, requestOptions))
    return json? await JSONhandleResponse(response): response;
}

async function post(url, body, json, options) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        ...options
    };
    const response = await cacheRequest(new Request(url, requestOptions))
    return json? await JSONhandleResponse(response): response;}

async function put(url, body, json, options) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        ...options
    };
    const response = await cacheRequest(new Request(url, requestOptions))
    return json? await JSONhandleResponse(response): response;
}

// prefixed with underscored because delete is a reserved word in javascript
async function _delete(url, json, options) {
    const requestOptions = {
        method: 'DELETE',
        ...options
    };
    const response = await cacheRequest(new Request(url, requestOptions))
    return json? await JSONhandleResponse(response): response;
}

// helper functions
async function JSONhandleResponse(response) {
    const text = await response.text();
    const data = text && JSON.parse(text);
    if (!response.ok) {
        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
    }
    return data;
}