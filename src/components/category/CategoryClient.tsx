"use client";

import { useState, useMemo, useEffect } from 'react';
import { ProductCard, Product } from '@/components/shared/ProductCard';
import { Button } from '@/components/ui/Button';
import { SlidersHorizontal, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function CategoryClient({ initialProducts, title }: { initialProducts: Product[], title: string }) {
  const [visibleCount, setVisibleCount] = useState(6);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [sortOption, setSortOption] = useState("Featured");

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const materials = ['Sterling Silver', 'Rose Gold Plated', 'Gold Plated'];
  const prices = ['Under ₹500', '₹500 - ₹1000', 'Over ₹1000'];

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
    setVisibleCount(6); // reset pagination when filter changes
  };

  const loadMore = () => {
    setVisibleCount(prev => prev + 6);
  };



  // Assign mock materials for filtering purposes since dummy data lacks it
  const productsWithMockDetails = useMemo(() => {
    return initialProducts.map((p, i) => ({
      ...p,
      material: materials[i % 3],
    }));
  }, [initialProducts]);

  const filteredProducts = useMemo(() => {
    let filtered = [...productsWithMockDetails];

    if (activeFilters.length > 0) {
      filtered = filtered.filter(product => {
        const activeMaterials = activeFilters.filter(f => materials.includes(f));
        const activePrices = activeFilters.filter(f => prices.includes(f));

        const matchesMaterial = activeMaterials.length === 0 || activeMaterials.includes(product.material);
        
        let matchesPrice = activePrices.length === 0;
        if (!matchesPrice) {
          matchesPrice = activePrices.some(priceFilter => {
            if (priceFilter === 'Under ₹500') return product.price < 500;
            if (priceFilter === '₹500 - ₹1000') return product.price >= 500 && product.price <= 1000;
            if (priceFilter === 'Over ₹1000') return product.price > 1000;
            return false;
          });
        }

        return matchesMaterial && matchesPrice;
      });
    }

    if (sortOption === "Price: Low to High") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === "Price: High to Low") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortOption === "Newest") {
      filtered.sort((a, b) => {
        const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return timeB - timeA;
      });
    }

    return filtered;
  }, [productsWithMockDetails, activeFilters, sortOption]);

  return (
    <div className="bg-white min-h-screen">
      {/* Premium Header */}
      <div className="relative bg-charcoal py-24 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="/hero_banner_no_text.png" className="w-full h-full object-cover mix-blend-luminosity" alt="Background" />
        </div>
        <div className="relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-5xl md:text-7xl font-bold text-cream drop-shadow-md"
          >
            {title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-300 mt-6 max-w-2xl mx-auto px-4 font-light text-lg"
          >
            Impeccable craftsmanship meets timeless design.
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 flex flex-col md:flex-row gap-12 max-w-7xl">
        {/* Mobile Filter Toggle */}
        <div className="md:hidden flex justify-between items-center mb-4">
          <Button variant="outline" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="border-rose-gold text-rose-gold">
            <SlidersHorizontal className="w-4 h-4 mr-2" /> Filters
          </Button>
          <span className="text-sm text-slate">{filteredProducts.length} Items</span>
        </div>

        {/* Sidebar Filters */}
        <AnimatePresence>
          {(isSidebarOpen || isDesktop) && (
            <motion.aside 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`w-full md:w-64 shrink-0 ${isSidebarOpen ? 'block' : 'hidden md:block'}`}
            >
              <div className="sticky top-24 pr-6">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-charcoal/10">
                  <h2 className="font-serif font-bold text-2xl text-charcoal flex items-center">
                    Filters
                  </h2>
                </div>
                
                {/* Custom Checkbox Filter */}
                <div className="mb-10">
                  <h3 className="font-medium text-charcoal mb-5 flex justify-between items-center text-sm uppercase tracking-widest">
                    Material
                  </h3>
                  <div className="space-y-4">
                    {materials.map((material) => (
                      <button 
                        key={material} 
                        onClick={() => toggleFilter(material)}
                        className="flex items-center space-x-3 w-full group text-left"
                      >
                        <div className={`w-5 h-5 border flex items-center justify-center transition-colors ${activeFilters.includes(material) ? 'bg-rose-gold border-rose-gold text-white' : 'border-slate/40 group-hover:border-rose-gold'}`}>
                          {activeFilters.includes(material) && <Check className="w-3 h-3" />}
                        </div>
                        <span className={`text-sm transition-colors ${activeFilters.includes(material) ? 'text-charcoal font-medium' : 'text-slate group-hover:text-charcoal'}`}>
                          {material}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-10">
                  <h3 className="font-medium text-charcoal mb-5 flex justify-between items-center text-sm uppercase tracking-widest">
                    Price
                  </h3>
                  <div className="space-y-4">
                    {prices.map((price) => (
                      <button 
                        key={price} 
                        onClick={() => toggleFilter(price)}
                        className="flex items-center space-x-3 w-full group text-left"
                      >
                        <div className={`w-5 h-5 border flex items-center justify-center transition-colors ${activeFilters.includes(price) ? 'bg-rose-gold border-rose-gold text-white' : 'border-slate/40 group-hover:border-rose-gold'}`}>
                          {activeFilters.includes(price) && <Check className="w-3 h-3" />}
                        </div>
                        <span className={`text-sm transition-colors ${activeFilters.includes(price) ? 'text-charcoal font-medium' : 'text-slate group-hover:text-charcoal'}`}>
                          {price}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Product Grid Area */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="hidden md:flex justify-between items-center mb-10 pb-4 border-b border-slate/10">
            <p className="text-sm text-slate uppercase tracking-wider">{filteredProducts.length} Products Found</p>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-charcoal uppercase tracking-wider font-medium">Sort by:</span>
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="text-sm border-b border-charcoal bg-transparent font-medium text-charcoal focus:ring-0 cursor-pointer pb-1 outline-none"
              >
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          <motion.div layout className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
            <AnimatePresence mode="popLayout">
              {filteredProducts.slice(0, visibleCount).map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Interactive Pagination */}
          {visibleCount < filteredProducts.length && (
            <div className="mt-20 flex justify-center">
              <Button 
                onClick={loadMore} 
                variant="outline" 
                className="px-12 py-6 rounded-none border-charcoal text-charcoal hover:bg-charcoal hover:text-white uppercase tracking-widest text-sm transition-all duration-300"
              >
                Discover More
              </Button>
            </div>
          )}
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-slate mb-4">No products match your selected filters.</p>
              <Button onClick={() => setActiveFilters([])} variant="outline" className="border-rose-gold text-rose-gold">Clear Filters</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
