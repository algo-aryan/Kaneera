"use client";

import Link from 'next/link';
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-charcoal text-cream py-12 mt-auto">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <span className="font-serif text-2xl font-bold tracking-wider text-white">
            KANEERA
          </span>
          <span className="block text-xs uppercase tracking-widest text-slate-300 mt-1">
            by Aashi
          </span>
          <p className="mt-4 text-sm text-gray-400">
            Premium, elegant, and timeless jewelry designed to make every moment special.
          </p>
        </div>
        
        <div>
          <h4 className="font-serif text-lg font-semibold text-rose-gold mb-4">Shop</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link href="/category/rings" className="hover:text-white transition-colors">Rings</Link></li>
            <li><Link href="/category/earrings" className="hover:text-white transition-colors">Earrings</Link></li>
            <li><Link href="/category/bracelets" className="hover:text-white transition-colors">Bracelets</Link></li>
            <li><Link href="/category/anklets" className="hover:text-white transition-colors">Anklets</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg font-semibold text-rose-gold mb-4">Customer Care</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping & Delivery</Link></li>
            <li><Link href="/returns" className="hover:text-white transition-colors">Returns & Exchanges</Link></li>
            <li><Link href="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg font-semibold text-rose-gold mb-4">Newsletter</h4>
          <p className="text-sm text-gray-400 mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
          <form className="flex" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="px-4 py-2 w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-rose-gold rounded-l-md"
            />
            <button className="px-4 py-2 bg-rose-gold text-white font-medium hover:bg-rose-gold/90 transition-colors rounded-r-md">
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-white/10 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Kaneera by Aashi. All rights reserved.
      </div>
    </footer>
  );
}
