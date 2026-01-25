const servicesRouter = require('express').Router();
const Service = require('../models/service');
const ServiceType = require('../models/serviceType');
const Semana = require('../models/semana'); 
const { userExtractor, isAdmin } = require('../middleware/auth'); // <--- CORREGIDO: se agregó isAdmin

// 1. REGISTRAR SERVICIO (Solo Admin registra a mecánicos)
servicesRouter.post('/', userExtractor, isAdmin, async (req, res) => { // <--- CORREGIDO: Coma agregada
    try {
        // Ahora recibimos mechanicId en el body porque el Admin registra el trabajo de otro
        const { serviceTypeId, description, totalAmount, mechanicId } = req.body;

        if (!mechanicId) return res.status(400).json({ error: 'El ID del mecánico es requerido' });

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
            mechanic: mechanicId, // <--- Se asigna el mecánico del body
            semana: currentSemana._id,
            date: new Date()
        });

        const savedService = await newService.save();
        res.status(201).json(savedService);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al guardar el servicio' });
    }
});

// 2. REPORTE GENERAL PARA EL ADMIN (Opción A)
servicesRouter.get('/admin-report', userExtractor, isAdmin, async (req, res) => {
    try {
        const currentSemana = await Semana.findOne({ status: 'open' });
        if (!currentSemana) return res.status(404).json({ error: 'No hay semana activa' });

        const services = await Service.find({ semana: currentSemana._id })
            .populate('mechanic', 'name')
            .populate('serviceType', 'name');

        const totalWorkshop = services.reduce((sum, s) => sum + s.workshopAmount, 0);
        const totalMechanics = services.reduce((sum, s) => sum + s.mechanicAmount, 0);

        res.json({
            semanaId: currentSemana._id,
            resumenFinanciero: {
                ingresoTotal: totalWorkshop + totalMechanics,
                gananciaTaller: totalWorkshop,
                totalNominaMecanicos: totalMechanics
            },
            serviciosRegistrados: services
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al generar reporte' });
    }
});

module.exports = servicesRouter;