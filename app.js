require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan')
const usersRouter = require('./controllers/users');
(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI_TEST);
        console.log('Conectado a MongoDB');
    } catch (error) {
        console.log('Error al conectar a MongoDB:', error);
    }
})();

app.use(cors());
app.use(express.json());
app.use(cookieParser());



//Rutas Frontend
app.use('/', express.static(path.resolve('views', 'home')))
app.use('/components', express.static(path.resolve('views', 'components')))
app.use('/img', express.static(path.resolve('img')))
app.use('/signup', express.static(path.resolve('views', 'signup')))
app.use('/login', express.static(path.resolve('views', 'login')))


app.use(morgan('tiny'));

//Rutas Backend
app.use('/api/users', usersRouter);

module.exports = app;
