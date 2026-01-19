const loginRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

loginRouter.post('/', async (req, res) => {
    const { email, password } = req.body;

    // 1. Verificar si el usuario existe
    const userExist = await User.findOne({ email });

    if (!userExist) {
        return res.status(400).json({ error: 'Email o contraseña inválidos' });
    }

    // 2. Verificar si el email está verificado (si vas a usar esta lógica)
    if (!userExist.verified) {
        return res.status(400).json({ error: 'Tu email no está verificado' });
    }

    // 3. Comparar contraseñas
    const isCorrect = await bcrypt.compare(password, userExist.passwordHash);

    if (!isCorrect) {
        return res.status(400).json({ error: 'Email o contraseña inválidos' });
    }

    // 4. Definir la información que viajará en el Token (Payload)
    const userForToken = {
        email: userExist.email,
        id: userExist._id,
        role: userExist.role
    };

    // 5. Firmar el Token
    const accessToken = jwt.sign(
        userForToken, 
        process.env.ACCESS_TOKEN_SECRET, 
        { expiresIn: '1d' }
    );

    // 6. Configurar la Cookie (para el navegador)
    res.cookie('accessToken', accessToken, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'strict'
    });

    // 7. Respuesta al cliente (enviamos el token explícito para Thunder Client/Postman)
    return res.status(200).json({
        token: accessToken, // <--- COPIA ESTE VALOR EN THUNDER CLIENT
        role: userExist.role,
        name: userExist.name,
        message: "Login exitoso"
    });
});

module.exports = loginRouter;