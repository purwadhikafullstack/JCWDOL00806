const express = require('express')
const Router = express.Router()
const passport = require("passport")

Router.get('/google', passport.authenticate("google", { scope: ["profile", "email"] }))
Router.get('/google/callback', passport.authenticate("google", {
    failureMessage: 'Cannot login to Google, please try again later!',
    failureRedirect: 'http://localhost:3000/users/login',
    successRedirect: 'http://localhost:3000/',
    failureFlash: true
}))

module.exports = Router