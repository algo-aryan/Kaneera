import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { getOrderConfirmationEmail } from '@/utils/emails/templates';

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
      const internalOrderId = paymentEntity.notes?.internal_order_id;
      
      if (!internalOrderId) {
        console.error('No internal_order_id found in notes');
        return NextResponse.json({ error: 'Missing internal order ID' }, { status: 400 });
      }
      
      // Initialize Supabase Admin Client using Service Role Key to bypass RLS
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
      
      if (!supabaseServiceKey) {
        console.error('SUPABASE_SERVICE_ROLE_KEY not configured');
        return NextResponse.json({ error: 'Database admin key not configured' }, { status: 500 });
      }

      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

      // We mark the order as paid based on the internal_order_id
      const { data: order, error } = await supabaseAdmin
        .from('orders')
        .update({ status: 'paid' })
        .eq('id', internalOrderId)
        .eq('status', 'pending')
        .select('*, profiles(email)')
        .single();

      if (error || !order) {
        console.error('Error updating order:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
      }
      
      console.log(`Order ${internalOrderId} marked as paid via webhook.`);

      // Send Email Notification
      const resendApiKey = process.env.RESEND_API_KEY;
      if (resendApiKey) {
        try {
          const resend = new Resend(resendApiKey);
          const email = order.profiles?.email;
          
          if (email) {
            const addressString = typeof order.shipping_address === 'object' && order.shipping_address !== null 
              ? order.shipping_address.address || JSON.stringify(order.shipping_address)
              : order.shipping_address;

            await resend.emails.send({
              from: 'Kaneera <orders@kaneera.in>',
              to: [email],
              subject: 'Order Confirmation - Kaneera',
              html: getOrderConfirmationEmail(order.id, order.total_amount, addressString)
            });
            console.log(`Order confirmation email sent to ${email}`);
          }
        } catch (emailError) {
          console.error('Failed to send order confirmation email:', emailError);
          // Don't fail the webhook if email fails
        }
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
