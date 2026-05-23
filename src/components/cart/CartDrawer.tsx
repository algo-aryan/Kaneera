"use client";

import { useCartStore } from '@/store/useCartStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useEffect } from 'react';

export function CartDrawer() {
  const { isOpen, items, toggleCart, updateQuantity, removeItem, getTotalPrice, clearCart } = useCartStore();
  const pathname = usePathname();

  // One-time clear of old mock items to prevent UUID errors on checkout
  useEffect(() => {
    if (items.some(item => item.id.startsWith('prod-'))) {
      clearCart();
    }
  }, [items, clearCart]);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="cart-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={toggleCart}
          className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm z-[100]"
        />
      )}
      {isOpen && (
        <motion.div
          key="cart-drawer"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-cream shadow-2xl z-[101] flex flex-col"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-charcoal/10 bg-white">
              <h2 className="font-serif text-2xl text-charcoal font-bold flex items-center">
                <ShoppingBag className="w-5 h-5 mr-3 text-rose-gold" />
                Your Cart
              </h2>
              <button 
                onClick={toggleCart}
                className="p-2 text-slate hover:text-rose-gold transition-colors rounded-full hover:bg-cream"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-slate">
                  <ShoppingBag className="w-16 h-16 text-rose-gold/30" />
                  <p className="font-medium text-lg">Your cart is beautifully empty.</p>
                  <p className="text-sm font-light">Discover our collections and find something extraordinary.</p>
                  <Button 
                    onClick={toggleCart}
                    variant="outline" 
                    className="mt-4 border-rose-gold text-rose-gold hover:bg-rose-gold hover:text-white rounded-none tracking-widest uppercase text-xs px-8"
                  >
                    Start Shopping
                  </Button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={item.id} 
                    className="flex gap-4 bg-white p-3 shadow-sm border border-charcoal/5"
                  >
                    <div className="w-24 h-32 shrink-0 bg-[#F5F5F5]">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                    
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start">
                        <Link href={`/product/${item.slug}`} onClick={toggleCart}>
                          <h3 className="font-serif text-charcoal font-medium hover:text-rose-gold transition-colors leading-tight pr-4">
                            {item.name}
                          </h3>
                        </Link>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-slate hover:text-red-500 transition-colors p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <p className="text-sm text-slate font-medium mt-1">₹ {item.price.toFixed(2)}</p>
                      
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center border border-charcoal/20">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 text-slate hover:text-rose-gold transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium text-charcoal">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 text-slate hover:text-rose-gold transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer / Checkout */}
            {items.length > 0 && (
              <div className="p-6 bg-white border-t border-charcoal/10 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate text-sm uppercase tracking-widest font-semibold">Subtotal</span>
                  <span className="font-serif text-2xl text-charcoal font-medium">₹ {getTotalPrice().toFixed(2)}</span>
                </div>
                <p className="text-xs text-slate mb-6 text-center font-light">Shipping & taxes calculated at checkout.</p>
                <Link href="/checkout" onClick={toggleCart}>
                  <Button className="w-full bg-charcoal text-white hover:bg-rose-gold rounded-none py-6 text-sm tracking-widest uppercase transition-colors duration-300">
                    Proceed to Checkout
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        )}
    </AnimatePresence>
  );
}
