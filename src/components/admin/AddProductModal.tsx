"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { addProduct } from "@/app/admin/products/actions";

export default function AddProductModal({ categories }: { categories: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>(['']);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      // Append all image URLs to the form data
      formData.delete('imageUrls'); // clean up any auto-appended
      formData.append('imageUrls', JSON.stringify(imageUrls.filter(url => url.trim() !== '')));
      await addProduct(formData);
      setIsOpen(false);
      alert("Product added successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center px-4 py-2 bg-charcoal text-white text-sm font-medium rounded-md hover:bg-black transition-colors"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Product
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-serif font-bold text-charcoal">Add New Product</h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-charcoal transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate mb-1">Product Name</label>
                <input required name="name" type="text" className="w-full border border-charcoal/20 bg-transparent px-4 py-2 text-sm focus:border-rose-gold focus:outline-none rounded" placeholder="E.g. Rose Gold Diamond Ring" />
              </div>
              
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate mb-1">Description</label>
                <textarea required name="description" rows={3} className="w-full border border-charcoal/20 bg-transparent px-4 py-2 text-sm focus:border-rose-gold focus:outline-none rounded" placeholder="A beautiful hand-crafted ring..."></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-slate mb-1">Price (₹)</label>
                  <input required name="price" type="number" step="0.01" className="w-full border border-charcoal/20 bg-transparent px-4 py-2 text-sm focus:border-rose-gold focus:outline-none rounded" placeholder="2999" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-slate mb-1">Category</label>
                  <select required name="categoryId" className="w-full border border-charcoal/20 bg-transparent px-4 py-2 text-sm focus:border-rose-gold focus:outline-none rounded">
                    <option value="">Select Category...</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-slate mb-2">Recipients (Check all that apply)</label>
                  <div className="space-y-2 border border-charcoal/20 rounded p-3 h-32 overflow-y-auto bg-transparent">
                    {["Mother", "Sister", "Wife", "Friends", "Husband", "Brother"].map((bond) => (
                      <label key={bond} className="flex items-center space-x-2">
                        <input type="checkbox" name="recipient" value={bond} className="rounded text-rose-gold focus:ring-rose-gold" />
                        <span className="text-sm text-slate-700">{bond}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-slate mb-1">Material Color</label>
                  <select name="material_color" className="w-full border border-charcoal/20 bg-transparent px-4 py-2 text-sm focus:border-rose-gold focus:outline-none rounded">
                    <option value="">Any</option>
                    <option value="Rose Gold">Rose Gold</option>
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate mb-2">Product Images</label>
                <div className="space-y-3">
                  {imageUrls.map((url, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div className="flex-1 relative">
                        <input 
                          required 
                          value={url}
                          onChange={(e) => {
                            const newUrls = [...imageUrls];
                            newUrls[idx] = e.target.value;
                            setImageUrls(newUrls);
                          }}
                          name={`imageUrl_${idx}`} 
                          type="url" 
                          className="w-full border border-charcoal/20 bg-transparent px-4 py-2 text-sm focus:border-rose-gold focus:outline-none rounded" 
                          placeholder={idx === 0 ? "Primary Image URL (Preview)" : idx === 1 ? "Hover Image URL" : "Gallery Image URL"} 
                        />
                        {idx === 0 && <span className="absolute right-2 top-2 text-[10px] uppercase font-bold text-rose-gold bg-rose-gold/10 px-2 py-0.5 rounded">Primary</span>}
                        {idx === 1 && <span className="absolute right-2 top-2 text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Hover</span>}
                      </div>
                      {imageUrls.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => setImageUrls(imageUrls.filter((_, i) => i !== idx))}
                          className="p-2 text-red-500 hover:bg-red-50 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button 
                    type="button"
                    onClick={() => setImageUrls([...imageUrls, ''])}
                    className="flex items-center text-xs font-semibold text-rose-gold hover:text-[#d69f8a]"
                  >
                    <Plus className="w-3 h-3 mr-1" /> Add Another Image
                  </button>
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm font-medium text-slate hover:bg-slate-50 rounded-md transition-colors">
                  Cancel
                </button>
                <button disabled={isSubmitting} type="submit" className="px-6 py-2 bg-rose-gold text-white text-sm font-medium rounded-md hover:bg-[#d69f8a] transition-colors disabled:opacity-50">
                  {isSubmitting ? 'Adding...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
