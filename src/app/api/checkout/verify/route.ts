import { NextResponse } from "next/server";
import Stripe from "stripe";

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
  } catch (error) {
    console.error("Checkout verify error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
