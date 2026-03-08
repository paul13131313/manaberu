import { NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

export async function POST(request: Request) {
  const stripe = getStripe();
  const { topic, level } = await request.json();

  const origin = request.headers.get("origin") || "http://localhost:3007";

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
}
