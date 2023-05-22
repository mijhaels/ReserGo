const restaurantes = require('./restaurantes.routes');
const mesas = require('./mesas.routes');
const clientes = require('./clientes.routes');
const reservas = require('./reservas.routes');

module.exports = app => {
    app.use('/api/mesas', mesas);
    app.use('/api/clientes', clientes);
    app.use('/api/reservas', reservas);
    app.use('/api/restaurantes', restaurantes);
    return app;
}