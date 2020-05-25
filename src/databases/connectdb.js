 const Sequelize = require('sequelize');
 require('dotenv').config();
 const sequelize = new Sequelize( process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port:process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    dialectOptions: {connectTimeout: 1000}, // mariadb connector option
    timezone: '+07:00',
    freezeTableName: true
    //logging: false // Log Sql excuting
  })
  sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
  module.exports = sequelize ;