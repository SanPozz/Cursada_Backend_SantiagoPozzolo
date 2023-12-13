import { Router } from "express";

// import ProductManager from "../controllers/ProductManager.js";
import Product from "../dao/models/products.models.js";
import Cart from "../dao/models/carts.models.js";

// const productManager = new ProductManager('./json/products.json');

const viewsRouter = Router();

viewsRouter.get('/', async (req, res) => {
    
    const { limit, page, sort, category, status } = req.query;

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
        res.status(200).render('home', {
            products: products.docs,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            totalPages: products.totalPages
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
    res.status(200).render('carts', {
        cart: cart,
        products: cart.products

    })
})

export default viewsRouter