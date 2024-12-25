import { createClient } from "redis";

const connectRedis = async() => {
    try {
        const client = createClient({
            username: process.env.REDIS_USERNAME,
            password: process.env.REDIS_PASSWORD,
            socket: {
                host: process.env.REDIS_HOST,
                port: process.env.REDIS_PORT
            }
        })

        await client.connect();
        
        return client;
    } catch (error) {
        console.log(`Error Occured while connecting to redis`, error);
    }
}

export default connectRedis;