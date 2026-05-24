"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
    image: "/carousel_banner_1.png", 
    title: "THE ART OF ELEGANCE", 
    subtitle: "Discover our latest collection of premium jewelry.",
    button: "Shop Now",
    textColor: "text-charcoal",
    bgHex: "#FAF5F0"
  },
  { 
    image: "/carousel_banner_2.png", 
    title: "TIMELESS BEAUTY", 
    subtitle: "Exquisite pieces that define sophistication.",
    button: "Explore",
    textColor: "text-charcoal",
    bgHex: "#F8EFEA"
  },
  { 
    image: "/carousel_banner_3.png", 
    title: "THE PERFECT GIFT", 
    subtitle: "Beautifully packaged. Unforgettable elegance.",
    button: "Gift Now",
    textColor: "text-charcoal",
    bgHex: "#F5F0E6"
  }
];

export default function Home() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = window.innerWidth < 768 ? 200 : 400;
      categoryScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

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
      {/* Hero Carousel */}
      <section 
        className="relative w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-[3/1] lg:aspect-[4/1] overflow-hidden group transition-colors duration-1000"
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
              <motion.h1 variants={fadeInUp} className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wide mb-2 md:mb-4 whitespace-nowrap">
                {banners[currentBanner].title}
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-sm md:text-xl font-light mb-4 md:mb-6">
                {banners[currentBanner].subtitle}
              </motion.p>
              <motion.div variants={fadeInUp}>
                <Link href="/category/all">
                  <Button className="px-6 md:px-10 py-4 md:py-6 text-xs md:text-sm tracking-widest uppercase bg-[#D4AF37] text-white hover:bg-[#c4a132] rounded-full shadow-lg transition-transform hover:-translate-y-1 border-none">
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
              className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentBanner ? 'w-8 bg-[#D4AF37]' : 'w-2 bg-white/50 hover:bg-white'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Shop by Category - Pill Carousel */}
      <section className="py-12 md:py-20 bg-[#FDF8F5] overflow-hidden relative border-t border-slate-100">
        <div className="container mx-auto px-4 relative">
          
          <div className="text-center mb-8 md:mb-12 relative z-10">
            <h2 className="font-serif italic text-3xl md:text-5xl font-medium text-[#D4AF37] drop-shadow-sm -rotate-2 inline-block">
              ✨ Shop by Categories ✨
            </h2>
          </div>

          <div className="relative group/carousel">
            {/* Scroll Arrows */}
            <button 
              onClick={() => scrollCategories('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-6 z-20 bg-white p-2 md:p-3 rounded-full shadow-lg text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-all opacity-0 group-hover/carousel:opacity-100 hidden sm:block"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={() => scrollCategories('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-6 z-20 bg-white p-2 md:p-3 rounded-full shadow-lg text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-all opacity-0 group-hover/carousel:opacity-100 hidden sm:block"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div ref={categoryScrollRef} className="flex overflow-x-auto no-scrollbar gap-6 md:gap-10 pb-8 justify-start md:justify-center px-4 snap-x scroll-smooth">
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
                    <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 bg-white rounded-2xl overflow-hidden mb-4 shadow-sm border-[3px] border-[#FFE4E4] group-hover:border-[#D4AF37] group-hover:shadow-md transition-all duration-300 p-4 md:p-6">
                      <img 
                        src={category.image} 
                        alt={category.name} 
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <h3 className="text-charcoal font-medium text-base md:text-lg">{category.name}</h3>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Luxury Within Reach (Full Width) */}
      <section className="py-16 md:py-24 bg-[#F7D8C6] border-y border-[#F3C2A9] relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[150%] rounded-full bg-white/40 blur-3xl transform rotate-12"></div>
          <div className="absolute top-[30%] -right-[10%] w-[40%] h-[120%] rounded-full bg-white/30 blur-3xl transform -rotate-12"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="w-full text-center mb-10">
            <h2 className="text-charcoal text-3xl md:text-5xl font-serif font-medium tracking-wide">Luxury Within Reach</h2>
            <p className="text-gray-800 mt-3 font-light text-lg">Curated collections of premium jewelry, thoughtfully priced.</p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 max-w-5xl mx-auto">
            <Link href="/category/all?maxPrice=1499" className="w-full md:w-1/3">
              <div className="bg-white/80 backdrop-blur-sm rounded-full py-5 text-center shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all hover:-translate-y-1 group cursor-pointer border border-white">
                <span className="font-medium text-[#902A46] text-lg md:text-xl tracking-wide group-hover:text-charcoal transition-colors">Under ₹1499</span>
              </div>
            </Link>
            <Link href="/category/all?maxPrice=1999" className="w-full md:w-1/3">
              <div className="bg-white/80 backdrop-blur-sm rounded-full py-5 text-center shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all hover:-translate-y-1 group cursor-pointer border border-white">
                <span className="font-medium text-[#902A46] text-lg md:text-xl tracking-wide group-hover:text-charcoal transition-colors">Under ₹1999</span>
              </div>
            </Link>
            <Link href="/category/all" className="w-full md:w-1/3">
              <div className="bg-white/80 backdrop-blur-sm rounded-full py-5 text-center shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all hover:-translate-y-1 group cursor-pointer border border-white">
                <span className="font-medium text-[#902A46] text-lg md:text-xl tracking-wide group-hover:text-charcoal transition-colors">Premium Gifts</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* First Access Banner (Full Width) */}
      <section className="bg-[#0f0f0f] w-full">
        <Link href="/category/all" className="block relative group w-full">
          <div className="w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-[3/1] lg:aspect-[4/1] overflow-hidden">
            <img 
              src="/first_access_banner_new.png" 
              alt="First Access - Explore the New Collection" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90 group-hover:opacity-100"
            />
          </div>
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 pointer-events-none"></div>
        </Link>
      </section>

      {/* Shop by Bond - Stylish Lifestyle Grid */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-5xl font-medium text-charcoal mb-4">Shop by Recipient</h2>
            <p className="text-gray-500 font-light text-lg">Perfectly crafted pieces to celebrate the ones you love.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
            {[
              { title: "Wife", img: "/bond_wife_1779595089303.png", query: "wife" },
              { title: "Mother", img: "/bond_mother_real.png", query: "mother" },
              { title: "Sister", img: "/bond_sister_real.png", query: "sister" },
              { title: "Friends", img: "/bond_friends_1779595135834.png", query: "friends" }
            ].map((bond, idx) => (
              <Link href={`/category/all?recipient=${bond.query}`} key={idx} className="group flex flex-col items-center">
                <div className="w-full aspect-[3/4] md:aspect-[4/5] rounded-t-full rounded-b-2xl overflow-hidden mb-5 bg-slate-50 shadow-sm border border-slate-100 group-hover:shadow-xl transition-all duration-500 relative">
                   <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-500 z-10 pointer-events-none"></div>
                   <img 
                      src={bond.img} 
                      alt={`Gifts for ${bond.title}`} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                </div>
                <div className="w-full text-center mt-1">
                  <h3 className="text-charcoal font-medium text-xl uppercase tracking-widest">{bond.title}</h3>
                  <div className="w-8 h-[2px] bg-[#D4AF37] mx-auto mt-3 transition-all duration-300 group-hover:w-16"></div>
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
