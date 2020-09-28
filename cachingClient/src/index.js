// ----- Resources
// * https://jasonwatmore.com/post/2020/04/18/fetch-a-lightweight-fetch-wrapper-to-simplify-http-requests
// * https://github.com/GoogleChrome/samples/tree/gh-pages/service-worker/read-through-caching
// * https://gist.github.com/niallo/3109252#gistcomment-2883309
// * https://stackoverflow.com/a/58209729


// Class definitions (CachingClient and EventDispatcher)

// Needed for compatibility with Safari and Explorer since EventTarget there doesn't support the constructor.
// Taken from: https://stackoverflow.com/a/58209729
class EventDispatcher {

    constructor() {
        this._listeners = [];
    }

    hasEventListener(type, listener) {
        return this._listeners.some(item => item.type === type && item.listener === listener);
    }

    addEventListener(type, listener) {
        if (!this.hasEventListener(type, listener)) {
            this._listeners.push({type, listener, options: {once: false}});
        }
        return this
    }

    removeEventListener(type, listener) {
        let index = this._listeners.findIndex(item => item.type === type && item.listener === listener);
        if (index >= 0) this._listeners.splice(index, 1);
        return this;
    }

    removeEventListeners() {
        this._listeners = [];
        return this;
    }

    dispatchEvent(evt) {
        this._listeners
            .filter(item => item.type === evt.type)
            .forEach(item => {
                const {type, listener, options: {once}} = item;
                listener.call(this, evt);
                if (once === true) this.removeEventListener(type, listener)
            });
        return this
    }
}


class CachingClient extends EventDispatcher{
    static GET = 'GET';
    static POST = 'POST';
    static HEAD = 'HEAD';
    static OPTIONS = 'OPTIONS';
    static PUT = 'PUT';
    static DELETE = 'DELETE';
    static HTTP_HEADERS_CONTENT_TYPE = 'Content-Type';
    static HTTP_HEADERS_LINK = 'Link';
    static HTTP_HEADERS_LOCATION = 'Location';
    static HTTP_HEADERS_ETAG = 'ETag';
    static HTTP_HEADERS_LAST_MODIFIED = 'Last-Modified';
    static HTTP_HEADERS_IF_MATCH = 'If-Match';
    static HTTP_HEADERS_IF_UNMODIFIED_SINCE = 'If-Unmodified-Since';
    static HTTP_HEADERS_CACHE_CONTROL = 'Cache-Control';
    static HTTP_HEADERS_IF_UNMODIFIED_SINCE = 'If-Unmodified-Since';

    constructor(cacheVersion=1, currentCache='read-through',
                jsonSchemaRelHeader='rel=\'describedBy\'',
                jsonSchemaEnvelopType='https://api.openteams.com/json-schema/Envelope'){
        super();
        this.cacheVersion = cacheVersion;
        this.currentCache = currentCache;
        this.currentCacheOptions = `${currentCache}-options`;
        this.currentCaches = {};
        this.currentCaches[currentCache] = `${currentCache}-cache-v${cacheVersion}`;
        this.currentCaches[this.currentCacheOptions] = `${currentCache}-cache-options-v${cacheVersion}`;
        this.jsonSchemaRelHeader = jsonSchemaRelHeader;
        this.jsonSchemaEnvelopType = jsonSchemaEnvelopType;
    }

    // ----- Cache handling
    
    // Clears unhandled caches
    clearUnknownCache = async () => {
        const expectedCacheNames = Object.keys(this.currentCaches).map(function(key) {
            return this.currentCaches[key];
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
    
    // Clear the current cache (currentCache)
    clearCache = async () => {
        return [await caches.delete(this.currentCaches[this.currentCache]),
                await caches.delete(this.currentCaches[this.currentCacheOptions])];
    }
    
    // Retrieve and cache a response from a new request or retrieve response from cache
    cacheRequest = async (request) => {
        const {method, url} = request;
        const openCacheName = method == CachingClient.OPTIONS ?
                                this.currentCaches[this.currentCacheOptions]:
                                this.currentCaches[this.currentCache];
        const cache = await caches.open(openCacheName)
        const cachedResponse = await cache.match(url);
        if (cachedResponse && (method == CachingClient.GET || method == CachingClient.OPTIONS)) {
            // If there is an entry in the cache for request.url, then response will be defined
            // and we can just return it for now.
            // e.g do a HEAD request to check cache headers for the resource.
            // console.log(' Found response in cache:', cachedResponse);
            const headHeaders = {};
            headHeaders[CachingClient.HTTP_HEADERS_CACHE_CONTROL] = 'no-store';
            const headRequest = new Request(url, {method: CachingClient.HEAD, headers: headHeaders});
            const headResponse = await fetch(headRequest);
            if(this._cacheUpToDate(headResponse, cachedResponse)){
                return cachedResponse.clone();
            }
        } else if (!cachedResponse && (method == CachingClient.PUT || method == CachingClient.DELETE)) {
            throw new Error(`Can't do a ${request.method} without previously having information in the Cache about the resource`);
        } else if (cachedResponse && (method == CachingClient.PUT || method == CachingClient.DELETE)) {
            const ifMatch = cachedResponse.headers.get(CachingClient.HTTP_HEADERS_ETAG);
            const ifUnmodifiedSince = cachedResponse.headers.get(CachingClient.HTTP_HEADERS_LAST_MODIFIED);
            if (ifMatch) {
                request.headers.append(CachingClient.HTTP_HEADERS_IF_MATCH, ifMatch);
            }
            if (ifUnmodifiedSince) {
                request.headers.append(CachingClient.HTTP_HEADERS_IF_UNMODIFIED_SINCE, ifUnmodifiedSince);
            }
        }
    
        // Otherwise, if there is no entry in the cache for request.url or it needs to be updated, response will be
        // undefined or old, and we need to fetch() the resource.
        // console.log(' No response for %s found in cache or response stored is old. ' + 'About to fetch from network...', request.url);
    
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
            if (method == CachingClient.GET || method == CachingClient.PUT || method == CachingClient.OPTIONS ){
                // Update the cache
                await cache.put(url, fetchResponse.clone());
            } else if (method == CachingClient.DELETE){
                // Delete the entry from the cache
                await cache.delete(url);
            } else if (method == CachingClient.POST){
                // Update the cache if the response has (1) A location header (2) The new resource in the body
                const locationHeader = fetchResponse.clone().headers.get(CachingClient.HTTP_HEADERS_LOCATION);
                const postBody = fetchResponse.clone().body;
                if (locationHeader && postBody){
                   await cache.put(locationHeader, fetchResponse.clone());
                }
                if(fetchResponse.status == 201){
                    await cache.delete(url);
                }
            }
            const unwrappedResources = await this._getUnwrappedResources(fetchResponse.clone());
            if( unwrappedResources.length > 0 ) {
                this._cacheUnwrappedResources(unwrappedResources, fetchResponse, cache);
            }
            if(cachedResponse){
                // Dispatch event informing of new info cached for the resource
                this.dispatchEvent(new CustomEvent(url, {detail: { url }}));
            }
        }
    
        // Return the original response object, which will be used to fulfill the resource request.
        return fetchResponse;
    }
    
    // ----- Envelopes and unwrapped resources handling functions
    
    // Cache unwrapped resources
    _cacheUnwrappedResources = async (unwrappedResources, fetchResponse, cache) => {
        // Get Headers and content from response body, get response read-only values,
        // cache response content with the headers extracted and values found.
        for (const unwrappedResource of unwrappedResources) {
            const {ok, redirected, status, statusText} = fetchResponse;
            const {headers, body, url} = unwrappedResource;
            const cachedResponse = await cache.match(url);
            const unWrappedResponse = new Response(body, {headers, status, statusText, url});
            // Set response read only values that aren't available in the Response constructor.
            Object.defineProperty(unWrappedResponse, 'url', {value: url});
            Object.defineProperty(unWrappedResponse, 'ok', {value: ok});
            Object.defineProperty(unWrappedResponse, 'redirected', {value: redirected});
            // Check if an update is needed by looking the headers of the unwrapped resources and if an already cached response is found
            if(cachedResponse){
                if(!this._cacheUpToDate(unWrappedResponse, cachedResponse)){
                    cache.put(url, unWrappedResponse.clone());
                    // Dispatch event informing of new info cached for a unwrapped resource
                    this.dispatchEvent(new CustomEvent(url, {detail: { url }}));
                }
            } else {
                cache.put(url, unWrappedResponse.clone());
            }
        }
    }

    // Extract information from an envelop. Get the headers, body and url from the envelop provided.
    _getUnwrappedEnvelop = (envelop) => {
        const {etag, last_modified, url, href, content} = envelop;
        const path = url || href;
        const headers = {};
        headers[CachingClient.HTTP_HEADERS_ETAG] = etag;
        headers[CachingClient.HTTP_HEADERS_LAST_MODIFIED] = last_modified;

        return {headers,
                body: JSON.stringify(content),
                url: path};
    }
    
    // Detect that a response is an Envelop and retrieve a list of unwrapped envelopes if needed.
    _getUnwrappedResources = async (response) => {
        const responseLinks = this._parseLinkHeader(response.headers);
        const jsonSchemaURI = responseLinks[this.jsonSchemaRelHeader];
        const unwrappedResources = [];
        if(jsonSchemaURI && jsonSchemaURI !== response.url){
            const schema = await this.get(jsonSchemaURI, {json: true}).catch((err)=>{return {}});
            if (schema.properties && schema.$id){
                const schemaId = schema.$id;
                if (schemaId == this.jsonSchemaEnvelopType){
                    // Handle single resource
                    unwrappedResources.push(this._getUnwrappedEnvelop(await response.json()));
                } else if (schema.properties.content) {
                    // Handle array of resources
                    const schemaItems = schema.properties.content.properties.items;
                    if(schemaItems && schemaItems.properties.content.$ref == this.jsonSchemaEnvelopType) {
                       const {content} = await response.json();
                       for (const envelop of content) {
                           unwrappedResources.push(this._getUnwrappedEnvelop(envelop));
                       }
                    }
                }
            }
        }
        return unwrappedResources;
    }
    
    // ----- Helper functions to cache requests

    // Check the headers of two responses to see if ETag and Last-Modified are the same. Used to check if a cached response needs to be updated.
    _cacheUpToDate = (response, cachedResponse) => {
        const headers = response.headers;
        const cacheResponseHeaders = cachedResponse.headers;
        const lastModifiedHeader = headers.get(CachingClient.HTTP_HEADERS_LAST_MODIFIED);
        const eTagHeader = headers.get(CachingClient.HTTP_HEADERS_ETAG);
        const lastModifiedCacheHeader = cacheResponseHeaders.get(CachingClient.HTTP_HEADERS_LAST_MODIFIED);
        const eTagCacheHeader = cacheResponseHeaders.get(CachingClient.HTTP_HEADERS_ETAG);
        // TODO: Check if a better validation is needed        
        return eTagCacheHeader == eTagHeader && lastModifiedCacheHeader == lastModifiedHeader;
    }

    // Logic handler of the different HTTP Requests available
    _httpRequest = async (url, requestOptions) => {
        try{
            const {method, callback, json} = requestOptions;
            if ((method == CachingClient.GET || method == CachingClient.POST
                 || method == CachingClient.OPTIONS) && callback){
                this.addEventListener(url, callback);
            }
            const response = await this.cacheRequest(new Request(url, requestOptions))
            return json? await this._JSONhandleResponse(response): response;
        } catch(err) {
            console.error('Error while catching the request', err);
            throw err;
        }
    }
    
    // Parse link headers and retrieve an object {rel0: url0, rel1: url1}
    _parseLinkHeader = (headers) => {
        // Taken from: https://gist.github.com/niallo/3109252#gistcomment-2883309
        const header = headers.get(CachingClient.HTTP_HEADERS_LINK);
        if (!header || header.length === 0) {
            return {};
        }    
        // Split parts by comma and parse each part into a named link
        const found = header.split(/(?!\B"[^"]*),(?![^"]*"\B)/).reduce((links, part) => {
            const section = part.split(/(?!\B"[^"]*);(?![^"]*"\B)/);
            if (section.length < 2) {
                throw new Error("Link header parsing: Section could not be split on ';'");
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
    
    get = async (url, options) => {
        const requestOptions = {
            method: CachingClient.GET,
            ...options
        };
        return this._httpRequest(url, requestOptions);
    }
    
    options = async (url, options) => {
        const requestOptions = {
            method: CachingClient.OPTIONS,
            ...options
        };
        return this._httpRequest(url, requestOptions);
    }
    
    post = async (url, body, options) => {
        const headers = {};
        headers[CachingClient.HTTP_HEADERS_CONTENT_TYPE] = 'application/json';
        const requestOptions = {
            method: CachingClient.POST,
            headers,
            body: JSON.stringify(body),
            ...options
        };
        return this._httpRequest(url, requestOptions);
    }
    
    put = async (url, body, options) => {
        const headers = {};
        headers[CachingClient.HTTP_HEADERS_CONTENT_TYPE] = 'application/json';
        const requestOptions = {
            method: CachingClient.PUT,
            headers,
            body: JSON.stringify(body),
            ...options
        };
        return this._httpRequest(url, requestOptions);
    }
    
    delete = async (url, options) => {
        const requestOptions = {
            method: CachingClient.DELETE,
            ...options
        };
        return this._httpRequest(url, requestOptions);
    }

}

// Export of the functions that should be available for external use.
export default CachingClient;
