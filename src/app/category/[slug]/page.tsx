import { CategoryClient } from '@/components/category/CategoryClient';
import { createClient } from '@/utils/supabase/server';

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const title = slug === 'all' ? 'All Collections' : slug.charAt(0).toUpperCase() + slug.slice(1);
  
  const supabase = await createClient();
  let query = supabase.from('products').select(`*, categories!inner(slug)`).eq('is_active', true);
  
  if (slug !== 'all') {
    query = query.eq('categories.slug', slug);
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
