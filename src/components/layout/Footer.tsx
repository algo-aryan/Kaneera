"use client";
import Link from 'next/link';
import { usePathname } from "next/navigation";
import { useState } from 'react';
import { Mail } from 'lucide-react';

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function Footer() {
  const pathname = usePathname();
  const [subscribed, setSubscribed] = useState(false);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 5000); // Reset after 5s
  };

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
          <h4 className="font-serif text-lg font-semibold text-rose-gold mb-4">Contact Us</h4>
          <ul className="space-y-4 text-sm text-gray-400">
            <li>
              <a href="mailto:kaneerabyaashi@gmail.com" className="hover:text-white transition-colors flex items-center gap-2">
                <Mail className="w-4 h-4" /> kaneerabyaashi@gmail.com
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/kaneerabyaashi/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
                <InstagramIcon className="w-4 h-4" /> @kaneerabyaashi
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg font-semibold text-rose-gold mb-4">Newsletter</h4>
          <p className="text-sm text-gray-400 mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
          {subscribed ? (
            <div className="px-4 py-3 bg-white/10 border border-rose-gold/50 rounded-md text-rose-gold text-sm font-medium animate-in fade-in duration-500">
              Thank you for subscribing! Welcome to Kaneera.
            </div>
          ) : (
            <form className="flex" onSubmit={handleSubscribe}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                required
                className="px-4 py-2 w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-rose-gold rounded-l-md transition-colors"
              />
              <button type="submit" className="px-4 py-2 bg-rose-gold text-white font-medium hover:bg-rose-gold/90 transition-colors rounded-r-md">
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-white/10 text-center text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>&copy; {new Date().getFullYear()} Kaneera by Aashi. All rights reserved.</div>
      </div>
    </footer>
  );
}
