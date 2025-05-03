const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const PM = require('./classes/ProductManager');
const CM = require('./classes/CartManager');
const exphbs = require('express-handlebars');
const path = require('path');
const fs = require('fs')


const ProductManager = new PM('./db/products.json');
const CartManager = new CM("./db/carts.json")

const dbFolder = path.join(__dirname, '..', 'db');

if (!fs.existsSync(dbFolder)) {
    fs.mkdirSync(dbFolder, { recursive: true });
}

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);


const PORT = 8080;

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

httpServer.listen(PORT, () => {
    console.log('Servidor escuchando en puerto', PORT);
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

app.put('/api/products/:pid', async (req, res) => {
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

//HandleBars

app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

app.get('/home', async (req, res) => {
    const products = await ProductManager.getProducts();
    res.render('home', { products });
});


io.on('connection', async (socket) => {
    const products = await ProductManager.getProducts();
    socket.emit('product-list', products);

    socket.on('new-product', async (data) => {

        const newProduct = {
            ...data,
            description: data.description || "Sin descripción",
            code: data.code || Math.random().toString(36).substring(2, 10),
            price: Number(data.price) || 0,
            status: true,
            stock: data.stock || 10,
            category: data.category || "General",
            thumbnails: []
        };
        await ProductManager.addProduct(newProduct);
        const updatedProducts = await ProductManager.getProducts();
        io.emit('product-list', updatedProducts);
    });

    socket.on('delete-product', async (id) => {
        await ProductManager.deleteProduct(id);
        const updatedProducts = await ProductManager.getProducts();
        io.emit('product-list', updatedProducts);
    });

});


