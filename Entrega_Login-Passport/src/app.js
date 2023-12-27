import __dirname from './path.js';
import path from 'path';

import dbConnect from './config/databaseConect.js';

import express from 'express';
import sessions from 'express-session';
import MongoStore from 'connect-mongo';

import { engine } from 'express-handlebars';

import { Server } from 'socket.io';

import Product from './dao/models/products.models.js';
import Message from './dao/models/messages.models.js';
// import ProductManager from './controllers/ProductManager.js';

import routerProducts from './routes/products.routes.js';
import routerCarts from './routes/carts.routes.js';
import routerSessions from './routes/sessions.routes.js';
import viewsRouter from './routes/views.routes.js';

import { initializatePassport } from './config/passportConfig.js';
import passport from 'passport';

const app = express();

const PORT = 8080;

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessions({
    secret: 'coder123',
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://pozzolosanti:n76CiNr4u21GNSKJ@cluster0.adq0f1x.mongodb.net/?retryWrites=true&w=majority',
        mongoOptions: {
            dbName: 'test'
        },
        ttl: 3600
    })
}));

initializatePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, '/public')));

app.use('/api/products', routerProducts);
app.use('/api/carts', routerCarts);
app.use('/api/sessions', routerSessions);
app.use('/', viewsRouter);

const server = app.listen(PORT, () => {
    console.log(`Server on Port: ${PORT}`);
})

dbConnect();

const io = new Server(server);
// const productManager = new ProductManager('./json/products.json');

io.on('connection', socket => {
    console.log('Conexion con Socket.io');

    //Products
    socket.on('loadProducts', async () => {
        const products = await Product.find().lean();
        socket.emit('sentProducts', products);
    })
    
    socket.on('addProduct', async productToAdd => { 
        // console.log(productToAdd);
        await Product.create(productToAdd);
        const products = await Product.find().lean();
        socket.emit("sentProducts", products);
    })
    
    socket.on('productToDelete', async productIdDelete => {
        await Product.findByIdAndDelete(productIdDelete)
        const products = await Product.find().lean();
        socket.emit("sentProducts", products);
    })

    //Chat app

    socket.on('loadMessages', async () => {
        const arrayMessages = await Message.find();
        socket.emit('messages', arrayMessages)
    })
    
    socket.on('sentMessage', async info => {
        console.log(info);
        const { userEmail, message } = info;
        await Message.create({
            userEmail,
            message
        })
    
        const arrayMessages = await Message.find();
        socket.emit('messages', arrayMessages)
    })
})