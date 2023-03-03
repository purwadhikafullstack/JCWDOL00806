'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.property, {
        foreignKey: 'property_id',
        as: 'property'
      })
      this.hasMany(models.order, {
        foreignKey: "room_id",
        as: 'order'
      })
      this.hasMany(models.room_status, {
        foreignKey: 'room_id',
        as: 'room_status'
      })
      this.hasMany(models.room_special_price, {
        foreignKey: "room_id",
        as: 'room_special_price'
      })
      this.hasMany(models.review, {
        foreignKey: 'room_id',
        as: 'review'
      })
    }
  }
  room.init({
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    rules: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'room',
  });
  return room;
};