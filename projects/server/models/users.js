'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasOne(models.user_details, {
        foreignKey: "users_id",
        as : "user_details"
      })
      this.hasMany(models.property, {
        foreignKey: "users_id",
        as: 'property'
      })
      this.hasMany(models.order, {
        foreignKey: 'users_id',
        as: 'order'
      })
      this.hasMany(models.review, {
        foreignKey: 'users_id',
        as: 'review'
      })
    }
  }
  users.init({
    id: {
      allowNull:false,
      primaryKey:true,
      type: DataTypes.UUID,
      defaultValue: UUIDV4
    },
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    password: DataTypes.STRING,
    is_verified: DataTypes.BOOLEAN,
    is_tenant: DataTypes.BOOLEAN,
    otp: DataTypes.STRING,
    otp_count: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};