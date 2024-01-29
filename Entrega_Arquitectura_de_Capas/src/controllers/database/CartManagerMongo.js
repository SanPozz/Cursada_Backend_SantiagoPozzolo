import { cartService } from "../../services/carts.service.js";
import { productService } from "../../services/products.service.js";


export class CartManagerMongo {
    constructor(){}

    static async createCart(req, res) {
        try {

            if(!req.cookies.cart){
                const newCart = await cartService.createCart();
                res.cookie('cart', newCart._id, {maxAge: 604800000, httpOnly: true});
                res.setHeader('Content-Type', 'application/json');
                res.status(200).send({ status: 'Cart created successfully'});
            } else {
                res.setHeader('Content-Type', 'application/json');
                res.status(400).send({ status: 'Cart already exists' });
            }

        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            res.status(400).send({ status: 'Error creating cart: ' + error });
        }
    }

    static async getCartByID(req, res) {
        const { cid } = req.params;
    
        try {
            const cart = await cartService.getCartByIDAndPopulate(cid);
    
            if (cart) {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).send(cart);
            } else {
                res.setHeader('Content-Type', 'application/json');
                res.status(400).send({ error: 'Cart not found' });
            }

        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            res.status(400).send({ error: 'Error consulting database' + error});
        }
    }

    static async pushProductToCart(req, res) {
        const { cid, pid } = req.params;
    
        try {
            const cart = await cartService.getCartByID(cid);
            const product = await productService.getProductByID(pid);
    
            if (!cart) {
                res.setHeader('Content-Type', 'application/json');
                res.status(400).send({ error: 'Cart not found' });
                return
            }
    
            if (!product) {
                res.setHeader('Content-Type', 'application/json');
                res.status(400).send({ error: 'Product not found' });
                return
            }
    
            const productExist = cart.products.find(product => product.id_prod == pid)
    
            if (productExist) {
                productExist.quantity++
            } else {
                cart.products.push({ id_prod: product._id, quantity: 1 });
            }
    
            await cart.save();

            res.setHeader('Content-Type', 'application/json');
            res.status(200).send({ status: 'Product added to cart successfully' });
    
        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            res.status(400).send({ error: 'Error adding product to cart: ' + error});
        }
    }

    static async cleanCart(req, res) {
        const { cid } = req.params;
    
        try {
            const cart = await cartService.getCartByID(cid);
            cart.products = [];
            await cart.save();

            res.setHeader('Content-Type', 'application/json');
            res.status(200).send({ status: 'Cart cleaned successfully' });
            
        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            res.status(400).send({ error: 'Error deleting cart: ' + error});
        }
    }

    static async deleteProductFromCart(req, res) {
        const { cid, pid } = req.params;
    
        try {
            const cart = await cartService.getCartByID(cid);
    
            if (cart) {
                const productsFiltered = cart.products.filter(prod => prod.id_prod != pid);
                cart.products = productsFiltered;

                await cart.save()

                res.setHeader('Content-Type', 'application/json');
                res.status(200).send({ status: `Product with ${pid} was deleted` })
            }
    
        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            res.status(400).send({ error: 'Error deleting product: ' + error});
        }
    }

    static async updateFullCart(req, res) {
        const { cid } = req.params;
        const { data } = req.body;

        try {
            const cart = await cartService.getCartByIDAndUpdate(cid, data);

            res.setHeader('Content-Type', 'application/json');
            res.status(200).send({ status: 'Cart updated successfully', cart });
            
        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            res.status(400).send({ error: 'Error updating cart: ' + error});
        }
    }

    static async updateProductQuantity(req, res){
        const { cid, pid } = req.params;
        const { quantity } = req.body;
    
        try {
            
            const cart = await cartService.getCartByID(cid);
            let productToUpdate = cart.products.find(prod => prod.id_prod == pid);
    
            productToUpdate.quantity = quantity;
            await cart.save();
            
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send({ status: "OK" , productToUpdate});
    
        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            res.status(400).send({ status: `Error: ${error}` });
        }
    }
}
