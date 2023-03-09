const {sequelize} = require('../../models')
const {Op} = require('sequelize')
const {hashPassword,hashMatch} = require('../lib/hash')
const db = require('../../models/index')
const users = db.users
const fs = require('fs').promises
const handlebars = require('handlebars')
const transporter = require('../helpers/transporter')

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
    userDetail: async (req, res) => {
        try {
        let email = req.query.email
        let getData = await users.findAll({
            where: {email}
        })
        res.status(201).send({
            isError: false,
            data: getData
        })
        } catch (error) {
            res.status(404).send({
                isError: true,
                message: error,
                data:null
            })
        }
        
    },
    resetConfirm: async (req, res) => {
      const t = await sequelize.transaction()
      try {
        let {email, id} = req.query
        let template = await fs.readFile('./src/template/resetPassword.html', 'utf-8')
        let compiledTemplate = await handlebars.compile(template)
        let newTemplate = compiledTemplate({
            resetURL: `${process.env.WEBSITE_URL}/new-password/${id}`
        })
          
          await transporter.sendMail({
              from: 'Admin',
              to: `"${email}"`,
              subject: 'Reset Password',
              html: newTemplate
        }, function(error, info) {
              if (error) {
                console.log(error)
              } else {
                  console.log('email sent: ' + info.response)
            }
        })
        t.commit() 
          return res.status(201).send({
              isError: false,
              message: "Reset Password Confirmed"
        })
      } catch (error) {
        t.rollback()
        console.log(error.message)
          return res.status(404).send({
              isError: true,
              message: error.message
        })
      }  
    },
    newPassword: async (req, res) => {
        const t = await sequelize.transaction()
        try {
            let userId = req.params.id
            let newPassword = req.body.password

            await users.update({
                password: await hashPassword(newPassword)
            }, {
                where: {id: userId}
            }, { transaction: t })
            t.commit()
            return res.status(201).send({
                isError: false,
                message: "Password reset success"
            })

        } catch (error) {
            t.rollback()
            console.log(error,message)
            return res.status(404), send({
                isError: true,
                message: error.message
            })
        }
    }
    
}