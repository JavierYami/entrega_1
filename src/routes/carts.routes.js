import { Router } from "express";
import { getCarts, getCartById, addCart, addProductToCart, deleteProductFromCart, updateCart, updateProductQuantity, emptyCart} from "../controllers/carts.controller.js";

const cartRouter = Router();

cartRouter.get('/', getCarts);
cartRouter.get('/:cid', getCartById);
cartRouter.post('/', addCart);
cartRouter.post('/:cid/product/:pid', addProductToCart);
cartRouter.delete('/:cid/products/:pid', deleteProductFromCart);
cartRouter.put('/:cid', updateCart);
cartRouter.put('/:cid/products/:pid', updateProductQuantity);
cartRouter.delete('/:cid', emptyCart);

export default cartRouter;

