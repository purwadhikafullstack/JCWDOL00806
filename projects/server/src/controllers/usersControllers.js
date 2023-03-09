// import sequelize
const { sequelize } = require('../../models')
const { Op } = require('sequelize')

// import modals
const db = require('../../models/index')
const users = db.users

// import hashing
const { hashPassword, hashMatch } = require('../lib/hash')

// import jwt
const { createToken } = require('../lib/jwt')

module.exports = {
    register: async (req, res) => {
        try {
            let {username, email, phone_number, password,provider} = req.body
            await users.create({
                username,
                email,
                phone_number,
                password: await hashPassword(password),
                provider
            })
            res.status(201).send({
                isError: false,
                message: "Register Success",
                data: null
            })

        } catch (error) {
            res.status(404).send({
                isError: true,
                message: error,
                data: null
            })
            console.log(error)
        }
    },
    checkUsername: async (req, res) => {
        console.log(req, "req")
        let username = req.query.username
        let getData = await users.findAll({
            where: {username}
        })
        res.status(201).send(Boolean(getData.length))
    },
    checkEmail: async (req, res) => {
        let email = req.query.email
        let getData = await users.findAll({
            where: {email}
        })
        res.status(201).send(Boolean(getData.length))
    },
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