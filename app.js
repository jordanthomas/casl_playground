const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const jwt = require("jsonwebtoken");
const { AbilityBuilder, Ability } = require("@casl/ability");

const indexRouter = require("./routes/index");
const apiRouter = require("./routes/api");
const userModel = require("./models/user");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const secret = "casl.homee.playground";

app.set("jwt.secret", secret);
app.set("jwt.issuer", "api.homee.com");
app.set("jwt.audience", "homee.com");

// return fake user
function findUser(payload, done) {
  const { id } = payload;
  const user = userModel.find(id);

  if (user) {
    done(null, user);
  } else {
    done(null, false);
  }
}

const passportOptions = {
  issuer: app.get("jwt.issuer"),
  audience: app.get("jwt.audience")
};

passport.use(
  new JwtStrategy(
    {
      ...passportOptions,
      secretOrKey: app.get("jwt.secret"),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    },
    findUser
  )
);

app.use(passport.initialize());

app.use("/", indexRouter);
app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
