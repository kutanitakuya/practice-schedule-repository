import Stripe from "stripe"
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
    const { title, price, bookId, userId } = await request.json();
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            metadata: {
                bookId: bookId,
            },
            client_reference_id: userId,

            line_items: [
                {
                    price_data: {
                        currency: "jpy",
                        product_data: {
                            name: title,
                        },
                        unit_amount: price,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            custom_fields: [
                {
                  key: 'full_name',
                  label: { type: 'custom', custom: '氏名' },
                  type: 'text',
                },
              ],
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/book/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
        });

        return NextResponse.json({checkout_url: session.url});
    } catch (err) {
        if (err instanceof Error) {
          return NextResponse.json({ error: err.message });
        } else {
          return NextResponse.json({ error: 'An unknown error occurred' });
        }
      }
    }