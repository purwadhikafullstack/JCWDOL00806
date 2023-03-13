const express = require('express')
const Router = express.Router()

const { usersControllers } = require('../controllers')

const { verifyToken } = require("../middleware/decodeToken");

Router.post('/register', usersControllers.register)
Router.get('/checkusername', usersControllers.checkUsername)
Router.get('/checkemail', usersControllers.checkEmail)
Router.get('/login', usersControllers.login)
Router.get('/userdetail', usersControllers.userDetail)
Router.get('/reset-confirm', usersControllers.resetConfirm)
Router.patch('/change-password/:id', usersControllers.newPassword)
Router.post('/verify-otp', verifyToken, usersControllers.onVerifyAccount)
Router.get('/send-otp', verifyToken, usersControllers.onSendOTP)
Router.get('/verify-data', verifyToken, usersControllers.onGetUserData)

module.exports = Router