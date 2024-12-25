import { createClient } from "redis";

const connectRedis = async() => {
    try {
        const client = createClient({
            username: 'default',
            password: 'dymjurgAtbevW5bJuTfe90DgfTrUZJCa',
            socket: {
                host: 'redis-13100.crce178.ap-east-1-1.ec2.redns.redis-cloud.com',
                port: 13100
            }
        })

        await client.connect();
        
        return client;
    } catch (error) {
        console.log(`Error Occured while connecting to redis`, error);
    }
}

export default connectRedis;