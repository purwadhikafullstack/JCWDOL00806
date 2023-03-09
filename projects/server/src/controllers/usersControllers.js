const {sequelize} = require('../../models')
const {Op} = require('sequelize')
const {hashPassword,hashMatch} = require('../lib/hash')
const session = require('express-session')
const db = require('../../models/index')
const users = db.users

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
    }
    
}