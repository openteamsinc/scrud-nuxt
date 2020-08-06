require('jest-fetch-mock').enableMocks();
// changes default behavior of fetchMock to use the real 'fetch' implementation and not mock responses
//fetchMock.dontMock();

// caches mock based on: https://github.com/apache-superset/superset-ui/blob/ea78a4e41a9e1e4b7f3fb86c9d61020c89652804/test/setup.ts
const caches = {};

class Cache {
  cache;
  constructor(key) {
    caches[key] = caches[key] || {};
    this.cache = caches[key];
  }
  match(url) {
    return new Promise((resolve, reject) => resolve(this.cache[url]));
  }
  delete(url) {
    delete this.cache[url];
    return new Promise((resolve, reject) => resolve(true));
  }
  put(url, response) {
    this.cache[url] = response;
    return Promise.resolve();
  }
};

class CacheStorage {
  open(key) {
    return new Promise((resolve, reject) => {
      resolve(new Cache(key));
    });
  }
  delete(key) {
    const wasPresent = key in caches;
    if (wasPresent) {
      caches[key] = undefined;
    }

    return Promise.resolve(wasPresent);
  }
};

global.caches = new CacheStorage();
global._caches = caches;