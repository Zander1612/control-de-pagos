const serviceTypesRouter = require('express').Router();
const ServiceType = require('../models/serviceType');
const { userExtractor, isAdmin } = require('../middleware/auth');

// 1. Obtener todos los tipos de servicios (Cualquier usuario logueado)
serviceTypesRouter.get('/', userExtractor, async (req, res) => {
    const types = await ServiceType.find({});
    res.json(types);
});

// 2. Crear un nuevo tipo de servicio (SOLO ADMIN)
serviceTypesRouter.post('/', userExtractor, isAdmin, async (req, res) => {
    const { name, percentage } = req.body;

    if (!name || percentage === undefined) {
        return res.status(400).json({ error: 'Nombre y porcentaje son requeridos' });
    }

    const newType = new ServiceType({
        name,
        percentage
    });

    const savedType = await newType.save();
    res.status(201).json(savedType);
});

module.exports = serviceTypesRouter;