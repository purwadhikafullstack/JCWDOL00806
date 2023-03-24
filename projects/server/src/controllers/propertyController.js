//Import dependencies
const { sequelize } = require("./../../models");
const { Op, where } = require("sequelize");
const { QueryTypes } = require("sequelize");
const fs = require("fs").promises;

//Import models
const db = require("../../models/index");
const propertyCategory = db.property_category;
const property = db.property;

//Import lib

module.exports = {
  createProperty: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      let { id } = req.query;
      let { name, address, description } = req.body;
      let findExisting = await property.findOne({
        where: {
          [Op.and]: {
            name,
            address,
            category_id: id,
          },
        },
      });
      if (findExisting !== null) {
        res.status(500).send({
          isError: false,
          message: "Property already registered",
          data: null,
        });
      } else {
        await property.create(
          {
            name,
            address,
            description,
            category_id: id,
          },
          { transaction: t }
        );
        res.status(201).send({
          isError: false,
          message: "New Property Created",
          data: null,
        });
        t.commit();
      }
    } catch (error) {
      t.rollback();
      console.log(error);
    }
  },

  createPropertyImage: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      let { id, name, address } = req.query;
      await property.update(
        {
          picture: req.files.property[0].path,
        },
        { where: { [Op.and]: [{ category_id: id, name, address }] } },
        { transaction: t }
      );
      res.status(201).send({
        isError: false,
        message: "Upload Success",
        data: null,
      });
      t.commit();
    } catch (error) {
      console.log(error);
      t.rollback();
    }
  },

  getType: async (req, res) => {
    try {
      let { id } = req.query;
      let getCategory = await propertyCategory.findOne({
        where: { id: id },
      });
      res.status(201).send({
        isError: false,
        message: "Type acquired",
        data: getCategory,
      });
    } catch (error) {}
  },
  getAllProperty: async (req, res) => {
    try {
      let { id } = req.query;
      let getData = await property.findAll({
        where: { category_id: id },
      });
      res.status(201).send({
        isError: false,
        message: "Data Acquired",
        data: getData,
      });
    } catch (error) {
      console.log(error);
    }
  },

  deleteProperty: async (req, res) => {
    try {
      let { id } = req.query;
      await property.destroy({
        where: { id },
      });
      res.status(201).send({
        isError: false,
        message: "Deleted Successfully",
        data: null,
      });
    } catch (error) {
      console.log(error);
    }
  },

  updateProperty: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      let { newName, newAddress, newDescription } = req.body;
      let { id, name, address, description } = req.query;

      if (newName == "") {
        newName = name;
      }
      if (newAddress == "") {
        newAddress = address;
      }
      if (newDescription == "") {
        newDescription = description;
      }

      await property.update(
        {
          name: newName,
          address: newAddress,
          description: newDescription,
        },
        { where: { category_id: id, name, address, description } },
        { transaction: t }
      );
      t.commit();
      res.status(201).send({
        isError: false,
        message: "Updated Successfully",
        data: null,
      });
    } catch (error) {
      t.rollback();
      console.log(error);
    }
  },
  updatePropertyImage: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      let { id, name, address } = req.query;
      await property.update(
        {
          picture: req.files.property[0].path,
        },
        { where: { [Op.and]: [{ category_id: id, name, address }] } },
        { transaction: t }
      );
      t.commit();
      res.status(201).send({
        isError: false,
        message: "Image Change Success",
        data: null,
      });
    } catch (error) {
      t.rollback();
      console.log(error);
    }
  },
  getPropertyContent: async (req, res) => {
    try {
      // get propert data for landing page
      let getProperty = await sequelize.query(`
        SELECT DISTINCT r.property_id, r.price, c.type, c.city, p.name, p.picture
        FROM property_categories c
        JOIN properties p ON p.category_id = c.id
        JOIN rooms r ON r.property_id = p.id
        GROUP BY r.property_id
        LIMIT 30;
      `);

      return res.status(200).send({
        isError: false,
        message: "Get property content success",
        data: getProperty[0],
      });
    } catch (error) {
      return res.status(400).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
};
