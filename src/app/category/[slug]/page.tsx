import { CategoryClient } from '@/components/category/CategoryClient';
import { createClient } from '@/utils/supabase/server';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const title = slug === 'all' ? 'All Collections' : slug.charAt(0).toUpperCase() + slug.slice(1);
  
  return {
    title: title,
    description: `Shop the latest ${title} collection at Kaneera by Aashi.`,
    openGraph: {
      title: `${title} | Kaneera by Aashi`,
      description: `Shop the latest ${title} collection at Kaneera by Aashi.`,
      images: [{
        url: '/hero_banner_jewelry_1779508789302.png',
        width: 1200,
        height: 630,
        alt: `${title} at Kaneera`
      }]
    }
  };
}

export default async function CategoryPage({ 
  params,
  searchParams
}: { 
  params: Promise<{ slug: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { slug } = await params;
  const sParams = await searchParams;
  
  const title = slug === 'all' ? 'All Collections' : slug.charAt(0).toUpperCase() + slug.slice(1);
  
  const supabase = await createClient();
  let query = supabase.from('products').select(`*, categories!inner(slug)`).eq('is_active', true);
  
  if (slug !== 'all') {
    query = query.eq('categories.slug', slug);
  }
  
  const maxPrice = sParams.maxPrice ? parseFloat(sParams.maxPrice as string) : undefined;
  if (maxPrice) {
    query = query.lte('price', maxPrice);
  }
  
  const recipient = sParams.recipient as string | undefined;
  if (recipient) {
    // Since recipient will be a TEXT[], we check if the array contains the value.
    // We capitalise the first letter to match "Wife", "Mother"
    const capitalized = recipient.charAt(0).toUpperCase() + recipient.slice(1);
    query = query.contains('recipient', [capitalized]);
  }

  const { data: dbProducts } = await query;
  
  // Format to match ProductCard interface
  const products = (dbProducts || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    image_urls: p.image_urls,
    category: p.categories.slug,
    created_at: p.created_at,
  }));

  return <CategoryClient initialProducts={products} title={title} />;
}
