import Link from 'next/link';
import { CheckCircle2, ShoppingBag } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string }>;
}) {
  const resolvedParams = await searchParams;
  const orderId = resolvedParams.order_id;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Optionally verify the order belongs to the user
  if (orderId) {
    const { data: order } = await supabase
      .from('orders')
      .select('id, status')
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single();

    if (!order) {
      // Order not found or doesn't belong to user
      redirect('/');
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 border border-charcoal/5 shadow-xl text-center">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        
        <h1 className="font-serif text-3xl font-bold tracking-tight text-charcoal mb-2">
          Order Confirmed!
        </h1>
        <p className="text-sm text-slate mb-8">
          Thank you for shopping with Kaneera by Aashi. Your elegant pieces will be on their way to you soon.
        </p>
        
        {orderId && (
          <div className="bg-cream/30 p-4 mb-8 text-left border border-charcoal/10">
            <p className="text-xs text-slate uppercase tracking-widest mb-1 font-semibold">Order Reference</p>
            <p className="text-charcoal font-medium font-mono text-sm break-all">{orderId}</p>
          </div>
        )}

        <div className="space-y-4">
          <Link href="/account" className="block w-full bg-charcoal text-white hover:bg-rose-gold px-6 py-4 text-sm tracking-widest uppercase transition-colors duration-300">
            View Order Status
          </Link>
          <Link href="/" className="flex items-center justify-center w-full bg-cream text-charcoal hover:bg-cream/80 px-6 py-4 text-sm tracking-widest uppercase transition-colors duration-300">
            <ShoppingBag className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
