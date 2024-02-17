import crypto from 'crypto';

export const authViews = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

export const authLogged = (req, res, next) => {
    if (req.session.user) {
        res.redirect('/?error=You are already logged in');
    } else {
        next();
    }
}

export const authUser = (req, res, next) => {
    if (req.session.user.rol == 'user') {
        next();
    } else {
        res.redirect('/login');
    }
}

export const authAdmin = (req, res, next) => {
    if (req.session.user.rol == 'admin') {
        next();
    } else {
        res.setHeader('Content-Type', 'application/json');
        res.status(403).send({ error: 'Unauthorized' });
    }
}

export const generateTicketCode = () =>{
    const id = crypto.randomBytes(20).toString('hex');
    return id
}

export class CustomError extends Error {
    constructor(message, name, description, code) {
        super(message);
        this.name = name;
        this.description = description;
        this.code = code;
    }
}

export const ErrorCodes = {
    INTERNAL_SERVER_ERROR : {
        name: 'INTERNAL_SERVER_ERROR',
        description: 'Internal server error',
        code: 500
    },
    PRODUCT_NOT_FOUND : {
        name: 'PRODUCT_NOT_FOUND',
        description: 'Product not found',
        code: 404
    },

}
