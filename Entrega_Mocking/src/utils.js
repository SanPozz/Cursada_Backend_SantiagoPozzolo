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
    constructor(message, name, code) {
        super(message);
        this.name = name;
        this.code = code;
    }
}

export const ErrorCodes = {
    INTERNAL_SERVER_ERROR : {
        name: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error',
        code: {status: 500, message: 'Internal Server Error'}
    },
    PRODUCT_NOT_FOUND : {
        name: 'PRODUCT_NOT_FOUND',
        message: 'Product not found',
        code: {status: 404, message: 'Not Found'}
    },
    INVALID_PRODUCT_ID : {
        name: 'INVALID_PRODUCT_ID',
        message: 'Invalid product ID',
        code: {status: 400, message: 'Bad Request'}
    },
    INVALID_CART_ID : {
        name: 'INVALID_CART_ID',
        message: 'Invalid cart ID',
        code: {status: 400, message: 'Bad Request'}
    },
    CART_NOT_FOUND : {
        name: 'CART_NOT_FOUND',
        message: 'Cart not found',
        code: {status: 404, message: 'Not Found'}
    }

}
