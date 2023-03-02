'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class review extends Model {
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
        as: "room"
      })
    }
  }
  review.init({
    review: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'review',
  });
  return review;
};