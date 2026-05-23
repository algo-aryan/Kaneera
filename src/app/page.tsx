"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { motion, Variants } from "framer-motion";

const categories = [
  { name: "Rings", slug: "rings", image: "/category_rings_1779508804127.png" },
  { name: "Earrings", slug: "earrings", image: "/category_earrings_1779508818040.png" },
  // using fallbacks for remaining categories to maintain aesthetic
  { name: "Bracelets", slug: "bracelets", image: "/category_rings_1779508804127.png" },
  { name: "Anklets", slug: "anklets", image: "/category_earrings_1779508818040.png" },
];

export default function Home() {
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
    <div className="flex flex-col min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden flex items-end md:items-center justify-center bg-cream pb-20 md:pb-0" style={{ height: '90vh' }}>
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full flex justify-end items-end"
        >
          {/* Using textless beautiful lady cut-out image */}
          <img 
            src="/hero_banner_no_text.png" 
            alt="Kaneera Premium Jewelry"
            className="w-full md:w-3/4 h-full object-cover object-top mix-blend-multiply opacity-95"
          />
        </motion.div>
        
        <div className="container mx-auto px-4 sm:px-8 relative z-10 flex flex-col items-start w-full">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-2xl bg-cream/30 p-8 md:p-12 backdrop-blur-sm shadow-xl rounded-md border border-white/50"
          >
            <motion.span variants={fadeInUp} className="text-rose-gold font-sans font-semibold tracking-[0.2em] uppercase text-xs md:text-sm mb-6 block drop-shadow-sm">
              The Kaneera Signature
            </motion.span>
            <motion.h1 variants={fadeInUp} className="font-serif text-5xl md:text-7xl font-bold text-charcoal leading-[1.1] mb-6">
              Radiance <br/> <span className="text-rose-gold italic font-light">Redefined.</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate mb-10 max-w-lg font-light leading-relaxed">
              Immerse yourself in a world of exquisite craftsmanship. Fine jewelry designed to elevate your everyday elegance.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
              <Link href="/category/all">
                <Button size="lg" className="w-full sm:w-auto px-10 py-6 text-sm tracking-widest uppercase bg-charcoal text-white hover:bg-rose-gold transition-all duration-500 rounded-none shadow-md">
                  Explore Collection
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Aesthetic Marquee / Trust Strip */}
      <div className="bg-charcoal text-rose-gold py-4 overflow-hidden border-y border-rose-gold/20">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap space-x-12 items-center"
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
             <div key={i} className="flex items-center space-x-12 font-serif italic text-lg">
               <span>100% Authentic Quality</span>
               <span className="text-white/20">✧</span>
               <span>Free Shipping Over ₹999</span>
               <span className="text-white/20">✧</span>
               <span>30-Day Easy Returns</span>
               <span className="text-white/20">✧</span>
             </div>
          ))}
        </motion.div>
      </div>

      {/* Shop by Category - Magazine Layout */}
      <section className="py-24 md:py-32 bg-cream">
        <div className="container mx-auto px-4 sm:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-20"
          >
            <span className="text-rose-gold tracking-[0.2em] uppercase text-xs font-semibold">Discover</span>
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-charcoal mt-4">Shop by Category</h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {categories.map((category, index) => (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                key={category.slug}
              >
                <Link 
                  href={`/category/${category.slug}`}
                  className="group block relative overflow-hidden"
                  style={{ aspectRatio: '3/4' }}
                >
                  <motion.img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 mix-blend-multiply"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors duration-500"></div>
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <h3 className="text-white font-serif text-3xl mb-2 drop-shadow-md">
                      {category.name}
                    </h3>
                    <div className="w-0 group-hover:w-12 h-0.5 bg-rose-gold transition-all duration-500 ease-out mb-2"></div>
                    <span className="text-white/90 text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 font-medium">
                      View Collection
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Video / Full Banner Parallax */}
      <section className="relative h-[70vh] bg-charcoal flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-40">
           <img 
            src="/category_earrings_1779508818040.png" 
            alt="Kaneera Excellence"
            className="w-full h-full object-cover object-center mix-blend-luminosity scale-110"
          />
        </div>
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="relative z-10 text-center px-4 max-w-3xl"
        >
          <h2 className="font-serif text-4xl md:text-6xl text-cream font-bold mb-6">The Art of Gifting</h2>
          <p className="text-gray-300 text-lg md:text-xl font-light mb-10">
            Make every moment unforgettable with our meticulously crafted jewelry pieces. Wrapped with love, delivered with care.
          </p>
          <Link href="/category/all">
            <Button variant="outline" className="border-cream text-cream hover:bg-cream hover:text-charcoal px-8 py-6 rounded-none text-sm tracking-widest uppercase transition-colors duration-500">
              Find the Perfect Gift
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
