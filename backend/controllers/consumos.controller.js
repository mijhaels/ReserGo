const { Consumo, ConsumoDetalle } = require('../models/consumo.model');
const NAME = 'Consumo';
const PLURAL_NAME = 'Consumos';

const get = async(req, res) => {
    try {
        if (req.params.id) {
            const obj = await Consumo.findOne({ where: {
                id: req.params.id
            }, raw: true})
            if (obj) {
                const detalles = await ConsumoDetalle.findAll({where: {consumoId: obj.id}, raw: true});
                if (detalles && detalles.length) {
                    obj.detalles = detalles;
                } else {
                    obj.detalles = [];
                }
                res.send({ok: true, msg: `${NAME}`, resp: obj});
            } else {
                res.send({ok: false, msg: `${NAME}`, resp: 'No encontrado'});
            }
        } else {
            const objs = await Consumo.findAll({raw: true});
            let idx = -1;
            for (obj of objs) {
                idx += 1;
                const detalles = await ConsumoDetalle.findAll({where: {consumoId: obj.id}, raw: true});
                if (detalles && detalles.length) {
                    obj.detalles = detalles
                } else {
                    obj.detalles = []
                }
            }
            res.send({ok: true, msg: `Lista de ${PLURAL_NAME}`, resp: objs});
        }
    } catch (error) {
        res.send({ok: false, msg: `Error GET ${NAME}`, resp: String(error)})
    }
}

const post = async(req, res) => {
    try {
        const model = await Consumo.create(req.body);
        await model.save();
        req.body.id = model.id;
        newDetalles = [];
        for (detalleReq of req.body.detalles) {
            detalleReq.consumoId = req.body.id;
            const detalle = await ConsumoDetalle.create(detalleReq);
            await detalle.save();
            detalleReq.id = detalle.id;
            newDetalles.push(detalleReq);
        }
        req.body.detalles = newDetalles;
        res.send({ok: true, msg: `${NAME} insertado`, resp: req.body});
    } catch (error) {
        res.send({ok: false, msg: `Error POST ${NAME}`, resp: String(error)})
    }
}

const put = async(req, res) => {
    try {
        const model = await Consumo.findOne({where: {id: req.body.id}})
        for (const key of Object.keys(req.body)) {
            if (key !== 'id') {
                model[key] = req.body[key];
            }
        }
        await model.save();
        newDetalles = [];
        const oldDetalles = await ConsumoDetalle.findAll({where: {consumoId: model.id}})
        for (detalle of oldDetalles) {
            const newDetalle = req.body.detalles.find(d => d.id === detalle.id);
            if (!newDetalle) {
                ConsumoDetalle.destroy({where: {id: detalle.id}});
            }
        }
        for (detalleReq of req.body.detalles) {
            if (detalleReq.id) {
                const detalle = await ConsumoDetalle.findOne({where: {id: detalleReq.id}})
                for (const key of Object.keys(detalleReq)) {
                    if (key !== 'id') {
                        detalle[key] = detalleReq[key];
                    }
                }
                await detalle.save();
            } else {
                detalleReq.consumoId = req.body.id;
                const detalle = await ConsumoDetalle.create(detalleReq);
                await detalle.save();
                detalleReq.id = detalle.id;
                newDetalles.push(detalleReq);
            }
        }
        req.body.id = model.id;
        req.body.detalles = newDetalles;
        res.send({ok: true, msg: `${NAME} editado`, resp: req.body});
    } catch (error) {
        res.send({ok: false, msg: `Error PUT ${NAME}`, resp: String(error)})
    }
}

const del = async(req, res) => {
    try {
        await Consumo.destroy({where: {id: req.params.id}});
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