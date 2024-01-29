import Cart from "../models/carts.models.js";

export class CartsMongoDAO {
    async createCart() {
        return await Cart.create({});
    }

    async getCartByID(cid) {
        return await Cart.findById(cid).lean();
    }

    async getCartByIDAndUpdate(cid, data) {
        return await Cart.findByIdAndUpdate(cid, { $set: data }, { new: true });
    }

    async getCartByIDAndPopulate(cid) {
        return await Cart.findById(cid).populate('products.id_prod');
    }

}