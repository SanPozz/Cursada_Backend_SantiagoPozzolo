import { productService } from "../../services/products.service.js";

export class ProductManagerMongo {
    constructor(){}

    static async getProducts(req, res) {
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
    
            const products = await productService.getPaginatedProducts(query, options);
    
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(products);
    
        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            res.status(400).send({ error: "Error during products search: " + error});
        }
    }

    static async getProductByID(req, res) {
        const { pid } = req.params;
    
        try {
            const product = await productService.getProductByID(pid);
    
            if (product) {
                res.send(product);

            } else {
                res.setHeader('Content-Type', 'application/json');
                res.status(404).send({ error: 'Product not found' });
            }
    
        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            res.status(400).send({ error: "Error during product search: " + error});
        }
    }

    static async createProduct(req, res) {
        const { title, description, price, thumbnail, code, stock, category } = req.body;
    
        try {
            const productToAdd = {
                title,
                description,
                category,
                stock,
                code,
                thumbnail,
                price
            };

            await productService.createProduct(productToAdd);

            res.setHeader('Content-Type', 'application/json');
            res.status(200).send({ status: "Product Created: " + productToAdd });

        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            res.status(400).send({ Error: "Error creating product: " + error});
        }
    }

    static async updateProduct(req, res) {
        const { pid } = req.params;
        const { title, description, stock, code, price, category } = req.body;
    
        try {
            const productToUpdate = {
                title,
                description,
                category,
                stock,
                code,
                price
            };

            let productUpdated = await productService.updateProduct(pid, productToUpdate);
    
            if (productUpdated) {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).send({ status: "Product Updated: " + productToUpdate });
            } else {
                res.setHeader('Content-Type', 'application/json');
                res.status(400).send({ status: "Product Not Found" });
            }
        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            res.status(400).send({ status: "Error updating product: " + error });
        }
    }

    static async deleteProduct(req, res) {
        const { pid } = req.params;
    
        try {
            const productToDelete = await productService.deleteProduct(pid);
    
            if (productToDelete) {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).send({ status: "Product Deleted: " + productToDelete })
            } else {
                res.setHeader('Content-Type', 'application/json');
                res.status(400).send({ status: "Product Not Found: " + productToDelete })
            }
        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            res.status(400).send({ status: "Error deleting product: " + error })
        }
    }
}