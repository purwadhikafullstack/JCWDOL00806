const express = require('express')
const passport = require('passport')
const { createToken } = require('../lib/jwt')
const Router = express.Router()

Router.get('/', passport.authenticate('facebook', {scope: 'email'}))
Router.get('/callback',
    passport.authenticate('facebook',
        {
            failureRedirect: '/users/login',
        }),
    function (req, res) {
        const token = createToken({ id: req.user.id })
        res.cookie('jwt', token)
        res.redirect('http://localhost:3000/passport-login')
    });

module.exports = Router