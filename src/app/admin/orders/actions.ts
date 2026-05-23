"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { getOrderShippedEmail } from "@/utils/emails/templates";

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

  // If marked as shipped, send email
  if (newStatus === 'shipped' && order?.profiles?.email) {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        await resend.emails.send({
          from: 'Kaneera <onboarding@resend.dev>',
          to: [order.profiles.email],
          subject: 'Your Order has Shipped! - Kaneera',
          html: getOrderShippedEmail(orderId)
        });
        console.log(`Shipped email sent to ${order.profiles.email}`);
      } catch (err) {
        console.error("Failed to send shipping email", err);
      }
    }
  }

  revalidatePath('/admin/orders');
  revalidatePath('/admin');
  revalidatePath('/account'); // revalidate customer dashboard too
}
