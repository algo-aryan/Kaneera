import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import AccountDashboard from '@/components/account/AccountDashboard';

export const metadata = {
  title: "My Account | Kaneera by Aashi",
  description: "Manage your Kaneera account and order history.",
};

export default async function AccountPage() {
  const supabase = await createClient();
  
  // Verify session securely on the server
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  // Fetch the user's full profile details safely
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Fetch the user's orders, including items and product details
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (
          name,
          image_urls
        )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  // If a profile doesn't exist (e.g. manually created test account), 
  // we still render the dashboard so they can create one!
  
  return (
    <div className="min-h-[80vh] bg-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold tracking-tight text-charcoal">
            My Account
          </h1>
          <p className="mt-2 text-sm text-slate font-light">
            Manage your personal details and view your order history.
          </p>
        </div>
        
        <AccountDashboard 
          profile={profile || {}} 
          sessionEmail={user.email || ''} 
          orders={orders || []} 
        />
      </div>
    </div>
  );
}
