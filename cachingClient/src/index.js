// ----- Resources
// * https://jasonwatmore.com/post/2020/04/18/fetch-a-lightweight-fetch-wrapper-to-simplify-http-requests
// * https://github.com/GoogleChrome/samples/tree/gh-pages/service-worker/read-through-caching
// * https://gist.github.com/niallo/3109252#gistcomment-2883309


// ----- Constants and values (probably need to be configurable)

const CACHE_VERSION = 1;
const CURRENT_CACHES = {
  'read-through': 'read-through-cache-v' + CACHE_VERSION
};
const CURRENT_CACHE = 'read-through';
const JSON_SCHEMA_REL_HEADER = 'describedBy';
const JSON_SCHEMA_ENVELOP_TYPE = 'https://api.openteams.com/json-schema/Envelope';

// ----- Cache handling

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

// Clear the current cache (CURRENT_CACHE)
async function clearCache(){
    return await caches.delete(CURRENT_CACHES[CURRENT_CACHE]);
}

// Retrieve and cache a response from a new request or retrieve response from cache
async function cacheRequest(request) {
    const cache = await caches.open(CURRENT_CACHES['read-through'])
    let cacheResponse = await cache.match(request.url);
    if (cacheResponse) {
        // If there is an entry in the cache for request.url, then response will be defined
        // and we can just return it for now.
        // TODO: Add a way to check if an update to the cache is needed
        // e.g do a HEAD request to check cache headers for the resource.
        // console.log(' Found response in cache:', cacheResponse);
        return cacheResponse;
    }

    // Otherwise, if there is no entry in the cache for request.url, response will be
    // undefined, and we need to fetch() the resource.
    // console.log(' No response for %s found in cache. ' + 'About to fetch from network...', request.url);

    // We call .clone() on the request since we might use it in the call to cache.put() later on.
    // Both fetch() and cache.put() "consume" the request, so we need to make a copy.
    // (see https://fetch.spec.whatwg.org/#dom-request-clone)
    const fetchResponse = await fetch(request.clone());
    // console.log('  Response for %s from network is: %O', request.url, fetchResponse);

    // Optional: Add in extra conditions here, e.g. response.type == 'basic' to only cache
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
        const unwrappResources = await getUnwrappedResources(fetchResponse);
        if( unwrappResources.length > 0 ) {
            // Get Headers and content from response body, get response read-only values,
            // cache response content with the headers extracted and values found.
            for (const unwrappResource of unwrappResources) {
                const {ok, redirected, status, statusText} = fetchResponse;
                const {headers, body, url} = unwrappResource;
                const unWrappResponse = new Response(body, {headers, status, statusText});

                // Set response read only values that aren't available in the Response constructor.
                Object.defineProperty(unWrappResponse, 'url', {value: url});
                Object.defineProperty(unWrappResponse, 'ok', {value: ok});
                Object.defineProperty(unWrappResponse, 'redirected', {value: redirected});
                cache.put(url, unWrappResponse.clone());
            }
        }
        cache.put(request.url, fetchResponse.clone());
    }

    // Return the original response object, which will be used to fulfill the resource request.
    return fetchResponse;
}

// ----- Helper functions to cache requests
async function _httpRequest(url, requestOptions) {
    try{
        const response = await cacheRequest(new Request(url, requestOptions))
        return requestOptions.json? await JSONhandleResponse(response): response;
    } catch(err) {
        console.error('Error while catching the request', err);
    }
}

// Parse link headers and retrieve an object {rel0: url0, rel1: url1}
function _parseLinkHeader(headers) {
    // Taken from: https://gist.github.com/niallo/3109252#gistcomment-2883309
    const header = headers.get('Link');
    if (!header || header.length === 0) {
        return {};
    }

    // Split parts by comma and parse each part into a named link
    return header.split(/(?!\B"[^"]*),(?![^"]*"\B)/).reduce((links, part) => {
        const section = part.split(/(?!\B"[^"]*);(?![^"]*"\B)/);
        if (section.length < 2) {
            throw new Error("Section could not be split on ';'");
        }
        const url = section[0].replace(/<(.*)>/, '$1').trim();
        const name = section[1].replace(/rel="(.*)"/, '$1').trim();

        links[name] = url;

        return links;
    }, {});
}


// ----- Envelop handling functions

// Extract information from an envelop. Get the headers, body and url from the envelop provided.
function unwrappEnvelop(envelop){
    const {etag, last_modified, url, content} = envelop;
    const headers = {ETag: etag, 'Last-Modified': last_modified}

    return {headers,
            body: new Blob(JSON.parse(content), {type: 'application/json'}),
            url};
}

// Detect that a response is an Envelop and retrieve a list of unwrapped envelopes if needed.
async function getUnwrappedResources(response){
    const responseLinks = _parseLinkHeader(response.headers);
    const jsonSchemaURI = responseLinks[JSON_SCHEMA_REL_HEADER];
    const unwrappedResources = [];
    if(jsonSchemaURI){
        const schema = await get(jsonSchemaURI, true);
        const schemaId = schema.$id;
        const schemaItems = schema.properties.content.properties.items;
        if (schemaId == JSON_SCHEMA_ENVELOP_TYPE){
            // Handle single resource
            unwrappedResources.push(unwrappEnvelop(await response.json()));
            return unwrappedResources;
        } else if (schemaItems && schemaItems.$ref == JSON_SCHEMA_ENVELOP_TYPE) {
            // Handle array of resources
            const content = await response.json();
            for (const envelop of content) {
                unwrappedResources.push(unwrappEnvelop(envelop));
            }
        }
    }
    return unwrappedResources;
}

// ----- Requests available (GET, OPTIONS, POST, PUT, DELETE)

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

async function _delete(url, json, options) {
    // Prefixed with underscored because delete is a reserved word in javascript
    const requestOptions = {
        method: 'DELETE',
        ...options,
        json
    };
    return _httpRequest(url, requestOptions);
}

// Helper function to parse a response as JSON (Probably not needed in the future and could be replaced with Response.json())
async function JSONhandleResponse(response) {
    const text = await response.text();
    const data = text && JSON.parse(text);
    if (!response.ok) {
        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
    }
    return data;
}

// Export of the functions that should be available for external use.
export const cachingClient = {
    clearUnknownCache,
    clearCache,
    get,
    options,
    post,
    put,
    delete: _delete
};