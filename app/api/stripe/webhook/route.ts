import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { connectToDatabase } from '@/lib/db';
import { Collaboration } from '@/models/collaboration';
import { User } from '@/models/user';

export const config = {
  api: {
    bodyParser: false,
  },
};

export const runtime = 'nodejs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Helper to read raw body as Buffer from ReadableStream
async function buffer(readableStream: ReadableStream<Uint8Array>) {
  const reader = readableStream.getReader();
  const chunks: Uint8Array[] = [];
  let done = false;

  while (!done) {
    const { value, done: readerDone } = await reader.read();
    if (value) chunks.push(value);
    done = readerDone;
  }

  return Buffer.concat(chunks);
}

export async function POST(req: NextRequest) {
  const rawBody = await buffer(req.body as ReadableStream<Uint8Array>);
  const sig = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err);
    return new NextResponse('Webhook signature verification failed', { status: 400 });
  }

  // ✅ Handle events
  if (event.type === 'checkout.session.completed') {
    try {
      const session = event.data.object as Stripe.Checkout.Session;
      const paymentType = session.metadata?.paymentType;

      await connectToDatabase();

      if (paymentType === 'collab') {
        const collaborationId = session.metadata?.collaborationId;
        const collaboration = await Collaboration.findById(collaborationId);
        if (collaboration) {
          collaboration.paymentStatus = 'Paid';
          collaboration.status = 'completed';
          collaboration.updatedAt = new Date();
          await collaboration.save();
        }
      }

      if (paymentType === 'subscription') {
        const channelId = session.metadata?.channelId;
        await User.findOneAndUpdate({ channelId }, { isPro: true });
      }

      return new NextResponse(JSON.stringify({ received: true }), { status: 200 });
    } catch (err) {
      console.error('❌ Error handling webhook event:', err);
      return new NextResponse('Server error', { status: 500 });
    }
  }

  return new NextResponse('Event type not handled', { status: 200 });
}
