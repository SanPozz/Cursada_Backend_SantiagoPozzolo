import { Router } from "express";

import passport from "passport";

import { SessionsManagerMongo } from "../controllers/database/SessionsManagerMongo.js";

const routerSessions = Router();

routerSessions.post('/register', passport.authenticate('register', {failureRedirect: '/register?error=Invalid%20Credentials', successRedirect: '/login'}));

routerSessions.post('/login', passport.authenticate('login', {failureRedirect: '/login?error=Invalid%20Credentials'}), SessionsManagerMongo.login);

routerSessions.get('/logout', SessionsManagerMongo.logout)

routerSessions.get('/github', passport.authenticate('github', {}), async (req, res) => {});

routerSessions.get('/callbackGithub', passport.authenticate('github', {failureRedirect: '/login'}), SessionsManagerMongo.callbackGithub)

routerSessions.get("/current", SessionsManagerMongo.current);

export default routerSessions