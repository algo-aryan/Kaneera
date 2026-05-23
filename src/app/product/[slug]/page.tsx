import { ProductGallery } from '@/components/product/ProductGallery';
import { AddToCartButton } from '@/components/product/AddToCartButton';
import { Star, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const supabase = await createClient();
  const { data: product } = await supabase
    .from('products')
    .select('*, categories!inner(slug)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen pt-8 pb-20">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Breadcrumb */}
        <nav className="text-xs tracking-widest uppercase text-slate mb-10 flex items-center space-x-2">
          <Link href="/" className="hover:text-rose-gold transition-colors">Home</Link>
          <span className="text-slate/40">/</span>
          <Link href="/category/all" className="hover:text-rose-gold transition-colors">Collections</Link>
          <span className="text-slate/40">/</span>
          <span className="text-charcoal font-medium">{product.name}</span>
        </nav>

        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Gallery */}
          <div>
            <ProductGallery images={product.image_urls} />
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col md:pl-8 lg:pl-12 pt-4">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-charcoal mb-4 leading-tight">{product.name}</h1>
            
            <div className="flex flex-col space-y-4 mb-8 pb-8 border-b border-slate/10">
              <p className="text-3xl font-serif text-charcoal font-medium">₹ {product.price.toFixed(2)}</p>
              <div className="flex items-center text-rose-gold">
                <div className="flex">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current opacity-50" />
                </div>
                <span className="text-sm text-slate ml-3 hover:text-charcoal cursor-pointer transition-colors">(24 Reviews)</span>
              </div>
            </div>

            <p className="text-slate mb-10 leading-relaxed font-light text-lg">
              {product.description}
            </p>

            <div className="space-y-4 mb-10 text-sm font-light">
              <div className="flex items-center">
                <span className="w-32 text-slate uppercase tracking-wider text-xs font-semibold">Material</span>
                <span className="text-charcoal">{product.material}</span>
              </div>
              <div className="flex items-center">
                <span className="w-32 text-slate uppercase tracking-wider text-xs font-semibold">SKU</span>
                <span className="text-charcoal">{product.sku}</span>
              </div>
              <div className="flex items-center">
                <span className="w-32 text-slate uppercase tracking-wider text-xs font-semibold">Availability</span>
                {product.stock_quantity > 0 ? (
                  <span className="text-green-600 font-medium">In Stock</span>
                ) : (
                  <span className="text-red-500 font-medium">Out of Stock</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <AddToCartButton 
                product={{
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: product.price,
                  image: product.image_urls[0],
                }}
              />
            </div>

            {/* Trust Mini-Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 bg-[#FDFBF7] p-6 border border-rose-gold/10">
              <div className="flex flex-col items-center text-center space-y-2">
                <ShieldCheck className="w-6 h-6 text-rose-gold shrink-0" />
                <span className="text-xs text-charcoal font-medium uppercase tracking-wider">100% Authentic</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2 border-l border-r border-rose-gold/10 px-2">
                <Truck className="w-6 h-6 text-rose-gold shrink-0" />
                <span className="text-xs text-charcoal font-medium uppercase tracking-wider">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <RefreshCw className="w-6 h-6 text-rose-gold shrink-0" />
                <span className="text-xs text-charcoal font-medium uppercase tracking-wider">30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
