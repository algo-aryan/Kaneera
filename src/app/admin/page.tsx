import { createClient } from '@supabase/supabase-js';
import { Package } from 'lucide-react';

export const metadata = {
  title: "Admin Dashboard | Kaneera",
};

export default async function AdminDashboardPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  // Fetch all orders
  const { data: allOrders } = await supabaseAdmin
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  // Fetch all products
  const { data: allProducts } = await supabaseAdmin
    .from('products')
    .select('*');

  const orders = allOrders || [];
  const products = allProducts || [];

  // Calculate metrics
  const totalRevenue = orders.filter(o => o.status === 'paid' || o.status === 'shipped' || o.status === 'delivered').reduce((sum, o) => sum + o.total_amount, 0);
  const activeOrdersCount = orders.filter(o => o.status === 'pending' || o.status === 'paid' || o.status === 'processing').length;
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
          <h3 className="text-sm font-medium text-slate uppercase tracking-wider mb-2">Total Revenue</h3>
          <p className="text-3xl font-serif text-charcoal font-bold">₹ {totalRevenue.toFixed(2)}</p>
          <p className="text-sm text-green-600 mt-2 flex items-center">
            Across {orders.filter(o => o.status === 'paid' || o.status === 'shipped' || o.status === 'delivered').length} successful orders
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
          <h3 className="text-sm font-medium text-slate uppercase tracking-wider mb-2">Active Orders</h3>
          <p className="text-3xl font-serif text-charcoal font-bold">{activeOrdersCount}</p>
          <p className="text-sm text-slate-400 mt-2 flex items-center">
            Pending or Processing
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
          <h3 className="text-sm font-medium text-slate uppercase tracking-wider mb-2">Total Products</h3>
          <p className="text-3xl font-serif text-charcoal font-bold">{products.length}</p>
          <p className="text-sm text-slate-400 mt-2 flex items-center">
            In Catalog
          </p>
        </div>
      </div>

      {/* Recent Orders Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <h3 className="text-lg font-medium text-charcoal">Recent Orders</h3>
        </div>
        {recentOrders.length === 0 ? (
          <div className="p-6 flex flex-col items-center justify-center text-center space-y-3 min-h-[300px]">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
              <Package className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate font-medium">No recent orders yet</p>
            <p className="text-sm text-slate-400">When you receive orders, they will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentOrders.map(order => (
              <div key={order.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                <div>
                  <p className="text-sm font-semibold text-charcoal uppercase tracking-widest">Order #{order.id.split('-')[0]}</p>
                  <p className="text-xs text-slate mt-1">{new Date(order.created_at).toLocaleString()}</p>
                </div>
                <div className="text-right flex flex-col items-end">
                  <p className="text-sm font-medium text-charcoal mb-1">₹ {order.total_amount.toFixed(2)}</p>
                  <span className={`px-2 py-1 text-[10px] font-semibold tracking-wider uppercase rounded-full border ${
                    order.status === 'paid' ? 'bg-green-50 text-green-700 border-green-200' : 
                    order.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                    order.status === 'shipped' || order.status === 'delivered' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    'bg-slate/10 text-slate border-slate/20'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
