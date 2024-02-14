import { Router } from "express";

import { ProductManagerMongo } from "../controllers/database/ProductManagerMongo.js";

import { authAdmin } from "../utils.js";

const routerProducts = Router();

routerProducts.get('/', ProductManagerMongo.getProducts)

routerProducts.get('/:pid', ProductManagerMongo.getProductByID)

routerProducts.post('/', authAdmin, ProductManagerMongo.createProduct)

routerProducts.put('/:pid', authAdmin, ProductManagerMongo.updateProduct)

routerProducts.delete('/:pid', authAdmin, ProductManagerMongo.deleteProduct)

export default routerProducts