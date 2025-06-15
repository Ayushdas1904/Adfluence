// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { buffer } from 'micro'; // 👈 required to get raw body
import { connectToDatabase } from '@/lib/db';
import { Collaboration } from '@/models/collaboration';
import { User } from '@/models/user';

export const config = {
  api: {
    bodyParser: false,
  },
};

export const runtime = 'nodejs'; // Ensure it's running on the edge/server

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const rawBody = await req.text(); // Required to keep raw format
  const sig = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return new NextResponse('Webhook signature verification failed', { status: 400 });
  }

  // ✅ Handle event
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
      } else if (paymentType === 'subscription') {
        const channelId = session.metadata?.channelId;
        await User.findOneAndUpdate({ channelId }, { isPro: true });
      }

      return new NextResponse(JSON.stringify({ received: true }), { status: 200 });
    } catch (err) {
      console.error('Error processing event:', err);
      return new NextResponse('Error handling event', { status: 500 });
    }
  }

  return new NextResponse('Unhandled event type', { status: 200 });
}
