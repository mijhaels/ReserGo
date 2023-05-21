const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config');
const { Restaurante } = require('./restaurante.model')
const { Mesa } = require('./mesa.model')
const { Cliente } = require('./cliente.model')

class Reserva extends Model { }

Reserva.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    planta: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    },
    horarios: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    }
}, { sequelize, modelName: 'reservas', createdAt: false, updatedAt: false});

Reserva.belongsTo(Restaurante, {foreignKey: {allowNull: false}}); // Agrega restauranteId a Reserva
Reserva.belongsTo(Mesa, {foreignKey: {allowNull: false}}); // Agrega mesaId a Reserva
Reserva.belongsTo(Cliente, {foreignKey: {allowNull: false}}); // Agrega clienteId a Reserva

module.exports = {
    Reserva
}