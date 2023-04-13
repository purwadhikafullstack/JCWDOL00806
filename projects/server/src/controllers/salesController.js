// import sequelize
const { sequelize } = require("../../models");
const { Op } = require("sequelize");

// import modals
const db = require("../../models/index");
const tenant = db.tenant;

module.exports = {
  reportByUser: async (req, res, next) => {
    try {
      let { id } = req.dataToken;
      let { startDate, endDate } = req.query;
      let getData = await sequelize.query(`
      WITH RECURSIVE date_range AS (
        SELECT '${startDate}' AS date
        UNION ALL
        SELECT DATE_ADD(date, INTERVAL 1 DAY) AS date
        FROM date_range
        WHERE date < '${endDate}'
      )
      SELECT dr.date, COUNT(o.id) AS order_count from date_range dr
      LEFT JOIN orders o ON dr.date BETWEEN o.start_date AND o.end_date 
      INNER JOIN rooms r ON r.id = o.room_id
      JOIN properties p ON p.id = r.property_id
      JOIN property_categories c ON c.id = p.category_id AND c.tenant_id = "${id}"
      WHERE status = "Completed"
      group by dr.date
        `);

      const dateRange = [];
      const start = new Date(startDate);
      const end = new Date(endDate);

      for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
        const dateString = date.toISOString().slice(0, 10);
        const orderCount =
          getData[0].find((d) => d.date === dateString)?.order_count ?? 0;
        dateRange.push({ date: dateString, order_count: orderCount });
      }
      return res.status(201).send({
        isError: false,
        message: "Data Acquired",
        data: dateRange,
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

  reportByProperty: async (req, res, next) => {
    try {
      let { id } = req.dataToken;
      let { startDate, endDate, property_id } = req.query;
      let getData = await sequelize.query(`WITH RECURSIVE date_range AS (
          SELECT '${startDate}' AS date
          UNION ALL
          SELECT DATE_ADD(date, INTERVAL 1 DAY) AS date
          FROM date_range
          WHERE date < '${endDate}'
        )
        SELECT dr.date, SUM(r.price) AS total from date_range dr
        LEFT JOIN orders o ON dr.date BETWEEN o.start_date AND o.end_date 
        INNER JOIN rooms r ON r.id = o.room_id
        JOIN properties p ON p.id = r.property_id AND p.id = ${property_id}
        JOIN property_categories c ON c.id = p.category_id AND c.tenant_id = "${id}"
        WHERE status = "Completed"
        group by dr.date`);

      const dateRange = [];
      const start = new Date(startDate);
      const end = new Date(endDate);

      for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
        const dateString = date.toISOString().slice(0, 10);
        const total = getData[0].find((d) => d.date === dateString)?.total ?? 0;
        dateRange.push({ date: dateString, total: total });
      }
      return res.status(201).send({
        isError: false,
        message: "Data Acquired",
        data: dateRange,
      });
    } catch (error) {
      next({
        isError: true,
        message: error.message,
        data: null,
        status: 400,
      });
    }
  },

  getPropertyList: async (req, res, next) => {
    try {
      let { id } = req.dataToken;
      let getData = await sequelize.query(`
      SELECT p.name, p.id FROM properties p
      INNER JOIN property_categories pc ON pc.id = p.category_id
      WHERE pc.tenant_id = "${id}"
      `);
      return res.status(201).send({
        isError: false,
        message: "Data Acquired",
        data: getData[0],
      });
    } catch (error) {
      next({
        isError: true,
        message: error.message,
        data: null,
        status: 400,
      });
    }
  },
  getTotalProfit: async (req, res, next) => {
    try {
      // get data from client
      let { id } = req.dataToken;

      // get tenant data
      let checkTenants = await tenant.findOne({ where: { id } });

      // check if tenant exist or not
      if (checkTenants === null)
        return next({
          isError: true,
          message: "Tenants Not Found",
          data: null,
          status: 400,
        });

      // get total profit data
      let getData = await sequelize.query(
        `
        WITH RECURSIVE dates AS (
          SELECT CURDATE() - INTERVAL 6 DAY AS date
          UNION ALL
          SELECT date + INTERVAL 1 DAY
          FROM dates
          WHERE date < CURDATE()
        )
        SELECT d.date, COALESCE(SUM(od.total_price), 0) AS total_profit
        FROM dates d
        LEFT JOIN (
            SELECT o.id, o.createdAt, o.status, od.total_price
            FROM orders o
            JOIN order_details od ON o.id = od.order_id
            JOIN rooms r ON o.room_id = r.id
            JOIN properties p ON r.property_id = p.id
            JOIN property_categories pc ON p.category_id = pc.id
            WHERE pc.tenant_id = ?
            AND o.status = "Completed"
        ) od ON DATE(od.createdAt) = d.date
        GROUP BY d.date
        ORDER BY d.date ASC;
      `,
        {
          replacements: [id],
        }
      );

      return res.status(200).send({
        isError: false,
        message: "Get Total Profit Success",
        data: getData[0],
      });
    } catch (error) {
      next({
        isError: true,
        message: error.message,
        data: null,
        status: 400,
      });
    }
  },
  getTotalTransaction: async (req, res, next) => {
    try {
      // get data from client
      let { id } = req.dataToken;

      // get tenant data
      let checkTenants = await tenant.findOne({ where: { id } });

      // check if tenant exist or not
      if (checkTenants === null)
        return next({
          isError: true,
          message: "Tenants Not Found",
          data: null,
          status: 400,
        });

      // get total transaction data
      let getData = await sequelize.query(
        `
        WITH RECURSIVE dates AS (
          SELECT CURDATE() - INTERVAL 6 DAY AS date
          UNION ALL
          SELECT date + INTERVAL 1 DAY
          FROM dates
          WHERE date < CURDATE()
        )
        SELECT d.date, COALESCE(COUNT(o.id), 0) AS total_transaction
        FROM dates d
        LEFT JOIN (
            SELECT o.id, o.createdAt, o.status
            FROM orders o
            JOIN order_details od ON o.id = od.order_id
            JOIN rooms r ON o.room_id = r.id
            JOIN properties p ON r.property_id = p.id
            JOIN property_categories pc ON p.category_id = pc.id
            WHERE pc.tenant_id = ?
            AND o.status = "Completed"
        ) o ON DATE(o.createdAt) = d.date
        GROUP BY d.date
        ORDER BY d.date ASC;
      `,
        {
          replacements: [id],
        }
      );

      return res.status(200).send({
        isError: false,
        message: "Get Total Transaction Success",
        data: getData[0],
      });
    } catch (error) {
      next({
        isError: true,
        message: error.message,
        data: null,
        status: 400,
      });
    }
  },
};
