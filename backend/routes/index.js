const restaurantes = require('./restaurantes.routes');
const mesas = require('./mesas.routes');
const clientes = require('./clientes.routes');
const reservas = require('./reservas.routes');
const categoriaProductos = require('./categoria-productos.routes');
const productos = require('./productos.routes');
const consumos = require('./consumos.routes');

module.exports = app => {
    app.use('/api/mesas', mesas);
    app.use('/api/clientes', clientes);
    app.use('/api/reservas', reservas);
    app.use('/api/restaurantes', restaurantes);
    app.use('/api/categoriaProductos', categoriaProductos);
    app.use('/api/productos', productos);
    app.use('/api/consumos', consumos);
    return app;
}