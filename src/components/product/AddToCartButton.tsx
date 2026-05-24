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
      className="flex-1 text-sm font-semibold tracking-widest uppercase py-6 rounded-full shadow-[0_8px_30px_rgb(212,175,55,0.25)] bg-[#D4AF37] text-white hover:bg-[#c4a132] hover:shadow-[0_8px_30px_rgb(212,175,55,0.4)] transition-all duration-300 transform hover:-translate-y-1"
    >
      Add to Cart
    </Button>
  );
}
