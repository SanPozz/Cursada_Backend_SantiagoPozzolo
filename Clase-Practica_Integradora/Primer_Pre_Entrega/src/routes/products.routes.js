import { Router } from "express";
import Product from "../dao/models/products.models.js";
// import ProductManager from "../controllers/ProductManager.js";
// const productManager = new ProductManager('./json/products.json');

const routerProducts = Router();

// routerProducts.get('/', async (req, res) => {
    
//     const { limit } = req.query;

//     if (limit) {

//         let products = await productManager.getProducts();

//         products = products.slice(0, limit);

//         res.send(products);
//     }

//     const products = await productManager.getProducts();
//     res.send(products);
// })

// routerProducts.get('/:pid', async (req, res) => {
    
//     const { pid } = req.params;

//     const product = await productManager.getProductById(parseInt(pid));

//     if (product) {
//         res.send(product);
//     } else {
//         res.status(404).send({ error: 'Product not found' });
//     }
// })

// routerProducts.post('/', async (req, res) => {
//     const { title, description, price, thumbnail, code, stock, category } = req.body;

//     const verify = await productManager.addProduct({
//         title,
//         description,
//         price,
//         thumbnail,
//         code,
//         stock,
//         category,
//         status: true,
//     })

//     if (!verify) {
//         res.status(400).send({ error: 'Product already exists' });
//         return;
//     }

//     res.status(200).send({ status: 'Product added successfully' })
// })

// routerProducts.put('/:pid', async (req, res) => {
//     const { pid } = req.params;
//     const { title, description, price, thumbnail, code, stock, category } = req.body;

//     const productVerify = await productManager.getProductById(parseInt(pid));

//     if (!productVerify) {
//         res.status(404).send({ error: 'Product not found' });
//         return;
//     }

//     await productManager.updateProduct(parseInt(pid), {
//         title,
//         description,
//         price,
//         thumbnail,
//         code,
//         stock,
//         category
//     })

//     res.status(200).send({ status: 'Product updated successfully' })
// })

// routerProducts.delete('/:pid', async (req, res) => {
//     const { pid } = req.params;

//     await productManager.deleteProduct(parseInt(pid));

//     res.status(200).send({ status: 'Product deleted successfully' })
// })

routerProducts.get('/', async (req, res) => {
    
    const { limit } = req.query;

    try {

        if (limit) {

            let products = await Product.find().lean();

            products = products.slice(0, limit);

            res.status(200).send(products);
        }

        const products = await Product.find().lean();
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