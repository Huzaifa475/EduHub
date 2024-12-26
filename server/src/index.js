import connectDB from './database/index.js';
import dotenv from 'dotenv';
import app from './app.js';
import { Server } from 'socket.io';
import { createServer } from 'http';
import setupChat from './service/chat.service.js';
import mediasoup from "mediasoup";

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

const connections = io.of('/videoCall')

const mediaCodecs = [
    {
        kind: 'audio',
        mimeType: 'audio/opus',
        clockRate: 48000,
        channels: 2
    },
    {
        kind: 'video',
        mimeType: 'video/H264',
        clockRate: 90000,
        parameters: {
            'level-asymmetry-allowed': 1,
            'packetization-mode': 1,
            'profile-level-id': '42e01f'
        }
    }
];

let worker;
let rooms = {};
let peers = {};
let transports = [];
let producers = [];
let consumers = [];

export const createWorker = async () => {
    worker = await mediasoup.createWorker({
        rtcMinPort: 2000,
        rtcMaxPort: 4000
    });

    console.log(`worker pid ${worker.pid}`);

    worker.on('died', (error) => {
        console.error('mediasoup worker has died');
        setTimeout(() => process.exit(1), 2000);
    });

    return worker;
};

const createWebRtcTransport = async (router) => {
    return new Promise(async (resolve, reject) => {
        try {
            const webRtcTransportOptions = {
                listenIps: [{ ip: '127.0.0.1', announcedIp: null }],
                enableUdp: true,
                enableTcp: true,
                preferUdp: true,
                minPort: 30000,
                maxPort: 60000,
            };

            const transport = await router.createWebRtcTransport(webRtcTransportOptions);

            transport.on('dtlsstatechange', (dtlsState) => {
                if (dtlsState === 'closed') {
                    transport.close();
                }
            });

            transport.on('close', () => {
                transport.close();
                console.log('transport closed');
            });

            resolve(transport);
        } catch (error) {
            reject(error);
        }
    })
};

connections.on('connection', async socket => {
    console.log(`Client connected: ${socket.id}`);
    socket.emit('connection-success', { socketId: socket.id });

    const removeItems = (items, socketId, type) => {
        items.forEach(item => {
            if (item.socketId === socket.id) {
                item[type].close();
            }
        })

        items = items.filter(item => item.socketId !== socket.id);

        return items;
    }

    socket.on('disconnect', () => {
        console.log('peer disconnected');

        consumers = removeItems(consumers, socket.id, 'consumer');
        producers = removeItems(producers, socket.id, 'producer');
        transports = removeItems(transports, socket.id, 'transport');

        let roomName
        try {
            roomName = peers[socket.id].roomName;
        } catch (error) {
            console.log(`some problem with the room name`);
        }

        delete peers[socket.id];

        try {
            rooms[roomName] = {
                router: rooms[roomName].router,
                peers: rooms[roomName].peers.filter(socketId => socketId !== socket.id)
            }
        } catch (error) {
            console.log(`some problem with the room name`);
        }
    });

    socket.on('joinRoom', async ({ roomName }, callback) => {
        console.log('RoomName is', roomName);
        
        const router1 = await createRoom(roomName, socket.id);

        peers[socket.id] = {
            socket,
            roomName,
            transports: [],
            producers: [],
            consumers: [],
            peerDetails: {
                name: '',
                isAdmin: false
            }
        }

        const rtpCapabilities = router1.rtpCapabilities;

        callback({ rtpCapabilities })
    });

    const createRoom = async (roomName, socketId) => {
        let router1
        let peers = []
        if (rooms[roomName]) {
            router1 = rooms[roomName].router;
            peers = rooms[roomName].peers || [];
        }
        else {
            router1 = await worker.createRouter({ mediaCodecs });
        }

        console.log('Router created with id:', router1.id);
        console.log('Peers:', peers.length);

        rooms[roomName] = {
            router: router1,
            peers: [...peers, socketId]
        }

        return router1
    }

    socket.on('createWebRtcTransport', async ({ consumer }, callback) => {
        try {
            const roomName = peers[socket.id].roomName;
            const router = rooms[roomName].router;
            createWebRtcTransport(router).then(
                transport => {
                    callback({
                        params: {
                            id: transport.id,
                            iceParameters: transport.iceParameters,
                            iceCandidates: transport.iceCandidates,
                            dtlsParameters: transport.dtlsParameters
                        }
                    })

                    addTransport(transport, roomName, consumer);
                },
                error => {
                    callback({ params: { error: error.message } });
                }
            );
        } catch (error) {
            console.error('Error creating WebRTC Transport:', error);
        }
    });

    const addTransport = (transport, roomName, consumer) => {

        transports = [
            ...transports,
            {
                socketId: socket.id,
                transport,
                roomName,
                consumer
            }
        ]

        peers[socket.id] = {
            ...peers[socket.id],
            transports: [
                ...peers[socket.id].transports,
                transport.id
            ]
        }
    }

    const addProducer = (producer, roomName) => {
        producers = [
            ...producers,
            {
                socketId: socket.id,
                producer,
                roomName
            }
        ]

        peers[socket.id] = {
            ...peers[socket.id],
            producers: [
                ...peers[socket.id].producers,
                producer.id
            ]
        }
    }

    const addConsumer = (consumer, roomName) => {
        consumers = [
            ...consumers,
            {
                socketId: socket.id,
                consumer,
                roomName
            }
        ]

        peers[socket.id] = {
            ...peers[socket.id],
            consumers: [
                ...peers[socket.id].consumers,
                consumer.id
            ]
        }
    }

    socket.on('getProducers', callback => {
        const roomName = peers[socket.id].roomName;

        let producersList = []

        producers.forEach(p => {
            if (p.roomName === roomName && p.socketId !== socket.id) {
                producersList = [...producersList, p.producer.id]
            }
        })

        callback(producersList)
    })

    const informConsumers = (roomName, socketId, producerId) => {
        console.log(`Informing consumers of new producer ${roomName} ${socketId} ${producerId}`);

        producers.forEach(p => {
            if (p.roomName === roomName && p.socketId !== socketId) {
                const producerSocket = peers[p.socketId].socket;

                producerSocket.emit('new-producer', { producerId });
            }
        })
    }

    const getTransport = (socketId) => {
        const [producerTransport] = transports.filter(t => t.socketId === socketId && !t.consumer);
        return producerTransport.transport;
    }

    socket.on('transport-connect', ({ dtlsParameters }) => {
        console.log('DTLS PARAMS... ', dtlsParameters);
        getTransport(socket.id).connect({ dtlsParameters });
    })

    socket.on('transport-produce', async ({ kind, rtpParameters, appData }, callback) => {
        const producer = await getTransport(socket.id).produce({
            kind,
            rtpParameters
        })

        const { roomName } = peers[socket.id];

        addProducer(producer, roomName);

        informConsumers(roomName, socket.id, producer.id);

        producer.on('transportclose', () => {
            console.log('transport for this producer closed');
            producer.close()
        })

        callback({
            id: producer.id,
            producersExist: producers.length > 1 ? true : false
        })
    })

    socket.on('transport-recv-connect', async ({ dtlsParameters, serverConsumerTransportId }) => {
        try {
            console.log(`DTLS PARAMS:`, dtlsParameters);
            const consumerTransport = transports.find(t => t.transport.id === serverConsumerTransportId && t.consumer).transport;
            await consumerTransport.connect({ dtlsParameters })
        } catch (error) {
            console.log(error.message);
        }
    })

    socket.on('consume', async ({ rtpCapabilities, remoteProducerId, serverConsumerTransportId }, callback) => {
        try {

            const roomName = peers[socket.id].roomName;

            const router = rooms[roomName].router;

            let consumerTransport = transports.find(t => t.consumer && t.transport.id === serverConsumerTransportId).transport;
            if (router.canConsume({
                producerId: remoteProducerId,
                rtpCapabilities
            })) {
                const consumer = await consumerTransport.consume({
                    producerId: remoteProducerId,
                    rtpCapabilities,
                    paused: true
                })

                consumer.on('transportclose', () => {
                    console.log('transport close from consumer');
                })

                consumer.on('producerclose', () => {
                    console.log('poroducer of consumer closed');
                    socket.emit('producer-closed', { remoteProducerId });

                    consumerTransport.close([]);
                    transports = transports.filter(t => t.transport.id !== consumerTransport.id);
                    consumer.close();
                    consumers = consumers.filter(c => c.consumer.id !== consumer.id);
                })

                addConsumer(consumer, roomName);

                const params = {
                    id: consumer.id,
                    producerId: remoteProducerId,
                    kind: consumer.kind,
                    rtpParameters: consumer.rtpParameters,
                    serverConsumerId: consumer.id
                }

                callback({ params })
            }
        } catch (error) {
            console.log(error.message);
            callback({
                params: {
                    error: error
                }
            })
        }
    })

    socket.on('consumer-resume', async ({ serverConsumerId }) => {
        console.log('consumer resume');
        const { consumer } = consumers.find(c => c.consumer.id === serverConsumerId);
        await consumer.resume()
    })
});

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