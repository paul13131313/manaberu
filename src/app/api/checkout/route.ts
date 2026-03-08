import { NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

export async function POST(request: Request) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json(
        { error: "STRIPE_SECRET_KEY が設定されていません" },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeKey);
    const { topic, level } = await request.json();

    const origin = request.headers.get("origin") || "https://manaberu.vercel.app";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "jpy",
            product_data: {
              name: `AI教科書: ${topic}`,
              description: "AI生成の教科書＋問題集セット",
            },
            unit_amount: 300,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}?canceled=true`,
      metadata: {
        topic,
        level,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
