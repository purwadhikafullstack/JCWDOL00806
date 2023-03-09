const express = require('express')
const Router = express.Router()

const { usersControllers } = require('../controllers')

Router.post('/register', usersControllers.register)
Router.get('/checkusername', usersControllers.checkUsername)
Router.get('/checkemail', usersControllers.checkEmail)
Router.get('/login', usersControllers.login)
Router.get('/userdetail', usersControllers.userDetail)
Router.get('/reset-confirm', usersControllers.resetConfirm)
Router.patch('/change-password/:id', usersControllers.newPassword)

module.exports = Router