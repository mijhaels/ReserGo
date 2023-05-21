const { Sequelize } = require('sequelize');

const PUERTO = 3000;

const DB = {
    username: 'postgres',
    host: '127.0.0.1',
    database: 'parcial2',
    password: 'postgres',
    port: 5433
}

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: DB.host,
    port: DB.port,
    database: DB.database,
    username: DB.username,
    password: DB.password,
    dialectOptions: {
        useUTC: false
    },
    timezone: '-04:00'
});

module.exports = {
    PUERTO,
    DB,
    sequelize
}