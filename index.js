const { METHODS } = require("http");
const wasm = require("./pkg/gotta_go_fast");

const NOOP = () => {};

module.exports = class GottaGoFast {
  constructor({ httpMethods = METHODS, cache = false } = {}) {
    this.router = new wasm.Router();
    this.callbacks = [];

    if (cache) {
      const QuickLRU = require("@alloc/quick-lru");
      this.cache = new QuickLRU({ maxSize: 10000 });
    }

    // create convenience methods, eg: get("/users", () => {})
    for (const method of httpMethods) {
      this[method.toLowerCase()] = (path, handler) => {
        this.insert(path, method, handler);
      };
    }
  }

  lookup(req, res) {
    const handler = this.route(req.url, req.method.toLowerCase());
    if (typeof handler === "function") {
      return handler(req, res);
    }
    res.statusCode = 404;
    res.end("NotFound");
  }

  insert(path, method = "GET", handler) {
    if (typeof path !== "string" || !path.length) {
      throw new TypeError("Invalid: path");
    }
    if (typeof method !== "string" || !method.length) {
      throw new TypeError("Invalid: method");
    }
    const idx = this.callbacks.push(
      typeof handler === "function" ? handler : NOOP
    );
    const key = `/${method.toLowerCase()}${path}`;
    this.router.insert(key, idx - 1);
  }

  route(path, method) {
    const key = `/${method.toLowerCase()}${path}`;
    if (this.cache && this.cache.has(key)) return this.cache.get(key);
    if (typeof path !== "string" || !path.length) {
      throw new TypeError("Invalid: path");
    }
    if (typeof method !== "string" || !method.length) {
      throw new TypeError("Invalid: method");
    }

    const idx = this.router.lookup(key);
    if (Number.isFinite(idx) && idx >= 0 && this.callbacks[idx]) {
      this.cache && this.cache.set(key, this.callbacks[idx]);
      return this.callbacks[idx];
    }
  }
};
