import { Message } from '../model/message.model.js';
import apiError from '../util/apiError.js';

const setupChat = (io) => {
    const chat = io.of('/chat');

    chat.on('connection', (socket) => {
        console.log('User connected with id:', socket.id);

        socket.on('join', async (roomId) => {
            try {
                socket.join(roomId);
                console.log('User joined room:', roomId);

                const messageHistory = await Message.find({ receiver: roomId }).sort({ createdAt: 1 });
                socket.emit('message-history', messageHistory);
            } catch (error) {
                console.error('Error fetching message history:', error);
                socket.emit('error', 'Failed to fetch message history.');
            }
        });

        socket.on('send-message', async (data) => {
            try {
                const { content, sender, receiver, senderName } = data;

                if (!content || !sender || !receiver || !senderName) {
                    throw new apiError(402, 'Please provide all required fields.');
                }

                const message = await Message.create({ content, sender, receiver, senderName });
                chat.to(receiver).emit('new-message', message);
            } catch (error) {
                console.error('Error sending message:', error);
                socket.emit('error', 'Failed to send message.');
            }
        });

        socket.on('delete-message', async (roomId) => {
            try {
                await Message.deleteMany({ receiver: roomId });
                chat.to(roomId).emit('messages-deleted', { roomId });
            } catch (error) {
                console.error('Error deleting messages:', error);
                socket.emit('error', 'Failed to delete messages.');
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });

    chat.on('connection-error', (error) => {
        console.log('Connection Error', error.message);
    })
};

export default setupChat;