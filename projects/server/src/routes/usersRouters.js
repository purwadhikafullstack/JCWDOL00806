const express = require('express')
const Router = express.Router()

const { usersControllers } = require('../controllers')

const decodeToken = require('../middleware/decodeToken')

Router.post('/register', usersControllers.register)
Router.get('/checkusername', usersControllers.checkUsername)
Router.get('/checkemail', usersControllers.checkEmail)
Router.get('/login', usersControllers.login)
Router.get('/userdetail', usersControllers.userDetail)
Router.get('/reset-confirm', usersControllers.resetConfirm)
Router.patch('/change-password/:id', usersControllers.newPassword)
Router.post('/verify-otp', decodeToken, usersControllers.onVerifyAccount)
Router.get('/send-otp', decodeToken, usersControllers.onSendOTP)
Router.get('/verify-data', decodeToken, usersControllers.onGetUserData)

module.exports = Router