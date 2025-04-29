import { NextRequest, NextResponse } from 'next/server';
import ChatMessage from '@/models/chatMessage';
import {connectToDatabase} from '@/lib/db'; // your dbConnect.ts should connect to MongoDB

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const { room, sender, receiver, message } = await req.json();

  const newMessage = new ChatMessage({ room, sender, receiver, message });
  await newMessage.save();

  return NextResponse.json({ success: true });
}
