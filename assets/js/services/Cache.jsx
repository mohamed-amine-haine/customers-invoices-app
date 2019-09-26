import { Promise } from "core-js";

const cache = {};

function set(key, data) {
  cache[key] = {
    data,
    cachedAt: new Date().getTime()
  };
}

function get(key) {
  return new Promise(resolve => {
    resolve(
      cache[key] && cache[key].cachedAt + 10 * 60 * 1000 > new Date().getTime()
        ? cache[key].data
        : null
    );
  });
}

function invalidate(key) {
  delete cache[key];
}

function clear() {
  for (var p in cache) {
    delete cache[p];
  }
}

export default {
  set,
  get,
  invalidate,
  clear
};
