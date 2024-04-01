import { cartService } from "../../services/carts.service.js";
import { productService } from "../../services/products.service.js";

import { generateTicketCode, logger } from "../../utils.js";


export class CartManagerMongo {
    constructor(){}

    static async createCart(req, res) {
        try {
            const newCart = await cartService.createCart();

            res.setHeader('Content-Type', 'application/json');
            res.status(200).send({ status: 'Cart created successfully', cart: newCart });


        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            res.status(400).send({ status: 'Error creating cart: ' + error });
        }
    }

    static async getCartByID(req, res) {
        const { cid } = req.params;
    
        try {

            if (!mongoose.Types.ObjectId.isValid(cid)) {
                throw new CustomError(ErrorCodes.INVALID_CART_ID.message, ErrorCodes.INVALID_CART_ID.name, ErrorCodes.INVALID_CART_ID.code);
            }

            const cart = await cartService.getCartByIDAndPopulate(cid);
    
            if (cart) {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).send(cart);
            } else {
                throw new CustomError(ErrorCodes.CART_NOT_FOUND.message, ErrorCodes.CART_NOT_FOUND.name, ErrorCodes.CART_NOT_FOUND.code);
            }

        } catch (error) {
            logger.error({error})
            res.setHeader('Content-Type', 'application/json');
            res.status(error.code.status).send({ error_name: error.name, error_description: error.message, error_code: error.code });
        }
    }

    static async pushProductToCart(req, res) {
        const { cid, pid } = req.params;
        const user = req.user
    
        try {
            const cart = await cartService.getCartByID(cid);
            const product = await productService.getProductByID(pid);
            
            if (!mongoose.Types.ObjectId.isValid(cid)) {
                throw new CustomError(ErrorCodes.INVALID_CART_ID.message, ErrorCodes.INVALID_CART_ID.name, ErrorCodes.INVALID_CART_ID.code);
            }
    
            if (!cart) {
                throw new CustomError(ErrorCodes.CART_NOT_FOUND.message, ErrorCodes.CART_NOT_FOUND.name, ErrorCodes.CART_NOT_FOUND.code);
            }
    
            if (!product) {
                throw new CustomError(ErrorCodes.PRODUCT_NOT_FOUND.message, ErrorCodes.PRODUCT_NOT_FOUND.name, ErrorCodes.PRODUCT_NOT_FOUND.code);
            }

            if (product.owner == user.email) {
                throw new CustomError(ErrorCodes.INVALID_PRODUCT_ID.message, ErrorCodes.INVALID_PRODUCT_ID.name, ErrorCodes.INVALID_PRODUCT_ID.code);
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
            logger.error({error})
            res.setHeader('Content-Type', 'application/json');
            res.status(error.code.status).send({ error_name: error.name, error_description: error.message, error_code: error.code });
        }
    }

    static async cleanCart(req, res) {
        const { cid } = req.params;
    
        try {

            if (!mongoose.Types.ObjectId.isValid(cid)) {
                throw new CustomError(ErrorCodes.INVALID_CART_ID.message, ErrorCodes.INVALID_CART_ID.name, ErrorCodes.INVALID_CART_ID.code);
            }

            const cart = await cartService.getCartByID(cid);

            if (!cart) {
                throw new CustomError(ErrorCodes.CART_NOT_FOUND.message, ErrorCodes.CART_NOT_FOUND.name, ErrorCodes.CART_NOT_FOUND.code);
            }

            cart.products = [];
            await cart.save();

            res.setHeader('Content-Type', 'application/json');
            res.status(200).send({ status: 'Cart cleaned successfully' });
            
        } catch (error) {
            logger.error({error})
            res.setHeader('Content-Type', 'application/json');
            res.status(error.code.status).send({ error_name: error.name, error_description: error.message, error_code: error.code });
        }
    }

    static async deleteProductFromCart(req, res) {
        const { cid, pid } = req.params;
    
        try {

            if (!mongoose.Types.ObjectId.isValid(cid)) {
                throw new CustomError(ErrorCodes.INVALID_CART_ID.message, ErrorCodes.INVALID_CART_ID.name, ErrorCodes.INVALID_CART_ID.code);
            }

            const cart = await cartService.getCartByID(cid);

            if (!cart) {
                throw new CustomError(ErrorCodes.CART_NOT_FOUND.message, ErrorCodes.CART_NOT_FOUND.name, ErrorCodes.CART_NOT_FOUND.code);
            }
    
            const productsFiltered = cart.products.filter(prod => prod.id_prod != pid);
            cart.products = productsFiltered;

            await cart.save()

            res.setHeader('Content-Type', 'application/json');
            res.status(200).send({ status: `Product with ${pid} was deleted` })

    
        } catch (error) {
            logger.error({error})
            res.setHeader('Content-Type', 'application/json');
            res.status(error.code.status).send({ error_name: error.name, error_description: error.message, error_code: error.code });
        }
    }

    static async updateFullCart(req, res) {
        const { cid } = req.params;
        const { data } = req.body;

        try {

            if (!mongoose.Types.ObjectId.isValid(cid)) {
                throw new CustomError(ErrorCodes.INVALID_CART_ID.message, ErrorCodes.INVALID_CART_ID.name, ErrorCodes.INVALID_CART_ID.code);
            }

            const cart = await cartService.getCartByIDAndUpdate(cid, data);

            if (!cart) {
                throw new CustomError(ErrorCodes.CART_NOT_FOUND.message, ErrorCodes.CART_NOT_FOUND.name, ErrorCodes.CART_NOT_FOUND.code);
            }

            res.setHeader('Content-Type', 'application/json');
            res.status(200).send({ status: 'Cart updated successfully', cart });
            
        } catch (error) {
            logger.error({error})
            res.setHeader('Content-Type', 'application/json');
            res.status(error.code.status).send({ error_name: error.name, error_description: error.message, error_code: error.code });
        }
    }

    static async updateProductQuantity(req, res){
        const { cid, pid } = req.params;
        const { quantity } = req.body;
    
        try {

            if (!mongoose.Types.ObjectId.isValid(cid)) {
                throw new CustomError(ErrorCodes.INVALID_CART_ID.message, ErrorCodes.INVALID_CART_ID.name, ErrorCodes.INVALID_CART_ID.code);
            }
            
            const cart = await cartService.getCartByID(cid);

            if (!cart) {
                throw new CustomError(ErrorCodes.CART_NOT_FOUND.message, ErrorCodes.CART_NOT_FOUND.name, ErrorCodes.CART_NOT_FOUND.code);
            }

            let productToUpdate = cart.products.find(prod => prod.id_prod == pid);
    
            productToUpdate.quantity = quantity;
            await cart.save();
            
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send({ status: "OK" , productToUpdate});
    
        } catch (error) {
            logger.error({error})
            res.setHeader('Content-Type', 'application/json');
            res.status(error.code.status).send({ error_name: error.name, error_description: error.message, error_code: error.code });
        }
    }

    static async completePurchase(req, res){
        const { cid } = req.params;

        try {
            
            const cart = await cartService.getCartByIDAndPopulate(cid);

            let purchase_amount = 0
            let notPurchased = []
            

            const funcstock = async (pid, quantity) => {
                const product = await productService.getProductByID(pid);
                if(product.stock < quantity){

                    notPurchased.push({id: product._id, quantity: product.quantity})
                    
                } else {
                    product.stock -= quantity;
                    purchase_amount += product.price * quantity
                    await product.save();                    
                }
            }

            cart.products.forEach(async (product) => {
                await funcstock(product.id_prod, product.quantity);
            })

            let ticketCode = generateTicketCode()

            const ticketToAdd = {
                code: ticketCode,
                purchase_datetime: Date.now(),
                amount: purchase_amount,
                purchaser: req.user.email
            }

            await ticketService.createTicket(ticketToAdd);

            cart.products = []

            if(notPurchased.length > 0) {
                notPurchased.forEach(
                    cart.products.push()
                )
                cart.save();
            }


            res.setHeader('Content-Type', 'application/json');
            res.status(200).send({ status: "OK" , cart});

        } catch (error) {
            logger.error({error})
            res.setHeader('Content-Type', 'application/json');
            res.status(400).send({ status: `Error: ${error}` });
        }
    }
}

