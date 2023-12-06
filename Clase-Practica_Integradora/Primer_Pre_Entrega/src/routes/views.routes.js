import { Router } from "express";

// import ProductManager from "../controllers/ProductManager.js";
import Product from "../dao/models/products.models.js";

// const productManager = new ProductManager('./json/products.json');

const viewsRouter = Router();

viewsRouter.get('/', async (req, res) => {
    const products = await Product.find().lean();
    res.status(200).render('home', { products: products });
})

viewsRouter.get('/realtimeproducts', (req, res) => {
    res.status(200).render('realTimeProducts');
})

viewsRouter.get('/chat', (req, res) => {
    res.status(200).render('chat');
})

export default viewsRouter