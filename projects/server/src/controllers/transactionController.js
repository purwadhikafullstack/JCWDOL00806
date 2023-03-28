//Import dependencies
const { sequelize } = require("../../models");
const { Op, where } = require("sequelize");
const { QueryTypes } = require("sequelize");
const fs = require("fs").promises;

//Import models
const db = require("../../models/index");

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
        `SELECT p.name AS name, pc.type, pc.city, p.picture, r.name AS room_name, r.price AS price
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
        `SELECT p.name AS name, pc.type, pc.city, p.picture, r.name AS room_name, r.price AS price
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
};
