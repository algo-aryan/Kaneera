"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus } from "@/app/admin/orders/actions";

export default function OrderStatusSelect({ orderId, initialStatus }: { orderId: string, initialStatus: string }) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState(initialStatus);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    startTransition(async () => {
      try {
        await updateOrderStatus(orderId, newStatus);
      } catch (err) {
        console.error(err);
        alert("Failed to update order status");
        setStatus(initialStatus); // revert
      }
    });
  };

  return (
    <select 
      value={status}
      onChange={handleChange}
      disabled={isPending}
      className={`text-xs font-semibold tracking-wider uppercase rounded-full border px-3 py-1 outline-none transition-colors cursor-pointer ${
        status === 'paid' ? 'bg-green-50 text-green-700 border-green-200' : 
        status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
        status === 'shipped' || status === 'delivered' ? 'bg-blue-50 text-blue-700 border-blue-200' :
        'bg-slate/10 text-slate border-slate/20'
      } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <option value="pending">Pending</option>
      <option value="paid">Paid</option>
      <option value="processing">Processing</option>
      <option value="shipped">Shipped</option>
      <option value="delivered">Delivered</option>
      <option value="cancelled">Cancelled</option>
    </select>
  );
}
