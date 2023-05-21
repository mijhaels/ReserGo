const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config');
const { Mesa } = require('./mesa.model')
const { Cliente } = require('./cliente.model')
const { Producto } = require('./producto.model')

class Consumo extends Model { }
class ConsumoDetalle extends Model { }

Consumo.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    estado: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    total: {
        type: DataTypes.DOUBLE,
        allowNull: true,
    },
    fecha_hora_creacion: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    fecha_hora_cierre: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, { 
    sequelize, 
    modelName: 'consumos',
    createdAt: false,
    updatedAt: false,
});

ConsumoDetalle.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    cantidad: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    total: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
}, { 
    sequelize, 
    modelName: 'consumos_detalles',
    createdAt: false,
    updatedAt: false,
});

Consumo.belongsTo(Mesa, {foreignKey: {allowNull: false}}); // Agrega mesaId a Consumo
Consumo.belongsTo(Cliente, {foreignKey: {allowNull: false}}); // Agrega clienteId a Consumo
ConsumoDetalle.belongsTo(Producto, {foreignKey: {allowNull: false}}); // Agrega clienteId a Consumo
Consumo.hasMany(ConsumoDetalle)

module.exports = {
    Consumo,
    ConsumoDetalle
}