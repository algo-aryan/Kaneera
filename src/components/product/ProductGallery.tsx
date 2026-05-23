"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductGalleryProps {
  images: string[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="flex flex-col md:flex-row-reverse gap-4">
      {/* Main Image */}
      <div className="flex-1 relative aspect-[3/4] bg-[#FDFBF7] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            alt={`Product view ${currentIndex + 1}`}
            className="w-full h-full object-cover mix-blend-multiply"
          />
        </AnimatePresence>
      </div>

      {/* Thumbnails */}
      <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible shrink-0 md:w-24 scrollbar-hide">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`relative aspect-[3/4] overflow-hidden bg-[#FDFBF7] transition-all duration-300 shrink-0 w-20 md:w-full ${
              currentIndex === index 
                ? 'ring-1 ring-charcoal ring-offset-2' 
                : 'opacity-60 hover:opacity-100'
            }`}
          >
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover mix-blend-multiply"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
