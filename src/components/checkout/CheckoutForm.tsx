"use client";

import { useState, useTransition, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useRouter } from 'next/navigation';
import { ShieldCheck, MapPin } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutForm({ userEmail, userProfile, pastOrders = [] }: { userEmail: string, userProfile: any, pastOrders?: any[] }) {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  
  // Saved Address Extraction
  const uniqueAddresses = Array.from(new Set(pastOrders.map(o => o.shipping_address?.address).filter(Boolean)));
  const [selectedAddress, setSelectedAddress] = useState<string>(uniqueAddresses.length > 0 ? uniqueAddresses[0] as string : 'new');

  // Promo State
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{code: string, discountAmount?: number, discountPercentage?: number} | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  const handleApplyPromo = async () => {
    if (!promoCodeInput.trim()) return;
    setIsApplyingPromo(true);
    setPromoError(null);
    try {
      const { validatePromoCode } = await import('@/app/checkout/actions');
      const result = await validatePromoCode(promoCodeInput.trim());
      if (result.error) {
        setPromoError(result.error);
        setAppliedPromo(null);
      } else if (result.success) {
        setAppliedPromo({
          code: result.code as string,
          discountAmount: result.discountAmount,
          discountPercentage: result.discountPercentage,
        });
        setPromoCodeInput('');
      }
    } catch (err: any) {
      setPromoError('Failed to apply promo code.');
    } finally {
      setIsApplyingPromo(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    // Load Razorpay Script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    setError(null);
    const finalAddress = selectedAddress === 'new' ? fullAddress : selectedAddress;

    startTransition(async () => {
      // 1. Call Server Action to create Order and generate Razorpay ID
      try {
        const { createRazorpayOrder } = await import('@/app/checkout/actions');
        const orderResult = await createRazorpayOrder({
          items: items.map(i => ({ product_id: i.id, quantity: i.quantity, price: i.price })),
          shippingAddress: finalAddress,
          mobileNumber: userProfile?.phone_number || '',
          promoCode: appliedPromo?.code,
        });

        if (orderResult.error) {
          setError(orderResult.error);
          return;
        }

        // 2. Open Razorpay Popup
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY', // This needs to be in .env.local
          amount: orderResult.amount, // in paise
          currency: orderResult.currency,
          name: "Kaneera by Aashi",
          description: "Premium Jewelry Purchase",
          order_id: orderResult.razorpayOrderId,
          handler: async function (response: any) {
            // 3. Verify Payment Signature on Server
            const { verifyPayment } = await import('@/app/checkout/actions');
            const verifyResult = await verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              internal_order_id: orderResult.internalOrderId,
            });

            if (verifyResult.success) {
              clearCart();
              router.push(`/order-confirmation?order_id=${orderResult.internalOrderId}`);
            } else {
              setError("Payment verification failed. Please contact support.");
            }
          },
          prefill: {
            name: userProfile?.full_name || '',
            email: userEmail,
            contact: userProfile?.phone_number || '',
          },
          theme: {
            color: "#D4AF37", // rose-gold/gold matching brand
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response: any){
           setError(`Payment failed: ${response.error.description}`);
        });
        rzp.open();

      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
      }
    });
  };

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="bg-white p-12 text-center border border-charcoal/10 shadow-sm">
        <h2 className="font-serif text-2xl text-charcoal mb-4">Your cart is empty</h2>
        <button onClick={() => router.push('/')} className="bg-charcoal text-white px-8 py-3 text-sm tracking-widest uppercase hover:bg-rose-gold transition-colors">
          Return to Shop
        </button>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const shipping = subtotal > 2000 ? 0 : 150; // Free shipping over 2000
  const total = subtotal + shipping;

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      
      {/* Left Column - Form */}
      <div className="flex-1 space-y-8">
        {error && (
          <div className="bg-red-50 text-red-700 border-l-4 border-rose-gold p-4 text-sm">
            {error}
          </div>
        )}

        <div className="bg-white p-8 border border-charcoal/5 shadow-sm">
          <div className="flex items-center space-x-2 mb-6">
            <ShieldCheck className="w-5 h-5 text-green-600" />
            <h2 className="font-serif text-xl text-charcoal">Contact Details</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-slate mb-1">Email</label>
              <input type="text" disabled value={userEmail} className="w-full border border-charcoal/20 bg-cream/50 px-4 py-3 text-sm cursor-not-allowed text-charcoal/70" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-slate mb-1">Mobile</label>
              <input type="text" disabled value={userProfile?.phone_number || ''} className="w-full border border-charcoal/20 bg-cream/50 px-4 py-3 text-sm cursor-not-allowed text-charcoal/70" />
            </div>
          </div>
          <p className="text-[10px] text-slate mt-2 italic">* Contact details are linked to your secure account profile.</p>
        </div>

        <div className="bg-white p-8 border border-charcoal/5 shadow-sm">
          <div className="flex items-center space-x-2 mb-6">
            <MapPin className="w-5 h-5 text-charcoal" />
            <h2 className="font-serif text-xl text-charcoal">Shipping Address</h2>
          </div>
          
          <div className="space-y-6">
            {uniqueAddresses.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-charcoal">Select Delivery Address</h3>
                <div className="grid grid-cols-1 gap-3">
                  {uniqueAddresses.map((addr: any, idx: number) => (
                    <label key={idx} className={`flex items-start p-4 border cursor-pointer transition-colors ${selectedAddress === addr ? 'border-rose-gold bg-cream/30' : 'border-charcoal/10 hover:border-charcoal/30'}`}>
                      <div className="flex items-center h-5">
                        <input 
                          type="radio" 
                          name="addressSelection" 
                          value={addr}
                          checked={selectedAddress === addr}
                          onChange={() => setSelectedAddress(addr)}
                          className="w-4 h-4 text-rose-gold border-gray-300 focus:ring-rose-gold"
                        />
                      </div>
                      <div className="ml-3 text-sm flex-1">
                        <p className="font-medium text-charcoal">Saved Address {idx + 1}</p>
                        <p className="text-slate mt-1 leading-relaxed">{addr}</p>
                      </div>
                    </label>
                  ))}
                  <label className={`flex items-center p-4 border cursor-pointer transition-colors ${selectedAddress === 'new' ? 'border-rose-gold bg-cream/30' : 'border-charcoal/10 hover:border-charcoal/30'}`}>
                    <div className="flex items-center h-5">
                      <input 
                        type="radio" 
                        name="addressSelection" 
                        value="new"
                        checked={selectedAddress === 'new'}
                        onChange={() => setSelectedAddress('new')}
                        className="w-4 h-4 text-rose-gold border-gray-300 focus:ring-rose-gold"
                      />
                    </div>
                    <div className="ml-3 text-sm font-medium text-charcoal">
                      Use a New Address
                    </div>
                  </label>
                </div>
              </div>
            )}

            {selectedAddress === 'new' && (
              <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4 pt-4 border-t border-charcoal/10 animate-in fade-in slide-in-from-top-4 duration-300">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-slate mb-1">Address / Apartment / Suite</label>
                  <input required value={address} onChange={e => setAddress(e.target.value)} type="text" className="w-full border border-charcoal/20 bg-transparent px-4 py-3 text-sm focus:border-rose-gold focus:outline-none" placeholder="123 Luxury Lane, Apt 4B" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-slate mb-1">City</label>
                    <input required value={city} onChange={e => setCity(e.target.value)} type="text" className="w-full border border-charcoal/20 bg-transparent px-4 py-3 text-sm focus:border-rose-gold focus:outline-none" placeholder="Mumbai" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-slate mb-1">State</label>
                    <input required value={state} onChange={e => setState(e.target.value)} type="text" className="w-full border border-charcoal/20 bg-transparent px-4 py-3 text-sm focus:border-rose-gold focus:outline-none" placeholder="Maharashtra" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-slate mb-1">Pincode</label>
                  <input required value={pincode} onChange={e => setPincode(e.target.value)} type="text" className="w-full border border-charcoal/20 bg-transparent px-4 py-3 text-sm focus:border-rose-gold focus:outline-none" placeholder="400001" />
                </div>
              </form>
            )}
            
            {/* Hidden form just for submission handling when using saved address */}
            {selectedAddress !== 'new' && (
              <form id="checkout-form" onSubmit={handlePlaceOrder} className="hidden"></form>
            )}
          </div>
        </div>

      </div>

      {/* Right Column - Order Summary */}
      <div className="w-full lg:w-96 shrink-0">
        <div className="bg-white p-8 border border-charcoal/5 shadow-sm sticky top-24">
          <h2 className="font-serif text-xl text-charcoal mb-6 border-b border-charcoal/10 pb-4">Order Summary</h2>
          
          <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
            {items.map(item => (
              <div key={item.id} className="flex justify-between items-start text-sm">
                <div className="flex gap-3">
                  <span className="text-slate font-medium">{item.quantity}x</span>
                  <span className="text-charcoal pr-4 truncate w-40">{item.name}</span>
                </div>
                <span className="text-charcoal font-medium shrink-0">₹ {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-charcoal/10 pt-6 mb-6 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-charcoal">Promotional Code</h3>
            {appliedPromo ? (
              <div className="flex justify-between items-center bg-green-50 px-4 py-3 border border-green-200">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">{appliedPromo.code} Applied</span>
                </div>
                <button onClick={() => setAppliedPromo(null)} type="button" className="text-xs text-slate hover:text-red-500 font-semibold uppercase tracking-widest">Remove</button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <div className="flex space-x-2">
                  <input 
                    type="text" 
                    value={promoCodeInput}
                    onChange={e => setPromoCodeInput(e.target.value.toUpperCase())}
                    placeholder="Enter code" 
                    className="flex-1 border border-charcoal/20 bg-transparent px-4 py-2 text-sm focus:border-rose-gold focus:outline-none"
                  />
                  <button 
                    type="button" 
                    onClick={handleApplyPromo}
                    disabled={isApplyingPromo || !promoCodeInput.trim()}
                    className="bg-charcoal text-white px-4 py-2 text-xs tracking-widest uppercase hover:bg-rose-gold transition-colors disabled:opacity-50"
                  >
                    {isApplyingPromo ? '...' : 'Apply'}
                  </button>
                </div>
                {promoError && <p className="text-xs text-red-500">{promoError}</p>}
              </div>
            )}
          </div>

          <div className="border-t border-charcoal/10 pt-4 space-y-3 text-sm mb-6">
            <div className="flex justify-between text-slate">
              <span>Subtotal</span>
              <span>₹ {subtotal.toFixed(2)}</span>
            </div>
            
            {appliedPromo && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({appliedPromo.code})</span>
                <span>- ₹ {(() => {
                  let d = 0;
                  if (appliedPromo.discountPercentage) d = subtotal * (appliedPromo.discountPercentage / 100);
                  else if (appliedPromo.discountAmount) d = appliedPromo.discountAmount;
                  return d.toFixed(2);
                })()}</span>
              </div>
            )}

            <div className="flex justify-between text-slate">
              <span>Shipping</span>
              <span>{(() => {
                  let d = 0;
                  if (appliedPromo) {
                    if (appliedPromo.discountPercentage) d = subtotal * (appliedPromo.discountPercentage / 100);
                    else if (appliedPromo.discountAmount) d = appliedPromo.discountAmount;
                  }
                  return (subtotal - d) > 2000 ? 'Free' : '₹ 150.00';
              })()}</span>
            </div>
            <div className="flex justify-between text-charcoal font-bold text-lg pt-2 border-t border-charcoal/10 mt-2">
              <span>Total</span>
              <span>₹ {(() => {
                  let d = 0;
                  if (appliedPromo) {
                    if (appliedPromo.discountPercentage) d = subtotal * (appliedPromo.discountPercentage / 100);
                    else if (appliedPromo.discountAmount) d = appliedPromo.discountAmount;
                  }
                  const s = (subtotal - d) > 2000 ? 0 : 150;
                  return (subtotal - d + s).toFixed(2);
              })()}</span>
            </div>
          </div>

          <button 
            type="submit" 
            form="checkout-form"
            disabled={isPending}
            className={`w-full bg-charcoal text-white px-8 py-4 text-sm tracking-widest uppercase hover:bg-rose-gold transition-colors duration-300 ${isPending ? 'opacity-70 cursor-wait' : ''}`}
          >
            {isPending ? 'Processing...' : 'Pay with Razorpay'}
          </button>

          <p className="text-[10px] text-center text-slate mt-4">
            Payments are secured by Razorpay with 256-bit encryption.
          </p>
        </div>
      </div>

    </div>
  );
}
