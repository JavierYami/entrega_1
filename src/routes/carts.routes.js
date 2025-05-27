import { Router } from "express";
import { getCarts, getCartById, addCart, addProductToCart, deleteProductFromCart, updateCart, updateProductQuantity} from "../controllers/carts.controller.js";

const cartRouter = Router();

cartRouter.get('/', getCarts);
cartRouter.get('/:cid', getCartById);
cartRouter.post('/', addCart);
cartRouter.post('/:cid/product/:pid', addProductToCart);
cartRouter.delete('/:cid/products/:pid', deleteProductFromCart);
cartRouter.put('/:cid', updateCart);
cartRouter.put('/:cid/products/:pid', updateProductQuantity);

export default cartRouter;

