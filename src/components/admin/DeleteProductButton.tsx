"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { hardDeleteProduct } from "@/app/admin/products/actions";

export default function DeleteProductButton({ productId }: { productId: string }) {
  const [isPending, setIsPending] = useState(false);

  const handleDelete = async () => {
    if (!confirm("WARNING: Are you sure you want to permanently delete this product? This may cause 'Unknown Item' to appear in historical orders if this product was ever purchased.")) return;
    
    setIsPending(true);
    try {
      await hardDeleteProduct(productId);
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      className={`flex items-center px-3 py-1.5 text-xs font-medium rounded transition-colors text-charcoal bg-slate-100 hover:bg-slate-200 ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
      title="Permanently Delete"
    >
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  );
}
