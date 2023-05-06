//Import dependencies
const { sequelize } = require("../../models");
const { Op, where } = require("sequelize");
const { QueryTypes } = require("sequelize");
const fs = require("fs").promises;
const handlebars = require("handlebars");
const transporter = require("../helpers/transporter");

//Import models
const db = require("../../models/index");
const order = db.order;
const users = db.users;
const room = db.room;
const order_details = db.order_details;
const room_status = db.room_status;
const reviews = db.review;

// import deleteFiles
const deleteFiles = require("./../helpers/deleteFiles");

module.exports = {
  list: async (req, res, next) => {
    try {
      let { city, start, end, page } = req.query;

      let limit = 10;
      let offset = (page - 1) * limit;
      console.log(page);

      let totalData = null;

      totalData = await sequelize.query(
        `
      SELECT COUNT(DISTINCT p.name) AS total
      FROM property_categories pc
      INNER JOIN properties p ON p.category_id = pc.id
      INNER JOIN rooms r ON r.property_id = p.id
      WHERE pc.city = ?
      AND r.id NOT IN (
        SELECT room_id FROM room_statuses
        WHERE (? BETWEEN start_date AND end_date
          OR ? BETWEEN start_date AND end_date
          OR start_date BETWEEN ? AND ?
          )
      )
      AND r.id NOT IN (
        SELECT room_id FROM orders
        WHERE status = 'complete'
          AND (? BETWEEN start_date AND end_date
          OR ? BETWEEN start_date AND end_date
          OR start_date BETWEEN ? AND ?
          )
      );`,
        {
          replacements: [city, start, end, start, end, start, end, start, end],
          type: sequelize.QueryTypes.SELECT,
        }
      );
      console.log(totalData);
      let total_pages = Math.ceil(totalData[0].total / limit);
      console.log(total_pages);
      let getData = "";

      getData = await sequelize.query(
        `
      SELECT p.name AS name, pc.type, pc.city, p.picture, r.name AS room_name, min(r.price) AS price, p.id, SUM(rv.rating) as total_rating, COUNT(rv.rating) as total_users
      FROM property_categories pc
      INNER JOIN properties p ON p.category_id = pc.id
      INNER JOIN rooms r ON r.property_id = p.id
      LEFT JOIN reviews rv ON rv.room_id = r.id
      WHERE pc.city = ?
      AND r.id NOT IN (
        SELECT room_id FROM room_statuses
        WHERE (? BETWEEN start_date AND end_date
          OR ? BETWEEN start_date AND end_date
          OR start_date BETWEEN ? AND ?
          )
      )
      AND r.id NOT IN (
        SELECT room_id FROM orders
        WHERE status = 'complete'
          AND (? BETWEEN start_date AND end_date
          OR ? BETWEEN start_date AND end_date
          OR start_date BETWEEN ? AND ?
          )
      ) GROUP BY p.name
      LIMIT ${limit}
      OFFSET ${offset}
      ;`,
        {
          replacements: [city, start, end, start, end, start, end, start, end],
          type: sequelize.QueryTypes.SELECT,
        }
      );

      res.status(200).send({
        isError: false,
        message: "List acquired",
        data: getData,
        total_pages,
      });
    } catch (error) {
      console.log(error);
      next({
        isError: true,
        message: error.message,
        data: null,
        status: 400,
      });
    }
  },
  roomListFromHomepage: async (req, res, next) => {
    try {
      let { property_id } = req.query;
      let data = await sequelize.query(
        `SELECT p.name AS name, pc.type, pc.city, p.picture, r.name AS room_name, r.price AS price, r.id
      FROM property_categories pc
      INNER JOIN properties p ON p.category_id = pc.id AND p.id = ?
      INNER JOIN rooms r ON r.property_id = p.id
      `,
        { replacements: [property_id], type: sequelize.QueryTypes.SELECT }
      );
      res.status(200).send({
        isError: false,
        message: "List acquired",
        data: data,
      });
    } catch (error) {
      console.log(error);
      next({
        isError: true,
        message: error.message,
        data: null,
        status: 400,
      });
    }
  },
  getRoomList: async (req, res, next) => {
    try {
      let { city, start, end, property_id } = req.query;

      let data = await sequelize.query(
        `SELECT p.name AS name, pc.type, pc.city, p.picture, r.name AS room_name, r.price AS price, r.id
      FROM property_categories pc
      INNER JOIN properties p ON p.category_id = pc.id AND p.id = ?
      INNER JOIN rooms r ON r.property_id = p.id
      WHERE pc.city = ?
      AND r.id NOT IN (
        SELECT room_id FROM room_statuses
        WHERE (? BETWEEN start_date AND end_date
          OR ? BETWEEN start_date AND end_date
          OR start_date BETWEEN ? AND ?
          )
      )
      AND r.id NOT IN (
        SELECT room_id FROM orders
        WHERE status = 'complete'
          AND (? BETWEEN start_date AND end_date
          OR ? BETWEEN start_date AND end_date
          OR start_date BETWEEN ? AND ?
          )
      )`,
        {
          replacements: [
            property_id,
            city,
            start,
            end,
            start,
            end,
            start,
            end,
            start,
            end,
          ],
          type: sequelize.QueryTypes.SELECT,
        }
      );
      res.status(200).send({
        isError: false,
        message: "List acquired",
        data: data,
      });
    } catch (error) {
      console.log(error);
      next({
        isError: true,
        message: error.message,
        data: null,
        status: 400,
      });
    }
  },
  getOrderList: async (req, res, next) => {
    try {
      let { id } = req.dataToken;
      let { status, page } = req.query;

      let limit = 5;
      let offset = (page - 1) * limit;

      let totalData = null;

      if (status === "in progress") {
        totalData = await sequelize.query(`
        SELECT COUNT(*) AS total
        FROM orders o
        INNER JOIN rooms r ON r.id = o.room_id
        JOIN properties p ON p.id = r.property_id
        JOIN property_categories c ON c.id = p.category_id and c.tenant_id = "${id}"
        WHERE status = "Waiting for Confirmation" or status = "Accepted"
        `);
      } else if (status === "all") {
        totalData = await sequelize.query(`
      SELECT COUNT(*) AS total
      FROM orders o
      INNER JOIN rooms r ON r.id = o.room_id
      JOIN properties p ON p.id = r.property_id
      JOIN property_categories c ON c.id = p.category_id and c.tenant_id = "${id}"
      `);
      } else {
        totalData = await sequelize.query(`
      SELECT COUNT(*) AS total
      FROM orders o
      INNER JOIN rooms r ON r.id = o.room_id
      JOIN properties p ON p.id = r.property_id
      JOIN property_categories c ON c.id = p.category_id and c.tenant_id = "${id}"
      WHERE status = "${status}"
      `);
      }
      let total_pages = Math.ceil(totalData[0][0].total / limit);

      let getData = null;

      if (status === "in progress") {
        getData = await sequelize.query(`
        SELECT o.id, o.invoice_id, p.name as property_name, r.name, o.payment_proof, status, od.total_price, start_date, end_date, room_id, notes, o.users_id, r.rules, DATE_ADD(o.updatedAt, INTERVAL 2 HOUR) as payment_deadline
        FROM orders o
        INNER JOIN rooms r ON r.id = o.room_id
        JOIN properties p ON p.id = r.property_id
        JOIN property_categories c ON c.id = p.category_id and c.tenant_id = "${id}"
        JOIN order_details od ON od.order_id = o.id
        WHERE status = "Waiting for Confirmation" or status = "Accepted"
        ORDER BY o.start_date ASC
        LIMIT ${limit}
        OFFSET ${offset}
        `);
      }else if(status === "cancelled") {
        getData = await sequelize.query(`
        SELECT o.id, o.invoice_id, p.name as property_name, r.name, o.payment_proof, status, od.total_price, start_date, end_date, room_id, notes, o.users_id, r.rules, DATE_ADD(o.updatedAt, INTERVAL 2 HOUR) as payment_deadline
        FROM orders o
        INNER JOIN rooms r ON r.id = o.room_id
        JOIN properties p ON p.id = r.property_id
        JOIN property_categories c ON c.id = p.category_id and c.tenant_id = "${id}"
        JOIN order_details od ON od.order_id = o.id
        WHERE status = "Cancelled" or status = "Expired"
        ORDER BY o.start_date ASC
        LIMIT ${limit}
        OFFSET ${offset}
        `);
      } else if (status === "all") {
        getData = await sequelize.query(`
        SELECT o.id, o.invoice_id, p.name as property_name, r.name, o.payment_proof, status, od.total_price, start_date, end_date, room_id, notes, o.users_id, r.rules, DATE_ADD(o.updatedAt, INTERVAL 2 HOUR) as payment_deadline
        FROM orders o
        INNER JOIN rooms r ON r.id = o.room_id
        JOIN properties p ON p.id = r.property_id
        JOIN property_categories c ON c.id = p.category_id and c.tenant_id = "${id}"
        JOIN order_details od ON od.order_id = o.id
        ORDER BY o.start_date ASC
        LIMIT ${limit}
        OFFSET ${offset}
        `);
      } else {
        getData = await sequelize.query(`
        SELECT o.id, o.invoice_id, p.name as property_name, r.name, o.payment_proof, status, od.total_price, start_date, end_date, room_id, notes, o.users_id, r.rules, DATE_ADD(o.updatedAt, INTERVAL 2 HOUR) as payment_deadline
        FROM orders o
        INNER JOIN rooms r ON r.id = o.room_id
        JOIN properties p ON p.id = r.property_id
        JOIN property_categories c ON c.id = p.category_id and c.tenant_id = "${id}"
        JOIN order_details od ON od.order_id = o.id
        WHERE status = "${status}"
        ORDER BY o.start_date ASC
        LIMIT ${limit}
        OFFSET ${offset}
        `);
      }

      return res.status(201).send({
        isError: false,
        message: "Data acquired",
        data: getData[0],
        total_pages,
      });
    } catch (error) {
      console.log(error);
      next({
        isError: true,
        message: error.message,
        data: null,
        status: 400,
      });
    }
  },
  getUserOrderList: async (req, res, next) => {
    try {
      let { id } = req.dataToken;
      let { status, page } = req.query;

      let limit = 5;
      let offset = (page - 1) * limit;

      let totalData = null;

      if (status === "in progress") {
        totalData = await sequelize.query(`
        SELECT COUNT(*) AS total
        FROM orders o
        JOIN order_details od ON o.id = od.order_id
        INNER JOIN rooms r ON r.id = o.room_id
        JOIN properties p ON p.id = r.property_id
        WHERE (status = "Waiting for Confirmation" OR status = "Waiting For Payment" or status = "Accepted") AND o.users_id = "${id}"
        `);
      } else if (status === "all") {
        totalData = await sequelize.query(`
      SELECT COUNT(*) AS total
      FROM orders o
        JOIN order_details od ON o.id = od.order_id
        INNER JOIN rooms r ON r.id = o.room_id
        JOIN properties p ON p.id = r.property_id
        WHERE o.users_id = "${id}"
      `);
      } else {
        totalData = await sequelize.query(`
      SELECT COUNT(*) AS total
      FROM orders o
        JOIN order_details od ON o.id = od.order_id
        INNER JOIN rooms r ON r.id = o.room_id
        JOIN properties p ON p.id = r.property_id
        WHERE status = "${status}" AND o.users_id = "${id}"
      `);
      }

      let total_pages = Math.ceil(totalData[0][0].total / limit);
      let getData = "";

      if (status === "in progress") {
        getData = await sequelize.query(`
        SELECT o.id, r.name, o.payment_proof, status, start_date, end_date, o.room_id, o.invoice_id, od.total_price, p.name AS property_name , o.notes, rv.rating, rv.review
        FROM orders o
        JOIN order_details od ON o.id = od.order_id
        INNER JOIN rooms r ON r.id = o.room_id
        JOIN properties p ON p.id = r.property_id
        LEFT JOIN reviews rv ON rv.order_id = o.id
        WHERE (status = "Waiting for Confirmation" OR status = "Waiting For Payment" or status = "Accepted") AND o.users_id = "${id}"
        ORDER BY o.start_date ASC
        LIMIT ${limit}
        OFFSET ${offset}
        `);
      } else if (status === "all") {
        getData = await sequelize.query(`
        SELECT o.id, r.name, o.payment_proof, status, start_date, end_date, o.room_id, o.invoice_id, od.total_price, p.name AS property_name , o.notes, rv.rating, rv.review
        FROM orders o
        JOIN order_details od ON o.id = od.order_id
        INNER JOIN rooms r ON r.id = o.room_id
        JOIN properties p ON p.id = r.property_id
        LEFT JOIN reviews rv ON rv.order_id = o.id
        WHERE o.users_id = "${id}"
        ORDER BY o.start_date ASC
        LIMIT ${limit}
        OFFSET ${offset}
        `);
      } else {
        getData = await sequelize.query(`
        SELECT o.id, r.name, o.payment_proof, status, start_date, end_date, o.room_id, o.invoice_id, od.total_price, p.name AS property_name , o.notes, rv.rating, rv.review
        FROM orders o
        JOIN order_details od ON o.id = od.order_id
        INNER JOIN rooms r ON r.id = o.room_id
        JOIN properties p ON p.id = r.property_id
        LEFT JOIN reviews rv ON rv.order_id = o.id
        WHERE status = "${status}" AND o.users_id = "${id}"
        ORDER BY o.start_date ASC
        LIMIT ${limit}
        OFFSET ${offset}
        `);
      }

      return res.status(201).send({
        isError: false,
        message: "Data acquired",
        data: getData[0],
        total_pages,
      });
    } catch (error) {
      console.log(error);
      next({
        isError: true,
        message: error.message,
        data: null,
        status: 400,
      });
    }
  },
  checkout: async (req, res, next) => {
    try {
      // get data from client
      let { id } = req.dataToken;
      let { room_id } = req.params;

      // get users data
      let checkUsers = await users.findOne({ where: { id } });

      // check if users exist or not
      if (checkUsers === null)
        return res.status(400).send({
          isError: true,
          message: "Users Not Found",
          data: null,
        });

      // check if users already verifed or not
      if (!checkUsers.dataValues.is_verified) {
        return res.status(400).send({
          isError: true,
          message: "Users Is Not Verified",
          data: null,
        });
      }

      // get room details
      let getRoom = await sequelize.query(
        `
        SELECT r.id, c.type, c.city, p.name AS property_name, r.name AS room_name, p.address, p.picture, r.price
        FROM property_categories c
        JOIN properties p ON p.category_id = c.id
        JOIN rooms r ON r.property_id = p.id
        WHERE r.id = ?;
      `,
        {
          replacements: [room_id],
          type: sequelize.QueryTypes.SELECT,
        }
      );

      return res.status(200).send({
        isError: false,
        message: "Get Room Detail Success",
        data: getRoom,
      });
    } catch (error) {
      console.log(error);
      next({
        isError: true,
        message: error.message,
        data: null,
        status: 400,
      });
    }
  },
  onBookRoom: async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
      // get data from client
      let { id } = req.dataToken;
      let { start_date, end_date, room_id } = req.body;

      // get users data
      let checkUsers = await users.findOne({ where: { id } });

      // check if users exist or not
      if (checkUsers === null)
        return res.status(400).send({
          isError: true,
          message: "Users Not Found",
          data: null,
        });

      // check if the room is already booked for the specified dates
      let existingBooking = await order.findAll({
        where: {
          room_id: room_id,
          status: {
            [Op.notIn]: ['Cancelled', 'Rejected']
          },
          [Op.or]: [
            {
              [Op.and]: [
                { start_date: { [Op.lte]: start_date } },
                { end_date: { [Op.gte]: start_date } },
              ],
            },
            {
              [Op.and]: [
                { start_date: { [Op.lte]: end_date } },
                { end_date: { [Op.gte]: end_date } },
              ],
            },
            {
              [Op.and]: [
                { start_date: { [Op.gte]: start_date } },
                { end_date: { [Op.lte]: end_date } },
              ],
            },
          ],
        },
        lock: true,
        transaction: t,
      });

      if (existingBooking.length > 0) {
        t.rollback();
        return res.status(400).send({
          isError: true,
          message: "Room Already Booked",
          data: null,
        });
      }

      // check if the room is unavailable for the specified dates
      let unavailableRoom = await room_status.findAll({
        where: {
          room_id: room_id,
          [Op.or]: [
            {
              [Op.and]: [
                { start_date: { [Op.lte]: start_date } },
                { end_date: { [Op.gte]: start_date } },
              ],
            },
            {
              [Op.and]: [
                { start_date: { [Op.lte]: end_date } },
                { end_date: { [Op.gte]: end_date } },
              ],
            },
            {
              [Op.and]: [
                { start_date: { [Op.gte]: start_date } },
                { end_date: { [Op.lte]: end_date } },
              ],
            },
          ],
        },
        lock: true,
        transaction: t,
      });

      if (unavailableRoom.length > 0) {
        t.rollback();
        return res.status(400).send({
          isError: true,
          message: "Room Unavailable",
          data: null,
        });
      }

      // get room data
      let getRoom = await room.findOne({
        where: { id: room_id },
        lock: true,
        transaction: t,
      });

      // get room special price
      let specialPrice = await sequelize.query(`
        SELECT *
        FROM room_special_prices
        WHERE room_id = ?
        AND ? BETWEEN start_date AND end_date;
      `, {
        replacements: [room_id, start_date],
        type: sequelize.QueryTypes.SELECT
      })

      // calculate total price
      let price
      let checkInDate = new Date(start_date);
      let checkOutDate = new Date(end_date);

      if (specialPrice.length === 0)
        price = getRoom.dataValues.price
      else
        price = specialPrice[0].price
      
      let timeDiff = checkOutDate.getTime() - checkInDate.getTime();
      let numDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

      let total_price = price * numDays;

      // create unique order id
      let uniqueString = Date.now().toString(16);
      let date = new Date().getDate().toString().padStart(2, "0");
      let month = new Date().getMonth().toString().padStart(2, "0");
      let year = new Date().getFullYear();
      let convertUserId = checkUsers.dataValues.id.substr(0, 8);

      let invoice_id = `INV/${year}${month}${date}/${convertUserId}/${uniqueString}`;
      invoice_id = invoice_id.toLocaleUpperCase();

      // create new order
      let insertOrder = await order.create(
        {
          status: "Waiting for Payment",
          start_date,
          end_date,
          users_id: checkUsers.dataValues.id,
          room_id,
          invoice_id,
        },
        { transaction: t }
      );

      let insertId = insertOrder.dataValues.id;

      await order_details.create(
        {
          total_price,
          order_id: insertId,
        },
        { transaction: t }
      );

      await sequelize.query(
        `
        CREATE EVENT change_status_order_${insertId}
        ON SCHEDULE AT DATE_ADD(NOW(), INTERVAL 2 HOUR)
        DO
          UPDATE orders SET 
            status = 'Expired',
            notes = "Order Expired"
          WHERE id = ?
      `,
        {
          replacements: [insertId],
          transaction: t,
        }
      );

      t.commit();

      return res.status(200).send({
        isError: false,
        message: "Book Room Success",
        data: null,
      });
    } catch (error) {
      t.rollback();
      console.log(error);
      next({
        isError: true,
        message: error.message,
        data: null,
        status: 400,
      });
    }
  },
  userUpdateOrderStatus: async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
      let { notes } = req.body;
      let { id } = req.params;

      await order.update(
        {
          status: "Cancelled",
          notes,
        },
        { where: { id } },
        { transaction: t }
      );
      t.commit();
      return res.status(201).send({
        isError: false,
        message: "Order Cancelled",
      });
    } catch (error) {
      t.rollback();
      console.log(error);
      next({
        isError: true,
        message: error.message,
        data: null,
        status: 400,
      });
    }
  },
  tenantUpdateOrderStatus: async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
      let { notes } = req.body;
      let { id } = req.params;
      let { status } = req.query;
      let d = new Date()
      let time = d.getTime()
      if (status === "cancel") {
        await order.update(
          {
            status: "Cancelled",
            notes,
          },
          {
            where: { id },
          },
          {
            transaction: t,
          }
        );
      } else if (status === "reject") {
        await order.update(
          {
            status: "Waiting for Payment",
            notes: "Payment proof incomplete",
            payment_proof: null,
          },
          {
            where: { id },
          },
          {
            transaction: t,
          }
        );
        await sequelize.query(
          `
          CREATE EVENT order_status_rejected_${time}
          ON SCHEDULE AT DATE_ADD(NOW(), INTERVAL 2 HOUR)
          DO
            UPDATE orders SET
             status = 'Expired',
             notes = "Order Expired"
            WHERE id = ${id}
        `,
          {
            transaction: t,
          }
        );
      }
      t.commit();
      return res.status(201).send({
        isError: false,
        message: "Order Cancelled",
      });
    } catch (error) {
      t.rollback();
      console.log(error);
      next({
        isError: true,
        message: error.message,
        data: null,
        status: 400,
      });
    }
  },
  tenantAcceptOrder: async (req, res, next) => {
    const t = await sequelize.transaction();
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });
    try {
      let { id } = req.params;
      let { users_id } = req.query;
      let { invoice, property, room, start, end, price, rules } = req.body;
      let getData = await users.findOne({ where: { id: users_id } });

      await order.update(
        {
          status: "Accepted",
          notes: "Order Accepted",
        },
        {
          where: { id },
        },
        {
          transaction: t,
        }
      );

      let template = await fs.readFile("./src/template/invoice.html", "utf-8");
      let compiledTemplate = await handlebars.compile(template);
      let newTemplate = compiledTemplate({
        invoice,
        property,
        room,
        start,
        end,
        price: formatter.format(price),
        rules,
      });
      await transporter.sendMail(
        {
          from: "Admin",
          to: `"${getData.dataValues.email}`,
          subject: "Your room order invoice",
          html: newTemplate,
        },
        function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent : " + info.response);
          }
        }
      );
      t.commit();
      return res.status(201).send({
        isError: false,
        message: "Order accepted",
      });
    } catch (error) {
      t.rollback();
      console.log(error);
      next({
        isError: true,
        message: error.message,
        data: null,
        status: 400,
      });
    }
  },
  getTenantOrderFilter: async (req, res, next) => {
    try {
      let { id } = req.dataToken;
      let { status, page, search } = req.query;

      let limit = 5;
      let offset = (page - 1) * limit;

      let totalData = null;

      if (status === "in progress") {
        totalData = await sequelize.query(`
        SELECT COUNT(*) AS total
        FROM orders o
        INNER JOIN rooms r ON r.id = o.room_id
        JOIN properties p ON p.id = r.property_id
        JOIN property_categories c ON c.id = p.category_id and c.tenant_id = "${id}"
        WHERE (status = "Waiting for Confirmation" or status = "Accepted") AND o.invoice_id LIKE "%${search}%"
        `);
      } else if (status === "all") {
        totalData = await sequelize.query(`
      SELECT COUNT(*) AS total
      FROM orders o
      INNER JOIN rooms r ON r.id = o.room_id
      JOIN properties p ON p.id = r.property_id
      JOIN property_categories c ON c.id = p.category_id and c.tenant_id = "${id}"
      WHERE o.invoice_id LIKE "%${search}%"
      `);
      } else {
        totalData = await sequelize.query(`
      SELECT COUNT(*) AS total
      FROM orders o
      INNER JOIN rooms r ON r.id = o.room_id
      JOIN properties p ON p.id = r.property_id
      JOIN property_categories c ON c.id = p.category_id and c.tenant_id = "${id}"
      WHERE status = "${status}" AND o.invoice_id LIKE "%${search}%"
      `);
      }
      let total_pages = Math.ceil(totalData[0][0].total / limit);

      let getData = null;

      if (status === "in progress") {
        getData = await sequelize.query(`
        SELECT o.id, o.invoice_id, p.name as property_name, r.name, o.payment_proof, status, od.total_price, start_date, end_date, room_id, notes, o.users_id, r.rules, DATE_ADD(o.updatedAt, INTERVAL 2 HOUR) as payment_deadline
        FROM orders o
        INNER JOIN rooms r ON r.id = o.room_id
        JOIN properties p ON p.id = r.property_id
        JOIN property_categories c ON c.id = p.category_id and c.tenant_id = "${id}"
        JOIN order_details od ON od.order_id = o.id
        WHERE (status = "Waiting for Confirmation" or status = "Accepted") AND o.invoice_id LIKE "%${search}%"
        ORDER BY o.start_date ASC
        LIMIT ${limit}
        OFFSET ${offset}
        `);
      } else if (status === "all") {
        getData = await sequelize.query(`
        SELECT o.id, o.invoice_id, p.name as property_name, r.name, o.payment_proof, status, od.total_price, start_date, end_date, room_id, notes, o.users_id, r.rules, DATE_ADD(o.updatedAt, INTERVAL 2 HOUR) as payment_deadline
        FROM orders o
        INNER JOIN rooms r ON r.id = o.room_id
        JOIN properties p ON p.id = r.property_id
        JOIN property_categories c ON c.id = p.category_id and c.tenant_id = "${id}"
        JOIN order_details od ON od.order_id = o.id
        WHERE o.invoice_id LIKE "%${search}%"
        ORDER BY o.start_date ASC
        LIMIT ${limit}
        OFFSET ${offset}
        `);
      } else {
        getData = await sequelize.query(`
        SELECT o.id, o.invoice_id, p.name as property_name, r.name, o.payment_proof, status, od.total_price, start_date, end_date, room_id, notes, o.users_id, r.rules, DATE_ADD(o.updatedAt, INTERVAL 2 HOUR) as payment_deadline
        FROM orders o
        INNER JOIN rooms r ON r.id = o.room_id
        JOIN properties p ON p.id = r.property_id
        JOIN property_categories c ON c.id = p.category_id and c.tenant_id = "${id}"
        JOIN order_details od ON od.order_id = o.id
        WHERE status = "${status}" AND o.invoice_id LIKE "%${search}%"
        ORDER BY o.start_date ASC
        LIMIT ${limit}
        OFFSET ${offset}
        `);
      }

      return res.status(201).send({
        isError: false,
        message: "Data acquired",
        data: getData[0],
        total_pages,
      });
    } catch (error) {
      console.log(error);
      next({
        isError: true,
        message: error.message,
        data: null,
        status: 400,
      });
    }
  },
  getUserOrderFilter: async (req, res, next) => {
    try {
      let { id } = req.dataToken;
      let { status, page, search } = req.query;

      let limit = 5;
      let offset = (page - 1) * limit;

      let totalData = null;

      if (status === "in progress") {
        totalData = await sequelize.query(`
        SELECT COUNT(*) AS total
        FROM orders o
        JOIN order_details od ON o.id = od.order_id
        INNER JOIN rooms r ON r.id = o.room_id
        JOIN properties p ON p.id = r.property_id
        WHERE (status = "Waiting for Confirmation" OR status = "Waiting For Payment") AND o.users_id = "${id}" AND o.invoice_id LIKE "%${search}%"
        `);
      } else if (status === "all") {
        totalData = await sequelize.query(`
      SELECT COUNT(*) AS total
      FROM orders o
        JOIN order_details od ON o.id = od.order_id
        INNER JOIN rooms r ON r.id = o.room_id
        JOIN properties p ON p.id = r.property_id
        WHERE o.users_id = "${id}" AND o.invoice_id LIKE "%${search}%"
      `);
      } else {
        totalData = await sequelize.query(`
      SELECT COUNT(*) AS total
      FROM orders o
      JOIN order_details od ON o.id = od.order_id
      INNER JOIN rooms r ON r.id = o.room_id
      JOIN properties p ON p.id = r.property_id
      WHERE status = "${status}" AND o.users_id = "${id}" AND o.invoice_id LIKE "%${search}%"
      `);
      }
      let total_pages = Math.ceil(totalData[0][0].total / limit);

      let getData = null;

      if (status === "in progress") {
        getData = await sequelize.query(`
        SELECT o.id, o.invoice_id, p.name as property_name, r.name, o.payment_proof, status, od.total_price, start_date, end_date, o.room_id, notes, rv.rating, rv.review
        FROM orders o
        JOIN order_details od ON o.id = od.order_id
        INNER JOIN rooms r ON r.id = o.room_id
        JOIN properties p ON p.id = r.property_id
        LEFT JOIN reviews rv ON rv.order_id = o.id
        WHERE (status = "Waiting for Confirmation" OR status = "Waiting For Payment") AND o.users_id = "${id}" AND o.invoice_id LIKE "%${search}%"
        ORDER BY o.start_date ASC
        LIMIT ${limit}
        OFFSET ${offset}
        `);
      } else if (status === "all") {
        getData = await sequelize.query(`
        SELECT o.id, o.invoice_id, p.name as property_name, r.name, o.payment_proof, status, od.total_price, start_date, end_date, o.room_id, notes, rv.rating, rv.review
        FROM orders o
        JOIN order_details od ON o.id = od.order_id
        INNER JOIN rooms r ON r.id = o.room_id
        JOIN properties p ON p.id = r.property_id
        LEFT JOIN reviews rv ON rv.order_id = o.id
        WHERE o.users_id = "${id}" AND o.invoice_id LIKE "%${search}%"
        ORDER BY o.start_date ASC
        LIMIT ${limit}
        OFFSET ${offset}
        `);
      } else {
        getData = await sequelize.query(`
        SELECT o.id, o.invoice_id, p.name as property_name, r.name, o.payment_proof, status, od.total_price, start_date, end_date, o.room_id, notes, rv.rating, rv.review
        FROM orders o
        JOIN order_details od ON o.id = od.order_id
        INNER JOIN rooms r ON r.id = o.room_id
        JOIN properties p ON p.id = r.property_id
        LEFT JOIN reviews rv ON rv.order_id = o.id
        WHERE status = "${status}" AND o.users_id = "${id}" AND o.invoice_id LIKE "%${search}%"
        ORDER BY o.start_date ASC
        LIMIT ${limit}
        OFFSET ${offset}
        `);
      }

      return res.status(201).send({
        isError: false,
        message: "Data acquired",
        data: getData[0],
        total_pages,
      });
    } catch (error) {
      console.log(error);
      next({
        isError: true,
        message: error.message,
        data: null,
        status: 400,
      });
    }
  },
  onUploadPaymentProof: async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
      // get data from client
      let { id } = req.dataToken;
      let { order_id } = req.params;

      // get users data
      let checkUsers = await users.findOne({ where: { id } });

      // check if users exist or not
      if (checkUsers === null) {
        // if user not found, delete image file
        deleteFiles(req.files.payment_proof);

        return res.status(400).send({
          isError: true,
          message: "Users Not Found",
          data: null,
        });
      }

      // get order data
      let checkOrder = await order.findOne({ where: { id: order_id } });

      // check if order id exist or not
      if (checkOrder === null) {
        // if order not found, delete image file
        deleteFiles(req.files.payment_proof);

        return res.status(400).send({
          isError: true,
          message: "Order Not Found",
          data: null,
        });
      }

      // save image path and update status order
      await order.update(
        {
          payment_proof: req.files.payment_proof[0].path,
          status: "Waiting for Confirmation",
        },
        {
          where: { id: order_id },
          transaction: t,
        }
      );

      // delete event scheduler
      await sequelize.query(
        `DROP EVENT IF EXISTS change_status_order_${order_id}`
      );

      await t.commit();

      return res.status(200).send({
        isError: false,
        message: "Upload Paymnet Proof Success",
        data: null,
      });
    } catch (error) {
      await t.rollback();

      // if something eror, delete image file
      deleteFiles(req.files.payment_proof);

      console.log(error);
      next({
        isError: true,
        message: error.message,
        data: null,
        status: 400,
      });
    }
  },
  onCreateReview: async (req, res, next) => {
    try {
      // get data from client
      let { id } = req.dataToken;
      let { rating, review, room_id, order_id } = req.body;

      // get users data
      let checkUsers = await users.findOne({ where: { id } });

      // check if users exist or not
      if (checkUsers === null) {
        // if user not found, delete image file
        deleteFiles(req.files.payment_proof);

        return res.status(400).send({
          isError: true,
          message: "Users Not Found",
          data: null,
        });
      }

      // create new review
      await reviews.create({
        review,
        rating,
        users_id: checkUsers.dataValues.id,
        room_id,
        order_id,
      });

      return res.status(200).send({
        isError: false,
        message: "Create Review Success",
        data: null,
      });
    } catch (error) {
      console.log(error);
      next({
        isError: true,
        message: error.message,
        data: null,
        status: 400,
      });
    }
  },
};
