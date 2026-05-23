import { createClient } from "@supabase/supabase-js";
import { Package } from "lucide-react";
import AddProductModal from "@/components/admin/AddProductModal";
import EditProductModal from "@/components/admin/EditProductModal";
import ArchiveProductButton from "@/components/admin/ArchiveProductButton";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export const metadata = {
  title: "Manage Products | Admin | Kaneera",
};

export default async function AdminProductsPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  // Fetch all products
  const { data: products } = await supabaseAdmin
    .from('products')
    .select('*, categories(name)')
    .order('created_at', { ascending: false });

  // Fetch categories for the add product form
  const { data: categories } = await supabaseAdmin
    .from('categories')
    .select('id, name');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif text-charcoal font-bold">Manage Products</h2>
        <AddProductModal categories={categories || []} />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
        {(!products || products.length === 0) ? (
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
              <Package className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate font-medium">No products found</p>
            <p className="text-sm text-slate-400">Add a product to start selling.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate">
              <thead className="bg-slate-50 text-xs uppercase font-semibold tracking-wider text-charcoal border-b border-slate-100">
                <tr>
                  <th scope="col" className="px-6 py-4">Product Info</th>
                  <th scope="col" className="px-6 py-4">Category</th>
                  <th scope="col" className="px-6 py-4">Price</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product: any) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-md overflow-hidden flex-shrink-0">
                          {product.image_urls && product.image_urls[0] ? (
                            <img src={product.image_urls[0]} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-6 h-6 text-slate-300 m-auto mt-3" />
                          )}
                        </div>
                        <div>
                          <p className={`font-medium ${product.is_active ? 'text-charcoal' : 'text-slate-400'}`}>{product.name}</p>
                          <p className="text-xs text-slate-400 mt-1 max-w-[200px] truncate">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                        {product.categories?.name || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-charcoal">
                      ₹ {product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 inline-flex text-[10px] font-semibold tracking-wider uppercase rounded-full border ${
                        product.is_active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-500 border-slate-200'
                      }`}>
                        {product.is_active ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        <EditProductModal categories={categories || []} product={product} />
                        <ArchiveProductButton productId={product.id} isActive={product.is_active} />
                        <DeleteProductButton productId={product.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
