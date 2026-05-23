import { CategoryClient } from '@/components/category/CategoryClient';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  
  if (!q) {
    redirect('/');
  }

  const supabase = await createClient();
  
  // Search products by name or description using ILIKE
  const { data: dbProducts } = await supabase
    .from('products')
    .select(`*, categories!inner(slug)`)
    .eq('is_active', true)
    .or(`name.ilike.%${q}%,description.ilike.%${q}%`);
  
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

  return <CategoryClient initialProducts={products} title={`Search Results for "${q}"`} />;
}
