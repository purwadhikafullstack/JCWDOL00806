const usersRouters = require("./usersRouters");
const authFacebookRouter = require("./authFacebookRouter");
const tenantRouter = require("./tenantRouter");
const authGoogleRouters = require("./authGoogleRouters");
const propertyRouter = require("./propertyRouter");
const roomRouter = require("./roomRouter");
const transactionRouter = require("./transactionRouter");

module.exports = {
  usersRouters,
  authFacebookRouter,
  tenantRouter,
  authGoogleRouters,
  propertyRouter,
  roomRouter,
  transactionRouter,
};
