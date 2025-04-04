const express = require('express');
const PM = require('./ProductManager');
const CM = require('./CartManager');

const ProductManager = new PM('./products.json');
const CartManager = new CM("./carts.json")



const app = express();
const PORT = 8080;

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

app.get('/api/products/', async (req, res) => {
    try {
        const products = await ProductManager.getProducts();
        res.status(200).json({ message: "Productos obtenidos con éxito", products });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/products/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        const foundProduct = await ProductManager.getProductById(pid);
        res.status(200).json({ message: "Producto encontrado", foundProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/products/', async (req, res) => {
    try {
        const newProductData = req.body;
        const newProduct = await ProductManager.addProduct(newProductData);
        res.status(201).json({ message: "Producto agregado con éxito", newProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

app.post('/api/products/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        const updatedData = req.body;
        const updatedProduct = await ProductManager.updateProduct(pid, updatedData);
        res.status(200).json({ message: "Producto actualizado con éxito", updatedProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

app.delete('/api/products/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        const products = await ProductManager.deleteProduct(pid);
        res.status(200).json({ message: "Producto eliminado con éxito", products });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})


app.post('/api/carts/', async (req, res) => {
    try {
        const newCart = await CartManager.addCart();
        res.status(201).json({ message: "Carrito agregado con éxito", newCart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

app.get('/api/carts/:cid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const cartProducts = await CartManager.getCartById(cid);
        res.status(200).json({ message: `Productos del carrito con id ${cid} obtenidos con éxito`, cartProducts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

app.post('/api/carts/:cid/product/:pid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const updatedCart = await CartManager.addProductToCart(cid, pid);
        res.status(200).json({ message: `Producto agregado al carrito`, updatedCart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})