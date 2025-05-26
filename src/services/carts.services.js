import { Cart } from "../models/carts.js";
import { Product } from "../models/products.js";

class CartService {

    getCarts = async () => {
        const carts = await Cart.find();
        return carts;
    }

    addCart = async (cart) => {
        const newCart = await Cart.create(cart);
        return newCart;
    }

    getCartById = async (cid) => {
        const cart = await Cart.findById(cid);
        return cart;
    }

    addProductToCart = async (cid, pid) => {
        const cart = await Cart.findById(cid);
        const product = await Product.findById(pid);
        cart.products.push(product);
        await cart.save();
        return cart;
    }
    
}

export default new CartService();