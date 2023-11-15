import __dirname from './path.js';
import path from 'path';

import express from 'express';

import { engine } from 'express-handlebars';

import { Server } from 'socket.io';

import ProductManager from './controllers/ProductManager.js';

import routerProducts from './routes/products.routes.js';
import routerCarts from './routes/carts.routes.js';
import viewsRouter from './routes/views.routes.js';

const app = express();

const PORT = 8080;

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '/public')));

app.use('/api/products', routerProducts);
app.use('/api/carts', routerCarts);
app.use('/', viewsRouter);

const server = app.listen(PORT, () => {
    console.log(`Server on Port: ${PORT}`);
})

const io = new Server(server);
const productManager = new ProductManager('./json/products.json');

io.on('connection', socket => {
    console.log('Conexion con Socket.io');
    
    socket.on('loadProducts', async () => {
        const products = await productManager.getProducts();
        socket.emit('sentProducts', products);
    })
    
    socket.on('addProduct', async productToAdd => { 
        // console.log(productToAdd);
        await productManager.addProduct(productToAdd);
        const products = await productManager.getProducts();
        socket.emit("sentProducts", products);
    })
    
    socket.on('productToDelete', async productIdDelete => {
        await productManager.deleteProduct(productIdDelete)
        const products = await productManager.getProducts();
        socket.emit("sentProducts", products)
    })
})