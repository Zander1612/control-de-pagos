const loginRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

loginRouter.post('/', async (req, res) => {
    const { email, password } = req.body;

    const userExist = await User.findOne({ email });

    if (!userExist) {
        return res.status(400).json({ error: 'Email o contraseña inválidos' });
    }

    if (!userExist.verified) {
        return res.status(400).json({ error: 'Tu email no está verificado' });
    }

    const isCorrect = await bcrypt.compare(password, userExist.passwordHash);

    if (!isCorrect) {
        return res.status(400).json({ error: 'Email o contraseña inválidos' });
    }
    console.log(userExist);
    

    const userForToken = {
        id: userExist.id,
        role: userExist.role            // AÑADIDO
    };

    const accessToken = jwt.sign(userForToken, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1d'
    });

    res.cookie('accessToken', accessToken, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true
    });

    return res.status(200).json({
        role: userExist.role,           // NECESARIO
        message: "Login exitoso"
    });
});

module.exports = loginRouter;
