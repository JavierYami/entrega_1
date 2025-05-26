import cartService from "../services/carts.services.js";

const getCarts = async (req, res) => {
    try {
        const carts = await cartService.getCarts();
        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const getCartById = async (req, res) => {
    try {
        const {cid} = req.params;
        const cart = await cartService.getCartById(cid);
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const addCart = async (req, res) => {
    try {
        const cart = req.body;
        const newCart = await cartService.addCart(cart);
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const addProductToCart = async (req, res) => {
    try {
        const {cid, pid} = req.params;
        const cart = await cartService.addProductToCart(cid, pid);
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export {getCarts, addCart, addProductToCart, getCartById};
