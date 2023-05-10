const { sequelize } = require("../models");
const { Op } = require("sequelize");
const { hashPassword, hashMatch } = require("../lib/hash");
const { createToken } = require("../lib/jwt");
const db = require("../models/index");
const users = db.users;
const user_details = db.user_details;
const fs = require("fs").promises;
const handlebars = require("handlebars");
const transporter = require("../helpers/transporter");
const { genereateOTP, checkOtpExpired } = require("../helpers/otp");

module.exports = {
  register: async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
      let { username, email, phone_number, password, provider } = req.body;
      await users.create(
        {
          username,
          email,
          phone_number,
          password: await hashPassword(password),
          provider,
          is_verified: false,
          otp_count: 0,
        },
        { transaction: t }
      );

      t.commit();

      // get users data
      let checkUsers = await users.findOne({
        where: {
          email: email,
          provider: "website",
        },
      });

      // create token
      let token = createToken({ id: checkUsers.dataValues.id });

      return res.status(201).send({
        isError: false,
        message: "Register Success",
        data: {
          token: token,
        },
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
  checkUsername: async (req, res, next) => {
    try {
    let username = req.query.username;
    let getData = await users.findAll({
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
    let email = req.query.email;
    let getData = await users.findAll({
      where: { email },
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
  login: async (req, res, next) => {
    try {
      // get data from client
      let { emailOrPhoneNumber, password } = req.query;

      // get users data
      let checkUsers = await users.findOne({
        where: {
          [Op.or]: [{ email: emailOrPhoneNumber }, { phone_number: emailOrPhoneNumber }],
          provider: "website",
        },
      });

      // check if users exist or not
      if (checkUsers === null)
        return res.status(400).send({
          isError: true,
          message: "Email or Phone Number Not Found",
          data: null,
        });

      // validate hash password
      let checkPassword = await hashMatch(
        password,
        checkUsers.dataValues.password
      );
      if (!checkPassword)
        return res.status(400).send({
          isError: true,
          message: "Password Incorrect",
          data: null,
        });

      // create token
      let token = createToken({ id: checkUsers.dataValues.id });

      // send response
      res.status(200).send({
        isError: false,
        message: "Login Success",
        data: {
          token: token,
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

      let checkUsers = await users.findOne({ where: { id } })

      if (checkUsers === null) 
        return res.status(400).send({
          isError: true,
          message: "Users Not Found",
          data: null
        })
      
      return res.status(201).send({
        isError: false,
        message: "User is logged in",
        data: checkUsers
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
  userDetail: async (req, res, next) => {
    try {
      let email = req.query.email;
      let getData = await users.findAll({
        where: { email },
      });
      res.status(201).send({
        isError: false,
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
  checkToken: async (req, res, next) => {
    try {
      const { token } = req.params
      console.log(token)
      let getData = await users.findOne({
        where: {
          reset_pass : token
        },
      })
      return res.status(200).send({
        isError: false,
        message: "token checked",
        data: getData
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
  resetConfirm: async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
      let { email, id } = req.query;
      let token = createToken({ id })
      let unique = token.slice(0, 10)
      let template = await fs.readFile(
        "./src/template/resetPassword.html",
        "utf-8"
      );
      let compiledTemplate = await handlebars.compile(template);
      let newTemplate = compiledTemplate({
        resetURL: `${process.env.WEBSITE_URL}/new-password/${token}`,
      });
      
      await users.update(
        {
        reset_pass : token
      },
        {
          where: { email }
        },
        {
          transaction: t
        }
      )
      await sequelize.query(`
      CREATE EVENT reset_pass_token_${unique}
      ON SCHEDULE AT DATE_ADD(NOW(), INTERVAL 1 HOUR)
      DO
      UPDATE users SET reset_pass = NULL
      WHERE id = "${id}"
      `)

      await transporter.sendMail(
        {
          from: "Admin",
          to: `"${email}"`,
          subject: "Reset Password",
          html: newTemplate,
        },
        function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("email sent: " + info.response);
          }
        }, {transaction : t}
      );
      t.commit();
      return res.status(201).send({
        isError: false,
        message: "Reset Password Confirmed",
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
  newPassword: async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
      let userId = req.params.id;
      let newPassword = req.body.password;

      await users.update(
        {
          password: await hashPassword(newPassword),
        },
        {
          where: { id: userId },
        },
        { transaction: t }
      );
      await users.update({
        reset_pass : null
      }, { where: { id: userId } },
        {transaction : t}
      )
      t.commit();
      return res.status(201).send({
        isError: false,
        message: "Password reset success",
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
  onSendOTP: async (req, res, next) => {
    try {
      // get data from client
      let { id } = req.dataToken;

      // get users data
      let checkUsers = await users.findOne({ where: { id } });

      // check if users exist
      if (checkUsers === null)
        return res.status(400).send({
          isError: true,
          message: "Users Not Exist",
          data: null,
        });

      let otpCount = checkUsers.dataValues.otp_count + 1;
      let lastGenerateOtp = checkUsers.dataValues.otp_generate;

      // check last generate otp is expired or not
      let otpExpired = checkOtpExpired(lastGenerateOtp);
      if (otpExpired) otpCount = 1;

      // check otp count has reached maximum limit or not
      if (otpCount > 5)
        return res.status(400).send({
          isError: true,
          message: "Resend OTP has reached the maximum limit",
          data: null,
        });

      // generate OTP number
      otp_number = genereateOTP();

      // update users otp and otp_count
      await users.update(
        {
          otp: otp_number,
          otp_count: otpCount,
          otp_generate: sequelize.literal("CURRENT_TIMESTAMP"),
        },
        {
          where: { id },
        }
      );

      // send new otp to users email
      let template = await fs.readFile("./src/template/otp.html", "utf-8");
      let compiledTemplate = await handlebars.compile(template);

      let newTemplate = compiledTemplate({
        otp_number: otp_number,
      });

      await transporter.sendMail({
        from: "Admin",
        to: checkUsers.dataValues.email,
        subject: "Verify Account",
        html: newTemplate,
      });

      return res.status(201).send({
        isError: false,
        message: "Send OTP Success",
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
  onVerifyAccount: async (req, res, next) => {
    try {
      // get data from client
      let { id } = req.dataToken;
      let { otp_number } = req.body;

      // get users data
      let checkUsers = await users.findOne({ where: { id } });

      // check if users exist
      if (checkUsers === null)
        return res.status(400).send({
          isError: true,
          message: "Users Not Exist",
          data: null,
        });

      // check last generate otp is expired or not
      let lastGenerateOtp = checkUsers.dataValues.otp_generate;
      let otpExpired = checkOtpExpired(lastGenerateOtp);

      // validate otp number
      if (otp_number !== checkUsers.dataValues.otp || otpExpired)
        return res.status(400).send({
          isError: true,
          message: "Incorrect OTP or Expired",
          data: null,
        });

      // update users is_verified
      await users.update(
        {
          is_verified: true,
        },
        {
          where: { id },
        }
      );

      return res.status(200).send({
        isError: false,
        message: "Account Verified",
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
  onGetUserData: async (req, res, next) => {
    try {
      // get data from client
      let { id } = req.dataToken;

      // get users data
      let checkUsers = await sequelize.query(`
        SELECT u.id, u.username, u.is_verified, ud.profile_pic
        FROM users u
        LEFT JOIN user_details ud ON ud.users_id = u.id
        WHERE u.id = ?
      `, {
        replacements: [id],
        type: sequelize.QueryTypes.SELECT,
      })

      // check if users exist
      if (checkUsers === null)
        return res.status(400).send({
          isError: true,
          message: "Users Not Exist",
          data: null,
        });

      return res.status(200).send({
        isError: false,
        message: "Get Users Data Successful",
        data: checkUsers[0],
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
  userProfile: async (req, res, next) => {
    try {
      const users_id = req.dataToken.id;
      let getData = await user_details.findAll({
        where: { users_id: users_id },
      });
      return res.status(201).send({
        isError: false,
        message: "Data Acquired",
        data: getData,
        users_id,
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
  changeNewPassword: async (req, res, next) => {
    try {
      // get data from client
      let { id } = req.dataToken;
      let { old_password, new_password, confirm_password } = req.body;

      // check new password and confirm password is same or not
      if (new_password !== confirm_password)
        return res.status(400).send({
          isError: true,
          message: "New Password Not Match",
          data: null,
        });

      // get users data
      let checkUsers = await users.findOne({ where: { id } });

      // check if users exist or not
      if (checkUsers === null)
        return res.status(400).send({
          isError: true,
          message: "Users Not Exist",
          data: null,
        });

      // validate hash password
      let checkPassword = await hashMatch(
        old_password,
        checkUsers.dataValues.password
      );
      if (!checkPassword)
        return res.status(400).send({
          isError: true,
          message: "Old Password Not Match",
          data: null,
        });

      // change new password
      await users.update(
        {
          password: await hashPassword(new_password),
        },
        {
          where: { id },
        }
      );

      return res.status(200).send({
        isError: false,
        message: "Change New Password Successful",
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
  newProfile: async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
      let id = req.params.id;

      await user_details.create(
        {
          users_id: id,
        },
        { transaction: t }
      );
      t.commit();
      return res.status(201).send({
        isError: false,
        message: "Profile created successfully",
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
  editProfile: async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
      let {data} = req.body;
      let users_id = req.params.id;
      let { title } = req.query

      console.log(data)
      console.log(users_id)
      console.log(title)

      if (title === "Full Name") {
        await user_details.update(
          {
            full_name : data
          },
          {where : {users_id}}
        ), {transaction : t}
      } else if (title === "Gender") {
        await user_details.update(
          {
            gender : data
          },
          {where : {users_id}}
        ), {transaction : t}
      } else {
        await user_details.update(
          {
            birthdate : data
          },
          {where : {users_id}}
        ), {transaction : t}
      }
      t.commit();
      return res.status(201).send({
        isError: false,
        message: "Profile created successfully",
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
  updateProfilePicture: async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
      let { id } = req.params;

      await user_details.update(
        {
          profile_pic: req.files.profile[0].path,
        },
        { where: { users_id: id } },
        { transaction: t }
      );
      t.commit();
      return res.status(201).send({
        isError: false,
        message: "Profile picture updated successfully",
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
  changeEmail: async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
      let { email } = req.body;
      let { id } = req.params;
      console.log(email);
      await users.update(
        {
          email,
          is_verified: false,
          otp_count: 0,
        },
        { where: { id } },
        { transaction: t }
      );

      t.commit();
      return res.status(201).send({
        isError: false,
        message: "Change Email Success",
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
  getUser: async (req, res, next) => {
    try {
      const id = req.dataToken.id;
      console.log(id);
      let getData = await users.findAll({
        where: { id },
      });
      return res.status(201).send({
        isError: false,
        message: "Data Acquired",
        data: getData,
        id,
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
