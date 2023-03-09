//Import dependencies
const { sequelize } = require("./../../models");
const { Op } = require("sequelize");
const { QueryTypes } = require("sequelize");
const fs = require("fs").promises;

//Import models
const db = require("../../models/index");
const tenant = db.tenant;
const propertyCategory = db.property_category;

//Import hash & jwt
const { hashPassword, hashMatch } = require("../lib/hash");
const { createToken } = require("../lib/jwt");
const { get } = require("http");

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

  getCategory: async (req, res) => {
    try {
      let { username } = req.query;
      let getTenantId = await tenant.findOne({
        attributes: ["id"],
        where: { username: username },
      });
      let getData = await propertyCategory.findAll({
        where: {
          tenant_id: getTenantId.dataValues.id,
        },
      });
      let data = [];
      getData.forEach((value) => {
        data.push(value.dataValues);
      });
      res.status(201).send({
        isError: false,
        message: "Data Acquired",
        data,
      });
    } catch (error) {}
  },

  createCategory: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      let { type, city } = req.body;
      let { username } = req.query;
      let getTenantId = await tenant.findOne({
        attributes: ["id"],
        where: { username: username },
      });
      let findExisting = await propertyCategory.findOne({
        where: {
          [Op.and]: {
            type,
            city,
            tenant_id: getTenantId.dataValues.id,
          },
        },
      });
      if (findExisting !== null) {
        res.status(500).send({
          isError: false,
          message: "Type and City combination already exists",
          data: null,
        });
      } else {
        await propertyCategory.create({
          type,
          city,
          tenant_id: getTenantId.dataValues.id,
        });
        res.status(200).send({
          isError: false,
          message: "Created Successfully",
          data: null,
        });
        t.commit();
      }
    } catch (error) {
      t.rollback();
      console.log(error);
    }
  },
  updateCategory: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      let { newType, newCity } = req.body;
      let { type, city, username } = req.query;
      let getTenantId = await tenant.findOne({
        attributes: ["id"],
        where: { username: username },
      });
      let findExisting = await propertyCategory.update(
        {
          type: newType,
          city: newCity,
        },
        {
          where: {
            [Op.and]: {
              type,
              city,
              tenant_id: getTenantId.dataValues.id,
            },
          },
        }
      );
      res.status(200).send({
        isError: false,
        message: "Updated Successfully",
        data: null,
      });
      t.commit();
    } catch (error) {
      t.rollback();
      console.log(error);
    }
  },

  deleteCategory: async (req, res) => {
    try {
      let { id } = req.query;
      await propertyCategory.destroy({
        where: {
          id,
        },
      });
      res.status(201).send({
        isError: false,
        message: "Deleted Successfully",
        data: null,
      });
    } catch (error) {}
  },
};
