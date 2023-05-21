const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const colors = require('colors');
const routes = require('./routes');
const app = express();
const { PUERTO, sequelize } = require('./config');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(cors());


app.get('/', (req, res) => {
    res.send('Hola Mundo!')
})

routes(app)

const httpServer = http.createServer(routes(app));
httpServer.listen(PUERTO, () => {
    console.log(colors.white('Escuchando Puerto: ', PUERTO));
});

// Crea las tablas solo si no existen
(async () => {
    await sequelize.sync();
})();