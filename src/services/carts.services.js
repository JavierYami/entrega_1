import { Cart } from "../models/carts.js";
import { Product } from "../models/products.js";

class CartService {

    getCarts = async () => {
        const carts = await Cart.find().populate('products.product');
        return carts;
    }

    addCart = async (cart) => {
        const newCart = await Cart.create(cart);
        return newCart;
    }

    getCartById = async (cid) => {
        const cart = await Cart.findById(cid).populate('products.product');
        if (!cart) throw new Error('Carrito no encontrado');
        return cart;
    }

    addProductToCart = async (cid, pid) => {
        const cart = await Cart.findById(cid);
        if (!cart) throw new Error('Carrito no encontrado');

        const product = await Product.findById(pid);
        if (!product) throw new Error('Producto no encontrado');

        const productIndex = cart.products.findIndex(
            (item) => item.product.toString() === pid.toString()
        );

        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        await cart.save();
        return await Cart.findById(cid).populate('products.product');
    }
    
}

export default new CartService();