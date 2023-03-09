const express = require('express')
const Router = express.Router()
const passport = require('passport')
const FacebookStrategy = require('passport-facebook')

const {usersControllers } = require('../controllers')

Router.post('/register', usersControllers.register)
Router.get('/checkusername', usersControllers.checkUsername)
Router.get('/checkemail', usersControllers.checkEmail)

module.exports = Router
