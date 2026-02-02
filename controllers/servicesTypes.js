const serviceTypesRouter = require('express').Router();
const ServiceType = require('../models/serviceType');
const { userExtractor, isAdmin } = require('../middleware/auth');

// 1. OBTENER TIPOS
serviceTypesRouter.get('/', userExtractor, async (req, res) => {
    try {
        const types = await ServiceType.find({});
        // Aseguramos que el frontend vea 'id' en lugar de '_id'
        res.json(types.map(t => ({
            id: t._id.toString(),
            name: t.name,
            percentage: t.percentage
        })));
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener tipos de servicio' });
    }
});

// 2. CREAR TIPO (Con validación de duplicados)
serviceTypesRouter.post('/', userExtractor, isAdmin, async (req, res) => {
    const { name, percentage } = req.body;

    if (!name || percentage === undefined) {
        return res.status(400).json({ error: 'Nombre y porcentaje son requeridos' });
    }

    const normalizedName = name.trim().toUpperCase();

    // Evitamos servicios con el mismo nombre para no confundir al Admin
    const existingType = await ServiceType.findOne({ name: normalizedName });
    if (existingType) {
        return res.status(400).json({ error: 'Este tipo de servicio ya existe' });
    }

    const newType = new ServiceType({
        name: normalizedName,
        percentage: Number(percentage)
    });

    try {
        const savedType = await newType.save();
        res.status(201).json(savedType);
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar el tipo de servicio' });
    }
});

// 3. ELIMINAR TIPO (Necesario para el botón '✕' de la pestaña Config)
serviceTypesRouter.delete('/:id', userExtractor, isAdmin, async (req, res) => {
    try {
        await ServiceType.findByIdAndDelete(req.params.id);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el tipo de servicio' });
    }
});

module.exports = serviceTypesRouter;