"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const categories = [
  { name: "Rings", slug: "rings", image: "/category_rings_1779508804127.png" },
  { name: "Bracelets", slug: "bracelets", image: "/category_rings_1779508804127.png" },
  { name: "Pendants", slug: "necklaces", image: "/category_earrings_1779508818040.png" },
  { name: "Earrings", slug: "earrings", image: "/category_earrings_1779508818040.png" },
  { name: "Sets", slug: "sets", image: "/category_rings_1779508804127.png" },
  { name: "Anklets", slug: "anklets", image: "/category_earrings_1779508818040.png" },
];

const banners = [
  { 
    image: "/banner_kriti_style.png", 
    title: "KANEERA'S FAVOURITES", 
    subtitle: "Aashi picked these. Your turn now.",
    button: "Shop Now",
    textColor: "text-charcoal",
    bgHex: "#FFE8E2"
  },
  { 
    image: "/banner_strip_3.png", 
    title: "THE PERFECT GIFT", 
    subtitle: "Beautifully packaged. Unforgettable elegance.",
    button: "Gift Now",
    textColor: "text-charcoal",
    bgHex: "#FAD9D7"
  },
  { 
    image: "/banner_box_style.png", 
    title: "FIRST ACCESS", 
    subtitle: "New designs destined to become bestsellers.",
    button: "Explore",
    textColor: "text-white",
    bgHex: "#4B101D"
  }
];

export default function Home() {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Ultra-Thin Hero Carousel (Strip Format) */}
      <section 
        className="relative w-full h-[250px] sm:h-[300px] md:h-[400px] lg:h-[450px] overflow-hidden group transition-colors duration-1000"
        style={{ backgroundColor: banners[currentBanner].bgHex }}
      >
        <AnimatePresence mode="wait">
          <motion.img 
            key={currentBanner}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            src={banners[currentBanner].image} 
            alt="Kaneera Premium Jewelry"
            className="w-full h-full object-cover object-center absolute inset-0"
          />
        </AnimatePresence>
        
        {/* Dynamic Text Overlay in Center */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBanner}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={staggerContainer}
              className={`text-center pointer-events-auto ${banners[currentBanner].textColor} drop-shadow-md`}
            >
              <motion.h1 variants={fadeInUp} className="font-serif text-2xl md:text-4xl lg:text-5xl tracking-wide mb-2 md:mb-4 whitespace-nowrap">
                {banners[currentBanner].title}
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-xs md:text-lg font-light mb-4 md:mb-6">
                {banners[currentBanner].subtitle}
              </motion.p>
              <motion.div variants={fadeInUp}>
                <Link href="/category/all">
                  <Button className="px-5 md:px-8 py-3 md:py-6 text-[10px] md:text-sm tracking-widest uppercase bg-[#D4AF37] text-white hover:bg-[#c4a132] rounded-full shadow-lg transition-transform hover:-translate-y-1 border-none">
                    {banners[currentBanner].button}
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
          {banners.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrentBanner(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentBanner ? 'w-6 bg-[#D4AF37]' : 'w-1.5 bg-white/50 hover:bg-white'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Shop by Category - Pill Carousel */}
      <section className="py-12 md:py-16 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto no-scrollbar gap-4 md:gap-8 pb-8 justify-start md:justify-center px-4 snap-x">
            {categories.map((category, index) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                key={category.slug + index}
                className="flex flex-col items-center group flex-shrink-0 snap-center"
              >
                <Link href={`/category/${category.slug}`} className="flex flex-col items-center">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-[#FFF0F0] rounded-[30px] overflow-hidden mb-3 md:mb-4 shadow-sm border-[3px] border-[#FFE4E4] group-hover:border-[#D4AF37] group-hover:shadow-md transition-all duration-300">
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      className="w-full h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="text-charcoal font-medium text-sm md:text-base">{category.name}</h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Luxury Within Reach (Pill Buttons) */}
      <section className="py-8 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 max-w-4xl mx-auto">
            <Link href="/category/all?maxPrice=399" className="w-full md:w-1/3">
              <div className="bg-gradient-to-r from-[#FFF0F0] to-[#FFE4E4] rounded-full py-4 text-center shadow-sm hover:shadow-md transition-shadow group cursor-pointer border border-[#FFF0F0]">
                <span className="font-medium text-charcoal text-base md:text-lg group-hover:text-[#D4AF37] transition-colors">Under ₹399</span>
              </div>
            </Link>
            <Link href="/category/all?maxPrice=799" className="w-full md:w-1/3">
              <div className="bg-gradient-to-r from-[#FFF0F0] to-[#FFE4E4] rounded-full py-4 text-center shadow-sm hover:shadow-md transition-shadow group cursor-pointer border border-[#FFF0F0]">
                <span className="font-medium text-charcoal text-base md:text-lg group-hover:text-[#D4AF37] transition-colors">Under ₹799</span>
              </div>
            </Link>
            <Link href="/category/all" className="w-full md:w-1/3">
              <div className="bg-gradient-to-r from-[#FFF9E6] to-[#FFF4CC] rounded-full py-4 text-center shadow-sm hover:shadow-md transition-shadow group cursor-pointer border border-[#FFF9E6]">
                <span className="font-medium text-charcoal text-base md:text-lg group-hover:text-[#D4AF37] transition-colors">Premium Gifts</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Shop by Bond - Realistic Lifestyle Grid */}
      <section className="py-16 md:py-20 bg-[#FDFBF7]">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-charcoal">Shop by Recipient</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
            {[
              { title: "Wife", img: "/bond_wife_1779595089303.png", query: "wife" },
              { title: "Mother", img: "/bond_mother_real.png", query: "mother" },
              { title: "Sister", img: "/bond_sister_real.png", query: "sister" },
              { title: "Friends", img: "/bond_friends_1779595135834.png", query: "friends" }
            ].map((bond, idx) => (
              <Link href={`/category/all?recipient=${bond.query}`} key={idx} className="group flex flex-col items-center">
                <div className="w-full aspect-square rounded-[2rem] md:rounded-[3rem] overflow-hidden mb-3 bg-slate-100 shadow-sm group-hover:shadow-lg transition-shadow duration-300">
                   <img 
                      src={bond.img} 
                      alt={`Gifts for ${bond.title}`} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                </div>
                <div className="w-full text-center mt-2">
                  <h3 className="text-charcoal font-medium text-lg">{bond.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Global styles for hiding scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
