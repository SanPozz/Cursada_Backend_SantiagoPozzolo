import { Router } from "express";
import Cart from "../dao/models/carts.models.js";
import Product from "../dao/models/products.models.js";

const routerCarts = Router();

routerCarts.post('/', async (req, res) => {
    try {

        if(!req.cookies.cart){
            const newCart = await Cart.create({});
            res.cookie('cart', newCart._id, {maxAge: 604800000, httpOnly: true});
            res.status(200).send({ status: 'Cart created successfully'});
        } else {
            res.status(400).send({ status: 'Cart already exists' });
        }

    } catch (error) {
        res.status(400).send({ status: 'Error creating cart: ' + error });
    }
})

routerCarts.get('/:cid', async (req, res) => {
    const { cid } = req.params;

    try {

        const cart = await Cart.findById(cid).populate('products.id_prod');

        if (cart) {
            res.status(200).send(cart);
        } else {
            res.status(400).send({ error: 'Cart not found' });
        }

    } catch (error) {
        
        res.status(400).send({ error: 'Error consulting database' + error});

    }

})

routerCarts.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    try {

        const cart = await Cart.findById(cid);
        const product = await Product.findById(pid);

        if (!cart) {
            res.status(400).send({ error: 'Cart not found' });
            return
        }

        if (!product) {
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

        res.status(200).send({ status: 'Product added to cart successfully' });

    } catch (error) {

        res.status(400).send({ error: 'Error adding product to cart: ' + error});
    }

})

routerCarts.delete('/:cid', async (req, res) => {
    const { cid } = req.params;

    try {

        const cart = await Cart.findById(cid);
        cart.products = [];
        await cart.save();

        res.status(200).send({ status: 'Cart cleaned successfully' });
        
    } catch (error) {
        res.status(400).send({ error: 'Error deleting cart: ' + error});
    }
})

routerCarts.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    try {

        const cart = await cartModel.findById(cid);

        if (cart) {
            const productsFiltered = cart.products.filter(prod => prod.id_prod != pid);
            cart.products = productsFiltered;
            await cart.save()
            res.status(200).send({ status: `Product with ${pid} was deleted` })
        }

    } catch (error) {
        res.status(400).send({ error: 'Error deleting product: ' + error});
    }
})

routerCarts.put('/:cid' , async (req, res) => {

    const { cid } = req.params;
    const { data } = req.body;
    try {

        const cart = await Cart.findByIdAndUpdate(cid, { $set: data }, { new: true });
        res.status(200).send({ status: 'Cart updated successfully', cart });
        
    } catch (error) {
        res.status(400).send({ error: 'Error updating cart: ' + error});
    }
})

routerCarts.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        
        const cart = await cartModel.findById(cid);
        let productToUpdate = cart.products.find(prod => prod.id_prod == pid);

        productToUpdate.quantity = quantity;
        await cart.save();
        res.status(200).send({ status: "OK" , productToUpdate});

    } catch (error) {
        res.status(400).send({ status: `Error: ${error}` });
    }
})

export default routerCarts