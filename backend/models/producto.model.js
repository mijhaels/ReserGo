const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config');
const { CategoriaProducto } = require('./categoria-producto.model')

class Producto extends Model { }

Producto.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    precio: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, { 
    sequelize,
    modelName: 'productos',
    createdAt: false,
    updatedAt: false,
});

Producto.belongsTo(CategoriaProducto, {foreignKey: {allowNull: false}}); // Agrega categoriaProductoID a Producto

module.exports = {
    Producto
}