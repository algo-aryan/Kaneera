"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingCart, Package, Users, Settings, LogOut } from "lucide-react";

export default function AdminSidebar({ children, initialName }: { children: React.ReactNode, initialName: string }) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Products', href: '/admin/products', icon: Package },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <Link href="/">
            <span className="font-serif text-2xl font-bold tracking-wider text-charcoal">
              KANEERA
            </span>
            <span className="ml-2 text-xs font-semibold text-rose-gold tracking-widest uppercase">Admin</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  isActive 
                    ? 'bg-rose-gold/10 text-rose-gold' 
                    : 'text-slate hover:bg-slate-50 hover:text-charcoal'
                }`}
              >
                <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-rose-gold' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <Link href="/" className="flex items-center px-4 py-3 text-sm font-medium text-slate hover:bg-slate-50 rounded-md transition-colors">
            <LogOut className="mr-3 h-5 w-5 text-slate-400" />
            Exit Admin
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <h1 className="text-xl font-semibold text-charcoal">
            {navigation.find(item => item.href === pathname)?.name || 'Dashboard'}
          </h1>
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 rounded-full bg-rose-gold flex items-center justify-center text-white font-serif font-bold">
              {initialName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-[#FAFAFA] p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
