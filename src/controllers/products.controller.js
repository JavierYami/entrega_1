import productService from "../services/products.services.js";

const getProducts = async (req, res) => {
    try {
        const {limit, page, sort} = req.query;
        
        const queryObject = {};
        
        if (req.query.category) {
            queryObject.category = req.query.category;
        }
        
        if (req.query.status !== undefined) {
            queryObject.status = req.query.status === "true";
        }

        const products = await productService.getProducts(
            parseInt(limit),
            parseInt(page),
            sort,
            queryObject
        );
        
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const getProductById = async (req, res) => {
    try {
        const {pid} = req.params;
        const product = await productService.getProductById(pid);
        if (!product) {
            return res.status(404).json({message: 'Producto no encontrado'});
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}
const addProduct = async (req, res) => {
    try {
        const product = req.body;
        if (!product.title || !product.price || !product.category || !product.description || !product.stock || !product.code || !product.status) {
            return res.status(400).json({message: 'Faltan campos por completar'});
        }
        if (product.price <= 0 || product.stock <= 0) {
            return res.status(400).json({message: 'El precio y el stock deben ser mayores a 0'});
        }
        if (isNaN(product.price) || isNaN(product.stock)) {
            return res.status(400).json({message: 'El precio y el stock deben ser números'});
        }
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
        if (product.price <= 0 || product.stock <= 0) {
            return res.status(400).json({message: 'El precio y el stock deben ser mayores a 0'});
        }
        if (isNaN(product.price) || isNaN(product.stock)) {
            return res.status(400).json({message: 'El precio y el stock deben ser números'});
        }
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
