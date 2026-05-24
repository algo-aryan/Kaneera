import { ProductGallery } from '@/components/product/ProductGallery';
import { AddToCartButton } from '@/components/product/AddToCartButton';
import { Star, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!product) return {};

  return {
    title: product.name,
    description: product.description || `Buy ${product.name} at Kaneera.`,
    openGraph: {
      title: product.name,
      description: product.description || `Buy ${product.name} at Kaneera.`,
      images: [
        {
          url: product.image_urls[0],
          width: 1080,
          height: 1080,
          alt: product.name,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
    }
  };
}

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
            <h1 className="font-serif text-4xl md:text-5xl font-medium text-charcoal mb-4 leading-tight">{product.name}</h1>
            
            <div className="flex flex-col space-y-4 mb-8">
              <p className="text-3xl font-serif text-rose-gold font-medium">₹ {product.price.toFixed(2)}</p>
              <div className="flex items-center text-[#D4AF37]">
                <div className="flex">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current opacity-50" />
                </div>
                <span className="text-sm text-slate ml-3 hover:text-charcoal cursor-pointer transition-colors border-b border-slate/30">(24 Reviews)</span>
              </div>
            </div>

            <p className="text-slate/80 mb-10 leading-relaxed font-light text-lg">
              {product.description}
            </p>

            <div className="space-y-4 mb-10 text-sm font-light bg-[#FFF8F8] p-6 rounded-2xl">
              <div className="flex items-center justify-between border-b border-rose-gold/10 pb-3">
                <span className="text-slate uppercase tracking-widest text-xs font-semibold">Material</span>
                <span className="text-charcoal font-medium">{product.material}</span>
              </div>
              <div className="flex items-center justify-between border-b border-rose-gold/10 pb-3">
                <span className="text-slate uppercase tracking-widest text-xs font-semibold">SKU</span>
                <span className="text-charcoal font-mono text-xs">{product.sku}</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate uppercase tracking-widest text-xs font-semibold">Availability</span>
                {product.stock_quantity > 0 ? (
                  <span className="text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full text-xs">In Stock</span>
                ) : (
                  <span className="text-red-500 font-medium bg-red-50 px-3 py-1 rounded-full text-xs">Out of Stock</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12 w-full max-w-sm">
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="flex flex-col items-center text-center space-y-3 bg-[#FFF8F8] p-5 rounded-2xl hover:shadow-md transition-shadow">
                <div className="bg-white p-3 rounded-full shadow-sm">
                  <ShieldCheck className="w-6 h-6 text-[#D4AF37] shrink-0" />
                </div>
                <span className="text-xs text-charcoal font-semibold uppercase tracking-wider">100% Authentic</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-3 bg-[#FFF8F8] p-5 rounded-2xl hover:shadow-md transition-shadow">
                <div className="bg-white p-3 rounded-full shadow-sm">
                  <Truck className="w-6 h-6 text-[#D4AF37] shrink-0" />
                </div>
                <span className="text-xs text-charcoal font-semibold uppercase tracking-wider">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-3 bg-[#FFF8F8] p-5 rounded-2xl hover:shadow-md transition-shadow">
                <div className="bg-white p-3 rounded-full shadow-sm">
                  <RefreshCw className="w-6 h-6 text-[#D4AF37] shrink-0" />
                </div>
                <span className="text-xs text-charcoal font-semibold uppercase tracking-wider">30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
