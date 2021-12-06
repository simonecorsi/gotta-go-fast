const http = require("http");
const GottaGoFast = require("..");

const router = new GottaGoFast({
  cache: false,
});

const pingback = (req, res) => res.end(req.url);

router.get("/", pingback);
router.get("/users", pingback);
router.get("/users/:id", pingback);
router.get("/users/:id/:org", pingback);
router.get("/users/:user_id/repos", pingback);
router.get("/users/:user_id/repos/:id", pingback);
router.get(
  "/users/:user_id/repos/:id/:file_name/:review_id/:user_id",
  pingback
);
router.get("/users/:user_id/repos/:id/*any", pingback);
router.get("/:username", pingback);
router.get("/*any", pingback);
router.get("/about", pingback);
router.get("/about/", pingback);
router.get("/about/us", pingback);
router.get("/users/repos/*any", pingback);

http.createServer((req, res) => router.lookup(req, res)).listen(3000);
