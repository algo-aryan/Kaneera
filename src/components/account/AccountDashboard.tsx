"use client";

import { useState, useTransition } from 'react';
import { Package, User, MapPin, LogOut } from 'lucide-react';
import { logout } from '@/app/(auth)/actions';
import { updateProfile } from '@/app/account/actions';

import { useRouter } from 'next/navigation';

export default function AccountDashboard({ profile, sessionEmail, orders = [] }: { profile: any, sessionEmail: string, orders?: any[] }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses'>('orders');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  // Extract unique saved addresses from past orders
  const uniqueAddresses = Array.from(new Set(orders.map(o => o.shipping_address?.address).filter(Boolean)));

  // Form states
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone_number || '');

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    
    const formData = new FormData();
    formData.append('full_name', fullName);
    formData.append('phone_number', phone);
    
    startTransition(async () => {
      const result = await updateProfile(formData);
      if (result.error) {
        setMessage({ type: 'error', text: result.error });
      } else {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        router.refresh(); // Refresh the server component props
      }
    });
  };

  const displayName = profile?.full_name || 'Welcome';
  const displayEmail = profile?.email || sessionEmail;

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] rounded-2xl h-full">
          <div className="mb-8">
            <h3 className="font-serif text-xl text-charcoal truncate">
              {displayName}
            </h3>
            <p className="text-xs text-slate truncate">{displayEmail}</p>
          </div>
          
          <nav className="space-y-2">
            <button 
              onClick={() => { setActiveTab('orders'); setSelectedOrder(null); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-sm transition-colors text-left rounded-xl ${activeTab === 'orders' ? 'bg-[#FFF8F8] text-[#D4AF37] font-medium' : 'text-charcoal hover:bg-[#FFF8F8] hover:text-[#D4AF37]'}`}
            >
              <Package className="w-4 h-4" />
              <span>Order History</span>
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-sm transition-colors text-left rounded-xl ${activeTab === 'profile' ? 'bg-[#FFF8F8] text-[#D4AF37] font-medium' : 'text-charcoal hover:bg-[#FFF8F8] hover:text-[#D4AF37]'}`}
            >
              <User className="w-4 h-4" />
              <span>Profile Details</span>
            </button>
            <button 
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-sm transition-colors text-left rounded-xl ${activeTab === 'addresses' ? 'bg-[#FFF8F8] text-[#D4AF37] font-medium' : 'text-charcoal hover:bg-[#FFF8F8] hover:text-[#D4AF37]'}`}
            >
              <MapPin className="w-4 h-4" />
              <span>Saved Addresses</span>
            </button>
            
            <div className="pt-8 mt-4 border-t border-charcoal/5">
              <button 
                onClick={async () => {
                  await logout();
                  window.location.href = '/login';
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0">
        <div className="bg-white p-6 md:p-10 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] rounded-2xl min-h-[500px]">
          
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="font-serif text-2xl text-charcoal border-b border-charcoal/10 pb-6">Order History</h2>
              
              {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                  <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mb-2">
                    <Package className="w-8 h-8 text-rose-gold/60" />
                  </div>
                  <h3 className="font-medium text-charcoal">No orders yet</h3>
                  <p className="text-sm text-slate max-w-md">
                    When you place an order, it will appear here. Start shopping to find your next favorite piece of jewelry.
                  </p>
                  <a href="/" className="mt-4 inline-block bg-charcoal text-white px-8 py-3 text-sm tracking-widest uppercase hover:bg-rose-gold transition-colors">
                    Start Shopping
                  </a>
                </div>
              ) : selectedOrder ? (
                <div className="space-y-6">
                  <button onClick={() => setSelectedOrder(null)} className="text-sm text-slate hover:text-rose-gold transition-colors flex items-center font-medium mb-2">
                    ← Back to Orders
                  </button>
                  <div className="bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] rounded-2xl p-6 sm:p-8 space-y-6 border border-slate-100">
                    <div className="flex justify-between items-start pb-6 border-b border-charcoal/10">
                      <div>
                        <h3 className="font-serif text-xl text-charcoal">Order Receipt</h3>
                        <p className="text-xs text-slate mt-1 uppercase tracking-widest">#{selectedOrder.id.split('-')[0].toUpperCase()}</p>
                      </div>
                      <span className={`px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase rounded-full border ${
                        selectedOrder.status === 'paid' || selectedOrder.status === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' : 
                        (selectedOrder.status === 'pending' && selectedOrder.payment_method === 'manual_upi') ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                        'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {(selectedOrder.status === 'pending' && selectedOrder.payment_method === 'manual_upi') ? 'Verifying Payment' : selectedOrder.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pb-6 border-b border-charcoal/10">
                      <div className="space-y-4">
                        <div>
                          <p className="text-[10px] text-slate uppercase tracking-widest font-semibold mb-1">Customer</p>
                          <p className="text-sm text-charcoal">{displayName}</p>
                          <p className="text-sm text-slate">{selectedOrder.mobile_number || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate uppercase tracking-widest font-semibold mb-1">Shipping Address</p>
                          <p className="text-sm text-charcoal max-w-[200px]">{selectedOrder.shipping_address?.address || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-[10px] text-slate uppercase tracking-widest font-semibold mb-1">Order Date</p>
                          <p className="text-sm text-charcoal">{new Date(selectedOrder.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate uppercase tracking-widest font-semibold mb-1">Payment Method</p>
                          <p className="text-sm text-charcoal uppercase">{selectedOrder.payment_method}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-charcoal uppercase tracking-widest mb-4">Itemized Details</h4>
                      <div className="space-y-4">
                        {selectedOrder.order_items?.map((item: any) => (
                          <div key={item.id} className="flex items-center space-x-4">
                            <div className="w-12 h-16 bg-cream shrink-0">
                              {item.products?.image_urls?.[0] ? (
                                <img src={item.products.image_urls[0]} alt="Product" className="w-full h-full object-cover mix-blend-multiply" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate/30 border border-charcoal/10">
                                  <Package className="w-4 h-4" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm text-charcoal truncate">{item.products?.name || 'Jewelry Piece'}</h4>
                              <p className="text-xs text-slate mt-1">Qty: {item.quantity}</p>
                            </div>
                            <p className="text-sm font-medium text-charcoal">₹ {(item.price_at_time * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 pt-4 border-t border-charcoal/10 flex justify-between items-center">
                        <span className="text-sm font-semibold text-charcoal uppercase tracking-widest">Total Amount</span>
                        <span className="text-xl font-serif text-charcoal">₹ {selectedOrder.total_amount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {orders.map((order) => {
                    const isVerifying = order.status === 'pending' && order.payment_method === 'manual_upi';
                    const statusText = isVerifying ? 'Verifying Payment' : order.status;
                    const statusColor = order.status === 'paid' || order.status === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                                        isVerifying ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                        'bg-slate-100 text-slate-600 border-slate-200';

                    return (
                    <div key={order.id} className="group bg-white hover:shadow-xl hover:shadow-[#D4AF37]/5 transition-all duration-300 rounded-2xl overflow-hidden flex flex-col sm:flex-row border border-slate-100">
                      {/* Image Thumbnail (Left Side) */}
                      <div className="w-full sm:w-48 h-48 sm:h-auto bg-[#FFF8F8] shrink-0 relative overflow-hidden">
                        {order.order_items?.[0]?.products?.image_urls?.[0] ? (
                          <img src={order.order_items[0].products.image_urls[0]} alt="Product" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 mix-blend-multiply" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate/30">
                            <Package className="w-8 h-8" />
                          </div>
                        )}
                        {/* Status Badge overlay */}
                        <div className="absolute top-4 left-4">
                           <span className={`px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded shadow-sm border backdrop-blur-md ${statusColor}`}>
                             {statusText}
                           </span>
                        </div>
                      </div>

                      {/* Content (Right Side) */}
                      <div className="flex-1 p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="text-[10px] text-slate uppercase tracking-widest font-semibold mb-1">Order Ref</p>
                              <p className="text-sm font-mono text-charcoal bg-cream/50 px-2 py-1 rounded inline-block">#{order.id.split('-')[0].toUpperCase()}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] text-slate uppercase tracking-widest font-semibold mb-1">Total</p>
                              <p className="text-lg font-serif text-charcoal font-medium">₹ {order.total_amount.toFixed(2)}</p>
                            </div>
                          </div>

                          <div className="space-y-1 mb-6">
                            {order.order_items?.slice(0, 2).map((item: any) => (
                              <p key={item.id} className="text-sm text-charcoal line-clamp-1 flex items-center">
                                <span className="text-slate mr-2 text-xs">{item.quantity}x</span> 
                                {item.products?.name || 'Jewelry Piece'}
                              </p>
                            ))}
                            {order.order_items?.length > 2 && (
                              <p className="text-xs text-slate italic">+ {order.order_items.length - 2} more items</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-charcoal/5">
                          <div>
                            <p className="text-[10px] text-slate uppercase tracking-widest font-semibold mb-0.5">Placed On</p>
                            <p className="text-xs text-charcoal">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                          </div>
                          <button onClick={() => setSelectedOrder(order)} className="text-xs font-bold text-charcoal uppercase tracking-widest hover:text-rose-gold transition-colors flex items-center">
                            View Details <span className="ml-1">→</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )})}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="font-serif text-2xl text-charcoal border-b border-charcoal/10 pb-4">Profile Details</h2>
              
              {message && (
                <div className={`p-4 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border-l-4 border-green-500' : 'bg-red-50 text-red-700 border-l-4 border-rose-gold'}`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleProfileUpdate} className="max-w-md space-y-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-slate mb-1">Email Address</label>
                  <div className="px-4 py-3 bg-cream/50 border border-charcoal/10 text-charcoal/70 text-sm cursor-not-allowed">
                    {displayEmail}
                  </div>
                  <p className="text-[10px] text-slate mt-1">Email cannot be changed.</p>
                </div>
                <div>
                  <label htmlFor="full_name" className="block text-xs font-semibold uppercase tracking-widest text-slate mb-1">Full Name</label>
                  <input 
                    id="full_name"
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="block w-full border border-charcoal/20 bg-transparent px-4 py-3 text-charcoal placeholder-slate/40 focus:border-rose-gold focus:outline-none focus:ring-0 sm:text-sm transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="phone_number" className="block text-xs font-semibold uppercase tracking-widest text-slate mb-1">Mobile Number</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate">+91</span>
                    <input 
                      id="phone_number"
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="98765 43210"
                      className="block w-full border border-charcoal/20 bg-transparent pl-12 pr-4 py-3 text-charcoal placeholder-slate/40 focus:border-rose-gold focus:outline-none focus:ring-0 sm:text-sm transition-colors"
                    />
                  </div>
                </div>
                <button 
                  type="submit" 
                  disabled={isPending}
                  className={`bg-charcoal text-white px-8 py-3 text-sm tracking-widest uppercase hover:bg-rose-gold transition-colors w-full sm:w-auto ${isPending ? 'opacity-70 cursor-wait' : ''}`}
                >
                  {isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <h2 className="font-serif text-2xl text-charcoal border-b border-charcoal/10 pb-4">Saved Addresses</h2>
              
              {uniqueAddresses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                  <MapPin className="w-12 h-12 text-rose-gold/40 mb-2" />
                  <h3 className="font-medium text-charcoal">No saved addresses</h3>
                  <p className="text-sm text-slate">
                    You haven't saved any addresses yet. Add one during your next checkout.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {uniqueAddresses.map((addr: string, idx: number) => (
                    <div key={idx} className="border border-charcoal/10 bg-white p-6 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-4 text-charcoal">
                          <MapPin className="w-4 h-4 text-rose-gold" />
                          <span className="font-serif text-lg font-medium">Home Address</span>
                        </div>
                        <p className="text-sm text-slate leading-relaxed">
                          {addr}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
        </div>
      </main>
    </div>
  );
}
