import { productService } from "../../services/products.service.js";
import { CustomError, ErrorCodes } from "../../utils.js";
import mongoose from "mongoose";

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

            if (!products) {
                throw new CustomError(ErrorCodes.PRODUCT_NOT_FOUND.message, ErrorCodes.PRODUCT_NOT_FOUND.name, ErrorCodes.PRODUCT_NOT_FOUND.code);
            }
    
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(products);
    
        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            res.status(error.code.status).send({ error_name: error.name, error_description: error.message, error_code: error.code });
        }
    }

    static async getProductByID(req, res) {
        const { pid } = req.params;
    
        try {

            if (!mongoose.Types.ObjectId.isValid(pid)) {
                throw new CustomError(ErrorCodes.INVALID_PRODUCT_ID.message, ErrorCodes.INVALID_PRODUCT_ID.name, ErrorCodes.INVALID_PRODUCT_ID.code);
                
            }

            const product = await productService.getProductByID(pid);

    
            if (product) {
                res.send(product);

            } else {
                throw new CustomError(ErrorCodes.PRODUCT_NOT_FOUND.message, ErrorCodes.PRODUCT_NOT_FOUND.name, ErrorCodes.PRODUCT_NOT_FOUND.code);
            }
    
        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            res.status(error.code.status).send({ error_name: error.name, error_description: error.message, error_code: error.code });
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