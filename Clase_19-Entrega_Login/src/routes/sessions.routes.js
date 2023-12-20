import { Router } from "express";
import User from "../dao/models/users.models.js";

import bcrypt from "bcrypt";

const routerSessions = Router();

routerSessions.post('/register', async (req, res) => {

    let {first_name, last_name, email, age, password} = req.body
    
    if (!first_name || !last_name || !email || !age || !password) {
        return res.redirect('/register?error=All fields are required')
    }

    const userExist = await User.findOne({email});

    if (userExist) {
        return res.redirect('/register?error=Email already registered')
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    let user = await User.create({first_name, last_name, email, age, password: hashedPassword});

    res.redirect('/login');

})

routerSessions.post('/login', async (req, res) => {

    let {email, password} = req.body;

    if (!email || !password) {
        return res.redirect('/login?error=All%20fields%20are%20required')
    }

    if (email == "adminCoder@coder.com") {
        const adminPassword = bcrypt.hashSync('adminCod3r123', 10);
        console.log(adminPassword);

        const validPassword = bcrypt.compareSync(password, adminPassword);

        if (validPassword) {
            req.session.user = {
                email: email,
                password: adminPassword,
                rol: "admin"
            }

            return res.redirect('/products');
        } else {
            return res.redirect('/login?error=Invalid%20Credentials')
        }
    }
        
    const userExist = await User.findOne({email});

    if (!userExist) {
        return res.redirect('/login?error=Invalid%20Credentials')
    }

    const validPassword = bcrypt.compareSync(password, userExist.password);



    if (!validPassword) {
        return res.redirect('/login?error=Invalid%20Credentials')
    }

    req.session.user = userExist;

    res.redirect('/products');
})

export default routerSessions