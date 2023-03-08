//Import dependencies
const { sequelize } = require("./../../models");
const { Op } = require("sequelize");
const { QueryTypes } = require("sequelize");
const fs = require("fs").promises;

//Import models
const db = require("../../models/index");
const tenant = db.tenant;

//Import hash & jwt
const { hashPassword, hashMatch } = require("../lib/hash");
const { createToken } = require("../lib/jwt");

module.exports = {
  register: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      let { username, email, phone_number, password } = req.body;
      await tenant.create({
        username,
        email,
        phone_number,
        password: await hashPassword(password),
        is_verified: false,
      });
      res.status(201).send({
        isError: false,
        message: "Register Success",
        data: null,
      });
      t.commit();
    } catch (error) {
      t.rollback();
      res.status(500).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },

  verifyTenant: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      let { username } = req.query;
      await tenant.update(
        {
          ktp: req.files.images[0].path,
          is_verified: true,
        },
        {
          where: {
            username,
          },
        },
        { transaction: t }
      );
      res.status(201).send({
        isError: false,
        message: "Validation Success",
        data: null,
      });
      t.commit();
    } catch (error) {
      t.rollback();
      console.log(error);
    }
  },

  login: async (req, res) => {
    try {
      let { usernameOrEmail, password } = req.query;
      let findUsernameOrEmail = await tenant.findOne({
        where: {
          [Op.or]: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
        },
      });

      if (!findUsernameOrEmail) {
        res.status(404).send({
          isError: true,
          message: "Username or Email not found",
          data: null,
        });
      }

      let hashMatchResult = await hashMatch(
        password,
        findUsernameOrEmail.dataValues.password
      );

      if (hashMatchResult === false) {
        res.status(404).send({
          isError: true,
          message: "Password not valid",
          data: null,
        });
      }

      res.status(200).send({
        isError: false,
        message: "Login Success",
        data: {
          token: createToken({ id: findUsernameOrEmail.dataValues.id }),
        },
      });
    } catch (error) {}
  },
};
