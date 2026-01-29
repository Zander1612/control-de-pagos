const servicesRouter = require('express').Router();
const Service = require('../models/service');
const ServiceType = require('../models/serviceType');
const Semana = require('../models/semana'); 
const { userExtractor, isAdmin } = require('../middleware/auth');

// -----------------------------------------------------------
// 1. REGISTRAR SERVICIO (Solo Admin)
// -----------------------------------------------------------
servicesRouter.post('/', userExtractor, isAdmin, async (req, res) => {
    try {
        const { serviceTypeId, description, totalAmount, mechanicId } = req.body;

        // Validaciones básicas
        if (!mechanicId || !serviceTypeId || !totalAmount) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

        const serviceType = await ServiceType.findById(serviceTypeId);
        if (!serviceType) return res.status(404).json({ error: 'Tipo de servicio no encontrado' });

        const currentSemana = await Semana.findOne({ status: 'open' });
        if (!currentSemana) return res.status(400).json({ error: 'No hay una semana abierta actualmente' });

        // Cálculos matemáticos
        const mechanicAmount = (totalAmount * serviceType.percentage) / 100;
        const workshopAmount = totalAmount - mechanicAmount;

        const newService = new Service({
            description,
            totalAmount,
            mechanicAmount,
            workshopAmount, // Asegúrate de haber agregado este campo a models/service.js
            serviceType: serviceTypeId,
            mechanic: mechanicId,
            semana: currentSemana._id,
            date: new Date()
        });

        const savedService = await newService.save();

        // Actualizar el acumulado de la semana
        currentSemana.totalGenerated += totalAmount;
        await currentSemana.save();

        // Devolvemos el servicio con los datos de nombres ya cargados
        const populatedService = await savedService.populate([
            { path: 'mechanic', select: 'name' },
            { path: 'serviceType', select: 'name' }
        ]);

        res.status(201).json(populatedService);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al guardar el servicio' });
    }
});

// -----------------------------------------------------------
// 2. REPORTE GENERAL PARA EL ADMIN
// -----------------------------------------------------------
servicesRouter.get('/', userExtractor, async (req, res) => {
    const user = req.user; // Obtenido gracias al middleware userExtractor

    try {
        let services;
        
        if (user.role === 'admin') {
            // El admin ve TODO
            services = await Service.find({}).populate('mechanic', { name: 1 }).populate('serviceType');
        } else {
            // El mecánico solo ve lo SUYO
            services = await Service.find({ mechanic: user._id }).populate('serviceType');
        }

        res.json(services);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los servicios' });
    }
});

// -----------------------------------------------------------
// 3. ELIMINAR SERVICIO (Solo Admin)
// -----------------------------------------------------------
servicesRouter.delete('/:id', userExtractor, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const serviceToDelete = await Service.findById(id);
        if (!serviceToDelete) return res.status(404).json({ error: 'Servicio no encontrado' });

        const semana = await Semana.findById(serviceToDelete.semana);
        
        // Solo permitimos borrar si la semana sigue abierta
        if (semana && semana.status === 'open') {
            semana.totalGenerated -= serviceToDelete.totalAmount;
            await semana.save();
        } else if (semana && semana.status === 'closed') {
            return res.status(400).json({ error: 'No se puede eliminar registros de una semana cerrada' });
        }

        await Service.findByIdAndDelete(id);
        res.status(204).end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el servicio' });
    }
});

module.exports = servicesRouter;