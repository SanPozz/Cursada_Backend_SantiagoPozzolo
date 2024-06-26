import crypto from 'crypto';
import winston from 'winston'
import jwt from 'jsonwebtoken'
import { configENV } from './config/configDotEnv.js';
import passport from 'passport';
import nodemailer from 'nodemailer'

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
    },
    MISSING_PARAMETERS : {
        name: 'MISSING_PARAMETERS',
        message: 'Missing parameters',
        code: {status: 400, message: 'Bad Request'}
    },
    UNAUTHORIZED : {
        name: 'UNAUTHORIZED',
        message: 'Unauthorized',
        code: {status: 401, message: 'Unauthorized'}
    },
}


const customLevelsLoggers = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        fatal: "red",
        error: "magenta",
        warning: "yellow",
        info: "green",
        http: "blue",
        debug: "white",
    },
};

export const logger = winston.createLogger({
    levels: customLevelsLoggers.levels,
    transports: [
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(
            winston.format.colorize({ colors: customLevelsLoggers.colors }),
            winston.format.simple()
            ),
        }),
        new winston.transports.File({
            filename: "./errors.log",
            level: "warning",
            format: winston.format.simple(),
        }),
        ],
    });

    export const addLogger = (req, res, next) => {
        req.logger = logger;
        req.logger.http(
        `${req.method} on ${req.url} - ${new Date().toLocaleString()}`
    );

    next();
};


export const generateToken = (user) => {
    // console.log(user);
    return jwt.sign(user, configENV.SECRET_JWT, { expiresIn: '24h' });
}

export const extractjwtFromCookie = (req, res) => {
    if(req.cookies.token){
        let token = req.cookies.token
        logger.info(`Token extracted from cookie: ${token}`)
        // console.log(`Token extracted from cookie: ${token}`)
        return token
    } else {
        return res.status(401).redirect('/login?error=Please%20LogIn');
    }
}

export const authorizationStrategy = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function (err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.redirect('/login?error=Please%20LogIn');
            }
            req.user = user;
            next();
        })(req, res, next);
    };
}

export const checkRol = ( validRoles ) => {
    return async (req, res, next) => {
        const user = req.user;

        if(!user) {
            return res.redirect('/login?error=Please%20LogIn');
        }

        if(validRoles.includes(user.rol)) {
            next();
        } else {
            res.redirect('/products?error=Unauthorized');
        }
    }
}

export const generateTokenResetPass = (email) =>{
    return jwt.sign({email}, configENV.SECRET_JWT, {expiresIn: '1h'})
}

export const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: configENV.MAIL_USER,
        pass: configENV.MAIL_PASS
    }
})

export let actualDatetime = currentDate.toLocaleString('es-ES', {
    timeZone: 'UTC',
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
});