import { Router } from "express";

import { CartManagerMongo } from "../controllers/database/CartManagerMongo.js";
import { authLogged, authUser } from "../utils.js";

const routerCarts = Router();

routerCarts.post('/', authLogged, CartManagerMongo.createCart)

routerCarts.get('/:cid', CartManagerMongo.getCartByID)

routerCarts.post('/:cid/product/:pid', CartManagerMongo.pushProductToCart)

routerCarts.delete('/:cid', CartManagerMongo.cleanCart)

routerCarts.delete('/:cid/products/:pid', CartManagerMongo.deleteProductFromCart)

routerCarts.put('/:cid', CartManagerMongo.updateFullCart)

routerCarts.put('/:cid/products/:pid', CartManagerMongo.updateProductQuantity)

routerCarts.post('/:cid/purchase', CartManagerMongo.completePurchase)

export default routerCarts