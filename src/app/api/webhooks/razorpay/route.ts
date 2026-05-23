import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('Webhook secret not configured');
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // Verify cryptographic signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error('Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);

    // Process payment.captured event
    if (payload.event === 'payment.captured') {
      const paymentEntity = payload.payload.payment.entity;
      const razorpayOrderId = paymentEntity.order_id;
      
      // Initialize Supabase Admin Client using Service Role Key to bypass RLS
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
      
      if (!supabaseServiceKey) {
        console.error('SUPABASE_SERVICE_ROLE_KEY not configured');
        return NextResponse.json({ error: 'Database admin key not configured' }, { status: 500 });
      }

      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

      // We mark the order as paid based on the razorpay_order_id
      const { error } = await supabaseAdmin
        .from('orders')
        .update({ status: 'paid' })
        .eq('razorpay_order_id', razorpayOrderId)
        .eq('status', 'pending'); // Ensure we only update pending orders

      if (error) {
        console.error('Error updating order:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
      }
      
      console.log(`Order ${razorpayOrderId} marked as paid via webhook.`);
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
