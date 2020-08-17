# Caching Client

Caching Client (HTTP Client using the Cache API).

## Available functions

* `constructor`: Doing `new CachingClient` you can pass the following options:
    * `cacheVersion`: Default 1
    * `currentCache`: Default 'read-through'
    * `jsonSchemaRelHeader`: Default 'rel=\'describedBy\''
    * `jsonSchemaEnvelopType`: Default 'https://api.openteams.com/json-schema/Envelope'
* `clearCache`: Removes any entry in the managed cache store.
* `clearUnknownCache`: Removes any entry in caches not being managed by the client.
* Requests (`GET`, `OPTIONS`, `POST`, `PUT`, `DELETE`): Each request can be used calling its respective function (i.e `get(...)`, `options(...)`, `post(...)`, `put(...)`, and `delete(...)`).

    The parameters for the available functions are:
    * `url`: URL to fetch.
    * `body`: Content of the request (in the case of `POST` or `PUT` requests).
    * `options`: To add or override the options used to fetch the given URL (`headers`, `mode`, `method`, etc.). Also you can add a `json` option if what you want get the response as the JSON parsed body.

## Build lib

To build a lib to be used in the browser you can use `npm run build:lib` this will create the `index.js` file that can be used from an HTML file with a script tag like `<script type="text/javascript" src="index.js"></script>`

## Demo Setup
To play with the caching client you can use the [`http-server`](https://www.npmjs.com/package/http-server) package:

```
npm install http-server -g
```

And under the `demo` directory:

```
http-server -p 3000
```

To build the demo after doing changes to the source code you can run `npm run build:demo`

## Demo

* Follow the setup above.
* Go to http://localhost:3000
* Open the console in your browser.
* Create an instance of the Caching Client: `client = cachingClient.default()` 
* Run something like `await cachingClient.get("https://jsonplaceholder.typicode.com/users/1/todos", true)`.
* Check with the browser devtools the Cache Storage section (in the case of Mozilla to update the cache view you need to close and reopen the devtool panel).

## Resources checked

* https://jasonwatmore.com/post/2020/04/18/fetch-a-lightweight-fetch-wrapper-to-simplify-http-requests
* https://github.com/GoogleChrome/samples/tree/gh-pages/service-worker/read-through-caching
* https://gist.github.com/niallo/3109252#gistcomment-2883309
* https://stackoverflow.com/a/58209729
 
