const servicesRouter = require('express').Router();
const Service = require('../models/service');
const ServiceType = require('../models/serviceType');
const User = require('../models/user');
const { userExtractor } = require('../middleware/auth');

// --- OBTENER TODOS LOS SERVICIOS ---
servicesRouter.get('/', userExtractor, async (req, res) => {
    try {
        const filter = req.user.role === 'admin' 
            ? {} 
            : { mechanic: req.user.id };

        const services = await Service.find(filter)
            .populate('mechanic', { name: 1, email: 1 })
            .populate('serviceType', { name: 1, percentage: 1 });

        res.json(services.map(service => ({
            id: service._id,
            mechanic: service.mechanic,
            serviceType: service.serviceType,
            costo_total: service.costo_total,
            monto_a_pagar: service.monto_a_pagar,
            status: service.status,
            description: service.description,
            fecha_inicio: service.fecha_inicio
        })));
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener servicios' });
    }
});

// --- CREAR NUEVO SERVICIO ---
servicesRouter.post('/', userExtractor, async (req, res) => {
    const { mechanic, serviceType, costo_total, description } = req.body;

    if (!mechanic || !serviceType || !costo_total) {
        return res.status(400).json({ error: 'Faltan datos: mecánico, tipo de servicio o costo' });
    }

    try {
        const typeFound = await ServiceType.findById(serviceType);
        if (!typeFound) return res.status(404).json({ error: 'Tipo de servicio no existe' });

        const mechanicFound = await User.findById(mechanic);
        if (!mechanicFound) return res.status(404).json({ error: 'Mecánico no existe' });

        const costo = Number(costo_total);
        const porcentaje = Number(typeFound.percentage);
        const a_pagar = (costo * porcentaje) / 100;

        const newService = new Service({
            mechanic: mechanicFound._id,
            serviceType: typeFound._id,
            costo_total: costo,
            monto_a_pagar: a_pagar,
            description: description || '',
            status: 'pendiente',
            fecha_inicio: new Date()
        });

        const savedService = await newService.save();
        const populatedService = await Service.findById(savedService._id)
            .populate('mechanic', { name: 1 })
            .populate('serviceType', { name: 1 });

        res.status(201).json(populatedService);

    } catch (error) {
        console.error("Error en POST /api/services:", error);
        res.status(500).json({ error: 'Error interno al guardar el servicio' });
    }
});

// --- ACTUALIZAR ESTADO ---
servicesRouter.patch('/:id', userExtractor, async (req, res) => {
    const { status } = req.body;
    try {
        const updatedService = await Service.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('mechanic').populate('serviceType');

        res.json(updatedService);
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar estado' });
    }
});

// --- ELIMINAR SERVICIO ---
servicesRouter.delete('/:id', userExtractor, async (req, res) => {
    try {
        await Service.findByIdAndDelete(req.params.id);
        res.status(204).end();
    } catch (error) {
        res.status(400).json({ error: 'Error al eliminar servicio' });
    }
});

// --- INICIAR SEMANA ---
servicesRouter.post('/start-week', userExtractor, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'No autorizado' });

    try {
        // Guardar fecha de inicio en DB o simplemente devolver la fecha
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // lunes
        startOfWeek.setHours(0,0,0,0);

        res.json({ message: 'Semana iniciada', startOfWeek });
    } catch (error) {
        res.status(500).json({ error: 'Error al iniciar semana' });
    }
});

// --- CERRAR SEMANA ---
servicesRouter.post('/close-week', userExtractor, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'No autorizado' });

    try {
        const { startDate } = req.body; // Fecha de inicio de la semana enviada desde frontend
        const start = new Date(startDate);
        start.setHours(0,0,0,0);

        const end = new Date(start);
        end.setDate(start.getDate() + 5); // lunes a sábado
        end.setHours(23,59,59,999);

        const services = await Service.find({
            fecha_inicio: { $gte: start, $lte: end },
            status: 'finalizado'
        }).populate('mechanic');

        const payroll = {};

        services.forEach(s => {
            const id = s.mechanic._id;
            if (!payroll[id]) payroll[id] = { name: s.mechanic.name, total: 0, count: 0 };
            payroll[id].total += s.monto_a_pagar;
            payroll[id].count++;
        });

        res.json({ start, end, payroll });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al cerrar semana' });
    }
});

module.exports = servicesRouter;
