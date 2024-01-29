import { Router } from "express";

import { ProductManagerMongo } from "../controllers/database/ProductManagerMongo.js";

const routerProducts = Router();

routerProducts.get('/', ProductManagerMongo.getProducts)

routerProducts.get('/:pid', ProductManagerMongo.getProductByID)

routerProducts.post('/', ProductManagerMongo.createProduct)

routerProducts.put('/:pid', ProductManagerMongo.updateProduct)

routerProducts.delete('/:pid', ProductManagerMongo.deleteProduct)

export default routerProducts