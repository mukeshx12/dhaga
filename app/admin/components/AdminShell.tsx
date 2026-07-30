"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { CalendarDays, LayoutDashboard, LogOut, Menu, Scissors, ShieldCheck, UserRound, Users, X } from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/tailors", label: "Tailors", icon: Scissors },
  { href: "/admin/verification", label: "Verification", icon: ShieldCheck },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarDays },
];

type Props = { adminName: string; children: React.ReactNode };

export default function AdminShell({ adminName, children }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const sidebar = (
    <div className="flex h-full flex-col bg-gray-950 text-white">
      <div className="border-b border-white/10 p-6">
        <Link href="/admin" className="flex items-center gap-3 text-xl font-bold"><Scissors className="text-amber-400" />Dhaga Admin</Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {links.map((item) => {
          const Icon = item.icon;
          const active = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${active ? "bg-amber-600 text-white" : "text-gray-300 hover:bg-white/10 hover:text-white"}`}>
              <Icon size={19} />{item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-4">
        <div className="mb-3 flex items-center gap-3 px-3 text-sm text-gray-300"><UserRound size={18} /><span className="truncate">{adminName}</span></div>
        <button type="button" onClick={() => signOut({ callbackUrl: "/admin/login" })} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-300 hover:bg-red-500/15"><LogOut size={19} />Logout</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 lg:flex">
      <aside className="hidden w-64 shrink-0 lg:fixed lg:inset-y-0 lg:block">{sidebar}</aside>
      {open && <div className="fixed inset-0 z-50 lg:hidden"><button aria-label="Close admin menu" onClick={() => setOpen(false)} className="absolute inset-0 bg-black/50" /><aside className="relative h-full w-72">{sidebar}</aside></div>}
      <div className="min-w-0 flex-1 lg:ml-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-8">
          <button type="button" onClick={() => setOpen(true)} className="rounded-lg border border-gray-200 p-2 text-gray-700 lg:hidden"><Menu size={22} /></button>
          <p className="font-semibold text-gray-900">Administration</p>
          {open ? <X className="invisible" /> : <span />}
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
