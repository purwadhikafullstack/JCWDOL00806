const usersRouters = require('./usersRouters')
const authFacebookRouter = require('./authFacebookRouter')
const tenantRouter = require("./tenantRouter");
const authGoogleRouters = require('./authGoogleRouters')

module.exports = {
    usersRouters,
    authFacebookRouter,
    tenantRouter,
    authGoogleRouters
};