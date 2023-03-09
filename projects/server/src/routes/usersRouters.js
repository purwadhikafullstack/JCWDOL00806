const express = require('express')
const Router = express.Router()

const { usersControllers } = require('../controllers')

Router.get('/login', usersControllers.login)

module.exports = Router