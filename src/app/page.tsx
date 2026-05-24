"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const categories = [
  { name: "Rings", slug: "rings", image: "/category_rings_1779508804127.png" },
  { name: "Earrings", slug: "earrings", image: "/category_earrings_1779508818040.png" },
  // using fallbacks for remaining categories to maintain aesthetic
  { name: "Bracelets", slug: "bracelets", image: "/category_rings_1779508804127.png" },
  { name: "Anklets", slug: "anklets", image: "/category_earrings_1779508818040.png" },
];

const banners = [
  "/hero_banner_giva_1779509207364.png", // fallback textless if first one fails
  "/hero_banner_giva_1779595073285.png"
];

export default function Home() {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section Carousel - Strip format */}
      <section className="relative w-full aspect-[4/3] md:aspect-[21/9] bg-[#FFF8F8] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img 
            key={currentBanner}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            src={banners[currentBanner]} 
            alt="Kaneera Premium Jewelry"
            className="w-full h-full object-cover object-center absolute inset-0"
            onError={(e) => {
              // fallback if image fails to load (since we are injecting artifacts)
              (e.target as HTMLImageElement).src = "/hero_banner_no_text_1779509207364.png";
            }}
          />
        </AnimatePresence>
        
        {/* Soft text overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFF8F8]/90 via-[#FFF8F8]/50 to-transparent flex items-center justify-start px-8 md:px-24 z-10 pointer-events-none">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-xl pointer-events-auto"
          >
            <motion.span variants={fadeInUp} className="text-[#D4AF37] font-sans font-semibold tracking-widest uppercase text-xs md:text-sm mb-4 block">
              The New Standard
            </motion.span>
            <motion.h1 variants={fadeInUp} className="font-serif text-4xl md:text-6xl font-bold text-charcoal leading-[1.1] mb-6 drop-shadow-sm">
              Everyday <br/> <span className="text-[#D4AF37] italic font-light">Elegance.</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-base md:text-lg text-charcoal mb-8 max-w-md font-medium leading-relaxed drop-shadow-sm">
              Fine silver jewelry designed to elevate your everyday moments.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Link href="/category/all">
                <Button size="lg" className="px-8 md:px-10 py-5 md:py-6 text-xs md:text-sm tracking-widest uppercase bg-[#D4AF37] text-white hover:bg-[#c4a132] shadow-[0_8px_30px_rgb(212,175,55,0.25)] hover:shadow-[0_8px_30px_rgb(212,175,55,0.4)] transition-all duration-300 rounded-full transform hover:-translate-y-1">
                  Shop Now
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
          {banners.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrentBanner(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentBanner ? 'w-6 bg-[#D4AF37]' : 'w-1.5 bg-charcoal/30 hover:bg-charcoal/50'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Luxury Within Reach (Pill Buttons) */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-center text-charcoal mb-10">Luxury Within Reach</h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 max-w-4xl mx-auto">
            <Link href="/category/all" className="w-full md:w-1/3">
              <div className="bg-gradient-to-r from-[#FFF0F0] to-[#FFE4E4] rounded-full py-5 text-center shadow-sm hover:shadow-md transition-shadow group cursor-pointer border border-[#FFF0F0]">
                <span className="font-medium text-charcoal text-lg group-hover:text-[#D4AF37] transition-colors">Under ₹1499</span>
              </div>
            </Link>
            <Link href="/category/all" className="w-full md:w-1/3">
              <div className="bg-gradient-to-r from-[#FFF0F0] to-[#FFE4E4] rounded-full py-5 text-center shadow-sm hover:shadow-md transition-shadow group cursor-pointer border border-[#FFF0F0]">
                <span className="font-medium text-charcoal text-lg group-hover:text-[#D4AF37] transition-colors">Under ₹1999</span>
              </div>
            </Link>
            <Link href="/category/all" className="w-full md:w-1/3">
              <div className="bg-gradient-to-r from-[#FFF9E6] to-[#FFF4CC] rounded-full py-5 text-center shadow-sm hover:shadow-md transition-shadow group cursor-pointer border border-[#FFF9E6]">
                <span className="font-medium text-charcoal text-lg group-hover:text-[#D4AF37] transition-colors">Premium Gifts</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Shop by Category - Clean GIVA style */}
      <section className="py-16 bg-[#FDFBF7]">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-charcoal">Shop by Category</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {categories.map((category, index) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                key={category.slug}
                className="flex flex-col items-center group"
              >
                <Link href={`/category/${category.slug}`} className="w-full flex flex-col items-center">
                  <div className="w-full aspect-square bg-[#FFF8F8] rounded-3xl overflow-hidden mb-4 shadow-sm group-hover:shadow-lg transition-shadow duration-300 relative">
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-200 to-slate-300"></div>
                    </div>
                  </div>
                  <h3 className="text-charcoal font-medium text-lg mb-1">{category.name}</h3>
                  <span className="text-[#D4AF37] text-xs font-semibold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">Explore</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Bond - AI Generated E-commerce grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-charcoal">Shop by Bond</h2>
            <p className="text-slate mt-2">Find the perfect piece for her.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
            {[
              { title: "Wife", img: "/bond_wife_1779595089303.png" },
              { title: "Mother", img: "/bond_mother_1779595104900.png" },
              { title: "Sister", img: "/bond_sister_1779595120958.png" },
              { title: "Friends", img: "/bond_friends_1779595135834.png" }
            ].map((bond, idx) => (
              <Link href="/category/all" key={idx} className="group flex flex-col items-center">
                <div className="w-full aspect-square rounded-2xl overflow-hidden mb-3 bg-slate-50 relative">
                   <img 
                      src={bond.img} 
                      alt={`Gifts for ${bond.title}`} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500"></div>
                </div>
                <div className="bg-slate-100/80 backdrop-blur-sm w-full py-2.5 rounded-lg text-center group-hover:bg-[#FFF8F8] transition-colors">
                  <h3 className="text-charcoal font-medium text-base">{bond.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
