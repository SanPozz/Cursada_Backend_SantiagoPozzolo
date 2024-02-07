import passport from 'passport'
import local from 'passport-local'
import github from 'passport-github2'
import bcrypt from 'bcrypt'

import User from '../dao/models/users.models.js'

export const initializatePassport = () => {
    
    passport.use('register', new local.Strategy({
        passReqToCallback: true,
        usernameField: 'email'
    },
    async (req, username, password, done) => {
        try {
            console.log(username);
            let {first_name, last_name, age} = req.body;
    
            if (!first_name || !last_name || !username || !age || !password) {
                return done(null, false);
                // return res.redirect('/register?error=All fields are required');
            }

            console.log(req.cookies.cart);

            const userExist = await User.findOne({username});

            if (userExist) {
                return done(null, false);
                // return res.redirect('/register?error=Email already registered');
            }

            const hashedPassword = bcrypt.hashSync(password, 10);
            let email = username;

            const user_cart = req.cookies.cart;

            let user = await User.create({first_name, last_name, email, age, password: hashedPassword, user_cart: user_cart});

            return done(null, user);
            // res.redirect('/login');
            
        } catch (error) {
            done(error, null)
        }
    }
    ))

    passport.use('login', new local.Strategy({
        usernameField: 'email'
    },
    async (username, password, done) => {
        try {

            if (!username || !password) {
                // return res.redirect('/login?error=All%20fields%20are%20required')
                return done(null, false);
            }

            if (username == "adminCoder@coder.com") {
                const adminPassword = bcrypt.hashSync('adminCod3r123', 10);
                console.log(adminPassword);

                const validPassword = bcrypt.compareSync(password, adminPassword);

                if (validPassword) {
                    let adminUser = {
                        email: username,
                        password: adminPassword,
                        rol: "admin"
                    }
                    
                    return done(null, adminUser);

                    // return res.redirect('/products');
                } else {
                    // return res.redirect('/login?error=Invalid%20Credentials')
                    return done(null, false);
                }
            }
            
            const userExist = await User.findOne({email: username});

            // console.log(userExist);

            if (!userExist) {
                // return res.redirect('/login?error=Invalid%20Credentials')
                return done(null, false);
            }

            const validPassword = bcrypt.compareSync(password, userExist.password);

            if (!validPassword) {
                // return res.redirect('/login?error=Invalid%20Credentials')
                return done(null, false);
            }

            return done(null, userExist);

        } catch (error) {
            console.log(4);
            done(error, null)
        }
    }))


    passport.use('github', new github.Strategy({
        clientID: "Iv1.b8798d66e0acf1ec",
        clientSecret: "9140ea59ab0d7cb8db622f4b54fa58fd0b1c0aef",
        callbackURL: "http://localhost:8080/api/sessions/callbackGithub"
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            // console.log(profile);
            const user = await User.findOne({email: profile._json.email})

            if (!user) {
                const nameParts = profile._json.name.split(' ');
                let firstName = nameParts[0];
                let lastName = nameParts[1];
                const user_cart = res.cookies.cart;
                console.log(firstName, lastName);
                const newUser = {
                    first_name: firstName,
                    last_name: lastName,
                    email: profile._json.email,
                    user_cart: user_cart
                }

                const createdUser = await User.create(newUser)
                return done(null, createdUser)
            }

            return done(null, user)
        } catch (error) {
            return done(error, null)
        }
    }
    ))

    passport.serializeUser((user, done) => {
        if (user.rol == 'admin')  {
            return done(null, user.email)
        } else {
            return done(null, user._id)
        }
    })

    passport.deserializeUser(async (id, done) => {
        const user = await User.findById(id)
        return done(null, user)
    })
}