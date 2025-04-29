import { createServer } from 'http';
import { Server } from 'socket.io';
import next from 'next';
import mongoose from 'mongoose';
import ChatMessage from './models/chatMessage';

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // User joins room
    socket.on('join-room', async (room, senderId, receiverId) => {
      socket.join(room);
      console.log(`User joined room: ${room}`);

      try {
        // Fetch previous messages for this room (sender-receiver pair)
        const messages = await ChatMessage.find({
          room,
          $or: [
            { sender: senderId, receiver: receiverId },
            { sender: receiverId, receiver: senderId },
          ]
        }).sort({ timestamp: 1 }); // Sort by timestamp to get the correct order

        // Emit previous messages to the client
        socket.emit('chat-history', messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    });

    // Handle message sending
    socket.on('send-message', async ({ room, message, senderId, receiverId }) => {
      console.log(`Message in room ${room}: ${message}`);

      try {
        // Store the message in MongoDB with sender and receiver IDs
        const newMessage = new ChatMessage({
          room,
          sender: senderId,
          receiver: receiverId,
          message,
          timestamp: new Date(), // Ensure timestamp is added to each message
        });
        await newMessage.save();

        // Emit the message to the other user in the room
        socket.to(room).emit('receive-message', { sender: senderId, message });
      } catch (error) {
        console.error('Error saving message:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  httpServer.listen(port, () => {
    console.log(`Server running on http://${hostname}:${port}`);
  });
});
