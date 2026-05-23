"use client";

import { useState } from "react";
import { Archive, RefreshCcw } from "lucide-react";
import { archiveProduct } from "@/app/admin/products/actions";

export default function ArchiveProductButton({ productId, isActive }: { productId: string, isActive: boolean }) {
  const [isPending, setIsPending] = useState(false);

  const handleToggle = async () => {
    if (!confirm(`Are you sure you want to ${isActive ? 'archive' : 'unarchive'} this product?`)) return;
    
    setIsPending(true);
    try {
      await archiveProduct(productId, isActive);
    } catch (err) {
      console.error(err);
      alert("Failed to change product status");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button 
      onClick={handleToggle}
      disabled={isPending}
      className={`flex items-center px-3 py-1.5 text-xs font-medium rounded transition-colors ${
        isActive 
          ? 'text-red-600 bg-red-50 hover:bg-red-100' 
          : 'text-green-600 bg-green-50 hover:bg-green-100'
      } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isActive ? (
        <>
          <Archive className="w-3.5 h-3.5 mr-1.5" />
          Archive
        </>
      ) : (
        <>
          <RefreshCcw className="w-3.5 h-3.5 mr-1.5" />
          Restore
        </>
      )}
    </button>
  );
}
