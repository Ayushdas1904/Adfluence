import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { channelId } = await req.json();

    if (!channelId) {
      return NextResponse.json({ error: "Missing channelId" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: "inr",
            unit_amount: 499 * 100,
            recurring: {
              interval: "month",
            },
            product_data: {
              name: "Pro Subscription",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        channelId, // store channelId for webhook
        paymentType: "subscription", // store payment type for webhook
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    let errorMsg = "Stripe session failed";
    if (err instanceof Error) {
      console.error("Stripe session error:", err.message);
      errorMsg = err.message;
    } else {
      console.error("Stripe session error:", err);
    }
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
