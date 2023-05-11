const express = require('express')
const Router = express.Router()
const passport = require("passport")
const { createToken } = require('../lib/jwt')

Router.get('/', passport.authenticate("google", { scope: ["profile", "email"] }))
Router.get('/callback', passport.authenticate("google", {
    // failureMessage: 'Cannot login to Google, please try again later!',
    failureRedirect: `${process.env.WEBSITE_URL}/users/register?error=true`,
    // failureFlash: true
}),
    function (req, res) {
        const token = createToken({id: req.user.id})
        res.cookie('jwt', token)
        res.redirect(`${process.env.WEBSITE_URL}/passport-login`)
    }
)

module.exports = Router
