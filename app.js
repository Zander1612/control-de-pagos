require('dotenv').config();
const { MONGO_URI } = require('./config');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const cookiesParser = require('cookie-parser');
const morgan = require('morgan');
const usersRouter = require('./controllers/users');
const { userExtractor } = require('./middleware/auth.js');
const loginRouter = require('./controllers/login.js');
const logoutRouter = require('./controllers/logout.js');
const todosRouter = require('./controllers/todos.js');

(async() => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Conectado a Mongo DB');
    
    } catch (error) {
        console.log(error);
    
    }
})()

app.use(cors());
app.use(express.json());
app.use(cookiesParser());

//Rutas Frontend
app.use('/', express.static(path.resolve('views', 'home')));
app.use('/styles', express.static(path.resolve('views', 'styles')));
app.use('/login', express.static(path.resolve('views', 'login')));
app.use('/signup', express.static(path.resolve('views', 'signup')));
app.use('/components', express.static(path.resolve('views', 'components')));
app.use('/img', express.static(path.resolve('img')));
app.use('/users', express.static(path.resolve('views', 'users')));
app.use('/verify/:id/:token', express.static(path.resolve('views', 'verify')));

app.use(morgan('tiny'));

//Rutas Backend
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/logout', logoutRouter);
app.use('/api/todos',userExtractor, todosRouter);


module.exports = app;