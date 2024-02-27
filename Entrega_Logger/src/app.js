import __dirname from './path.js';
import path from 'path';

import express from 'express';
import sessions from 'express-session';
import MongoStore from 'connect-mongo';

import { engine } from 'express-handlebars';

import { Server } from 'socket.io';

import Product from './dao/models/products.models.js';
import Message from './dao/models/messages.models.js';

import routerProducts from './routes/products.routes.js';
import routerCarts from './routes/carts.routes.js';
import routerSessions from './routes/sessions.routes.js';
import viewsRouter from './routes/views.routes.js';

import { initializatePassport } from './config/passportConfig.js';
import passport from 'passport';

import cookieParser from 'cookie-parser';

import { configENV } from "./config/configDotEnv.js"
import { SingletonDB } from './config/SingletonDB.js';
import { authUser, addLogger, logger } from './utils.js';


const app = express();
const PORT = configENV.PORT;

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessions({
    secret: configENV.SECRET_CODERH_PASS,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: configENV.MONGO_URL,
        mongoOptions: {
            dbName: 'test'
        },
        ttl: 3600
    })
}));

initializatePassport();
app.use(passport.initialize());
app.use(passport.session());
app.use(addLogger);

app.use(express.static(path.join(__dirname, '/public')));

app.use('/api/products', routerProducts);
app.use('/api/carts', routerCarts);
app.use('/api/sessions', routerSessions);
app.use('/', viewsRouter);

const server = app.listen(PORT, () => {
    logger.info(`Server on Port: ${PORT}`);
    // console.log(`Server on Port: ${PORT}`);
})

SingletonDB.connectDB(configENV.MONGO_URL);

const io = new Server(server);
io.on('connection', socket => {
    logger.info('Conexión con Socket.io');
    // console.log('Conexion con Socket.io');

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
    
    socket.on('sentMessage', authUser, async info => {
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