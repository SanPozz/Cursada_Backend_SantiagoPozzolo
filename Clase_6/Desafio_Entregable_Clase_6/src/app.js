import express from 'express';

import ProductManager from './controllers/ProductManager.js';

const app = express();

const productManager = new ProductManager('./json/products.json');

const PORT = 8080;

const server = app.listen(PORT, () => {
    console.log(`Server on Port: ${PORT}`);
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/products', async (req, res) => {

    const { limit } = req.query;

    if (limit) {

        let products = await productManager.getProducts();

        products = products.slice(0, limit);

        res.send(products);
    }

    const products = await productManager.getProducts();
    res.send(products);
});

app.get('/api/products/:pid', async (req, res) => {
    
    const { pid } = req.params;

    const product = await productManager.getProductById(parseInt(pid));

    if (product) {
        res.send(product);
    } else {
        res.status(404).send({ error: 'Product not found' });
    }
})