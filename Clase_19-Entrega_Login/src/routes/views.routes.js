import { Router } from "express";

// import ProductManager from "../controllers/ProductManager.js";
import Product from "../dao/models/products.models.js";
import Cart from "../dao/models/carts.models.js";

// const productManager = new ProductManager('./json/products.json');

const viewsRouter = Router();

const authViews = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

const authLogged = (req, res, next) => {
    if (req.session.user) {
        res.redirect('/?error=You are already logged in');
    } else {
        next();
    }
}

viewsRouter.get('/products', authViews, async (req, res) => {
    
    const { limit, page, sort, category, status } = req.query;
    const user = req.session.user;

        let query = {};

        category && (query.category = category)
        status && (query.status = status)
        
        let options = {
            limit: limit || 10,
            page: page || 1,
            lean: true
        }

        sort && (options.sort = { price: sort})

        const products = await Product.paginate(query, options);
        res.status(200).render('products', {
            products: products.docs,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            totalPages: products.totalPages,
            user: user
        });
})

viewsRouter.get('/realtimeproducts', (req, res) => {
    res.status(200).render('realTimeProducts');
})

viewsRouter.get('/chat', (req, res) => {
    res.status(200).render('chat');
})

viewsRouter.get('/carts/:cid', async (req, res) => {
    const { cid } = req.params;

    const cart = await Cart.findById(cid).populate('products.id_prod').lean();
    console.log(cart.products);
    res.status(200).render('products', {
        cart: cart,
        products: cart.products

    })
})

viewsRouter.get('/', (req, res) => {
    if (!req.session.user) {
        res.redirect('/login');
    }
    res.status(200).render('home');
})

viewsRouter.get('/register', authLogged, (req, res) => {
    res.status(200).render('register');
})

viewsRouter.get('/login', authLogged, (req, res) => {
    res.status(200).render('login');
})

viewsRouter.get('/profile', authViews, (req, res) => {
    
    res.status(200).render('profile', {
        user: req.session.user
    });
})

viewsRouter.get('/logout', authViews, (req, res) => {
    req.session.destroy();
    res.redirect('/');
})

export default viewsRouter