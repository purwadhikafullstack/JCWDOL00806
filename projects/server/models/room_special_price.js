'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class room_special_price extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.room, {
        foreignKey: 'room_id',
        as: 'room'
      })
    }
  }
  room_special_price.init({
    start_date: DataTypes.DATEONLY,
    end_date: DataTypes.DATEONLY,
    price: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'room_special_price',
  });
  return room_special_price;
};