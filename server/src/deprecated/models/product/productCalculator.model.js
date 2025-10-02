// ЕСЛИ ДО КОНЦА ПРОЕКТА НЕ ПРИГОДИТЬСЯ НУЖНО УДАЛИТЬ!
// ЕСЛИ ДО КОНЦА ПРОЕКТА НЕ ПРИГОДИТЬСЯ НУЖНО УДАЛИТЬ!
// ЕСЛИ ДО КОНЦА ПРОЕКТА НЕ ПРИГОДИТЬСЯ НУЖНО УДАЛИТЬ!
// ЕСЛИ ДО КОНЦА ПРОЕКТА НЕ ПРИГОДИТЬСЯ НУЖНО УДАЛИТЬ!

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db.config.sequlize');

const productCalculator = sequelize.define('products', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  name: DataTypes.STRING,
  image: DataTypes.STRING,
  kg_price: DataTypes.INTEGER,
  metr_price: DataTypes.INTEGER,
}, {
  sequelize,
  modelName: 'Product',
  tableName: 'products', // Имя вашей таблицы
});

module.exports = productCalculator;
