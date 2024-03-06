import {UserReadDTO} from "../../dto/usersDTO.js";
import passport from "passport";
import { generateToken } from "../../utils.js";
import User from "../../dao/models/users.models.js";
import jwt from "jsonwebtoken";
import { configENV } from "../../config/configDotEnv.js";
import bcrypt from "bcrypt";

export class SessionsManagerMongo {
    constructor(){}

    static login = async (req, res, next) => {
        passport.authenticate('login', { session: false }, (err, user) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.redirect('/login');
            }
    
            const token = generateToken(user);
    
            res.cookie("token", token, { maxAge: 1000 * 60 * 60, httpOnly: true });
    
            res.redirect('/products');
        })(req, res, next);
    }

    static register = async (req, res, next) => {
        passport.authenticate('register', { session: false }, (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.redirect('/register?error=' + info.message);
            }
    
            res.redirect('/login');
        })(req, res, next);
    }

    static async logout(req, res) {

        res.clearCookie("token");
        res.redirect('/login');
    }

    static async callbackGithub(req, res) {

        const token = generateToken(req.user);

        res.cookie("token", token, { maxAge: 1000 * 60 * 60, httpOnly: true });
        res.redirect('/products');
    }

    static async current(req, res) {

        if (req.user) {
            res.send({
                user: new UserReadDTO(req.user)
            });
        } else {
            res.send({
                user: null
            });
        }
    }

    static async resetPassword(req, res) {
        const { password, confirmPassword } = req.body;
        console.log(req.body);
        try {
            const token = req.query.token

            const info = jwt.verify(token, configENV.SECRET_JWT);

            const email = info.email

            console.log(info);

            console.log(email);

            if (email) {

                const user = await User.findOne({ email });

                
                if (password == confirmPassword) {

                    if (password == "" || confirmPassword == "") {
                        return res.redirect(`/resetpasswordconfirm?error=All fields are required&token=${token}`);
                        
                    }

                    const correctPass = bcrypt.compareSync(password, user.password);
                    if (correctPass) {
                        return res.redirect(`/resetpasswordconfirm?error=The password must be different from the previous one&token=${token}`);
                    }

                    const hashedPassword = await bcrypt.hash(password, 10);

                    user.password = hashedPassword;
                    await user.save();
                    return res.redirect(`/login?success=Password changed successfully`);
                } else {
                    return res.redirect(`/resetpasswordconfirm?error=Passwords do not match&token=${token}`);
                }
            }
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.redirect(`/resetpassform?error=The link has expired`);
                
            } else {
                return res.redirect('/resetpassform?error=Uknown error');
            }
        }
    }

    static async updateRol(req, res) {
        const { uid } = req.params;
            try {
            const user = await User.findById(uid);

            if (!user) {
                throw new Error('User not found');
            }

            if (user.rol == 'user') {
                user.rol = 'premium';
            } else if (user.rol == 'premium') {
                user.rol = 'user';
            }
            
        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            res.status(404).send({ error: error });
        }
    }
}