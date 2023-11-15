import { Router } from "express";
import CartManager from "../controllers/CartManager.js";

const cartManager = new CartManager('./json/carts.json', './json/products.json');

const routerCarts = Router();

routerCarts.post('/', async (req, res) => {
    const status = await cartManager.createCart();
    
    if (status == true) {
        res.status(200).send({ status: 'Cart created successfully' })
    } else {
        res.status(400).send({ error: 'Error creating cart' });
    }

})

routerCarts.get('/:cid', async (req, res) => {
    const { cid } = req.params;

    const cart = await cartManager.getProductsByCart(parseInt(cid));

    if (cart) {
        res.status(200).send(cart);
    } else {
        res.status(400).send({ error: 'Cart not found' });
    }
})

routerCarts.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    const cartVerify = await cartManager.addProductToCart(parseInt(cid), parseInt(pid));

    if (cartVerify) {
        res.status(200).send({ status: 'Product added to cart successfully' })
    } else {
        res.status(400).send({ error: 'Error adding product to cart' });
    }
})

export default routerCarts