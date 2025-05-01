import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { connectToDatabase } from '@/lib/db';
import { Collaboration } from '@/models/collaboration';
import { User } from '@/models/user'; // assuming you have this model

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const config = {
  api: {
    bodyParser: false,
  },
};

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const sig = req.headers.get('Stripe-Signature')!;
  const body = await req.text(); // raw body is required for webhook validation

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: 'Webhook signature verification failed.' },
      { status: 400 }
    );
  }

  if (event.type === 'checkout.session.completed') {
    try {
      const session: Stripe.Checkout.Session = event.data.object;
      const paymentType = session.metadata?.paymentType;

      if (!paymentType) {
        console.error('Missing paymentType in metadata:', session.metadata);
        return NextResponse.json(
          { error: 'Missing payment type in metadata' },
          { status: 400 }
        );
      }

      await connectToDatabase();

      if (paymentType === 'collab') {
        const collaborationId = session.metadata?.collaborationId;
        console.log('Received collaborationId:', collaborationId);

        if (!collaborationId) {
          console.error('No collaborationId found in session metadata:', session.metadata);
          return NextResponse.json(
            { error: 'Collaboration ID not found in metadata' },
            { status: 400 }
          );
        }

        const collaboration = await Collaboration.findById(collaborationId).exec();

        if (!collaboration) {
          console.error('Collaboration not found for ID:', collaborationId);
          return NextResponse.json(
            { error: 'Collaboration not found' },
            { status: 404 }
          );
        }

        collaboration.paymentStatus = 'Paid';
        collaboration.status = 'completed';
        collaboration.updatedAt = new Date();
        await collaboration.save();

        if (process.env.NODE_ENV !== 'production') {
          console.log('✅ Collaboration updated after payment:', collaborationId);
        }

      } else if (paymentType === 'subscription') {
        const channelId = session.metadata?.channelId;

        if (!channelId) {
          console.error('Missing channelId for subscription:', session.metadata);
          return NextResponse.json(
            { error: 'Channel ID missing in metadata' },
            { status: 400 }
          );
        }

        const user = await User.findOneAndUpdate(
          { channelId },
          { isPro: true },
          { new: true }
        );

        if (!user) {
          console.error('User not found for channelId:', channelId);
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          );
        }

        if (process.env.NODE_ENV !== 'production') {
          console.log('✅ User upgraded to Pro:', channelId);
        }
      }

    } catch (error) {
      console.error('Error processing checkout.session.completed:', error);
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
