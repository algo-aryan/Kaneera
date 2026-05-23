import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://kaneera.in'),
  title: {
    default: "Kaneera by Aashi | Premium Jewelry",
    template: "%s | Kaneera by Aashi"
  },
  description: "Discover elegant, premium jewelry including rings, earrings, bracelets, and anklets.",
  openGraph: {
    type: 'website',
    siteName: 'Kaneera by Aashi',
    title: 'Kaneera by Aashi | Premium Jewelry',
    description: 'Discover elegant, premium jewelry including rings, earrings, bracelets, and anklets.',
    images: [{
      url: '/hero_banner_jewelry_1779508789302.png',
      width: 1200,
      height: 630,
      alt: 'Kaneera by Aashi Jewelry'
    }]
  },
  twitter: {
    card: 'summary_large_image',
  }
};

import { createClient } from '@/utils/supabase/server';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full scroll-smooth`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col font-sans text-charcoal bg-cream selection:bg-rose-gold selection:text-white">
        <Navbar serverUser={user} />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
