"use client";

import Link from 'next/link';
import { Search, ShoppingBag, User, Menu } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { logout } from '@/app/(auth)/actions';

export default function Navbar({ serverUser = null }: { serverUser?: any }) {
  const toggleCart = useCartStore((state) => state.toggleCart);
  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const pathname = usePathname();
  const router = useRouter();
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-cream/90 backdrop-blur-md border-b border-rose-gold/20">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex-1 md:flex-none text-center md:text-left">
          <span className="font-serif text-2xl font-bold tracking-wider text-charcoal">
            KANEERA
          </span>
          <span className="block text-[10px] uppercase tracking-widest text-slate -mt-1">
            by Aashi
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/category/rings" className="text-sm font-medium text-slate hover:text-rose-gold transition-colors">RINGS</Link>
          <Link href="/category/earrings" className="text-sm font-medium text-slate hover:text-rose-gold transition-colors">EARRINGS</Link>
          <Link href="/category/necklaces" className="text-sm font-medium text-slate hover:text-rose-gold transition-colors">NECKLACES</Link>
          <Link href="/category/bracelets" className="text-sm font-medium text-slate hover:text-rose-gold transition-colors">BRACELETS</Link>
        </nav>

        {/* Icons */}
        <div className="flex items-center space-x-4">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const q = new FormData(e.currentTarget).get('q');
              if (q) router.push(`/search?q=${encodeURIComponent(q.toString())}`);
            }}
            className="hidden sm:flex items-center relative"
          >
            <input 
              name="q"
              type="text" 
              placeholder="Search..." 
              className="w-32 lg:w-48 bg-transparent border-b border-charcoal/20 px-2 py-1 text-sm text-charcoal focus:outline-none focus:border-rose-gold transition-colors placeholder:text-slate-400"
            />
            <button type="submit" className="absolute right-0 p-1 text-charcoal hover:text-rose-gold transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </form>
          
          {mounted && serverUser ? (
            <div className="hidden sm:flex items-center space-x-2 border-l border-charcoal/10 pl-4 ml-2">
              <Link href="/account" className="text-xs font-semibold text-charcoal tracking-widest uppercase hover:text-rose-gold transition-colors">
                Account
              </Link>
              <button 
                onClick={async () => {
                  await logout();
                  window.location.href = '/login';
                }} 
                className="text-xs font-medium text-slate tracking-widest uppercase hover:text-rose-gold transition-colors ml-4"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className="p-2 text-charcoal hover:text-rose-gold transition-colors hidden sm:block">
              <User className="w-5 h-5" />
            </Link>
          )}

          <button 
            onClick={toggleCart}
            className="p-2 text-charcoal hover:text-rose-gold transition-colors relative"
          >
            <ShoppingBag className="w-5 h-5" />
            {mounted && totalItems > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-gold text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
