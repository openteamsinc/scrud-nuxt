# Caching Client

Example Caching Client (HTTP Client using the Cache API). This example cache any request that is made using the available functions.

## Available functions

* `clearCache`: Removes any entry in the managed cache store.
* `clearUnknownCache`: Removes any entry in caches not being managed by the client.
* Requests (`GET`, `POST`, `PUT`, `DELETE`): Each request can be used calling its respective function (i.e `get(...)`, `post(...)`, `put(...)`, and `delete(...)`). The parameters are: 
        - `url`: URL to fetch.
        - `body`: Content of the request (in the case of `POST` or `PUT` requests).
        - `json`: If only the JSON parsed response is needed.
        - `options`: To add or override the options used to fetch the given URL (`headers`, `mode`, `method`, etc.).

## Setup
To play with it you can use the [`http-server`](https://www.npmjs.com/package/http-server) package:

```
npm install http-server -g
```

And under this directory:

```
http-server -p 3000
```

## Example

* Go to http://localhost:3000
* Open the console in your browser.
* Run something like `await cachingClient.get("http://dummy.restapiexample.com/api/v1/employees", true)`.
    * Result without cache:
        ```js
        No response for http://dummy.restapiexample.com/api/v1/employees found in cache. About to fetch from network...
        Response for http://dummy.restapiexample.com/api/v1/employees from network is:  
        Response { type: "cors", url: "http://dummy.restapiexample.com/api/v1/employees", redirected: false, status: 200, ok: true, statusText: "OK", headers: Headers, body: ReadableStream, bodyUsed: false }
        Object { status: "success", data: (24) […] }
        ```
    * Result with cache:
        ```js
        Found response in cache: 
        Response { type: "cors", url: "http://dummy.restapiexample.com/api/v1/employees", redirected: false, status: 200, ok: true, statusText: "OK", headers: Headers, body: ReadableStream, bodyUsed: false }
        Object { status: "success", data: (24) […] }    
        ```
## Resources

Based on:

* https://jasonwatmore.com/post/2020/04/18/fetch-a-lightweight-fetch-wrapper-to-simplify-http-requests
* https://github.com/GoogleChrome/samples/tree/gh-pages/service-worker/read-through-caching
 

