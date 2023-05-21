const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config');
const { Restaurante } = require('./restaurante.model')

class Mesa extends Model { }

Mesa.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    posicionx: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: {
            min: 1,
            max: 10
        }
    },
    posiciony: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: {
            min: 1,
            max: 10
        }
    },
    planta: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    },
    capacidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    }
}, { 
    sequelize,
    modelName: 'mesas',
    createdAt: false,
    updatedAt: false,
});

Mesa.belongsTo(Restaurante, {foreignKey: {allowNull: false}}); // Agrega restauranteId a Mesa

module.exports = {
    Mesa
}