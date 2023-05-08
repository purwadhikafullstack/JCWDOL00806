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
      let { start_date, end_date, sort_by, order_by } = req.query;

      start_date = start_date === "null" ? null : start_date;
      end_date = end_date === "null" ? null : end_date;

      // check sort by value
      switch (sort_by) {
        case "total_user":
          // sort by total profit
          sort_by = "order_count";
          break;
        case "date":
          // sort by date
          sort_by = "dr.date";
          break;
        default:
          // sort by default
          sort_by = "dr.date";
      }

      // check order by value
      if (order_by === "desc") order_by = "DESC";
      else order_by = "ASC";
      let getData = await sequelize.query(
        `
        WITH RECURSIVE date_range AS (
        SELECT '${start_date}' AS date
        UNION ALL
        SELECT DATE_ADD(date, INTERVAL 1 DAY) AS date
        FROM date_range
        WHERE date < '${end_date}'
      )
      SELECT dr.date, COUNT(o.id) AS order_count from date_range dr
      LEFT JOIN orders o ON dr.date BETWEEN o.start_date AND o.end_date 
      INNER JOIN rooms r ON r.id = o.room_id
      JOIN properties p ON p.id = r.property_id
      JOIN property_categories c ON c.id = p.category_id AND c.tenant_id = "${id}"
      WHERE status = "Completed"
      group by dr.date
      ORDER BY ${sort_by} ${order_by}
      `,
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );

      let dateRange = [];
      let start = new Date(start_date);
      let end = new Date(end_date);

      for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
        const dateString = date.toISOString().slice(0, 10);
        const total =
          getData.find((d) => d.date === dateString)?.order_count ?? 0;
        dateRange.push({ date: dateString, total: total });
      }
      if (sort_by == "dr.date" && order_by == "ASC") {
        dateRange.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      } else if (sort_by == "dr.date" && order_by == "DESC") {
        dateRange.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      } else if (sort_by == "order_count" && order_by == "ASC") {
        dateRange.sort((a, b) => a.total - b.total);
      } else if (sort_by == "order_count" && order_by == "DESC") {
        dateRange.sort((a, b) => b.total - a.total);
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
      let { start_date, end_date, property_id, sort_by, order_by } = req.query;

      switch (sort_by) {
        case "total_profit":
          // sort by total profit
          sort_by = "total";
          break;
        case "date":
          // sort by date
          sort_by = "dr.date";
          break;
        default:
          // sort by default
          sort_by = "dr.date";
      }

      if (order_by === "desc") order_by = "DESC";
      else order_by = "ASC";

      let getData = await sequelize.query(`WITH RECURSIVE date_range AS (
          SELECT '${start_date}' AS date
          UNION ALL
          SELECT DATE_ADD(date, INTERVAL 1 DAY) AS date
          FROM date_range
          WHERE date < '${end_date}'
        )
        SELECT dr.date, SUM(r.price) AS total from date_range dr
        LEFT JOIN orders o ON dr.date BETWEEN o.start_date AND o.end_date 
        INNER JOIN rooms r ON r.id = o.room_id
        JOIN properties p ON p.id = r.property_id AND p.id = ${property_id}
        JOIN property_categories c ON c.id = p.category_id AND c.tenant_id = "${id}"
        WHERE status = "Completed"
        group by dr.date
        ORDER BY ${sort_by} ${order_by}`);

      const dateRange = [];
      const start = new Date(start_date);
      const end = new Date(end_date);

      for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
        const dateString = date.toISOString().slice(0, 10);
        const total = getData[0].find((d) => d.date === dateString)?.total ?? 0;
        dateRange.push({ date: dateString, total: total });
      }

      if (sort_by == "dr.date" && order_by == "ASC") {
        dateRange.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      } else if (sort_by == "dr.date" && order_by == "DESC") {
        dateRange.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      } else if (sort_by == "total" && order_by == "ASC") {
        dateRange.sort((a, b) => a.total - b.total);
      } else if (sort_by == "total" && order_by == "DESC") {
        dateRange.sort((a, b) => b.total - a.total);
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
      let { sort_by, order_by, start_date, end_date } = req.query;

      // check start and end date value
      start_date = start_date === "null" ? null : start_date;
      end_date = end_date === "null" ? null : end_date;

      // set reqursive query
      if (!start_date || !end_date)
        reqursiveQuery = `
          SELECT CURDATE() - INTERVAL 6 DAY AS date
          UNION ALL
          SELECT date + INTERVAL 1 DAY
          FROM dates
          WHERE date < CURDATE()
        `;
      else
        reqursiveQuery = `
          SELECT DATE("${start_date}") AS date
          UNION ALL
          SELECT date + INTERVAL 1 DAY
          FROM dates
          WHERE date < DATE("${end_date}")
        `;

      // check sort by value
      switch (sort_by) {
        case "total_profit":
          // sort by total profit
          sort_by = "total_profit";
          break;
        case "date":
          // sort by date
          sort_by = "d.date";
          break;
        default:
          // sort by default
          sort_by = "d.date";
      }

      // check order by value
      if (order_by === "desc") order_by = "DESC";
      else order_by = "ASC";

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
        WITH RECURSIVE dates AS (${reqursiveQuery})
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
        ORDER BY ${sort_by} ${order_by};
      `,
        {
          replacements: [id],
          type: sequelize.QueryTypes.SELECT,
        }
      );

      return res.status(200).send({
        isError: false,
        message: "Get Total Profit Success",
        data: getData,
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
      let { sort_by, order_by, start_date, end_date } = req.query;

      // check start and end date value
      start_date = start_date === "null" ? null : start_date;
      end_date = end_date === "null" ? null : end_date;

      // set reqursive query
      if (!start_date || !end_date)
        reqursiveQuery = `
          SELECT CURDATE() - INTERVAL 6 DAY AS date
          UNION ALL
          SELECT date + INTERVAL 1 DAY
          FROM dates
          WHERE date < CURDATE()
        `;
      else
        reqursiveQuery = `
          SELECT DATE("${start_date}") AS date
          UNION ALL
          SELECT date + INTERVAL 1 DAY
          FROM dates
          WHERE date < DATE("${end_date}")
        `;

      // check sort by value
      switch (sort_by) {
        case "total_transaction":
          // sort by total transaction
          sort_by = "total_transaction";
          break;
        case "date":
          // sort by date
          sort_by = "d.date";
          break;
        default:
          // sort by default
          sort_by = "d.date";
      }

      // check order by value
      if (order_by === "desc") order_by = "DESC";
      else order_by = "ASC";

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
        WITH RECURSIVE dates AS (${reqursiveQuery})
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
        ORDER BY ${sort_by} ${order_by};
      `,
        {
          replacements: [id],
          type: sequelize.QueryTypes.SELECT,
        }
      );

      return res.status(200).send({
        isError: false,
        message: "Get Total Transaction Success",
        data: getData,
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
