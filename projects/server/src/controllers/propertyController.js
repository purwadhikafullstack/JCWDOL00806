//Import dependencies
const { sequelize } = require("./../../models");
const { Op } = require("sequelize");
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
        await propertyCategory.create({
          name,
          address,
          description,
          category_id: id,
        });
      }
    } catch (error) {
      console.log(error);
    }
  },

  createPropertyImage: async (req, res) => {
    try {
      let { id, name, address } = req.query;
      await property.update(
        {
          picture: req.files.images[0].path,
        },
        { where: { [Op.and]: [{ category_id: id, name, address }] } }
      );
      res.status(201).send({
        isError: false,
        message: "Upload Success",
        data: null,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
