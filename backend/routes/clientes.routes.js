const Router = require('express-promise-router');
const { get, post, put, del } = require('../controllers/clientes.controller');


const router = new Router();

router.get('/', get);
router.get('/:id', get);
router.post('/', post);
router.put('/', put);
router.delete('/:id', del);

module.exports = router;