'use server'

import { createClient } from '@/utils/supabase/server';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'YOUR_SECRET',
});

export async function createRazorpayOrder(data: { items: any[], shippingAddress: string, mobileNumber: string, promoCode?: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to checkout.' };
  }

  try {
    // 1. Calculate total server-side for security
    let subtotal = 0;
    
    // Fetch real prices from database to prevent client tampering
    const productIds = data.items.map(item => item.product_id);
    const { data: dbProducts, error: dbError } = await supabase
      .from('products')
      .select('id, price')
      .in('id', productIds);

    if (dbError || !dbProducts) {
      throw new Error("Could not verify product prices");
    }

    const priceMap = new Map(dbProducts.map(p => [p.id, p.price]));
    
    // Build order items array for database
    const orderItemsToInsert = data.items.map(clientItem => {
      const realPrice = priceMap.get(clientItem.product_id);
      if (realPrice === undefined) throw new Error(`Product ${clientItem.product_id} not found`);
      
      subtotal += realPrice * clientItem.quantity;
      
      return {
        product_id: clientItem.product_id,
        quantity: clientItem.quantity,
        price_at_time: realPrice
      };
    });

    let discountAmount = 0;
    
    // Apply Promo Code Server-Side
    if (data.promoCode) {
      const { data: promo } = await supabase
        .from('promotions')
        .select('*')
        .eq('code', data.promoCode.toUpperCase())
        .eq('is_active', true)
        .single();
        
      if (promo) {
        if (promo.discount_percentage) {
          discountAmount = subtotal * (promo.discount_percentage / 100);
        } else if (promo.discount_amount) {
          discountAmount = promo.discount_amount;
        }
      }
    }

    const shipping = (subtotal - discountAmount) > 2000 ? 0 : 150;
    const finalTotal = subtotal - discountAmount + shipping;

    // 2. Insert into orders table as 'pending'
    const { data: orderRow, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        total_amount: finalTotal,
        shipping_address: { address: data.shippingAddress }, // Store as JSONB
        mobile_number: data.mobileNumber || 'Unknown',
        status: 'pending' // pending until razorpay confirms
      })
      .select('id')
      .single();

    if (orderError) throw orderError;

    // 3. Insert order items
    const fullOrderItems = orderItemsToInsert.map(item => ({
      ...item,
      order_id: orderRow.id
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(fullOrderItems);

    if (itemsError) throw itemsError;

    // 4. Create Razorpay Order
    const amountInPaise = Math.round(finalTotal * 100);
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: orderRow.id,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    return { 
      razorpayOrderId: razorpayOrder.id,
      internalOrderId: orderRow.id,
      amount: amountInPaise,
      currency: "INR",
    };

  } catch (err: any) {
    console.error("Checkout error:", err);
    return { error: err.message || "Failed to create order" };
  }
}

export async function verifyPayment(data: {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  internal_order_id: string;
}) {
  const secret = process.env.RAZORPAY_KEY_SECRET || 'YOUR_SECRET';

  const body = data.razorpay_order_id + "|" + data.razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === data.razorpay_signature;

  if (isAuthentic) {
    // Payment is successful, update order status
    const supabase = await createClient();
    await supabase
      .from('orders')
      .update({ status: 'paid' })
      .eq('id', data.internal_order_id);

    return { success: true };
  } else {
    // Signature mismatch
    return { success: false, error: 'Invalid payment signature' };
  }
}

export async function validatePromoCode(code: string) {
  const supabase = await createClient();
  const { data: promo, error } = await supabase
    .from('promotions')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .single();

  if (error || !promo) {
    return { error: 'Invalid or expired promotional code.' };
  }

  // Check expiration
  if (promo.valid_until && new Date(promo.valid_until) < new Date()) {
    return { error: 'This promotional code has expired.' };
  }

  return { 
    success: true, 
    discountPercentage: promo.discount_percentage,
    discountAmount: promo.discount_amount,
    code: promo.code
  };
}
