import { Router } from "express";

import Product from "../dao/models/products.models.js";
import Cart from "../dao/models/carts.models.js";

import { generateProductMocks } from "../dao/mocks/mockProducts.js";

import { authLogged, authViews, authAdmin } from "../utils.js";

const viewsRouter = Router();



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

viewsRouter.get('/realtimeproducts', async (req, res) => {
    res.status(200).render('realTimeProducts');
})

viewsRouter.get('/chat', async (req, res) => {
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

viewsRouter.get('/', async (req, res) => {
    if (!req.session.user) {
        res.redirect('/login');
    }
    res.status(200).render('home');
})

viewsRouter.get('/register', authLogged, async (req, res) => {
    res.status(200).render('register');
})

viewsRouter.get('/login', authLogged, async (req, res) => {
    res.status(200).render('login');
})

viewsRouter.get('/profile', authViews, async (req, res) => {
    
    res.status(200).render('profile', {
        user: req.session.user
    });
})

viewsRouter.get('/mockingproducts', async (req, res) => {
    const fakeProducts = [];

    let limit = req.query.limit || 100

    for (let i = 0; i < limit; i++) {
        fakeProducts.push(generateProductMocks());
    }

    res.status(200).render('mockingproducts', {
        products: fakeProducts
    })

    // res.status(200).render('mockingproducts', {
    //     products
    // })
})

viewsRouter.get('/*', async (req, res) => {
    res.status(404).render('error404');
})

export default viewsRouter