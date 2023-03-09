// import sequelize
const { sequelize } = require('../../models')
const { Op } = require('sequelize')

// import modals
const db = require('../../models/index')
const users = db.users

// import hashing
const { hashMatch } = require('../lib/hash')

// import jwt
const { createToken } = require('../lib/jwt')

module.exports = {
    login: async (req, res) => {
        try {
            // get data from client
            let { email, password } = req.query
    
            // get users data
            let checkUsers = await users.findOne({ where: { 
                email: email,
                provider: "website"
            } })
    
            // check if users exist or not
            if (checkUsers === null)
                return res.status(400).send({
                    isError: true,
                    message: "Email Not Found",
                    data: null
                })
    
            // validate hash password
            let checkPassword = await hashMatch(password, checkUsers.dataValues.password)
            if (!checkPassword)
                return res.status(400).send({
                    isError: true,
                    message: "Password Incorrect",
                    data: null
                })
    
            // create token
            let token = createToken({ id: checkUsers.dataValues.id })
    
            // send response
            res.status(200).send({
                isError: false,
                message: "Login Success",
                data: {
                    token: token
                }
            })
        } catch (error) {
            res.status(400).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    }
}