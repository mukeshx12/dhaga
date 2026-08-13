"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Route,
  Scissors,
  Store,
  UserPlus,
  UserRoundPlus,
  X,
  type LucideIcon,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import LanguageSelector from "./LanguageSelector";
import { useLanguage } from "@/app/i18n/LanguageProvider";

type UserData = {
  id: string;
  name: string;
  email: string;
  role: string;
  isTailor: boolean;
  tailorId: string | null;
};

type NavId = "home" | "services" | "tailors" | "how-it-works";

type NavItem = {
  id: NavId;
  href: string;
  label: string;
  icon: LucideIcon;
};

export default function Navbar({ hideOnMobile = false }: { hideOnMobile?: boolean }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { language, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<NavId>("home");
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    async function fetchUser() {
      if (!session) return;
      const response = await fetch("/api/me");
      if (!response.ok) return;
      setUser(await response.json());
    }
    fetchUser();
  }, [session]);

  useEffect(() => {
    const syncSection = () => {
      if (window.location.hash === "#popular-services") setActiveSection("services");
      else if (window.location.hash === "#how-it-works") setActiveSection("how-it-works");
      else setActiveSection("home");
    };
    const timer = window.setTimeout(syncSection, 0);
    window.addEventListener("hashchange", syncSection);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("hashchange", syncSection);
    };
  }, [pathname]);

  const allNavItems: NavItem[] = [
    { id: "home", href: "/", label: language === "hi" ? "होम" : "Home", icon: Home },
    { id: "services", href: "/#popular-services", label: t("services"), icon: Scissors },
    { id: "tailors", href: "/tailors", label: t("tailors"), icon: Store },
    { id: "how-it-works", href: "/#how-it-works", label: t("howItWorks"), icon: Route },
  ];
  const navItems = user?.isTailor
    ? allNavItems.filter((item) => item.id === "home" || item.id === "how-it-works")
    : allNavItems;
  const activeId: NavId | null = pathname.startsWith("/tailors") ? "tailors" : pathname === "/" ? activeSection : null;
  const activeIndex = navItems.findIndex((item) => item.id === activeId);

  const selectNav = (id: NavId) => {
    setActiveSection(id);
    setIsMenuOpen(false);
  };

  return (
    <nav className={`fixed inset-x-0 top-0 z-50 border-b border-stone-200/70 bg-[#FAF7F2]/88 shadow-[0_4px_24px_rgba(120,53,15,.05)] backdrop-blur-xl ${hideOnMobile ? "hidden md:block" : ""}`}>
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-5 lg:px-6">
        <Link href="/" onClick={() => selectNav("home")} className="flex shrink-0 items-center gap-2 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-700 text-white shadow-sm">
            <Scissors aria-hidden="true" size={22} />
          </span>
          <span className="text-2xl font-extrabold tracking-tight text-amber-900">Dhaga</span>
        </Link>

        <div className="hidden min-w-0 flex-1 justify-center xl:flex">
          <div
            className={`relative grid rounded-2xl bg-stone-200/70 p-1.5 ring-1 ring-stone-300/60 ${navItems.length <= 2 ? "min-w-[20rem]" : "min-w-[31rem]"}`}
            style={{ gridTemplateColumns: `repeat(${navItems.length}, minmax(0, 1fr))` }}
            aria-label="Primary navigation"
          >
            <span
              aria-hidden="true"
              className={`absolute bottom-1.5 top-1.5 rounded-xl bg-white shadow-[0_3px_12px_rgba(120,53,15,.12)] ring-1 ring-black/[.04] transition-[transform,opacity] duration-300 ease-out ${activeIndex < 0 ? "opacity-0" : "opacity-100"}`}
              style={{ width: `calc(100% / ${navItems.length})`, transform: `translateX(${Math.max(activeIndex, 0) * 100}%)` }}
            />
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = item.id === activeId;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => selectNav(item.id)}
                  aria-current={active ? "page" : undefined}
                  className={`relative z-10 inline-flex min-h-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-3 text-sm font-semibold transition-colors duration-300 ${active ? "text-amber-800" : "text-stone-600 hover:text-stone-950"}`}
                >
                  <Icon aria-hidden="true" size={16} strokeWidth={active ? 2.4 : 2} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2.5">
          <LanguageSelector compact />
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-700 shadow-sm transition hover:border-amber-200 hover:text-amber-700 xl:hidden"
          >
            {isMenuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>

          <div className="hidden items-center gap-2 xl:flex">
            {!session ? (
              <>
                <Link href="/login" className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-amber-700 px-4 text-sm font-semibold text-amber-800 transition hover:bg-amber-50">
                  <LogIn aria-hidden="true" size={16} /> {t("login")}
                </Link>
                <Link href="/register" className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-amber-700 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-800">
                  <UserPlus aria-hidden="true" size={16} /> {t("signUp")}
                </Link>
              </>
            ) : (
              <>
                <Link href={user?.isTailor ? "/tailor-dashboard" : "/dashboard"} className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-amber-700 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-800">
                  <LayoutDashboard aria-hidden="true" size={16} /> {user?.isTailor ? t("tailorDashboard") : t("dashboard")}
                </Link>
                {!user?.isTailor && (
                  <Link href="/become-tailor" className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-amber-700 px-3 text-sm font-semibold text-amber-800 transition hover:bg-amber-50">
                    <UserRoundPlus aria-hidden="true" size={16} /> {t("becomeTailor")}
                  </Link>
                )}
                <button onClick={() => signOut({ callbackUrl: "/" })} className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-red-200 bg-white px-3 text-sm font-semibold text-red-600 transition hover:bg-red-50">
                  <LogOut aria-hidden="true" size={16} /> {t("logout")}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div id="mobile-navigation" className="border-t border-stone-200/80 bg-[#FAF7F2]/98 px-5 py-4 shadow-lg backdrop-blur-xl xl:hidden">
          <div className="mx-auto max-w-2xl">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = item.id === activeId;
                return (
                  <Link key={item.id} href={item.href} onClick={() => selectNav(item.id)} className={`flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition ${active ? "bg-white text-amber-800 shadow-sm ring-1 ring-amber-100" : "text-stone-600 hover:bg-white/70 hover:text-stone-950"}`}>
                    <Icon aria-hidden="true" size={17} /> {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="mt-4 grid gap-2 border-t border-stone-200 pt-4 sm:grid-cols-3">
              {!session ? (
                <>
                  <Link href="/login" onClick={() => setIsMenuOpen(false)} className="rounded-xl border border-amber-700 px-4 py-3 text-center text-sm font-semibold text-amber-800">{t("login")}</Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)} className="rounded-xl bg-amber-700 px-4 py-3 text-center text-sm font-semibold text-white">{t("signUp")}</Link>
                </>
              ) : (
                <>
                  <Link href={user?.isTailor ? "/tailor-dashboard" : "/dashboard"} onClick={() => setIsMenuOpen(false)} className="rounded-xl bg-amber-700 px-4 py-3 text-center text-sm font-semibold text-white">{user?.isTailor ? t("tailorDashboard") : t("dashboard")}</Link>
                  {!user?.isTailor && <Link href="/become-tailor" onClick={() => setIsMenuOpen(false)} className="rounded-xl border border-amber-700 px-4 py-3 text-center text-sm font-semibold text-amber-800">{t("becomeTailor")}</Link>}
                  <button onClick={() => { setIsMenuOpen(false); signOut({ callbackUrl: "/" }); }} className="rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600">{t("logout")}</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
