import connectDB from './database/index.js';
import dotenv from 'dotenv';
import app from './app.js';
import { Server } from 'socket.io';
import { createServer } from 'http';
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

const connections = io.of('/videoCall')

connections.on('connection', (socket) => {
    console.log('User connected with Id:', socket.id);
    socket.emit('connection-success', { socketId: socket.id });

    socket.on('disconnect', async () => {
        try {
            console.log('Peer disconnected:', socket.id);

            const peerData = JSON.parse(await client.hGet(`peers:${socket.id}`, 'details') || '{}');
            const roomName = peerData.roomName;

            const roomPeers = JSON.parse(await client.hGet(`room:${roomName}`, 'peers') || '[]');
            const updatedPeers = roomPeers.filter(peerId => peerId !== socket.id);
            await client.hSet(`room:${roomName}`, 'peers', JSON.stringify(updatedPeers));

            await client.del(`peers:${socket.id}`);
            await client.del(`transports:${socket.id}`);
            await client.del(`producers:${socket.id}`);
            await client.del(`consumers:${socket.id}`);
        } catch (error) {
            console.error('Error handling disconnect:', error);
        }
    });

    socket.on('joinRoom', async ({ roomName }, callback) => {
        const router1 = await createRoom(roomName, socket.id);

        const peerDetails = {
            name: '',
            isAdmin: false,
            roomName
        };

        await client.hSet(`peers:${socket.id}`, 'details', JSON.stringify(peerDetails));

        // Add the peer to the room in Redis
        const roomPeers = JSON.parse(await client.hGet(`room:${roomName}`, 'peers') || '[]');
        if (!roomPeers.includes(socket.id)) {
            roomPeers.push(socket.id);
            await client.hSet(`room:${roomName}`, 'peers', JSON.stringify(roomPeers));
        }

        // Initialize separate lists for transports, producers, and consumers
        await client.del(`transports:${socket.id}`);
        await client.del(`producers:${socket.id}`);
        await client.del(`consumers:${socket.id}`);

        // Send RTP capabilities to the client
        callback({ rtpCapabilities: router1.rtpCapabilities });
    });

    const createRoom = async (roomName, socketId) => {
        const roomKey = `room:${roomName}`;
        let router1;
        let peers = [];

        const roomData = await client.hGetAll(roomKey);

        if (Object.keys(roomData).length > 0) {
            router1 = roomData.router;
            peers = JSON.parse(roomData.peers || '[]');
        } else {
            router1 = await worker.createRouter({ mediaCodecs });

            await client.hSet(roomKey, {
                router: router1.id,
                peers: JSON.stringify([])
            });
        }

        if (!peers.includes(socketId)) {
            peers.push(socketId);
            await client.hSet(roomKey, 'peers', JSON.stringify(peers));
        }

        return router1;
    };

    socket.on('createWebRtcTransport', async ({ consumer }, callback) => {
        try {
            const peerDetails = JSON.parse(await client.hGet(`peers:${socket.id}`, 'details') || '{}');
            const roomName = peerDetails.roomName;

            const roomData = await client.hGetAll(`room:${roomName}`);
            if (!roomData || !roomData.router) {
                throw new Error(`Room ${roomName} or router not found`);
            }

            const router = roomData.router;
            if (!router) {
                throw new Error(`Router with ID ${roomData.router} not found`);
            }

            const transport = await createWebRtcTransport(router);

            callback({
                params: {
                    id: transport.id,
                    iceParameters: transport.iceParameters,
                    iceCandidates: transport.iceCandidates,
                    dtlsParameters: transport.dtlsParameters
                }
            });

            await addTransport(socket.id, transport, roomName, consumer);

        } catch (error) {
            console.error('Error creating WebRTC Transport:', error);
            callback({ params: { error: error.message } });
        }
    });

    const addTransport = async (socketId, transport, roomName, consumer) => {
        const transportData = JSON.stringify({ transport, roomName, consumer });

        await client.rPush(`transports:${socketId}`, transportData);

        const peerData = JSON.parse(await client.hGet(`peers:${socketId}`, 'details') || '{}');
        peerData.transports = peerData.transports || [];
        peerData.transports.push(transport.id);
        await client.hSet(`peers:${socketId}`, 'details', JSON.stringify(peerData));
    };

    const addProducer = async (socketId, producer, roomName) => {
        const producerData = JSON.stringify({ producer, roomName });

        await client.rpush(`producers:${socketId}`, producerData);

        const peerData = JSON.parse(await client.hGet(`peers:${socketId}`, 'details') || '{}');
        peerData.producers = peerData.producers || [];
        peerData.producers.push(producer.id);
        await client.hSet(`peers:${socketId}`, 'details', JSON.stringify(peerData));
    };

    const addConsumer = async (socketId, consumer, roomName) => {
        const consumerData = JSON.stringify({ consumer, roomName });

        await client.rPush(`consumers:${socketId}`, consumerData);

        const peerData = JSON.parse(await client.hGet(`peers:${socketId}`, 'details') || '{}');
        peerData.consumers = peerData.consumers || [];
        peerData.consumers.push(consumer.id);
        await client.hSet(`peers:${socketId}`, 'details', JSON.stringify(peerData));
    };

    socket.on('getProducers', async (callback) => {
        try {
            const peerData = JSON.parse(await client.hGet(`peers:${socket.id}`, 'details') || '{}');
            const roomName = peerData.roomName;

            const allProducers = await client.lRange(`producers:${socket.id}`, 0, -1);
            const parsedProducers = allProducers.map((producer) => JSON.parse(producer));

            const producersList = parsedProducers
                .filter((p) => p.roomName === roomName && p.socketId !== socket.id)
                .map((p) => p.producer.id);

            // Return the list of producer IDs
            callback(producersList);
        } catch (error) {
            console.error('Error occurred while fetching producers:', error);
        }
    });

    const informConsumers = async (roomName, socketId, producerId) => {
        try {
            console.log(`Informing consumers of new producer in room: ${roomName}, socketId: ${socketId}, producerId: ${producerId}`);

            const roomPeers = JSON.parse(await client.hGet(`room:${roomName}`, 'peers') || '[]');

            for (const consumerSocketId of roomPeers) {
                if (consumerSocketId !== socketId) {
                    const consumerData = JSON.parse(await client.hGet(`peers:${consumerSocketId}`, 'details') || '{}');

                    if (consumerData) {
                        const consumerSocket = io.sockets.sockets.get(consumerSocketId);

                        if (consumerSocket) {
                            consumerSocket.emit('new-producer', { producerId });
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error informing consumers:', error);
        }
    };

    const getTransport = async (socketId) => {
        const transportDataList = await client.lRange(`transports:${socketId}`, 0, -1);

        const producerTransport = transportDataList
            .map(transportData => JSON.parse(transportData))
            .find(t => t.socketId === socketId && !t.consumer);

        if (!producerTransport) {
            throw new Error("No matching transport found");
        }

        return producerTransport.transport;
    };

    const getProducers = async (socketId) => {
        const producerDataList = await client.lRange(`producers:${socketId}`, 0, -1);

        const producers = producerDataList.map(producerData => JSON.parse(producerData));

        return producers;
    };

    const getConsumer = async (serverConsumerId) => {
        const consumerDataList = await client.lRange(`consumers:${serverConsumerId}`, 0, -1);

        const consumerData = consumerDataList
            .map(data => JSON.parse(data))
            .find(c => c.consumer.id === serverConsumerId);

        if (!consumerData) {
            throw new Error("No matching consumer found");
        }

        return consumerData.consumer;
    };

    const getConsumerTransport = async (serverConsumerTransportId) => {
        const transportDataList = await client.lRange(`transports:${socket.id}`, 0, -1);

        const consumerTransport = transportDataList
            .map(transportData => JSON.parse(transportData))
            .find(t => t.transport.id === serverConsumerTransportId && t.consumer);

        if (!consumerTransport) {
            throw new Error("No matching consumer transport found");
        }

        return consumerTransport.transport;
    };

    const getTransportsForSocket = async (socketId) => {
        const transportDataList = await client.lRange(`transports:${socketId}`, 0, -1);
        return transportDataList.map(data => JSON.parse(data));
    };

    socket.on('transport-connect', ({ dtlsParameters }) => {
        console.log('DTLS PARAMS... ', dtlsParameters);
        getTransport(socket.id).connect({ dtlsParameters });
    })

    socket.on('transport-produce', async ({ kind, rtpParameters, appData }, callback) => {
        try {
            const producer = await getTransport(socket.id).produce({
                kind,
                rtpParameters
            });

            const peerData = JSON.parse(await client.hGet(`peers:${socket.id}`, 'details') || '{}');
            const roomName = peerData.roomName;

            await addProducer(socket.id, producer, roomName);

            const producers = await getProducers(socket.id);

            await informConsumers(roomName, socket.id, producer.id);

            producer.on('transportclose', () => {
                console.log('transport for this producer closed');
                producer.close();
            });

            callback({
                id: producer.id,
                producersExist: producers.length > 1
            });
        } catch (error) {
            console.log('Error Occurred', error);
        }
    });

    socket.on('transport-recv-connect', async ({ dtlsParameters, serverConsumerTransportId }) => {
        try {
            console.log(`DTLS PARAMS:`, dtlsParameters);

            const consumerTransport = await getConsumerTransport(serverConsumerTransportId);

            await consumerTransport.connect({ dtlsParameters });

            console.log(`Consumer transport connected successfully.`);
        } catch (error) {
            console.log('Error occurred while connecting consumer transport:', error.message);
        }
    });

    socket.on('consume', async ({ rtpCapabilities, remoteProducerId, serverConsumerTransportId }, callback) => {
        try {
            const peerData = JSON.parse(await client.hGet(`peers:${socket.id}`, 'details') || '{}');
            const roomName = peerData.roomName;

            const roomData = await client.hGetAll(`room:${roomName}`);
            if (!roomData || !roomData.router) {
                throw new Error(`Room ${roomName} or router not found`);
            }

            const router = await worker.getRouterById(roomData.router);
            if (!router) {
                throw new Error(`Router with ID ${roomData.router} not found`);
            }

            const transports = await getTransportsForSocket(socket.id);
            const consumers = await getConsumer(socket.id);

            let consumerTransportData = transports.find(t => t.consumer && t.transport.id === serverConsumerTransportId);
            if (!consumerTransportData) {
                return callback({ error: 'No matching transport found' });
            }
            const consumerTransport = consumerTransportData.transport;

            if (router.canConsume({ producerId: remoteProducerId, rtpCapabilities })) {
                const consumer = await consumerTransport.consume({
                    producerId: remoteProducerId,
                    rtpCapabilities,
                    paused: true
                });

                consumer.on('transportclose', () => {
                    console.log('Transport closed from consumer');
                });

                consumer.on('producerclose', () => {
                    console.log('Producer of consumer closed');
                    socket.emit('producer-closed', { remoteProducerId });

                    consumerTransport.close();
                    transports = transports.filter(t => t.transport.id !== consumerTransport.id);
                    consumer.close();
                    consumers = consumers.filter(c => c.consumer.id !== consumer.id);
                });

                await addConsumer(consumer, roomName);

                const params = {
                    id: consumer.id,
                    producerId: remoteProducerId,
                    kind: consumer.kind,
                    rtpParameters: consumer.rtpParameters,
                    serverConsumerId: consumer.id
                };

                callback({ params });
            } else {
                callback({ error: 'Router cannot consume from the producer' });
            }
        } catch (error) {
            console.log('Error:', error.message);
            callback({
                params: {
                    error: error.message
                }
            });
        }
    });

    socket.on('consumer-resume', async ({ serverConsumerId }) => {
        try {
            console.log('Consumer resume');

            const consumer = await getConsumer(serverConsumerId);

            await consumer.resume();

            console.log(`Consumer ${serverConsumerId} resumed successfully.`);
        } catch (error) {
            console.log('Error occurred while resuming consumer:', error.message);
        }
    });

})

connections.on('connection-error', (error) => {
    console.log('Connection Error', error.message);
})

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