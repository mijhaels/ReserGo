const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config');
class Cliente extends Model { }

Cliente.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    cedula: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    apellido: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, { 
    sequelize, 
    modelName: 'clientes',
    createdAt: false,
    updatedAt: false,
    indexes: [{
        unique: true,
        fields: ['cedula']
    }]
});

module.exports = {
    Cliente
}