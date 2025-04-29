import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { connectToDatabase } from '@/lib/db';
import { Collaboration } from '@/models/collaboration';

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
      const collaborationId = session.metadata?.collaborationId;

      // Log the collaborationId to check its value
      console.log('Received collaborationId:', collaborationId);

      if (!collaborationId) {
        console.error('No collaborationId found in session metadata:', session.metadata);
        return NextResponse.json(
          { error: 'Collaboration ID not found in metadata' },
          { status: 400 }
        );
      }

      await connectToDatabase();

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

    } catch (error) {
      console.error('Error processing checkout.session.completed:', error);
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
