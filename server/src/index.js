import connectDB from './database/index.js';
import dotenv from 'dotenv';
import app from './app.js';
import {Server} from 'socket.io';
import {createServer} from 'http';

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

connectDB()
    .then(() => {
        server.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.log("MongoDB connection failed !!!", err);
    })

export default io;