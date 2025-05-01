import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const { amount, creatorEmail, creatorName, collaborationId } = await req.json();

  if (!collaborationId) {
    return NextResponse.json({ error: 'collaborationId is required' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            unit_amount: amount * 100,
            product_data: {
              name: `Payment to ${creatorName}`,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
      metadata: {
        creatorEmail,
        collaborationId, // 🔥 Include this for the webhook
        paymentType: "collab", // store payment type for webhook
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}
