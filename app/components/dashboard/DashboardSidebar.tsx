"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Search,
  CalendarDays,
  Package,
  User,
  LogOut,
  Scissors,
} from "lucide-react";
import { signOut } from "next-auth/react";

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Find Tailors",
    href: "/tailors",
    icon: Search,
  },
  {
    title: "Bookings",
    href: "/bookings",
    icon: CalendarDays,
  },
  {
    title: "Orders",
    href: "/orders",
    icon: Package,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
];

export default function DashboardSidebar() {
  return (
    <aside className="w-72 min-h-screen bg-[#1D4D4F] text-white flex flex-col">
      <div className="p-8 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Scissors size={30} />
          <h1 className="text-3xl font-bold">Dhaga</h1>
        </div>

        <p className="text-sm text-gray-300 mt-2">
          Customer Dashboard
        </p>
      </div>

      <nav className="flex-1 mt-6 px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className="flex items-center gap-4 rounded-xl px-4 py-3 transition hover:bg-white/10"
            >
              <Icon size={22} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button onClick={() => signOut({ callbackUrl: "/" })} className="flex w-full items-center gap-4 rounded-xl px-4 py-3 hover:bg-red-500 transition">
          <LogOut size={22} />
          Logout
        </button>
      </div>
    </aside>
  );
}