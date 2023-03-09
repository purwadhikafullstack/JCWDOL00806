const express = require('express')
const passport = require('passport')
const Router = express.Router()

Router.get('/', passport.authenticate('facebook', {scope: 'email'}))
Router.get('/callback',
    passport.authenticate('facebook',
    { failureRedirect: '/users/login' }),
    function (req, res) { res.redirect('http://localhost:3000/') })

module.exports = Router