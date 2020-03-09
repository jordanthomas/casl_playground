const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const userModel = require("../models/user");

router.post("/jobs", function(req, res, next) {
  req.ability.throwUnlessCan("create", "Job");

  res.send({ message: "Job created!" });
});

router.post("/login", function(req, res, next) {
  const { email, password } = req.body;

  const user = userModel.findByLogin(email, password);

  const accessToken = jwt.sign({ id: user.id }, req.app.get("jwt.secret"), {
    issuer: req.app.get("jwt.issuer"),
    audience: req.app.get("jwt.audience")
  });

  res.send({ accessToken });
});

module.exports = router;
