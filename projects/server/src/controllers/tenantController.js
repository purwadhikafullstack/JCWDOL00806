//Import dependencies
const { sequelize } = require("../models");
const { Op } = require("sequelize");
const { QueryTypes } = require("sequelize");
const fs = require("fs").promises;

//Import models
const db = require("../models/index");
const tenant = db.tenant;
const propertyCategory = db.property_category;

//Import hash & jwt
const { hashPassword, hashMatch } = require("../lib/hash");
const { createToken } = require("../lib/jwt");

module.exports = {
  register: async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
      let { username, email, phone_number, password } = req.body;
      let checkUsername = await tenant.findAll({
        where: {
          username,
        },
      });
      let checkEmail = await tenant.findAll({
        where: {
          email,
        },
      });
      let checkPhone = await tenant.findAll({
        where: {
          phone_number,
        },
      });

      if (checkUsername.length != 0) {
        res.status(201).send({
          isError: false,
          message: "Username already exists",
          data: null,
        });
      }
      if (checkEmail.length != 0) {
        res.status(201).send({
          isError: false,
          message: "Email already used",
          data: null,
        });
      }
      if (checkPhone.length != 0) {
        res.status(201).send({
          isError: false,
          message: "Phone number already used",
          data: null,
        });
      }
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
      console.log(error)
      next({
        isError: true,
        message: error.message,
        data: null,
        status: 400
      })
    }
  },
  checkUsername: async (req, res, next) => {
    try {
      let { username } = req.query;
    let getData = await tenant.findAll({
      where: { username },
    });
    return res.status(201).send(Boolean(getData.length));
    } catch (error) {
      console.log(error)
      next({
        isError: true,
        message: error.message,
        data: null,
        status: 400
      })
    }
  },
  checkEmail: async (req, res, next) => {
    try {
      let { email } = req.query;
    let getData = await tenant.findAll({
      where: { email },
    });
    res.status(201).send(Boolean(getData.length));
    } catch (error) {
      console.log(error)
      next({
        isError: true,
        message: error.message,
        data: null,
        status: 400
      })
    }
  },
  checkPhone: async (req, res, next) => {
    try {
    let { phone_number } = req.query;
    let getData = await tenant.findAll({
      where: { phone_number },
    });
    return res.status(201).send(Boolean(getData.length));
    } catch (error) {
      console.log(error)
      next({
        isError: true,
        message: error.message,
        data: null,
        status: 400
      })
    }
  },
  verifyTenant: async (req, res, next) => {
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
      t.commit();
      res.status(201).send({
        isError: false,
        message: "Validation Success",
        data: null,
      });
    } catch (error) {
      t.rollback();
      console.log(error)
      next({
        isError: true,
        message: error.message,
        data: null,
        status: 400
      })
    }
  },
  login: async (req, res, next) => {
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
          id: findUsernameOrEmail.dataValues.id,
        },
      });
    } catch (error) {
      console.log(error)
      next({
        isError: true,
        message: error.message,
        data: null,
        status: 400
      })
    }
  },
  keepLogin: async (req, res, next) => {
    try {
      let { id } = req.dataToken

      let checkTenant = await tenant.findOne({ where: { id } })

      if (checkTenant === null) 
        return res.status(400).send({
          isError: true,
          message: "Tenant Not Found",
          data: null
        })

      return res.status(201).send({
        isError: false,
        message: "Tenant is logged in",
        data: checkTenant
      })
    } catch (error) {
      console.log(error)
      next({
        isError: true,
        message: error.message,
        data: null,
        status: 400
      })
    }
  },
  checkTenant: async (req, res, next) => {
    try {
      const userId = req.params.id;
      const authorizedUserId = req.dataToken.id;
      if (userId !== authorizedUserId) {
        return res.status(403).json({
          message:
            "Forbidden. You do not have permission to access this resource.",
        });
      }
      res.status(200).send({
        isError: false,
        message: "Verify success",
        data: null,
      });
    } catch (error) {
      console.log(error)
      next({
        isError: true,
        message: error.message,
        data: null,
        status: 400
      })
    }
  },
  getCategory: async (req, res, next) => {
    try {
      let { id } = req.query;
      let getData = await propertyCategory.findAll({
        where: {
          tenant_id: id,
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
    } catch (error) {
      console.log(error)
      next({
        isError: true,
        message: error.message,
        data: null,
        status: 400
      })
    }
  },
  createCategory: async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
      let { type, city } = req.body;
      let { id } = req.query;

      let findExisting = await propertyCategory.findOne({
        where: {
          [Op.and]: {
            type,
            city,
            tenant_id: id,
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
          tenant_id: id,
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
      console.log(error)
      next({
        isError: true,
        message: error.message,
        data: null,
        status: 400
      })
    }
  },
  updateCategory: async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
      let { newType, newCity } = req.body;
      let { type, city, id } = req.query;

      if (newType == "") {
        newType = type;
      }
      if (newCity == "") {
        newCity = city;
      }
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
              tenant_id: id,
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
      console.log(error)
      next({
        isError: true,
        message: error.message,
        data: null,
        status: 400
      })
    }
  },
  deleteCategory: async (req, res, next) => {
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
    } catch (error) {
      console.log(error)
      next({
        isError: true,
        message: error.message,
        data: null,
        status: 400
      })
    }
  },
  getRoomStatus: async (req, res, next) => {
    try {
      let { id } = req.params;
      let getData = await sequelize.query(`
      SELECT r.name AS room_name, 'booked' AS status, o.start_date, DATE_ADD(o.end_date, INTERVAL 1 DAY) as end_date
      FROM properties p
      INNER JOIN rooms r ON p.id = r.property_id
      INNER JOIN orders o ON r.id = o.room_id AND (o.status = 'Completed' or o.status = "Accepted")
      WHERE p.id = ${id}
      UNION
      SELECT r.name AS room_name, 'unavailable' AS status, rs.start_date, DATE_ADD(rs.end_date, INTERVAL 1 DAY) as end_date
      FROM properties p
      INNER JOIN rooms r ON p.id = r.property_id
      INNER JOIN room_statuses rs ON r.id = rs.room_id
      WHERE p.id = ${id};
      `);

      res.status(201).send({
        isError: false,
        message: "Data Acquired",
        data: getData[0],
      });
    } catch (error) {
      console.log(error)
      next({
        isError: true,
        message: error.message,
        data: null,
        status: 400
      })
    }
  },
  getTenantData: async (req, res, next) => {
    try {
      let { id } = req.dataToken;

      let getData = await tenant.findOne({ where: { id } });

      if (getData === null)
        return res.status(400).send({
          isError: true,
          message: "Users Not Exist",
          data: null,
        });

      return res.status(200).send({
        isError: false,
        message: "Get Users Data Successful",
        data: getData,
      });
    } catch (error) {
      console.log(error)
      next({
        isError: true,
        message: error.message,
        data: null,
        status: 400
      })
    }
  },
};
