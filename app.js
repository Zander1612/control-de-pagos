require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI_TEST);
        console.log('Conectado a MongoDB');
    } catch (error) {
        console.log('Error al conectar a MongoDB:', error);
    }
})();

//Rutas Frontend
app.use('/', express.static(path.resolve('views', 'home')))
app.use('/components', express.static(path.resolve('views', 'components')))
app.use('/images', express.static(path.resolve('img')))
app.use('/signup', express.static(path.resolve('views', 'signup')))
app.use('/login', express.static(path.resolve('views', 'login')))




module.exports = app;
