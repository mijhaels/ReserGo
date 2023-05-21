const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config');
class CategoriaProducto extends Model { }

CategoriaProducto.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },

}, { 
    sequelize, 
    modelName: 'categoriaProductos',
    createdAt: false,
    updatedAt: false,
});

module.exports = {
    CategoriaProducto
}