import { Router } from "express";

import { CartManagerMongo } from "../controllers/database/CartManagerMongo.js";

const routerCarts = Router();

routerCarts.post('/', CartManagerMongo.createCart)

routerCarts.get('/:cid', CartManagerMongo.getCartByID)

routerCarts.post('/:cid/product/:pid', CartManagerMongo.pushProductToCart)

routerCarts.delete('/:cid', CartManagerMongo.cleanCart)

routerCarts.delete('/:cid/products/:pid', CartManagerMongo.deleteProductFromCart)

routerCarts.put('/:cid', CartManagerMongo.updateFullCart)

routerCarts.put('/:cid/products/:pid', CartManagerMongo.updateProductQuantity)

export default routerCarts