import { NextRequest, NextResponse } from 'next/server';
import ChatMessage from '@/models/chatMessage';
import { connectToDatabase } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { room, sender, receiver, message } = await req.json();

    if (!room || !sender || !receiver || !message) {
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
    }

    const newMessage = new ChatMessage({ room, sender, receiver, message });
    await newMessage.save();

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    let errorMsg = "Unknown error";
    if (err instanceof Error) {
      errorMsg = err.message;
    }
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
