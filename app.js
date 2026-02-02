require('dotenv').config();
const { MONGO_URI } = require('./config');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

// --- 1. IMPORTAR LOS ROUTERS ---
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const logoutRouter = require('./controllers/logout');
const servicesRouter = require('./controllers/services');
const serviceTypesRouter = require('./controllers/servicesTypes'); 
const semanasRouter = require('./controllers/semana');

const { userExtractor, isAdmin } = require('./middleware/auth');

// --- 2. CONEXIÓN A BASE DE DATOS ---
(async() => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Conectado a MongoDB');
    } catch (error) {
        console.error('❌ Error de conexión:', error);
    }
})();

// --- 3. MIDDLEWARES GLOBALES ---
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan('tiny'));

// --- 4. RUTAS DEL API (BACKEND) ---
// Nota: Hemos organizado los middlewares para que el frontend pueda consultar
// los datos necesarios sin bloqueos innecesarios de isAdmin.
app.use('/api/login', loginRouter);
app.use('/api/logout', logoutRouter);
app.use('/api/users', usersRouter);

// Para obtener servicios y tipos de servicio, solo pedimos que el usuario esté logueado (userExtractor)
// La protección de "solo admin puede crear/borrar" se maneja dentro de cada controlador.
app.use('/api/services', userExtractor, servicesRouter);
app.use('/api/service-types', userExtractor, serviceTypesRouter);
app.use('/api/semanas', userExtractor, semanasRouter);

// --- 5. RUTAS ESTÁTICAS (FRONTEND) ---
app.use('/', express.static(path.resolve('views', 'home')));
app.use('/login', express.static(path.resolve('views', 'login')));
app.use('/signup', express.static(path.resolve('views', 'signup')));
app.use('/styles', express.static(path.resolve('views', 'styles')));
app.use('/components', express.static(path.resolve('views', 'components')));
app.use('/img', express.static(path.resolve('img')));

// Vistas protegidas
app.use('/users', userExtractor, express.static(path.resolve('views', 'users')));
app.use('/admin', userExtractor, isAdmin, express.static(path.resolve('views', 'admin')));

// --- 6. MANEJO DE ERRORES (OPCIONAL PERO RECOMENDADO) ---
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada en el servidor' });
});

module.exports = app;