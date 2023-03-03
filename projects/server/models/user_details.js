'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_details extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.users, {
        foreignKey: 'users_id',
        as: "users"
      })
    }
  }
  user_details.init({
    gender: DataTypes.STRING,
    profile_pic: DataTypes.STRING,
    full_name: DataTypes.STRING,
    birthdate: DataTypes.DATEONLY,
    ktp: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user_details',
  });
  return user_details;
};