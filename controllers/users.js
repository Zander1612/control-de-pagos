require('dotenv').config();
const usersRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');  
const { userExtractor, isAdmin } = require('../middleware/auth');

// --- 1. OBTENER LISTA (Corregido para el JS) ---
usersRouter.get('/', userExtractor, isAdmin, async (req, res) => {
    try {
        const users = await User.find({});
        return res.json(users.map(user => ({
            id: user._id.toString(), // Aseguramos que el JS vea "id"
            name: user.name,
            email: user.email,
            role: user.role || 'mecanico' 
        })));
    } catch (error) {
        console.error("Error al obtener la lista de usuarios:", error);
        return res.status(500).json({ error: "Error interno al obtener usuarios" });
    }
});

// --- 2. REGISTRO (Tu lógica original intacta) ---
usersRouter.post('/', async (request, response) => {
    const { name, email, password } = request.body;

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
                return response.status(400).json({ 
                    error: 'El correo electrónico no es válido o no existe' 
                });
            }
        } catch (apiError) {
            console.error('EmailListVerify API Error:', apiError.message);
        }
        
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            name: name.trim(),
            email: normalizedEmail,
            passwordHash,
            verified: true,
            role: 'mecanico' // <--- Asegúrate que esto esté aquí
        });

        const savedUser = await newUser.save();

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
        return response.status(500).json({ error: 'Error interno del servidor' });
    }
});

// ELIMINAR USUARIO 
usersRouter.delete('/:id', userExtractor, isAdmin, async (req, res) => {
    try {
        const userToDelete = await User.findById(req.params.id);

        if (!userToDelete) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Opcional: Evitar que el admin se borre a sí mismo
        if (userToDelete._id.toString() === req.user.id) {
            return res.status(400).json({ error: 'No puedes eliminar tu propia cuenta de administrador' });
        }

        await User.findByIdAndDelete(req.params.id);
        res.status(204).end(); // Éxito, sin contenido
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        res.status(500).json({ error: 'Error interno al eliminar el mecánico' });
    }
});

module.exports = usersRouter;
