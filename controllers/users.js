require('dotenv').config();
const usersRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');  
const { userExtractor, isAdmin } = require('../middleware/auth');

// --- 1. OBTENER TODOS LOS USUARIOS (Para el Admin) ---
// Esta es la ruta que corregimos para que el selector de mecánicos funcione
usersRouter.get('/', userExtractor, isAdmin, async (req, res) => {
    try {
        // Buscamos todos los usuarios en la BD
        const users = await User.find({});
        
        // Enviamos la lista mapeada con los campos que el frontend necesita
        return res.json(users.map(user => ({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        })));
    } catch (error) {
        console.error("Error al obtener la lista de usuarios:", error);
        return res.status(500).json({ error: "Error interno al obtener usuarios" });
    }
});

// --- 2. REGISTRO DE NUEVO USUARIO ---
usersRouter.post('/', async (request, response) => {
    const { name, email, password } = request.body;

    // Validación de campos vacíos
    if (!name || !email || !password) {
        return response.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    try {
        const normalizedEmail = email.toLowerCase().trim();
        const userExists = await User.findOne({ email: normalizedEmail });
        
        if (userExists) {
            return response.status(400).json({ error: 'El correo ya está en uso' });
        }

        // --- Validación Externa de Email ---
        try {
            const verifyResponse = await axios.get(`https://apps.emaillistverify.com/api/verifyEmail`, {
                params: {
                    secret: process.env.EMAIL_LIST_VERIFY_KEY,
                    email: normalizedEmail,
                    timeout: 10 
                }
            });

            const status = verifyResponse.data.toString().trim().toLowerCase();
            const validStatuses = ['valid', 'ok', 'ok_for_all'];

            if (!validStatuses.includes(status)) {
                console.log(`Registro rechazado por API. Email: ${normalizedEmail}, Status: ${status}`);
                return response.status(400).json({ 
                    error: 'El correo electrónico no es válido o no existe' 
                });
            }
        } catch (apiError) {
            // Si la API falla, permitimos el registro para no bloquear el flujo
            console.error('EmailListVerify API Error:', apiError.message);
        }
        
        // Encriptación de contraseña
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Crear el nuevo usuario (Por defecto el modelo debería tener role: 'mecanico')
        const newUser = new User({
            name: name.trim(),
            email: normalizedEmail,
            passwordHash,
            verified: true 
        });

        const savedUser = await newUser.save();

        // Generación de Token
        const userForToken = {
            id: savedUser._id,
            email: savedUser.email,
            role: savedUser.role
        };

        const token = jwt.sign(
            userForToken, 
            process.env.ACCESS_TOKEN_SECRET, 
            { expiresIn: '1d' }
        );

        return response.status(201).json({ 
            message: 'Usuario creado con éxito', 
            token,
            user: {
                id: savedUser._id,
                name: savedUser.name,
                role: savedUser.role
            }
        });

    } catch (error) {
        console.error('Error en el controlador de usuarios:', error);
        return response.status(500).json({ error: 'Error interno del servidor al crear usuario' });
    }
});

module.exports = usersRouter;
