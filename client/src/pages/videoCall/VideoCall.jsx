import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { Device } from 'mediasoup-client';
import { useNavigate, useParams } from 'react-router-dom';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import './index.css'
import { Button } from '@mui/material';

function App() {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const userName = localStorage.getItem('userName')
  const localVideoRef = useRef(null);
  let stream;
  let rtpCapabilities;
  let device;
  let producerTransport;
  let consumerTransports = [];
  let videoProducer;

  const roomName = roomId;

  const socket = io('http://localhost:3000/videoCall', {
    transports: ['websocket'],
    secure: true,
    withCredentials: true,
  });

  const params = {
    encodings: [
      {
        rid: 'r0',
        maxBitrate: 100000,
        scalabilityMode: 'S1T3',
      },
      {
        rid: 'r1',
        maxBitrate: 300000,
        scalabilityMode: 'S1T3',
      },
      {
        rid: 'r2',
        maxBitrate: 900000,
        scalabilityMode: 'S1T3',
      },
    ],
    codecOptions: {
      videoGoogleStartBitrate: 1000,
    },
  };

  let videoParams = { params };
  let consumingTransports = [];

  const streamSuccess = (s) => {
    localVideoRef.current.srcObject = s;
    stream = s;
    videoParams = { track: stream.getVideoTracks()[0], ...videoParams };
    joinRoom();
  };


  const joinRoom = () => {
    socket.emit('joinRoom', { roomName }, (data) => {
      console.log('rtpCapabilities:', data.rtpCapabilities);
      rtpCapabilities = data.rtpCapabilities

      createDevice();
    });
  }

  const getLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: { min: 500, max: 500 },
          height: { min: 420, max: 420 },
        },
      });
      streamSuccess(stream);
    } catch (error) {
      console.error('Error accessing local video stream:', error.message);
    }
  };

  socket.on('connection-success', async ({ socketId, existsProducer }) => {
    console.log(`Connected with socket ID: ${socketId}, Producer Exists: ${existsProducer}`);
    await getLocalStream();
  });

  socket.on('new-producer', ({ producerId }) => signalNewConsumerTransport(producerId))

  const getProducers = () => {
    socket.emit('getProducers', producersId => {
      producersId.forEach(signalNewConsumerTransport);
    });
  }

  const createDevice = async () => {
    try {
      const newDevice = new Device();
      await newDevice.load({
        routerRtpCapabilities: rtpCapabilities,
      });
      device = newDevice;
      console.log('Device loaded successfully');
      createSendTransport();
    } catch (error) {
      if (error.name === 'UnsupportedError') {
        console.warn('Browser not supported');
      } else {
        console.error(error);
      }
    }
  };

  const createSendTransport = () => {
    socket.emit('createWebRtcTransport', { consumer: false }, ({ params }) => {
      if (params.error) {
        console.error(params.error);
        return;
      }

      producerTransport = device.createSendTransport(params);
      producerTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
        try {
          socket.emit('transport-connect', { dtlsParameters });
          callback();
        } catch (error) {
          errback(error);
        }
      });

      producerTransport.on('produce', async (parameters, callback, errback) => {
        try {
          socket.emit('transport-produce', parameters, ({ id, producersExist }) => {
            callback({ id });

            if (producersExist)
              getProducers()
          });
        } catch (error) {
          errback(error);
        }
      });

      connectSendTransport();
    });
  };

  const connectSendTransport = async () => {
    if (!stream) {
      console.error('Stream is not available');
      return;
    }
    const videoTrack = stream.getVideoTracks()[0];

    if (!videoTrack) {
      console.error('No video track available in the stream');
      return;
    }

    try {
      videoProducer = await producerTransport.produce({ track: videoTrack });

      videoProducer.on('trackended', () => {
        console.log('Video track ended');
      });
      videoProducer.on('transportclose', () => {
        console.log('Video transport closed');
      });
    } catch (error) {
      console.error('Error in connectSendTransport:', error);
    }
  };


  const signalNewConsumerTransport = async (remoteProducerId) => {
    if (consumingTransports.includes(remoteProducerId)) return;

    consumingTransports.push(remoteProducerId);

    socket.emit('createWebRtcTransport', { consumer: true }, ({ params }) => {
      if (params.error) {
        console.error(params.error);
        return;
      }

      let consumerTransport;
      try {
        consumerTransport = device.createRecvTransport(params);
      } catch (error) {
        console.log(error);
        return;
      }

      consumerTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
        try {
          await socket.emit('transport-recv-connect', {
            dtlsParameters,
            serverConsumerTransportId: params.id,
          });
          callback();
        } catch (error) {
          errback(error);
        }
      });

      connectRecvTransportAndConsume(consumerTransport, remoteProducerId, params.id);
    });
  };

  const connectRecvTransportAndConsume = async (consumerTransport, remoteProducerId, serverConsumerTransportId) => {
    socket.emit('consume', { rtpCapabilities: device.rtpCapabilities, remoteProducerId, serverConsumerTransportId }, async ({ params }) => {
      if (params.error) {
        console.error('Cannot consume:', params.error);
        return;
      }

      const consumer = await consumerTransport.consume({
        id: params.id,
        producerId: params.producerId,
        kind: params.kind,
        rtpParameters: params.rtpParameters,
      });

      consumerTransports.push({
        consumerTransport,
        serverConsumerTransportId: params.id,
        producerId: remoteProducerId,
        consumer,
      });

      const videoContainer = document.getElementById('videoContainer');
      if (!videoContainer) {
        console.error('videoContainer element not found!');
        return;
      }

      if (document.getElementById(remoteProducerId)) {
        console.log(`Video element for producer ${remoteProducerId} already exists`);
        return;
      }

      const newElem = document.createElement('div');
      newElem.setAttribute('id', `td-${remoteProducerId}`);

      newElem.setAttribute('class', 'remoteVideo');
      newElem.innerHTML = `<video id="${remoteProducerId}" autoplay class="video"></video>`;

      videoContainer.appendChild(newElem);

      const { track } = consumer;
      document.getElementById(remoteProducerId).srcObject = new MediaStream([track]);

      socket.emit('consumer-resume', { serverConsumerId: params.serverConsumerId });
    });
  };

  socket.on('producer-closed', ({ remoteProducerId }) => {
    const producerToClose = consumerTransports.find(transportData => transportData.producerId === remoteProducerId)

    producerToClose.consumerTransport.close()
    producerToClose.consumer.close()

    consumerTransports = consumerTransports.filter(transportData => transportData.producerId !== remoteProducerId)

    videoContainer.removeChild(document.getElementById(`td-${remoteProducerId}`))
  })

  useEffect(() => {
    getLocalStream();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      consumerTransports.forEach(({ consumerTransport, consumer }) => {
        consumerTransport.close();
        consumer.close();
      });
      consumerTransports = [];

      if (producerTransport) {
        producerTransport.close();
      }

      if (videoProducer) {
        videoProducer.close();
      }

      if (socket) {
        socket.disconnect();
      }

      const videoContainer = document.getElementById('videoContainer');
      if (videoContainer) {
        while (videoContainer.firstChild) {
          videoContainer.removeChild(videoContainer.firstChild);
        }
      }

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
    };
  }, [stream]);

  const handleLeave = () => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    }
    consumerTransports.forEach(({ consumerTransport, consumer }) => {
      consumerTransport.close();
      consumer.close();
    });
    consumerTransports = [];
    if (producerTransport) {
      producerTransport.close();
    }
    if (videoProducer) {
      videoProducer.close();
    }
    if (socket) {
      socket.disconnect();
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    navigate(`/room/${roomId}`);
  };

  return (
    <div className='videoCall-container'>

      <div className="videoCall-haeder">
        <h1>Video Call</h1>
        <Button onClick={handleLeave}><ExitToAppIcon />Leave</Button>
      </div>

      <div className="videoCall-content">

        <div className="videoCall-local">
          <video ref={localVideoRef} autoPlay></video>
          <h1>{userName}</h1>
        </div>

        <div id='videoContainer'>
        </div>

      </div>

    </div>
  );
}

export default App;