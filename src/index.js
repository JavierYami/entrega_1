import express from 'express';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import exphbs from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import productRouter from './routes/products.routes.js';
import cartRouter from './routes/carts.routes.js';
import productService from './services/products.services.js';

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

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

httpServer.listen(PORT, () => {
    console.log('Servidor escuchando en puerto', PORT);
});

const connectMongoDB = async () => {
    try{
        await mongoose.connect('mongodb+srv://javieryami1:QdtYnLDbwBJKJK7Z@coder.1bvlaqj.mongodb.net/proyecto');
        console.log("MongoDB conectado con éxito");
    }
    catch (error) {
        console.log(error)
    }
} 

connectMongoDB();

//HandleBars

app.get('/realtimeproducts', async (req, res) => {
    const allProducts = await productService.getAllProducts();
    const categories = [...new Set(allProducts.map(p => p.category))];
    const defaultCartId = '6835067560834d8f12ab29f4';
    res.render('realTimeProducts', { categories, cartId: defaultCartId });
});

app.get('/home', async (req, res) => {
    const products = await productService.getProducts();
    res.render('home', { products });
});

app.get('/products/:pid', async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.pid);
        if (!product) {
            return res.status(404).render('error', { message: 'Producto no encontrado' });
        }
        const defaultCartId = '6835067560834d8f12ab29f4';
        res.render('product', { product, cartId: defaultCartId });
    } catch (error) {
        res.status(500).render('error', { message: 'Error al cargar el producto' });
    }
});

io.on('connection', async (socket) => {
    const products = await productService.getProducts();
    socket.emit('product-list', products);

    socket.on('request-products', async (data) => {
        const { page = 1, category = '', sort = '' } = data;
        const query = category ? { category } : {};
        const products = await productService.getProducts(10, page, sort, query);
        socket.emit('product-list', products);
    });

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
        await productService.addProduct(newProduct);
        const updatedProducts = await productService.getProducts();
        io.emit('product-list', updatedProducts);
    });

    socket.on('delete-product', async (id) => {
        await productService.deleteProduct(id);
        const updatedProducts = await productService.getProducts();
        io.emit('product-list', updatedProducts);
    });
});


