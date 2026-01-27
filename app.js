require('dotenv').config();
const { MONGO_URI } = require('./config');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // Corregido: suele ser cookieParser
const morgan = require('morgan');

// Importar los Routers
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const logoutRouter = require('./controllers/logout');
const servicesRouter = require('./controllers/services');
const serviceTypesRouter = require('./controllers/servicesTypes'); // Revisa la 's' en el nombre del archivo
const SemanasRouter = require('./controllers/semana');
const { userExtractor, isAdmin } = require('./middleware/auth');

// Conexión a BD
(async() => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log(' Conectado a MongoDB');
    } catch (error) {
        console.error(' Error en conexión:', error);
    }
})();

// --- Middlewares Globales ---
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan('tiny'));

// --- 1. RUTAS API (Prioridad para evitar conflictos con estáticos) ---
app.use('/api/login', loginRouter);
app.use('/api/logout', logoutRouter);
app.use('/api/users', usersRouter); 
app.use('/api/services', servicesRouter); // El middleware ya está dentro del router
app.use('/api/service-types', serviceTypesRouter);
app.use('/api/semanas', SemanasRouter);

// --- 2. RUTAS FRONTEND PÚBLICAS ---
app.use('/login', express.static(path.resolve('views', 'login')));
app.use('/signup', express.static(path.resolve('views', 'signup')));
app.use('/styles', express.static(path.resolve('views', 'styles')));
app.use('/components', express.static(path.resolve('views', 'components')));
app.use('/img', express.static(path.resolve('img')));
app.use('/verify/:id/:token', express.static(path.resolve('views', 'verify')));

// --- 3. RUTAS FRONTEND PROTEGIDAS (Navegador) ---
app.use('/users', userExtractor, isAdmin, express.static(path.resolve('views', 'users')));
app.use('/admin', userExtractor, isAdmin, express.static(path.resolve('views', 'admin')));

// --- 4. RUTA RAÍZ ---
app.use('/', express.static(path.resolve('views', 'home')));

module.exports = app;