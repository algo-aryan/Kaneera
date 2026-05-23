"use client";

import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/store/useCartStore';

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    image: string;
  };
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.image,
    });
  };

  return (
    <Button 
      onClick={handleAddToCart}
      size="lg" 
      className="flex-1 text-sm tracking-widest uppercase py-6 rounded-none shadow-none bg-charcoal text-white hover:bg-rose-gold transition-colors duration-300"
    >
      Add to Cart
    </Button>
  );
}
