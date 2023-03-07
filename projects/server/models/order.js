'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.users, {
        foreignKey: 'users_id',
        as: 'users'
      })
      this.belongsTo(models.room, {
        foreignKey: 'room_id',
        as: 'room'
      })
      this.hasOne(models.order_details, {
        foreignKey: 'order_id',
        as: 'order_details'
      })
    }
  }
  order.init({
    status: DataTypes.STRING,
    payment_proof: DataTypes.STRING,
    start_date: DataTypes.DATEONLY,
    end_date: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'order',
  });
  return order;
};