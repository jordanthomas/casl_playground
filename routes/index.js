const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "lol fart" });
});

module.exports = router;
