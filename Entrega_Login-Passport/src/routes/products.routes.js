import { Router } from "express";
import Product from "../dao/models/products.models.js";

const routerProducts = Router();

routerProducts.get('/', async  (req, res) => {
    
    const { limit, page, sort, category, status } = req.query;

    try {

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

        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(products);

    } catch (error) {

        res.status(400).send({ error: "Error during products search: " + error});
    }





})

routerProducts.get('/:pid', async (req, res) => {
    
    const { pid } = req.params;

    try {

        const product = await Product.findById(pid).lean();

        if (product) {
            res.send(product);
        } else {
            res.status(404).send({ error: 'Product not found' });
        }

    } catch (error) {
        res.status(400).send({ error: "Error during product search: " + error});
    }


})

routerProducts.post('/', async (req, res) => {
    const { title, description, price, thumbnail, code, stock, category } = req.body;

    try {
        const productToAdd = await Product.create({
            title,
            description,
            category,
            stock,
            code,
            thumbnail,
            price
        });

        res.status(200).send({ status: "Product Created: " + productToAdd });
    } catch (error) {
        res.status(400).send({ Error: "Error creating product: " + error});
    }
})

routerProducts.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const { title, description, stock, code, price, category } = req.body;

    try {
        const productToUpdate = await Product.findByIdAndUpdate(pid, {
            title,
            description,
            category,
            stock,
            code,
            price
        });

        if (productToUpdate) {
            res.status(200).send({ status: "Product Updated: " + productToUpdate });
        } else {
            res.status(400).send({ status: "Product Not Found" });
        }
    } catch (error) {
        res.status(400).send({ status: "Error updating product: " + error });
    }
})

routerProducts.delete('/:pid', async (req, res) => {
    const { pid } = req.params;

    try {
        const productToDelete = await Product.findByIdAndDelete(pid);

        if (productToDelete) {
            res.status(200).send({ status: "Product Deleted: " + productToDelete })
        } else {
            res.status(400).send({ status: "Product Not Found: " + productToDelete })
        }
    } catch (error) {
        res.status(400).send({ status: "Error deleting product: " + error })
    }
})

export default routerProducts