import { Router } from "express";

import ProductManager from "../controllers/ProductManager.js";

const productManager = new ProductManager('./json/products.json');

const viewsRouter = Router();

viewsRouter.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.status(200).render('home', { products: products });
})

viewsRouter.get('/realtimeproducts', (req, res) => {
    res.status(200).render('realTimeProducts');
})

export default viewsRouter