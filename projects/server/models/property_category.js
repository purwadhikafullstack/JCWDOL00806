'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class property_category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.property, {
        foreignKey: 'category_id',
        as: 'property'
      })
    }
  }
  property_category.init({
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'property_category',
  });
  return property_category;
};