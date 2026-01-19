const SemanasRouter = require('express').Router();
const Semana = require('../models/semana');
const { userExtractor, isAdmin } = require('../middleware/auth');

// Abrir una nueva semana
SemanasRouter.post('/', userExtractor, isAdmin, async (req, res) => {
    const { startDate, endDate } = req.body;

    // Verificar si ya existe una semana abierta
    const openSemana = await Semana.findOne({ status: 'open' });
    if (openSemana) {
        return res.status(400).json({ error: 'Ya hay una semana abierta. Ciérrala primero.' });
    }

    const nuevaSemana = new Semana({
        startDate,
        endDate,
        status: 'open'
    });

    const savedSemana = await nuevaSemana.save();
    res.status(201).json(savedSemana);
});

// Ver la semana actual (Para que los mecánicos sepan dónde registrar)
SemanasRouter.get('/current', userExtractor, async (req, res) => {
    const currentSemana = await Semana.findOne({ status: 'open' });
    if (!currentSemana) {
        return res.status(404).json({ error: 'No hay semanas abiertas actualmente.' });
    }
    res.json(currentSemana);
});

module.exports = SemanasRouter;