import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { updatePaymentToPaid } from '@/lib/actions/payment.actions';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature header' },
        { status: 400 }
      );
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log('event', event);
    // charge.succeeded indicates a successful payment
    if (event.type === 'charge.succeeded') {
      const charge = event.data.object as Stripe.Charge;
      
      // Check if orderId exists in metadata
      if (!charge.metadata?.orderId) {
        return NextResponse.json({
          error: 'No orderId found in payment metadata'
        }, { status: 400 });
      }

      await updatePaymentToPaid(charge.metadata.paymentId, {
        id: charge.id,
        status: 'COMPLETED',
        email_address: charge.billing_details.email!,
        pricePaid: (charge.amount / 100).toFixed(),
        amount: (charge.amount / 100).toFixed(),
        created_at: new Date().toISOString(),
      });

      return NextResponse.json({
        message: 'updateOrderToPaid was successful',
      });
    }
    return NextResponse.json({
      message: 'event is not charge.succeeded',
    });
  } catch (error) {
    console.error('Error processing Stripe webhook:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create conversation', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
