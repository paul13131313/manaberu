import { NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

export async function POST(request: Request) {
  const stripe = getStripe();
  const { sessionId } = await request.json();

  if (!sessionId) {
    return NextResponse.json(
      { error: "sessionId は必須です" },
      { status: 400 }
    );
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    return NextResponse.json(
      { error: "決済が完了していません" },
      { status: 402 }
    );
  }

  return NextResponse.json({
    paid: true,
    topic: session.metadata?.topic,
    level: session.metadata?.level,
  });
}
