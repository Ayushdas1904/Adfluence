import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  room: { type: String, required: true },
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }, // Ensure the timestamp is saved
});

const ChatMessage = mongoose.models.ChatMessage || mongoose.model('ChatMessage', chatMessageSchema);

export default ChatMessage;
