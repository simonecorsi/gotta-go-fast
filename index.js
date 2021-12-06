const { METHODS } = require("http");
const wasm = require("./pkg/gotta_go_fast");

const NOOP = () => {};

class GottaGoFast {
  constructor() {
    this.router = new wasm.Router(METHODS.join(","));
    this.handlers = [];

    // create convenience methods, eg: get("/users", () => {})
    for (const method of METHODS) {
      this[method.toLowerCase()] = (path, handler) => {
        this.insert(path, method, handler);
      };
    }
  }

  insert(path, method = "GET", handler) {
    if (typeof path !== "string" || !path.length) {
      throw new TypeError("Invalid: path");
    }
    if (typeof method !== "string" || !method.length) {
      throw new TypeError("Invalid: method");
    }

    const idx = this.handlers.push(
      typeof handler === "function" ? handler : NOOP
    );
    this.router.insert(path, idx);
  }

  lookup(path) {
    if (typeof path !== "string" || !path.length) {
      throw new TypeError("Invalid: path");
    }
    const idx = this.router.lookup(path);
    if (Number.isFinite(idx) && idx >= 0) {
      return this.handlers[idx](idx);
    }
  }
}

const router = new GottaGoFast();

router.get("/", console.log);
router.get("/users", console.log);
router.get("/users/:id", console.log);
router.get("/users/:id/:org", console.log);
router.get("/users/:user_id/repos", console.log);
router.get("/users/:user_id/repos/:id", console.log);
router.get("/users/:user_id/repos/:id/*any", console.log);
router.get("/:username", console.log);
router.get("/*any", console.log);
router.get("/about", console.log);
router.get("/about/", console.log);
router.get("/about/us", console.log);
router.get("/users/repos/*any", console.log);

console.log(router.lookup("/users/123"));
