const Sequelize = require('sequelize');
const { DB_HOST, DB_USER, DB_PASS } = require('../deprecated/utils/secrets');

const sequelize = new Sequelize('products_db', DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: 'mysql',
});

const sequelizeReviews = new Sequelize('reviews_db', DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: 'mysql',
});

module.exports = {sequelize, sequelizeReviews};
