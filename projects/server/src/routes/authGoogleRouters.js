const express = require('express')
const Router = express.Router()
const passport = require("passport")
const { createToken } = require('../lib/jwt')

Router.get('/', passport.authenticate("google", { scope: ["profile", "email"] }))
Router.get('/callback', passport.authenticate("google", {
    failureMessage: 'Cannot login to Google, please try again later!',
    failureRedirect: 'http://localhost:3000/users/login',
    failureFlash: true
}),
    function (req, res) {
        const token = createToken({id: req.user.id})
        res.cookie('jwt', token)
        res.redirect('http://localhost:3000/passport-login')
    }
)

module.exports = Router