const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userExtractor = async (req, res, next) => {
    const authorization = req.get('authorization');
    let token = '';

    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        token = authorization.substring(7);
    } else if (req.cookies && req.cookies.accessToken) {
        token = req.cookies.accessToken;
    }

    if (!token) {
        if (req.path.startsWith('/api')) return res.status(401).json({ error: 'No token' });
        return res.redirect('/login');
    }

    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        
        const user = await User.findById(decodedToken.id);
        if (!user) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        req.user = user; 
        next();
    } catch (error) {
        console.error("Error validando token:", error.message);
        if (req.path.startsWith('/api')) return res.status(401).json({ error: 'Token inválido o expirado' });
        return res.redirect('/login');
    }
};

const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        if (req.path.startsWith('/api')) {
            return res.status(403).json({ error: 'Acceso denegado: se requiere rol de administrador' });
        }
        return res.redirect('/'); 
    }
    next();
};

module.exports = { userExtractor, isAdmin };