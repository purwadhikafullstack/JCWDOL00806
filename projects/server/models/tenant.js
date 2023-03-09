'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tenant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.property_category, {
        foreignKey: 'tenant_id',
        as: 'tenant'
      })
    }
  }
  tenant.init({
    id: {
      allowNull:false,
      primaryKey:true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    password: DataTypes.STRING,
    is_verified: DataTypes.BOOLEAN,
    ktp: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'tenant',
  });
  return tenant;
};