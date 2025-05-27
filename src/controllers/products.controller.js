import productService from "../services/products.services.js";

const getProducts = async (req, res) => {
    try {
        const {limit, page, sort, query} = req.query;
        const products = await productService.getProducts(limit, page, sort, query);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const getProductById = async (req, res) => {
    try {
        const {pid} = req.params;
        const product = await productService.getProductById(pid);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}
const addProduct = async (req, res) => {
    try {
        const product = req.body;
        const newProduct = await productService.addProduct(product);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const updateProduct = async (req, res) => {
    try {
        const {pid} = req.params;
        const product = req.body;
        const updatedProduct = await productService.updateProduct(pid, product);
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const deleteProduct = async (req, res) => {
    try {
        const {pid} = req.params;
        const deletedProduct = await productService.deleteProduct(pid);
        res.status(200).json(deletedProduct);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export {getProducts, addProduct, updateProduct, deleteProduct, getProductById};
