// models/productAbout.model.js
const { DataTypes } = require('sequelize');
const {sequelize} = require('../../config/db.config.sequlize');

const ProductsImage = sequelize.define('products_img', {
  ShortProducts_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'products_img',
  timestamps: false,
});

module.exports = ProductsImage;
