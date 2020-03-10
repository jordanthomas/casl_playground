const passport = require("passport");
const { AbilityBuilder, Ability } = require("@casl/ability");
const connect = require("connect");

const passportMiddleware = passport.authenticate("jwt", { session: false });

const abilityMiddleware = (req, res, next) => {
  console.log(req.user);
  const { rules, can } = AbilityBuilder.extract();

  can("create", "Job");

  req.ability = new Ability(rules);
  next();
};

const combinedMiddleware = (function() {
  const chain = connect();

  [passportMiddleware, abilityMiddleware].forEach(function(middleware) {
    chain.use(middleware);
  });

  return chain;
})();

// The authentication middleware is actually a combination of Passport,
// who first identifies the user (adds req.user) and CASL who decorates
// the request w/ the identified user's abilities.
module.exports = combinedMiddleware;
