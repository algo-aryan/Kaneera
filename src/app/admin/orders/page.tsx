import { createClient } from "@supabase/supabase-js";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import { Package } from "lucide-react";

export const metadata = {
  title: "Manage Orders | Admin | Kaneera",
};

export default async function AdminOrdersPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  // Fetch all orders with profile details and order items
  const { data: orders } = await supabaseAdmin
    .from('orders')
    .select(`
      *,
      profiles!user_id ( full_name, email ),
      order_items (
        quantity,
        price_at_time,
        products (
          name,
          image_urls
        )
      )
    `)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif text-charcoal font-bold">Manage Orders</h2>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
        {(!orders || orders.length === 0) ? (
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
              <Package className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate font-medium">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate">
              <thead className="bg-slate-50 text-xs uppercase font-semibold tracking-wider text-charcoal border-b border-slate-100">
                <tr>
                  <th scope="col" className="px-6 py-4">Order ID & Date</th>
                  <th scope="col" className="px-6 py-4">Customer</th>
                  <th scope="col" className="px-6 py-4">Items to Ship</th>
                  <th scope="col" className="px-6 py-4">Amount</th>
                  <th scope="col" className="px-6 py-4">Payment</th>
                  <th scope="col" className="px-6 py-4">Fulfillment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 align-top">
                      <p className="font-semibold text-charcoal">#{order.id.split('-')[0]}</p>
                      <p className="text-xs mt-1">{new Date(order.created_at).toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <p className="font-medium text-charcoal">{order.profiles?.full_name || 'Guest'}</p>
                      <p className="text-xs mt-1">{order.profiles?.email}</p>
                      <p className="text-xs mt-1 text-slate-400 font-medium">📞 {order.mobile_number}</p>
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1">Shipping Address</p>
                        <p className="text-xs text-charcoal leading-relaxed">
                          {typeof order.shipping_address === 'string' 
                            ? order.shipping_address 
                            : order.shipping_address?.address || JSON.stringify(order.shipping_address)}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top min-w-[250px]">
                      <div className="space-y-3">
                        {order.order_items?.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-slate-100 rounded flex-shrink-0 overflow-hidden">
                              <img src={item.products?.image_urls?.[0]} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-charcoal line-clamp-1">{item.products?.name}</p>
                              <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <p className="font-medium text-charcoal">₹ {order.total_amount.toFixed(2)}</p>
                      <p className="text-xs mt-1 text-slate-400">Razorpay</p>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <span className={`px-2 py-1 inline-flex text-[10px] font-semibold tracking-wider uppercase rounded-full border ${
                        ['paid', 'processing', 'shipped', 'delivered'].includes(order.status) ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {['paid', 'processing', 'shipped', 'delivered'].includes(order.status) ? 'Paid' : 'Unpaid'}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <OrderStatusSelect orderId={order.id} initialStatus={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
