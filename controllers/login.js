const loginRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

loginRouter.post('/', async (req, res) => {
    try {
        const { email, password } = req.body;

        
        const userExist = await User.findOne({ email: email.toLowerCase().trim() });

        if (!userExist) {
            return res.status(401).json({ error: 'Email o contraseña inválidos' });
        }

        if (!userExist.verified) {
            return res.status(403).json({ error: 'Tu email no está verificado aún' });
        }
        const isCorrect = await bcrypt.compare(password, userExist.passwordHash);

        if (!isCorrect) {
            return res.status(401).json({ error: 'Email o contraseña inválidos' });
        }
        const userForToken = {
            email: userExist.email,
            id: userExist._id,
            role: userExist.role
        };

        const accessToken = jwt.sign(
            userForToken, 
            process.env.ACCESS_TOKEN_SECRET, 
            { expiresIn: '1d' }
        );

        res.cookie('accessToken', accessToken, {
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            sameSite: 'strict'
        });

        return res.status(200).json({
            token: accessToken,
            id: userExist._id, 
            role: userExist.role,
            name: userExist.name,
            message: "Login exitoso"
        });

    } catch (error) {
        console.error("Error en el proceso de Login:", error);
        return res.status(500).json({ error: 'Ocurrió un error interno en el servidor' });
    }
});

module.exports = loginRouter;