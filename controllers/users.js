require('dotenv').config(); 
const usersRouter = require('express').Router(); 
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');  
const { userExtractor } = require('../middleware/auth');

// API Key de EmailListVerify 

const EMAIL_LIST_VERIFY_KEY = process.env.EMAIL_LIST_VERIFY_KEY;

usersRouter.get('/', userExtractor, (req, res) => {
    try {
        
        return res.json({
            nombre: req.user.name,
            email: req.user.email,
            role: req.user.role 
        });
    } catch (error) {
        return res.status(500).json({ error: "Error al obtener el perfil" });
    }
});

// ============================================================
usersRouter.post('/', async (request, response) => {
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
        return response.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        return response.status(400).json({ error: 'El correo ya está en uso' });
    }


    try {
    const verifyResponse = await axios.get(`https://apps.emaillistverify.com/api/verifyEmail`, {
        params: {
            secret: process.env.EMAIL_LIST_VERIFY_KEY,
            email: email,
            timeout: 15
        }
    });

    const status = verifyResponse.data.toString().trim().toLowerCase();
    
    // EmailListVerify suele devolver 'ok' cuando es válido
    const validStatuses = ['valid', 'ok', 'ok_for_all'];

    if (!validStatuses.includes(status)) {
        console.log(`Registro rechazado. Email: ${email}, Motivo API: ${status}`);
        return response.status(400).json({ 
            error: 'El correo electrónico no pudo ser verificado como real',
            debug: status // Quita esto en producción
        });
    }
} catch (error) {
    console.error('Error conectando con EmailListVerify:', error.message);
    // Decisión de arquitectura: ¿Si la API falla, dejas que el usuario se registre o no?
    // Si quieres dejarlo pasar: console.log("Saltando validación por error de API");
}

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
        name,
        email,
        passwordHash,
        verified: true 
    });

    const savedUser = await newUser.save();

    const token = jwt.sign({ id: savedUser.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });

    return response.status(201).json({ message: 'Usuario creado con éxito', token });
    
    
});

module.exports = usersRouter;

