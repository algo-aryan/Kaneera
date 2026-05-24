"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "What materials are used in your jewelry?",
    answer: "Our pieces are meticulously crafted with premium materials, including 18k gold plating, sterling silver, and ethically sourced cubic zirconia, designed for timeless elegance and durability."
  },
  {
    question: "How should I care for my jewelry?",
    answer: "To maintain the brilliance of your Kaneera pieces, avoid contact with water, perfumes, and harsh chemicals. Store them in the provided luxury box when not in use."
  },
  {
    question: "Do you offer custom or personalized designs?",
    answer: "Currently, we offer curated, limited-edition collections. We do not take custom orders, but our pieces are carefully designed to make perfect, memorable gifts for your loved ones."
  },
  {
    question: "What is your shipping timeline?",
    answer: "Orders are typically processed within 24-48 hours and delivered within 3-5 business days across India. All orders come in our signature premium packaging."
  }
];

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
    image: "/new_carousel_1.png", 
    title: "ETHEREAL GLOW", 
    subtitle: "Minimalist designs for everyday sophistication.",
    button: "Shop The Look",
    textColor: "text-[#4A3B32]",
    bgHex: "#F6F1EA"
  },
  { 
    image: "/new_carousel_2.png", 
    title: "REGAL RADIANCE", 
    subtitle: "Statement pieces crafted for unforgettable moments.",
    button: "Explore Collection",
    textColor: "text-[#2A1E22]",
    bgHex: "#F2EDE4"
  },
  { 
    image: "/new_carousel_3.png", 
    title: "MODERN HEIRLOOMS", 
    subtitle: "Timeless jewelry that shines with your unique light.",
    button: "Discover More",
    textColor: "text-[#3D2C2A]",
    bgHex: "#EAE6DF"
  }
];

export default function Home() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
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
        
        {/* Dynamic Text Overlay Left-Aligned */}
        <div className="absolute inset-0 flex items-center justify-start z-10 pointer-events-none px-6 sm:px-12 md:px-24 w-full md:w-3/5">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBanner}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={staggerContainer}
              className={`text-left pointer-events-auto ${banners[currentBanner].textColor} drop-shadow-sm`}
            >
              <motion.h1 variants={fadeInUp} className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wide mb-2 md:mb-4">
                {banners[currentBanner].title}
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-sm md:text-xl font-light mb-6 md:mb-8 max-w-md">
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
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#FDE8EF] via-[#FDF8F5] to-[#E8E2D2] border-y border-[#F3C2A9] relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[150%] rounded-full bg-white/60 blur-3xl transform rotate-12"></div>
          <div className="absolute top-[30%] -right-[10%] w-[40%] h-[120%] rounded-full bg-white/50 blur-3xl transform -rotate-12"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="w-full text-center mb-12">
            <h2 className="text-[#902A46] text-4xl md:text-6xl font-serif italic font-medium tracking-wide drop-shadow-sm">Luxury Within Reach</h2>
            <p className="text-gray-700 mt-4 font-light text-lg">Curated collections of premium jewelry, thoughtfully priced.</p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 max-w-6xl mx-auto">
            <Link href="/category/under-399" className="w-full md:w-1/3">
              <div className="bg-gradient-to-r from-[#D78B9B] to-[#C97284] rounded-full py-5 text-center shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group cursor-pointer border-2 border-white/50">
                <span className="font-medium text-white text-lg md:text-xl tracking-wide">Under ₹399</span>
              </div>
            </Link>
            <Link href="/category/under-799" className="w-full md:w-1/3">
              <div className="bg-gradient-to-r from-[#D4AF37] to-[#C19B2E] rounded-full py-5 text-center shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group cursor-pointer border-2 border-white/50">
                <span className="font-medium text-white text-lg md:text-xl tracking-wide">Under ₹799</span>
              </div>
            </Link>
            <Link href="/category/all" className="w-full md:w-1/3">
              <div className="bg-gradient-to-r from-[#8C9AA9] to-[#718093] rounded-full py-5 text-center shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group cursor-pointer border-2 border-white/50">
                <span className="font-medium text-white text-lg md:text-xl tracking-wide">All Collections</span>
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
              src="/new_first_access_banner.png" 
              alt="First Access - Explore the New Collection" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90 group-hover:opacity-100"
            />
          </div>
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 pointer-events-none"></div>
        </Link>
      </section>

      {/* Shop by Bond - Stylish Lifestyle Grid */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-[#F2EFE9] to-[#EAE6DE]">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif italic text-4xl md:text-6xl font-medium text-charcoal mb-4 drop-shadow-sm">Shop by Recipient</h2>
            <p className="text-gray-600 font-light text-lg">Perfectly crafted pieces to celebrate the ones you love.</p>
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
      
      {/* FAQ Section (End to End) */}
      <section className="py-24 bg-gradient-to-r from-[#FFF0F5] to-[#FBE8EF]">
        <div className="container mx-auto px-4 max-w-5xl flex flex-col md:flex-row gap-12 items-start">
          <div className="w-full md:w-1/3 sticky top-24">
            <h2 className="font-serif italic text-4xl md:text-5xl font-medium text-[#902A46] mb-4">Questions? <br/>We have answers.</h2>
            <p className="text-gray-600 font-light mb-8">Everything you need to know about Kaneera's premium jewelry, shipping, and care.</p>
            <div className="w-16 h-[2px] bg-[#D4AF37]"></div>
          </div>
          
          <div className="w-full md:w-2/3 space-y-2 bg-white/60 backdrop-blur-md p-6 md:p-10 rounded-3xl shadow-sm border border-white">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="border-b border-[#902A46]/10 pb-4 last:border-0 last:pb-0"
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex justify-between items-center text-left py-4 group"
                >
                  <span className="font-medium text-lg text-charcoal group-hover:text-[#902A46] transition-colors">{faq.question}</span>
                  <div className="text-[#902A46]/60 group-hover:text-[#902A46] transition-colors ml-4 flex-shrink-0 bg-white p-2 rounded-full shadow-sm">
                    {openFaq === index ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-4 text-gray-600 font-light leading-relaxed pr-8">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
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
