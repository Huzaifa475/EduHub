import connectDB from './database/index.js';
import dotenv from 'dotenv';
import app from './app.js';
import { Server } from 'socket.io';
import { createServer } from 'http';
import setupChat from './service/chat.service.js';

dotenv.config({
    path: './.env'
})

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        transports: ['websocket'],
        credentials: true
    }
})

setupChat(io);

connectDB()
    .then(() => {
        server.listen(process.env.PORT, async () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.log("MongoDB connection failed !!!", err);
    })