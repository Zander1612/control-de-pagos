const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userExtractor = async (req, res, next) => {
    // 1. Obtener el token del header Authorization (Bearer <token>)
    const authorization = req.get('authorization');
    let token = '';

    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        token = authorization.substring(7);
    }

    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    try {
        // 2. Decodificar el token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if (!decodedToken.id) {
            return res.status(401).json({ error: 'Token inválido' });
        }

        // 3. Buscar al usuario en la DB y agregarlo al objeto request (req)
        const user = await User.findById(decodedToken.id);
        req.user = user;

        next(); // Continuar a la siguiente función
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
};

const isAdmin = (req, res, next) => {
    // Este middleware debe ir DESPUÉS de userExtractor
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Acceso denegado: Se requieren permisos de administrador' });
    }
    next();
};

module.exports = { userExtractor, isAdmin };