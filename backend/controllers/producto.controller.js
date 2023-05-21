const { Producto } = require('../models/producto.model');
const NAME = 'Producto';
const PLURAL_NAME = 'Productos';

const get = async(req, res) => {
    try {
        if (req.params.id) {
            const obj = await Producto.findOne({ where: {
                id: req.params.id
            }})
            if (obj) {
                res.send({ok: true, msg: `${NAME}`, resp: obj});
            } else {
                res.send({ok: false, msg: `${NAME}`, resp: 'No encontrado'});
            }
        } else {
            const objs = await Producto.findAll();
            res.send({ok: true, msg: `Lista de ${PLURAL_NAME}`, resp: objs});
        }
    } catch (error) {
        res.send({ok: false, msg: `Error GET ${NAME}`, resp: String(error)})
    }
}

const post = async(req, res) => {
    try {
        const model = await Producto.create(req.body);
        await model.save();
        req.body.id = model.id;
        res.send({ok: true, msg: `${NAME} insertado`, resp: req.body});
    } catch (error) {
        res.send({ok: false, msg: `Error POST ${NAME}`, resp: String(error)})
    }
}

const put = async(req, res) => {
    try {
        const model = await Producto.findOne({where: {id: req.body.id}})
        for (const key of Object.keys(model.toJSON())) {
            if (key !== 'id') {
                model[key] = req.body[key];
            }
        }
        await model.save();
        req.body.id = model.id;
        res.send({ok: true, msg: `${NAME} editado`, resp: req.body});
    } catch (error) {
        res.send({ok: false, msg: `Error PUT ${NAME}`, resp: String(error)})
    }
}

const del = async(req, res) => {
    try {
        await Producto.destroy({where: {id: req.params.id}});
        res.send({ok: true, msg: `${NAME} eliminado`, resp: req.params});
    } catch (error) {
        res.send({ok: false, msg: `Error DELETE ${NAME}`, resp: String(error)})
    }
}

module.exports = {
    get,
    post,
    put,
    del
}