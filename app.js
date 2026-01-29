require('dotenv').config();
const { MONGO_URI } = require('./config');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

// Importar los Routers
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const logoutRouter = require('./controllers/logout');
const servicesRouter = require('./controllers/services');
const serviceTypesRouter = require('./controllers/servicesTypes');
const SemanasRouter = require('./controllers/semana');


const { userExtractor, isAdmin } = require('./middleware/auth');

// Conexión a Base de Datos
(async() => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Conectado a MongoDB');
    } catch (error) {
        console.error('❌ Error de conexión:', error);
    }
})();

// MIDDLEWARES 
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan('tiny'));

//RUTAS BACKEND

app.use('/api/login', loginRouter);
app.use('/api/logout', logoutRouter);
app.use('/api/users', usersRouter);
app.use('/api/services', userExtractor, servicesRouter);
app.use('/api/service-types', userExtractor, isAdmin, serviceTypesRouter);
app.use('/api/semanas', userExtractor, isAdmin, SemanasRouter);



// --- 4. RUTAS ESTÁTICAS ---
app.use('/', express.static(path.resolve('views', 'home')));
app.use('/login', express.static(path.resolve('views', 'login')));
app.use('/signup', express.static(path.resolve('views', 'signup')));
app.use('/styles', express.static(path.resolve('views', 'styles')));
app.use('/components', express.static(path.resolve('views', 'components')));
app.use('/img', express.static(path.resolve('img')));
app.use('/users', userExtractor, express.static(path.resolve('views', 'users')));
app.use('/admin', userExtractor, isAdmin, express.static(path.resolve('views', 'admin')));






module.exports = app;