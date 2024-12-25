import connectDB from './database/index.js';
import dotenv from 'dotenv';
import app from './app.js';
import { Server } from 'socket.io';
import { createServer } from 'http';
import connectRedis from './database/redis.js';
import setupChat from './service/chat.service.js';
import setVideoCall, { createWorker } from './service/videoCall.service.js';

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
setVideoCall(io);

const client = await connectRedis();

connectDB()
    .then(() => {
        server.listen(process.env.PORT, async () => {
            console.log(`Server is running on port ${process.env.PORT}`);
            await createWorker();
        })
    })
    .catch((err) => {
        console.log("MongoDB connection failed !!!", err);
    })