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

  const announcements = [
    "Free Shipping Over ₹799",
    "Use Code WELCOME20 for 20% Off",
    "Fast Pan-India Delivery"
  ];
  const [announcementIndex, setAnnouncementIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white flex flex-col shadow-sm">
      {/* Top Announcement Bar */}
      <div className="w-full bg-[#FFECEC] text-charcoal py-2 text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-center overflow-hidden transition-all duration-500">
        <p key={announcementIndex} className="animate-fade-in">
          {announcements[announcementIndex]}
        </p>
      </div>

      {/* Main Navbar */}
      <div className="container mx-auto px-4 h-20 grid grid-cols-3 items-center gap-4">
        {/* Logo (Left) */}
        <div className="flex justify-start">
          <Link href="/" className="flex items-center group">
            <span className="font-serif text-3xl sm:text-4xl italic font-bold tracking-widest text-charcoal group-hover:text-[#D4AF37] transition-colors">
              KANEERA
            </span>
          </Link>
        </div>

        {/* Search Bar (Center) */}
        <div className="hidden md:flex justify-center w-full">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const q = new FormData(e.currentTarget).get('q');
              if (q) router.push(`/search?q=${encodeURIComponent(q.toString())}`);
            }}
            className="w-full max-w-xl flex items-center relative"
          >
            <input 
              name="q"
              type="text" 
              placeholder="Search for Jewellery..." 
              className="w-full bg-white border border-slate-200 rounded-md pl-4 pr-10 py-2.5 text-sm text-charcoal focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all placeholder:text-slate-400"
            />
            <button type="submit" className="absolute right-3 p-1 text-slate hover:text-[#D4AF37] transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Icons (Right) */}
        <div className="flex items-center justify-end space-x-6 sm:space-x-8">
          {mounted && serverUser ? (
            <Link href="/account" className="hidden sm:flex flex-col items-center group">
              <User className="w-5 h-5 text-charcoal group-hover:text-[#D4AF37] transition-colors" />
              <span className="text-[9px] uppercase tracking-wider font-semibold text-charcoal mt-1 group-hover:text-[#D4AF37] transition-colors">Account</span>
            </Link>
          ) : (
            <Link href="/login" className="hidden sm:flex flex-col items-center group">
              <User className="w-5 h-5 text-charcoal group-hover:text-[#D4AF37] transition-colors" />
              <span className="text-[9px] uppercase tracking-wider font-semibold text-charcoal mt-1 group-hover:text-[#D4AF37] transition-colors">Login</span>
            </Link>
          )}

          <button 
            onClick={toggleCart}
            className="flex flex-col items-center group relative"
          >
            <ShoppingBag className="w-5 h-5 text-charcoal group-hover:text-[#D4AF37] transition-colors" />
            <span className="text-[9px] uppercase tracking-wider font-semibold text-charcoal mt-1 group-hover:text-[#D4AF37] transition-colors">Cart</span>
            {mounted && totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1 w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Sub Navbar (Categories) */}
      <div className="hidden md:flex justify-center items-center space-x-10 h-12 bg-white border-t border-slate-100 border-b border-slate-100">
        <Link href="/category/all" className="text-sm font-medium text-charcoal hover:text-[#D4AF37] transition-colors relative group">
          Shop by Category
          <div className="absolute -bottom-3.5 left-0 w-full h-[2px] bg-[#D4AF37] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
        </Link>
        <Link href="/category/rings" className="text-sm font-medium text-charcoal hover:text-[#D4AF37] transition-colors relative group">
          Rings
          <div className="absolute -bottom-3.5 left-0 w-full h-[2px] bg-[#D4AF37] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
        </Link>
        <Link href="/category/earrings" className="text-sm font-medium text-charcoal hover:text-[#D4AF37] transition-colors relative group">
          Earrings
          <div className="absolute -bottom-3.5 left-0 w-full h-[2px] bg-[#D4AF37] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
        </Link>
        <Link href="/category/bracelets" className="text-sm font-medium text-charcoal hover:text-[#D4AF37] transition-colors relative group">
          Bracelets
          <div className="absolute -bottom-3.5 left-0 w-full h-[2px] bg-[#D4AF37] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
        </Link>
        <Link href="/category/pendants" className="text-sm font-medium text-charcoal hover:text-[#D4AF37] transition-colors relative group">
          Pendants
          <div className="absolute -bottom-3.5 left-0 w-full h-[2px] bg-[#D4AF37] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
        </Link>
      </div>

      {/* Mobile Search Bar (Only visible on small screens) */}
      <div className="md:hidden px-4 pb-3">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            const q = new FormData(e.currentTarget).get('q');
            if (q) router.push(`/search?q=${encodeURIComponent(q.toString())}`);
          }}
          className="flex flex-1 items-center relative"
        >
          <input 
            name="q"
            type="text" 
            placeholder="Search for Jewellery..." 
            className="w-full bg-slate-50 border border-slate-200 rounded-full pl-4 pr-10 py-2 text-sm text-charcoal focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
          />
          <button type="submit" className="absolute right-3 p-1 text-slate hover:text-[#D4AF37] transition-colors">
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>
    </header>
  );
}
