//Import dependencies
const { sequelize } = require("../../models");
const { Op, where } = require("sequelize");
const { QueryTypes } = require("sequelize");
const fs = require("fs").promises;

//Import models
const db = require("../../models/index");
const order = db.order;
const users = db.users;
const room = db.room;
const order_details = db.order_details;

module.exports = {
  list: async (req, res) => {
    try {
      let { city, start, end } = req.query;

      let data = await sequelize.query(
        `
      SELECT p.name AS name, pc.type, pc.city, p.picture, r.name AS room_name, min(r.price) AS price, p.id
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
      ) GROUP BY p.name;`,
        {
          replacements: [city, start, end, start, end, start, end, start, end],
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
    }
  },
  roomListFromHomepage: async (req, res) => {
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
    }
  },
  getRoomList: async (req, res) => {
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
    }
  },
  getOrderList: async (req, res) => {
    try {
      let {id} = req.dataToken
      let { status, page } = req.query

      let limit = 5
      let offset = (page - 1) * limit

      let totalData = null

      if (status === 'in progress') {
        totalData = await sequelize.query(`
        SELECT COUNT(*) AS total
        FROM orders o
        INNER JOIN rooms r ON r.id = o.room_id
        JOIN properties p ON p.id = r.property_id
        JOIN property_categories c ON c.id = p.category_id and c.tenant_id = "${id}"
        WHERE status = "Waiting for Confirmation"
        `)
      } else if (status === 'all') {
        totalData = await sequelize.query(`
      SELECT COUNT(*) AS total
      FROM orders o
      INNER JOIN rooms r ON r.id = o.room_id
      JOIN properties p ON p.id = r.property_id
      JOIN property_categories c ON c.id = p.category_id and c.tenant_id = "${id}"
      WHERE status NOT IN ("Waiting for Payment")
      `)
      } else {
        totalData = await sequelize.query(`
      SELECT COUNT(*) AS total
      FROM orders o
      INNER JOIN rooms r ON r.id = o.room_id
      JOIN properties p ON p.id = r.property_id
      JOIN property_categories c ON c.id = p.category_id and c.tenant_id = "${id}"
      WHERE status = "${status}"
      `)}
      let total_pages = Math.ceil(totalData[0][0].total / limit)

      let getData = null

      if (status === "in progress") {
        getData = await sequelize.query(`
        SELECT o.id, o.invoice_id, r.name, o.payment_proof, status, start_date, end_date, room_id, notes
        FROM orders o
        INNER JOIN rooms r ON r.id = o.room_id
        JOIN properties p ON p.id = r.property_id
        JOIN property_categories c ON c.id = p.category_id and c.tenant_id = "${id}"
        WHERE status = "Waiting for Confirmation"
        ORDER BY o.start_date ASC
        LIMIT ${limit}
        OFFSET ${offset}
        `)
      } else if (status === "all") {
        getData = await sequelize.query(`
        SELECT o.id, o.invoice_id, r.name, o.payment_proof, status, start_date, end_date, room_id, notes
        FROM orders o
        INNER JOIN rooms r ON r.id = o.room_id
        JOIN properties p ON p.id = r.property_id
        JOIN property_categories c ON c.id = p.category_id and c.tenant_id = "${id}"
        WHERE status NOT IN ("Waiting for Payment")
        ORDER BY o.start_date ASC
        LIMIT ${limit}
        OFFSET ${offset}
        `)
      } else {
        getData = await sequelize.query(`
        SELECT o.id, o.invoice_id, r.name, o.payment_proof, status, start_date, end_date, room_id, notes
        FROM orders o
        INNER JOIN rooms r ON r.id = o.room_id
        JOIN properties p ON p.id = r.property_id
        JOIN property_categories c ON c.id = p.category_id and c.tenant_id = "${id}"
        WHERE status = "${status}"
        ORDER BY o.start_date ASC
        LIMIT ${limit}
        OFFSET ${offset}
        `)
      }

      return res.status(201).send({
        isError: false,
        message: "Data acquired",
        data: getData[0],
        total_pages
      })
      
    } catch (error) {
      console.log(error);
      return res.status(404).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
  getUserOrderList: async (req, res) => {
    try {
      let { id } = req.dataToken;
      let { status } = req.query;
      let getData = "";

      if (status === "in progress") {
        getData = await sequelize.query(`
        SELECT o.id, r.name, o.payment_proof, status, start_date, end_date, room_id
        FROM orders o
        INNER JOIN rooms r ON r.id = o.room_id
        WHERE status = "Waiting for Confirmation" AND o.users_id = "${id}"
        `);
      } else if (status === "all") {
        getData = await sequelize.query(`
        SELECT o.id, r.name, o.payment_proof, status, start_date, end_date, room_id
        FROM orders o
        INNER JOIN rooms r ON r.id = o.room_id
        WHERE status NOT IN ("Waiting for Payment") AND o.users_id = "${id}"
        `);
      } else {
        getData = await sequelize.query(`
        SELECT o.id, r.name, o.payment_proof, status, start_date, end_date, room_id
        FROM orders o
        INNER JOIN rooms r ON r.id = o.room_id
        WHERE status = "${status}" AND o.users_id = "${id}"
        `);
      }

      return res.status(201).send({
        isError: false,
        message: "Data acquired",
        data: getData[0],
      });
    } catch (error) {
      console.log(error);
      return res.status(404).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
  checkout: async (req, res) => {
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
      return res.status(400).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
  onBookRoom: async (req, res) => {
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

      // get room price
      let getRoom = await room.findOne({ where: { id: room_id } });
      let price = getRoom.dataValues.price;

      // calculate total price
      let checkInDate = new Date(start_date);
      let checkOutDate = new Date(end_date);

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
      invoice_id = invoice_id.toLocaleUpperCase()
      
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
          UPDATE orders SET status = 'Cancelled'
          WHERE id = ?
      `,
        {
          replacements: [insertId],
        }
      );

      t.commit();

      return res.status(200).send({
        isError: false,
        message: "Book Room Success",
        data: null,
      });
    } catch (error) {
      return res.status(400).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
  tenantUpdateOrderStatus: async (req, res) => {
    const t = await sequelize.transaction()
    try {
      let { notes } = req.body
      let { id } = req.params
      let { status } = req.query
      console.log(status)
      console.log(notes)
      if (status === 'cancel') {
        await order.update({
          status: 'Cancelled',
          notes
        }, {
          where: { id }
        }, {
          transaction: t
        })
      } else if (status === 'reject') {
        await order.update({
          status: 'Rejected',
          notes
        }, {
          where: { id }
        }, {
          transaction: t
        })
      } else {
        await order.update({
          status: 'Complete',
          notes : 'Order Accepted'
        }, {
          where: { id }
        }, {
          transaction: t
        })
      }
      
      t.commit()
      return res.status(201).send({
        isError: false,
        message: "Order Cancelled"
      })
    } catch (error) {
      t.rollback()
      console.log(error)
      return res.status(404).send({
        isError: true,
        message: error
      })
    }
  },
  getTenantOrderFilter: async (req, res) => {
    try {
      let {id} = req.dataToken
      let { status, page, search } = req.query

      let limit = 5
      let offset = (page - 1) * limit

      let totalData = null

      if (status === 'in progress') {
        totalData = await sequelize.query(`
        SELECT COUNT(*) AS total
        FROM orders o
        INNER JOIN rooms r ON r.id = o.room_id
        JOIN properties p ON p.id = r.property_id
        JOIN property_categories c ON c.id = p.category_id and c.tenant_id = "${id}"
        WHERE status = "Waiting for Confirmation" AND o.invoice_id LIKE "%${search}%"
        `)
      } else if (status === 'all') {
        totalData = await sequelize.query(`
      SELECT COUNT(*) AS total
      FROM orders o
      INNER JOIN rooms r ON r.id = o.room_id
      JOIN properties p ON p.id = r.property_id
      JOIN property_categories c ON c.id = p.category_id and c.tenant_id = "${id}"
      WHERE status NOT IN ("Waiting for Payment") AND o.invoice_id LIKE "%${search}%"
      `)
      } else {
        totalData = await sequelize.query(`
      SELECT COUNT(*) AS total
      FROM orders o
      INNER JOIN rooms r ON r.id = o.room_id
      JOIN properties p ON p.id = r.property_id
      JOIN property_categories c ON c.id = p.category_id and c.tenant_id = "${id}"
      WHERE status = "${status}" AND o.invoice_id LIKE "%${search}%"
      `)}
      let total_pages = Math.ceil(totalData[0][0].total / limit)

      let getData = null

      if (status === "in progress") {
        getData = await sequelize.query(`
        SELECT o.id, o.invoice_id, r.name, o.payment_proof, status, start_date, end_date, room_id, notes
        FROM orders o
        INNER JOIN rooms r ON r.id = o.room_id
        JOIN properties p ON p.id = r.property_id
        JOIN property_categories c ON c.id = p.category_id and c.tenant_id = "${id}"
        WHERE status = "Waiting for Confirmation" AND o.invoice_id LIKE "%${search}%"
        ORDER BY o.start_date ASC
        LIMIT ${limit}
        OFFSET ${offset}
        `)
      } else if (status === "all") {
        getData = await sequelize.query(`
        SELECT o.id, o.invoice_id, r.name, o.payment_proof, status, start_date, end_date, room_id, notes
        FROM orders o
        INNER JOIN rooms r ON r.id = o.room_id
        JOIN properties p ON p.id = r.property_id
        JOIN property_categories c ON c.id = p.category_id and c.tenant_id = "${id}"
        WHERE status NOT IN ("Waiting for Payment") AND o.invoice_id LIKE "%${search}%"
        ORDER BY o.start_date ASC
        LIMIT ${limit}
        OFFSET ${offset}
        `)
      } else {
        getData = await sequelize.query(`
        SELECT o.id, o.invoice_id, r.name, o.payment_proof, status, start_date, end_date, room_id, notes
        FROM orders o
        INNER JOIN rooms r ON r.id = o.room_id
        JOIN properties p ON p.id = r.property_id
        JOIN property_categories c ON c.id = p.category_id and c.tenant_id = "${id}"
        WHERE status = "${status}" AND o.invoice_id LIKE "%${search}%"
        ORDER BY o.start_date ASC
        LIMIT ${limit}
        OFFSET ${offset}
        `)
      }

      return res.status(201).send({
        isError: false,
        message: "Data acquired",
        data: getData[0],
        total_pages
      })
      
    } catch (error) {
      console.log(error);
      return res.status(404).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  }
};
