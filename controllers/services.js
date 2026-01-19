const servicesRouter = require('express').Router();
const Service = require('../models/service');
const ServiceType = require('../models/serviceType');
const Semana = require('../models/semana'); // Importado como 'Semana'
const { userExtractor } = require('../middleware/auth');

// 1. REGISTRAR SERVICIO (POST)
servicesRouter.post('/', userExtractor, async (req, res) => {
    try {
        const { serviceTypeId, description, totalAmount } = req.body;
        const mechanicId = req.user.id;

        const serviceType = await ServiceType.findById(serviceTypeId);
        if (!serviceType) return res.status(404).json({ error: 'Tipo de servicio no encontrado' });

        const currentSemana = await Semana.findOne({ status: 'open' });
        if (!currentSemana) return res.status(400).json({ error: 'No hay una semana abierta' });

        const mechanicAmount = (totalAmount * serviceType.percentage) / 100;
        const workshopAmount = totalAmount - mechanicAmount;

        const newService = new Service({
            description,
            totalAmount,
            mechanicAmount,
            workshopAmount,
            serviceType: serviceTypeId,
            mechanic: mechanicId,
            semana: currentSemana._id, // Campo en la DB (minúscula)
            date: new Date()
        });

        const savedService = await newService.save();
        res.status(201).json(savedService);
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar el servicio' });
    }
});

// 2. VER RESUMEN (GET) - Esta es la que causaba el error
servicesRouter.get('/my-summary', userExtractor, async (req, res) => {
    try {
        // Buscamos la semana abierta usando el modelo 'Semana'
        const currentSemana = await Semana.findOne({ status: 'open' });
        
        if (!currentSemana) {
            return res.status(404).json({ error: 'No hay semana activa' });
        }

        const services = await Service.find({
            mechanic: req.user.id,
            semana: currentSemana._id
        }).populate('serviceType');

        const totalEarned = services.reduce((sum, s) => sum + s.mechanicAmount, 0);

        res.json({
            mechanic: req.user.name,
            totalEarned,
            servicesCount: services.length,
            services
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor al obtener resumen' });
    }
});

module.exports = servicesRouter;