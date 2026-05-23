import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import CheckoutForm from '@/components/checkout/CheckoutForm';

export default async function CheckoutPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?message=Please log in to proceed with checkout');
  }

  // Fetch the user's profile to pre-fill their info
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Fetch user's past orders to extract saved addresses
  const { data: pastOrders } = await supabase
    .from('orders')
    .select('shipping_address')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-charcoal mb-8 text-center sm:text-left">
          Secure Checkout
        </h1>
        
        <CheckoutForm 
          userEmail={user.email || ''} 
          userProfile={profile || {}} 
          pastOrders={pastOrders || []}
        />
      </div>
    </div>
  );
}
