// Based on: 
// * https://jasonwatmore.com/post/2020/04/18/fetch-a-lightweight-fetch-wrapper-to-simplify-http-requests
// * https://github.com/GoogleChrome/samples/tree/gh-pages/service-worker/read-through-caching

const CACHE_VERSION = 1;
const CURRENT_CACHES = {
  'read-through': 'read-through-cache-v' + CACHE_VERSION
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
                // console.log('Deleting out of date cache:', cacheName);
                return caches.delete(cacheName);
            }
        })
    );
}

// Clear the current cache
async function clearCache(){
    return await caches.delete(CURRENT_CACHES['read-through']);
}

// Cache handling: Retrieve and cache a response from a new request or retrieve response from cache
async function cacheRequest(request, callback) {
    const cache = await caches.open(CURRENT_CACHES['read-through'])
    let cacheResponse = await cache.match(request);
    if (cacheResponse) {
        // If there is an entry in the cache for event.request, then response will be defined
        // and we can just return it.
        // console.log(' Found response in cache:', cacheResponse);
        return cacheResponse;
    }

    // Otherwise, if there is no entry in the cache for event.request, response will be
    // undefined, and we need to fetch() the resource.
    // console.log(' No response for %s found in cache. ' + 'About to fetch from network...', request.url);

    // We call .clone() on the request since we might use it in the call to cache.put() later on.
    // Both fetch() and cache.put() "consume" the request, so we need to make a copy.
    // (see https://fetch.spec.whatwg.org/#dom-request-clone)
    const fetchResponse = await fetch(request.clone());
    // console.log('  Response for %s from network is: %O', request.url, fetchResponse);
    // Optional: add in extra conditions here, e.g. response.type == 'basic' to only cache
    // responses from the same domain. See https://fetch.spec.whatwg.org/#concept-response-type
    if (fetchResponse.status < 400) {
        // This avoids caching responses that we know are errors (i.e. HTTP status code of 4xx or 5xx).
        // One limitation is that, for non-CORS requests, we get back a filtered opaque response
        // (https://fetch.spec.whatwg.org/#concept-filtered-response-opaque) which will always have a
        // .status of 0, regardless of whether the underlying HTTP call was successful. Since we're
        // blindly caching those opaque responses, we run the risk of caching a transient error response.
        //
        // We need to call .clone() on the response object to save a copy of it to the cache.
        // (https://fetch.spec.whatwg.org/#dom-request-clone)
        cache.put(request, fetchResponse.clone());
    }

    // Return the original response object, which will be used to fulfill the resource request.
    return fetchResponse;
}

// Helper function to cache requests
async function _httpRequest(url, requestOptions) {
    try{
        const response = await cacheRequest(new Request(url, requestOptions))
        return requestOptions.json? await JSONhandleResponse(response): response;
    } catch(err) {
        console.error('Error while catching the request', err);
    }
}

// Requests available (GET, OPTIONS, POST, PUT, DELETE)
async function get(url, json, options) {
    const requestOptions = {
        method: 'GET',
        ...options,
        json
    };
    return _httpRequest(url, requestOptions);
}

async function options(url, json, options) {
    const requestOptions = {
        method: 'OPTIONS',
        ...options,
        json
    };
    return _httpRequest(url, requestOptions);
}

async function post(url, body, json, options) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        ...options,
        json
    };
    return _httpRequest(url, requestOptions);
}

async function put(url, body, json, options) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        ...options,
        json
    };
    return _httpRequest(url, requestOptions);
}

// prefixed with underscored because delete is a reserved word in javascript
async function _delete(url, json, options) {
    const requestOptions = {
        method: 'DELETE',
        ...options,
        json
    };
    return _httpRequest(url, requestOptions);
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

export const cachingClient = {
    clearUnknownCache,
    clearCache,
    get,
    options,
    post,
    put,
    delete: _delete
};