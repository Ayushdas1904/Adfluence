import ChatMessage from '@/models/chatMessage';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Access query parameters using nextUrl.searchParams and get() method
  const room = req.nextUrl.searchParams.get('room');
  const senderId = req.nextUrl.searchParams.get('senderId');
  const receiverId = req.nextUrl.searchParams.get('receiverId');

  // Check if any required query parameter is missing
  if (!room || !senderId || !receiverId) {
    return new NextResponse('Missing query parameters', { status: 400 });
  }

  try {
    // Fetch messages from MongoDB based on the room and sender/receiver IDs
    const messages = await ChatMessage.find({
      room,
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    }).sort({ timestamp: 1 });

    // Return the messages as JSON response
    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    // Return error response if something goes wrong
    return new NextResponse('Error fetching messages', { status: 500 });
  }
}
