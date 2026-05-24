"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { getOrderShippedEmail, getOrderDeliveredEmail, getOrderPaidEmail } from "@/utils/emails/templates";

export async function updateOrderStatus(orderId: string, newStatus: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId)
    .select('*, profiles(email)')
    .single();

  if (error) {
    console.error("Error updating order status:", error);
    throw new Error("Failed to update order status");
  }

  // If marked as paid, shipped or delivered, send email
  if ((newStatus === 'paid' || newStatus === 'shipped' || newStatus === 'delivered') && order?.profiles?.email) {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        
        let subject = '';
        let html = '';

        if (newStatus === 'paid') {
          subject = 'Payment Verified & Order Confirmed! - Kaneera';
          const address = typeof order.shipping_address === 'string' ? order.shipping_address : order.shipping_address?.address || 'Your Address';
          html = getOrderPaidEmail(orderId, order.total_amount, address);
        } else if (newStatus === 'shipped') {
          subject = 'Your Order has Shipped! - Kaneera';
          html = getOrderShippedEmail(orderId);
        } else if (newStatus === 'delivered') {
          subject = 'Your Order has been Delivered! - Kaneera';
          html = getOrderDeliveredEmail(orderId);
        }

        await resend.emails.send({
          from: 'Kaneera <orders@kaneera.in>',
          to: [order.profiles.email],
          subject: subject,
          html: html
        });
        console.log(`${newStatus} email sent to ${order.profiles.email}`);
      } catch (err) {
        console.error(`Failed to send ${newStatus} email`, err);
      }
    }
  }

  revalidatePath('/admin/orders');
  revalidatePath('/admin');
  revalidatePath('/account'); // revalidate customer dashboard too
}
