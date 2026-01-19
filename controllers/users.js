require('dotenv').config(); 
const usersRouter = require('express').Router(); 
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');  
const { userExtractor, isAdmin } = require('../middleware/auth');

// API Key de EmailListVerify 
const EMAIL_LIST_VERIFY_KEY = process.env.EMAIL_LIST_VERIFY_KEY;

// ============================================================
// 🔥 RUTA PARA OBTENER EL PERFIL DEL USUARIO AUTENTICADO
// ============================================================
usersRouter.get('/perfil', userExtractor, (req, res) => {
    try {
        // Adaptado a los campos que definimos para tu taller
        return res.json({
            nombre: req.user.name,
            email: req.user.email,
            role: req.user.role // Importante para saber si es Admin o Mecánico
        });
    } catch (error) {
        return res.status(500).json({ error: "Error al obtener el perfil" });
    }
});

// ============================================================
// POST: Crear un nuevo usuario (Registro Directo)
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

    /* --- COMENTAMOS ESTO TEMPORALMENTE ---
    try {
        const verifyResponse = await axios.get(`https://api.emaillistverify.com/v2/verifyEmail?secret=${process.env.EMAIL_LIST_VERIFY_KEY}&email=${email}`);
        if (verifyResponse.data.toLowerCase() !== 'ok') {
            return response.status(400).json({ error: 'El correo electrónico no es real' });
        }
    } catch (error) {
        return response.status(400).json({ error: 'Error de conexion con el validador' });
    }
    --------------------------------------- */

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