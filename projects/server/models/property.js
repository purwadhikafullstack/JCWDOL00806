'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class property extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.users, {
        foreignKey: "users_id",
        as: 'users'
      })
      this.belongsTo(models.property_category, {
        foreignKey: 'category_id',
        as: 'property_category'
      })
      this.hasMany(models.room, {
        foreignKey: 'property_id',
        as: 'room'
      })
    }
  }
  property.init({
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    description: DataTypes.TEXT,
    picture: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'property',
  });
  return property;
};