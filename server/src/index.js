import connectDB from './database/index.js';
import dotenv from 'dotenv';
import app from './app.js';
import {Server} from 'socket.io';
import {createServer} from 'http';
import { createClient } from 'redis';

dotenv.config({
    path: './.env'
})

const client = createClient({
    username: 'default',
    password: 'dymjurgAtbevW5bJuTfe90DgfTrUZJCa',
    socket: {
        host: 'redis-13100.crce178.ap-east-1-1.ec2.redns.redis-cloud.com',
        port: 13100
    }
});

client.on('error', err => console.log('Redis Client Error', err));
await client.connect();
await client.set('foo', 'bar');
const result = await client.get('foo');
console.log(result)

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