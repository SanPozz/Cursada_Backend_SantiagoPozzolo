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
