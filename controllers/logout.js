const logoutRouter = require('express').Router();

logoutRouter.get('/', async (request, response) => {
    const cookies = request.cookies; 
    
    if (!cookies?.accessToken) {
        return response.sendStatus(204); 
    }

    response.clearCookie('accessToken', {
        secure: process.env.NODE_ENV === 'production', 
        httpOnly: true,
        sameSite: 'strict' 
    });

    return response.sendStatus(204); 
});

module.exports = logoutRouter;