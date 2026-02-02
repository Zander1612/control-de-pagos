const semanasRouter = require('express').Router();
const Semana = require('../models/semana');
const { userExtractor, isAdmin } = require('../middleware/auth');

// OBTENER ESTADO DE LA SEMANA ACTUAL
semanasRouter.get('/status', userExtractor, async (req, res) => {
    try {
        // Usamos populate para que el frontend pueda ver los nombres de los mecánicos en el resumen
        const openSemana = await Semana.findOne({ status: 'open' })
            .populate({
                path: 'trabajos_incluidos',
                populate: { path: 'mechanic', select: 'name' }
            });
        res.json(openSemana); 
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el estado' });
    }
});

// ABRIR NUEVA SEMANA
semanasRouter.post('/open', userExtractor, isAdmin, async (req, res) => {
    try {
        const yaExiste = await Semana.findOne({ status: 'open' });
        if (yaExiste) return res.status(400).json({ error: 'Ya hay una semana abierta' });

        const newSemana = new Semana({
            fecha_inicio_semana: new Date(), // Nombre de tu boceto
            status: 'open',
            totalGenerated: 0,
            trabajos_incluidos: [] // Inicializamos el arreglo vacío
        });

        await newSemana.save();
        res.status(201).json(newSemana);
    } catch (error) {
        res.status(500).json({ error: 'Error al abrir la semana' });
    }
});

// CERRAR SEMANA ACTUAL
semanasRouter.post('/close', userExtractor, isAdmin, async (req, res) => {
    try {
        const semana = await Semana.findOne({ status: 'open' });
        if (!semana) return res.status(400).json({ error: 'No hay semana abierta para cerrar' });

        semana.status = 'closed';
        semana.fecha_fin_semana = new Date(); // Nombre de tu boceto
        
        await semana.save();
        
        res.json({ message: 'Semana cerrada correctamente', semana });
    } catch (error) {
        res.status(500).json({ error: 'Error al cerrar la semana' });
    }
});

module.exports = semanasRouter;