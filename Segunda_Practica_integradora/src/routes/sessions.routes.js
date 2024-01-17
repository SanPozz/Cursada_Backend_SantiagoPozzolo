import { Router } from "express";
import User from "../dao/models/users.models.js";

import passport from "passport";
import bcrypt from "bcrypt";

const routerSessions = Router();

routerSessions.post('/register', passport.authenticate('register', {failureRedirect: '/register?error=Invalid%20Credentials', successRedirect: '/login'}));

routerSessions.post('/login', passport.authenticate('login', {failureRedirect: '/login?error=Invalid%20Credentials'}), async (req,res) => {
    console.log(req.user);
    req.session.user = req.user;
    res.redirect('/products');
});

routerSessions.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
})

routerSessions.get('/github', passport.authenticate('github', {}), async (req, res) => {});

routerSessions.get('/callbackGithub', passport.authenticate('github', {failureRedirect: '/login'}), async (req, res) => {
    req.session.user = req.user;
    res.redirect('/products');
})

routerSessions.get("/current", (req, res) => {
    if (req.session.user) {
        res.send({
            user: req.session.user
        });
    } else {
        res.send({
            user: null
        });
    }
});

export default routerSessions