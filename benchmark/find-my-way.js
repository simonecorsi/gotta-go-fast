const http = require("http");
const router = require("find-my-way")();

const pingback = (req, res) => res.end(req.url);

router.on("GET", "/", pingback);
router.on("GET", "/users", pingback);
router.on("GET", "/users/:id", pingback);
router.on("GET", "/users/:id/:org", pingback);
router.on("GET", "/users/:user_id/repos", pingback);
router.on("GET", "/users/:user_id/repos/:id", pingback);
router.on(
  "GET",
  "/users/:user_id/repos/:id/:file_name/:review_id/:user_id",
  pingback
);
router.on("GET", "/users/:user_id/repos/:id/*any", pingback);
router.on("GET", "/:username", pingback);
router.on("GET", "/*any", pingback);
router.on("GET", "/about", pingback);
router.on("GET", "/about/", pingback);
router.on("GET", "/about/us", pingback);
router.on("GET", "/users/repos/*any", pingback);

http.createServer((req, res) => router.lookup(req, res)).listen(3000);
