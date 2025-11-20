const usersRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { PAGE_URL } = require('../config');

// Post User
usersRouter.post('/', async (req, res) => {
    const { name, email, password } = req.body;

    // Validar que los campos no estén vacíos
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Todos lo espacion son requeridos' });
    }

    // Validar que el correo no esté en uso
    const userExist = await User.findOne({ email });
    if (userExist) {
        return res.status(400).json({ error: 'El correo ya está en uso' });
    }

    // saltRounds = 10 by default
    const passwordHash = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario
    const newUser = new User({
        name,
        email,
        passwordHash,
    });

    // Guardar el usuario en la base de datos
    const saveUser= await newUser.save();
    
    const token = jwt.sign({id: saveUser.id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '3h'});
    

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        requireTLS: false,
        auth: {
            user: process.env.EMAIL_USER, // generated ethereal user
            pass: process.env.EMAIL_PASS, // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false // WARNING: Disables certificate validation
        },
    });
    

    (async () => {
        try {
        const info = await transporter.sendMail({
        from: process.env.EMAIL_USER, // sender address
        to: saveUser.email, // list of receivers
        subject: "Verificacion de Usuario", // Subject line
        html: `<a href="${ PAGE_URL }/verify/${saveUser.id}/${token}"> Verificar Correo</a>`, // html body
        });

        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (err) {
        console.error("Error while sending mail", err);
    }
    })();

    // Enviar respuesta exitosa
    return res.status(201).json('Usuario creado correctamente, por favor verifica tu cuenta');

});

// Verify User
usersRouter.patch('/:id/:token', async (req, res) => {
    try {
        const token = req.params.token;
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const id = decodedToken.id;
        await User.findByIdAndUpdate(id, { verified: true });
        return res.sendStatus(200);
        
    } catch (error) {

        // Encontrar el email del usuario
        const id = req.params.id;
        const { email } = await User.findById(id);

        // Firmar un nuevo token
        const token = jwt.sign({id: id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '3h'});
    
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            requireTLS: false,
            auth: {
            user: process.env.EMAIL_USER, // generated ethereal user
            pass: process.env.EMAIL_PASS, // generated ethereal password
        },
            tls: {
            rejectUnauthorized: false // WARNING: Disables certificate validation
        },
        });
    
        // Enviar el correo de verificación de nuevo
        await transporter.sendMail({
            from: process.env.EMAIL_USER, // sender address
            to: email,
            subject: "Verificacion de Usuario", // Subject line
            html: `<a href="${ PAGE_URL }/verify/${id}/${token}"> Verificar Correo</a>`, // html body

        });

        // Enviar respuesta de error
        return res.status(400).json({ error: 'El enlace de verificación ha expirado. Se ha enviado un nuevo correo de verificación.'});
    }
});


// Exportar el router
module.exports = usersRouter;
