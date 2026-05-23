"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/store/useCartStore';

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  image_urls: string[];
  category: string;
  created_at?: string;
}

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.image_urls[0],
    });
  };

  return (
    <div className="group flex flex-col relative">
      <div 
        className="relative overflow-hidden mb-4"
        style={{ aspectRatio: '3/4', backgroundColor: '#FDFBF7' }}
      >
        {/* We place the Link behind the button to avoid HTML invalid nesting of button inside a */}
        <Link href={`/product/${product.slug}`} className="absolute inset-0 z-0 block">
          {/* Primary Image */}
          <img 
            src={product.image_urls[0]} 
            alt={product.name} 
            className="w-full h-full object-cover transition-opacity duration-700 group-hover:opacity-0 mix-blend-multiply"
          />
          {/* Hover Image */}
          <img 
            src={product.image_urls[1] || product.image_urls[0]} 
            alt={`${product.name} hover view`} 
            className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105 mix-blend-multiply"
          />
        </Link>
        
        {/* Quick Add Button on Hover */}
        <div className="absolute bottom-4 left-4 right-4 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out z-10 pointer-events-auto">
          <Button 
            onClick={handleAddToCart}
            className="w-full bg-charcoal text-white hover:bg-rose-gold rounded-none uppercase tracking-widest text-xs py-3 h-auto" 
            variant="secondary"
          >
            Quick Add
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col items-center text-center space-y-2 mt-2">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-serif text-lg text-charcoal hover:text-rose-gold transition-colors">{product.name}</h3>
        </Link>
        <p className="text-sm font-medium text-slate">₹ {product.price.toFixed(2)}</p>
      </div>
    </div>
  );
}
