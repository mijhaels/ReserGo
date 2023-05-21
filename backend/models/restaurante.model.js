const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config');

class Restaurante extends Model { }

Restaurante.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    plantas: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    }
}, { sequelize, modelName: 'restaurantes', createdAt: false, updatedAt: false});

module.exports = {
    Restaurante
}