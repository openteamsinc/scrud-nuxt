// ----- Resources
// * https://jasonwatmore.com/post/2020/04/18/fetch-a-lightweight-fetch-wrapper-to-simplify-http-requests
// * https://github.com/GoogleChrome/samples/tree/gh-pages/service-worker/read-through-caching
// * https://gist.github.com/niallo/3109252#gistcomment-2883309


// ----- Constants and values (probably need to be configurable)

class CachingClient extends EventTarget{

    constructor(cache_version=1, current_cache='read-through',
                json_schema_rel_header='rel=\'describedBy\'',
                json_schema_envelop_type='https://api.openteams.com/json-schema/Envelope'){
        super();
        this.cache_version = cache_version;
        this.current_cache = current_cache;
        this.current_caches = {};
        this.current_caches[current_cache] = `${current_cache}-cache-v${cache_version}`;
        this.json_schema_rel_header = json_schema_rel_header;
        this.json_schema_envelop_type = json_schema_envelop_type;
    }
    // ----- Cache handling
    
    // Clears unhandled caches
    clearUnknownCache = async () => {
        const expectedCacheNames = Object.keys(this.current_caches).map(function(key) {
            return this.current_caches[key];
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
    
    // Clear the current cache (current_cache)
    clearCache = async () => {
        return await caches.delete(this.current_caches[this.current_cache]);
    }
    
    // Retrieve and cache a response from a new request or retrieve response from cache
    cacheRequest = async (request) => {
        const cache = await caches.open(this.current_caches[this.current_cache])
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
            const unwrappResources = await this._getUnwrappedResources(fetchResponse.clone());
            if( unwrappResources.length > 0 ) {
                // Get Headers and content from response body, get response read-only values,
                // cache response content with the headers extracted and values found.
                for (const unwrappResource of unwrappResources) {
                    const {ok, redirected, status, statusText} = fetchResponse;
                    const {headers, body, url} = unwrappResource;
                    const unWrappResponse = new Response(body, {headers, status, statusText, url});
    
                    // Set response read only values that aren't available in the Response constructor.
                    Object.defineProperty(unWrappResponse, 'url', {value: url});
                    Object.defineProperty(unWrappResponse, 'ok', {value: ok});
                    Object.defineProperty(unWrappResponse, 'redirected', {value: redirected});
                    cache.put(url, unWrappResponse);
                }
            }
            cache.put(request.url, fetchResponse.clone());
        }
    
        // Return the original response object, which will be used to fulfill the resource request.
        return fetchResponse;
    }
    
    // ----- Envelop handling functions
    
    // Extract information from an envelop. Get the headers, body and url from the envelop provided.
    _unwrappEnvelop = (envelop) => {
        const {etag, last_modified, url, content} = envelop;
        const headers = {ETag: etag, 'Last-Modified': last_modified}
    
        return {headers,
                body: JSON.stringify(content),
                url};
    }
    
    // Detect that a response is an Envelop and retrieve a list of unwrapped envelopes if needed.
     _getUnwrappedResources = async (response) => {
        const responseLinks = this._parseLinkHeader(response.headers);
        const jsonSchemaURI = responseLinks[this.json_schema_rel_header];
        const unwrappedResources = [];
        if(jsonSchemaURI && jsonSchemaURI !== response.url){
            const schema = await this.get(jsonSchemaURI, true);
            const schemaId = schema.$id;
            const schemaItems = schema.properties.content.properties.items;
            if (schemaId == this.json_schema_envelop_type){
                // Handle single resource
                unwrappedResources.push(this._unwrappEnvelop(await response.json()));
                return unwrappedResources;
            } else if (schemaItems && schemaItems.$ref == this.json_schema_envelop_type) {
                // Handle array of resources
                const content = await response.json();
                for (const envelop of content) {
                    unwrappedResources.push(this._unwrappEnvelop(envelop));
                }
            }
        }
        return unwrappedResources;
    }
    
    // ----- Helper functions to cache requests
    _httpRequest = async (url, requestOptions) => {
        try{
            const response = await this.cacheRequest(new Request(url, requestOptions))
            return requestOptions.json? await this._JSONhandleResponse(response): response;
        } catch(err) {
            console.error('Error while catching the request', err);
        }
    }
    
    // Parse link headers and retrieve an object {rel0: url0, rel1: url1}
    _parseLinkHeader = (headers) => {
        // Taken from: https://gist.github.com/niallo/3109252#gistcomment-2883309
        const header = headers.get('Link');
        if (!header || header.length === 0) {
            return {};
        }
    
        // Split parts by comma and parse each part into a named link
        const found = header.split(/(?!\B"[^"]*),(?![^"]*"\B)/).reduce((links, part) => {
            const section = part.split(/(?!\B"[^"]*);(?![^"]*"\B)/);
            if (section.length < 2) {
                throw new Error("Section could not be split on ';'");
            }
            const url = section[0].replace(/<(.*)>/, '$1').trim();
            const name = section[1].replace(/rel="(.*)"/, '$1').trim();
    
            links[name] = url;
    
            return links;
        }, {});
    
        return found;
    }
    
    // Helper function to parse a response as JSON (Probably not needed in the future and could be replaced with Response.json())
    _JSONhandleResponse = async (response) => {
        const text = await response.text();
        const data = text && JSON.parse(text);
        if (!response.ok) {
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    }

    // ----- Requests available (GET, OPTIONS, POST, PUT, DELETE)
    
    get = async (url, json, options) => {
        const requestOptions = {
            method: 'GET',
            ...options,
            json
        };
        return this._httpRequest(url, requestOptions);
    }
    
    options = async (url, json, options) => {
        const requestOptions = {
            method: 'OPTIONS',
            ...options,
            json
        };
        return this._httpRequest(url, requestOptions);
    }
    
    post = async (url, body, json, options) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            ...options,
            json
        };
        return this._httpRequest(url, requestOptions);
    }
    
    put = async (url, body, json, options) => {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            ...options,
            json
        };
        return this._httpRequest(url, requestOptions);
    }
    
    delete = async (url, json, options) => {
        const requestOptions = {
            method: 'DELETE',
            ...options,
            json
        };
        return this._httpRequest(url, requestOptions);
    }

}

// Export of the functions that should be available for external use.
export default CachingClient;
