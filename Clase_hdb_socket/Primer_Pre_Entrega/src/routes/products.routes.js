import { Router } from "express";
import ProductManager from "../controllers/ProductManager.js";
const productManager = new ProductManager('./json/products.json');

const routerProducts = Router();

routerProducts.get('/', async (req, res) => {
    
    const { limit } = req.query;

    if (limit) {

        let products = await productManager.getProducts();

        products = products.slice(0, limit);

        res.send(products);
    }

    const products = await productManager.getProducts();
    res.send(products);
})

routerProducts.get('/:pid', async (req, res) => {
    
    const { pid } = req.params;

    const product = await productManager.getProductById(parseInt(pid));

    if (product) {
        res.send(product);
    } else {
        res.status(404).send({ error: 'Product not found' });
    }
})

routerProducts.post('/', async (req, res) => {
    const { title, description, price, thumbnail, code, stock, category } = req.body;

    const verify = await productManager.addProduct({
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        category,
        status: true,
    })

    if (!verify) {
        res.status(400).send({ error: 'Product already exists' });
        return;
    }

    res.status(200).send({ status: 'Product added successfully' })
})

routerProducts.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const { title, description, price, thumbnail, code, stock, category } = req.body;

    const productVerify = await productManager.getProductById(parseInt(pid));

    if (!productVerify) {
        res.status(404).send({ error: 'Product not found' });
        return;
    }

    await productManager.updateProduct(parseInt(pid), {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        category
    })

    res.status(200).send({ status: 'Product updated successfully' })
})

routerProducts.delete('/:pid', async (req, res) => {
    const { pid } = req.params;

    await productManager.deleteProduct(parseInt(pid));

    res.status(200).send({ status: 'Product deleted successfully' })
})

export default routerProducts