import { Router } from "express";
import { getCarts, getCartById, addCart, addProductToCart } from "../controllers/carts.controller.js";

const cartRouter = Router();

cartRouter.get('/', getCarts);
cartRouter.get('/:cid', getCartById);
cartRouter.post('/', addCart);
cartRouter.post('/:cid/product/:pid', addProductToCart);

export default cartRouter;

