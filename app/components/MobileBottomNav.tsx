"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Clock3, Home, Scissors, Store, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "@/app/i18n/LanguageProvider";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { language } = useLanguage();
  const [isTailor, setIsTailor] = useState(false);
  const hi = language === "hi";

  useEffect(() => {
    if (!session) return;
    fetch("/api/me")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => data && setIsTailor(Boolean(data.isTailor)))
      .catch(() => undefined);
  }, [session]);

  if (
    pathname === "/" ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password")
  ) return null;

  const customerItems = [
    { label: hi ? "होम" : "Home", href: "/", icon: Home },
    { label: hi ? "सेवाएं" : "Services", href: "/services", icon: Scissors },
    { label: hi ? "दर्जी" : "Tailors", href: "/tailors", icon: Store },
    { label: hi ? "बुकिंग" : "Bookings", href: session ? "/my-bookings" : "/login", icon: Clock3 },
    { label: hi ? "अकाउंट" : "Account", href: session ? "/profile" : "/login", icon: UserRound },
  ];

  const tailorItems = [
    { label: hi ? "होम" : "Home", href: "/", icon: Home },
    { label: hi ? "अनुरोध" : "Requests", href: "/tailor-dashboard?section=requests", icon: Clock3 },
    { label: hi ? "कीमतें" : "Prices", href: "/tailor-dashboard/services", icon: Scissors },
    { label: hi ? "दुकान" : "Shop", href: "/tailor-dashboard?section=profile", icon: Store },
    { label: hi ? "अकाउंट" : "Account", href: "/profile", icon: UserRound },
  ];

  const items = isTailor ? tailorItems : customerItems;

  return (
    <>
      <div className="h-24 md:hidden" aria-hidden="true" />
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200/80 bg-white/95 px-2 pb-[max(.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_30px_rgba(15,23,42,.08)] backdrop-blur-xl md:hidden" aria-label="Mobile navigation">
        <div className="mx-auto grid max-w-md grid-cols-5">
          {items.map((item) => {
            const Icon = item.icon;
            const active = item.href !== "/" && pathname.startsWith(item.href);
            return (
              <Link key={item.label} href={item.href} className={`flex min-w-0 flex-col items-center gap-1 rounded-xl py-1 text-[10px] font-semibold ${active ? "text-amber-700" : "text-slate-500"}`}>
                <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
