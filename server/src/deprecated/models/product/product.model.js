const { DataTypes, INTEGER } = require('sequelize');
const { sequelize } = require('../../config/db.config.sequlize');

const ShortProduct = sequelize.define('ShortProduct', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  type: {
    type: DataTypes.STRING,
    defaultValue: 'product',
  },
  bedroom: {
    type: DataTypes.INTEGER,
  },
  bathroom: {
    type: DataTypes.INTEGER,
  },
  villa: {
    type: DataTypes.BOOLEAN,
  },
  location: {
    type: DataTypes.STRING,
  },
  buildYear: {
    type: DataTypes.INTEGER,
  },
  propertySize: { 
    type: DataTypes.STRING
  },
});


module.exports = ShortProduct; 
