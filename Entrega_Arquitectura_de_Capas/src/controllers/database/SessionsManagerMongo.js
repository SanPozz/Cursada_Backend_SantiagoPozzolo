
export class SessionsManagerMongo {
    constructor(){}

    static async login(req, res) {

        req.session.user = req.user;
        res.redirect('/products');
    }

    static async logout(req, res) {

        req.session.destroy();
        res.redirect('/login');
    }

    static async callbackGithub(req, res) {

        req.session.user = req.user;
        res.redirect('/products');
    }

    static async current(req, res) {

        if (req.session.user) {
            res.send({
                user: req.session.user
            });
        } else {
            res.send({
                user: null
            });
        }
    }
}