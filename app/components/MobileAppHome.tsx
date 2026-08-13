"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Capacitor } from "@capacitor/core";
import { Geolocation } from "@capacitor/geolocation";
import {
  BadgeCheck,
  CalendarDays,
  Clock3,
  Heart,
  Home,
  House,
  LocateFixed,
  MapPin,
  Ruler,
  Scissors,
  Search,
  Shirt,
  Sparkles,
  Store,
  UserRound,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/app/i18n/LanguageProvider";
import LanguageSelector from "./LanguageSelector";

type Tailor = {
  id: string;
  shopName: string;
  city: string;
  experience: number;
  isVerified: boolean;
  shopPhoto: string | null;
  services: Array<{ id: string; serviceName: string; price: number }>;
};

type UserData = {
  isTailor: boolean;
};

type LocationDetails = {
  primary: string;
  secondary: string;
};

const serviceItems = [
  { en: "Blouse", hi: "ब्लाउज़", query: "Blouse", icon: Shirt, color: "bg-rose-100 text-rose-700" },
  { en: "Suits", hi: "सूट", query: "Suit", icon: Sparkles, color: "bg-violet-100 text-violet-700" },
  { en: "Alteration", hi: "अल्टरेशन", query: "Alteration", icon: Scissors, color: "bg-sky-100 text-sky-700" },
  { en: "Lehenga", hi: "लहंगा", query: "Lehenga", icon: BadgeCheck, color: "bg-amber-100 text-amber-700" },
  { en: "Fall & Pico", hi: "फॉल पिको", query: "Fall", icon: Ruler, color: "bg-emerald-100 text-emerald-700" },
  { en: "Home Visit", hi: "घर पर माप", query: "Home", icon: House, color: "bg-orange-100 text-orange-700" },
];

export default function MobileAppHome({ tailors }: { tailors: Tailor[] }) {
  const router = useRouter();
  const { data: session } = useSession();
  const { language } = useLanguage();
  const hi = language === "hi";
  const [locationState, setLocationState] = useState<"choose" | "current" | "unavailable" | "denied">("choose");
  const [locationDetails, setLocationDetails] = useState<LocationDetails | null>(null);
  const [locating, setLocating] = useState(false);
  const [showRolePrompt, setShowRolePrompt] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const tailorCarouselRef = useRef<HTMLDivElement>(null);
  const carouselScrollTimerRef = useRef<number | null>(null);
  const activeTailorIndexRef = useRef(0);
  const carouselDirectionRef = useRef<1 | -1>(1);
  const [activeTailorIndex, setActiveTailorIndex] = useState(0);
  const [carouselPaused, setCarouselPaused] = useState(false);
  const carouselTailors = tailors.slice(0, 5);

  useEffect(() => {
    const dismissedAt = Number(localStorage.getItem("dhaga-role-prompt-dismissed") || 0);
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    if (!session && Date.now() - dismissedAt > sevenDays) {
      const showTimer = window.setTimeout(() => setShowRolePrompt(true), 650);
      const hideTimer = window.setTimeout(() => setShowRolePrompt(false), 12_000);
      return () => {
        window.clearTimeout(showTimer);
        window.clearTimeout(hideTimer);
      };
    }
  }, [session]);

  useEffect(() => {
    if (!session) return;
    fetch("/api/me")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => data && setUser(data))
      .catch(() => undefined);
  }, [session]);

  const accountHref = useMemo(() => {
    if (!session) return "/login";
    return user?.isTailor ? "/tailor-dashboard" : "/profile";
  }, [session, user]);

  const scrollToTailor = useCallback((index: number) => {
    const carousel = tailorCarouselRef.current;
    const card = carousel?.children.item(index) as HTMLElement | null;
    if (!carousel || !card) return;

    activeTailorIndexRef.current = index;
    setActiveTailorIndex(index);
    carousel.scrollTo({ left: card.offsetLeft - 16, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (carouselTailors.length < 2 || carouselPaused) return;

    const interval = window.setInterval(() => {
      const lastIndex = carouselTailors.length - 1;
      if (activeTailorIndexRef.current >= lastIndex) carouselDirectionRef.current = -1;
      if (activeTailorIndexRef.current <= 0) carouselDirectionRef.current = 1;
      scrollToTailor(activeTailorIndexRef.current + carouselDirectionRef.current);
    }, 4_800);
    return () => window.clearInterval(interval);
  }, [carouselPaused, carouselTailors.length, scrollToTailor]);

  const updateActiveTailor = () => {
    if (carouselScrollTimerRef.current) window.clearTimeout(carouselScrollTimerRef.current);
    carouselScrollTimerRef.current = window.setTimeout(() => {
      const carousel = tailorCarouselRef.current;
      if (!carousel) return;

      const viewportCenter = carousel.scrollLeft + carousel.clientWidth / 2;
      const cards = Array.from(carousel.children) as HTMLElement[];
      const closestIndex = cards.reduce((closest, card, index) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const closestCard = cards[closest];
        const closestCenter = closestCard.offsetLeft + closestCard.offsetWidth / 2;
        return Math.abs(cardCenter - viewportCenter) < Math.abs(closestCenter - viewportCenter) ? index : closest;
      }, 0);

      activeTailorIndexRef.current = closestIndex;
      setActiveTailorIndex(closestIndex);
    }, 90);
  };

  const closeRolePrompt = () => {
    localStorage.setItem("dhaga-role-prompt-dismissed", String(Date.now()));
    setShowRolePrompt(false);
  };

  const getCurrentCoordinates = async () => {
    if (Capacitor.isNativePlatform()) {
      let permission = await Geolocation.checkPermissions();
      if (permission.location !== "granted" && permission.coarseLocation !== "granted") {
        permission = await Geolocation.requestPermissions({ permissions: ["location", "coarseLocation"] });
      }
      if (permission.location !== "granted" && permission.coarseLocation !== "granted") {
        throw new Error("Location permission denied");
      }

      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15_000,
        maximumAge: 60_000,
      });
      return { latitude: position.coords.latitude, longitude: position.coords.longitude };
    }

    if (!navigator.geolocation) throw new Error("Location unavailable");
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 15_000,
        maximumAge: 60_000,
      });
    });
    return { latitude: position.coords.latitude, longitude: position.coords.longitude };
  };

  const findLocation = async () => {
    setLocating(true);
    try {
      const coordinates = await getCurrentCoordinates();
      const params = new URLSearchParams({
        lat: String(coordinates.latitude),
        lon: String(coordinates.longitude),
        lang: language,
      });
      const response = await fetch(`/api/location/reverse?${params.toString()}`);
      if (!response.ok) throw new Error("Address unavailable");

      const address = (await response.json()) as LocationDetails;
      setLocationDetails(address);
      setLocationState("current");
    } catch (error) {
      const message = error instanceof Error ? error.message.toLowerCase() : "";
      const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
      const permissionDenied = message.includes("permission") || message.includes("denied") || code === "1" || code === "OS-PLUG-GLOC-0003";
      setLocationDetails(null);
      setLocationState(permissionDenied ? "denied" : "unavailable");
    } finally {
      setLocating(false);
    }
  };

  const locationLabel = {
    choose: hi ? "अपनी लोकेशन चुनें" : "Choose your location",
    current: hi ? "वर्तमान लोकेशन" : "Current location",
    unavailable: hi ? "लोकेशन उपलब्ध नहीं" : "Location unavailable",
    denied: hi ? "लोकेशन की अनुमति दें" : "Allow location access",
  }[locationState];

  return (
    <div className="min-h-screen bg-[#fbf8f3] pb-28 text-slate-950">
      <header className="rounded-b-[2rem] bg-gradient-to-br from-amber-800 via-amber-700 to-orange-600 px-5 pb-7 pt-[max(1rem,env(safe-area-inset-top))] text-white shadow-lg shadow-amber-900/15">
        <div className="flex items-center justify-between gap-3 pt-2">
          <button type="button" onClick={findLocation} disabled={locating} className="group flex min-w-0 items-center gap-2 rounded-xl py-1 text-left disabled:cursor-wait" aria-label="Use current location">
            <span className="min-w-0">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-100">
                <MapPin size={14} /> {hi ? "कहाँ डिलीवर करना है?" : "Where to deliver?"}
              </span>
              <span className="mt-1 block max-w-[11.5rem] truncate text-sm font-bold leading-4">
                {locating ? (hi ? "पता लगाया जा रहा है..." : "Finding your address...") : locationDetails?.primary || locationLabel}
              </span>
              {locationDetails?.secondary && !locating && (
                <span className="mt-0.5 block max-w-[11.5rem] truncate text-[10px] font-medium leading-3.5 text-amber-100/85">
                  {locationDetails.secondary} · © OpenStreetMap
                </span>
              )}
            </span>
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/10 text-amber-100 transition group-active:scale-95">
              <LocateFixed size={15} className={locating ? "animate-pulse" : ""} />
            </span>
          </button>
          <div className="flex items-center gap-2">
            <LanguageSelector compact />
            <Link href={accountHref} className="grid h-10 w-10 place-items-center rounded-full bg-white/15 ring-1 ring-white/25" aria-label="Account">
              <UserRound size={21} />
            </Link>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium text-amber-100">{hi ? "आप क्या सिलवाना चाहते हैं?" : "What would you like stitched?"}</p>
          <form
            className="mt-2 flex h-14 items-center rounded-2xl bg-white p-1.5 shadow-xl shadow-amber-950/15"
            onSubmit={(event) => {
              event.preventDefault();
              router.push("/search");
            }}
          >
            <Search size={20} className="ml-3 shrink-0 text-amber-700" />
            <input
              onFocus={() => router.push("/search")}
              onClick={() => router.push("/search")}
              readOnly
              placeholder={hi ? "ब्लाउज़, सूट, अल्टरेशन खोजें" : "Search blouse, suit, alteration"}
              className="min-w-0 flex-1 bg-transparent px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
            <button type="submit" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-700 text-white" aria-label="Search services">
              <Search size={19} />
            </button>
          </form>
        </div>
      </header>

      {showRolePrompt && !session && (
        <section className="mx-4 mt-5 animate-[fadeIn_.25s_ease-out] rounded-3xl border border-amber-100 bg-white p-4 shadow-lg shadow-amber-950/10">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-base font-extrabold">{hi ? "Dhaga पर आप कौन हैं?" : "How will you use Dhaga?"}</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">{hi ? "आप बाद में भी अपना विकल्प बदल सकते हैं।" : "Choose your journey. You can switch later."}</p>
            </div>
            <button type="button" onClick={closeRolePrompt} className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-500" aria-label="Close">
              <X size={16} />
            </button>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link href="/register" onClick={closeRolePrompt} className="rounded-2xl bg-amber-50 p-3 ring-1 ring-amber-100">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-amber-700 shadow-sm"><UserRound size={21} /></span>
              <span className="mt-2 block text-sm font-bold">{hi ? "मैं ग्राहक हूं" : "I’m a customer"}</span>
              <span className="mt-0.5 block text-[11px] text-slate-500">{hi ? "दर्जी खोजें और बुक करें" : "Find and book a tailor"}</span>
            </Link>
            <Link href="/register" onClick={closeRolePrompt} className="rounded-2xl bg-slate-900 p-3 text-white">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-amber-300"><Scissors size={21} /></span>
              <span className="mt-2 block text-sm font-bold">{hi ? "मैं दर्जी हूं" : "I’m a tailor"}</span>
              <span className="mt-0.5 block text-[11px] text-slate-300">{hi ? "काम और ग्राहक पाएं" : "Get work and customers"}</span>
            </Link>
          </div>
        </section>
      )}

      <section id="mobile-services" className="scroll-mt-4 px-4 pt-7">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-700">{hi ? "सेवाएं" : "Services"}</p>
            <h2 className="mt-1 text-xl font-extrabold">{hi ? "आपको क्या चाहिए?" : "What do you need?"}</h2>
          </div>
          <Link href="/tailors" className="text-xs font-bold text-amber-700">{hi ? "सभी देखें" : "View all"}</Link>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-x-3 gap-y-5">
          {serviceItems.map((service) => {
            const Icon = service.icon;
            return (
              <Link key={service.en} href={`/tailors?service=${encodeURIComponent(service.query)}`} className="text-center">
                <span className={`mx-auto grid h-16 w-16 place-items-center rounded-2xl ${service.color} shadow-sm ring-1 ring-black/[.03]`}><Icon size={27} /></span>
                <span className="mt-2 block text-xs font-semibold leading-4 text-slate-700">{hi ? service.hi : service.en}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-8 px-4">
        <div className="rounded-3xl bg-slate-900 p-5 text-white shadow-xl shadow-slate-900/15">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-300">{hi ? "सबसे ज्यादा बुक" : "Most booked"}</p>
              <h2 className="mt-1 text-xl font-extrabold">{hi ? "घर पर माप" : "Measurement at home"}</h2>
            </div>
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-amber-300"><House size={24} /></span>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-6 text-slate-300">{hi ? "दर्जी आपके घर आएगा—समय चुनें और बिना भागदौड़ सही फिटिंग पाएं।" : "Pick a time and a tailor visits you for a comfortable, accurate fitting."}</p>
          <Link href="/tailors?service=Home" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-sm font-bold text-slate-950">
            <CalendarDays size={17} /> {hi ? "माप बुक करें" : "Book measurement"}
          </Link>
        </div>
      </section>

      <section className="px-4 pt-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-700">{hi ? "आपके आस-पास" : "Near you"}</p>
            <h2 className="mt-1 text-xl font-extrabold">{hi ? "भरोसेमंद दर्जी" : "Trusted tailors"}</h2>
          </div>
          <Link href="/tailors" className="text-xs font-bold text-amber-700">{hi ? "सभी देखें" : "View all"}</Link>
        </div>
        <div
          ref={tailorCarouselRef}
          onScroll={updateActiveTailor}
          onPointerDown={() => setCarouselPaused(true)}
          onPointerUp={() => setCarouselPaused(false)}
          onPointerCancel={() => setCarouselPaused(false)}
          onMouseEnter={() => setCarouselPaused(true)}
          onMouseLeave={() => setCarouselPaused(false)}
          className="-mx-4 mt-4 flex snap-x snap-proximity gap-3 overflow-x-auto overscroll-x-contain px-4 pb-3 pr-[14vw] scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label={hi ? "आस-पास के भरोसेमंद दर्जी" : "Trusted tailors near you"}
        >
          {carouselTailors.length ? carouselTailors.map((tailor) => {
            const price = tailor.services.length ? Math.min(...tailor.services.map((service) => service.price)) : null;
            return (
              <Link key={tailor.id} href={`/tailors/${tailor.id}`} className="w-[82vw] max-w-[330px] shrink-0 snap-start overflow-hidden rounded-3xl bg-white shadow-[0_10px_28px_rgba(15,23,42,.09)] ring-1 ring-slate-200/70">
                <div className="relative h-36 bg-amber-50">
                  <Image src={tailor.shopPhoto || "/images/tailor1.png"} alt={tailor.shopName} fill sizes="290px" unoptimized={Boolean(tailor.shopPhoto?.startsWith("data:"))} className="object-cover" />
                  {tailor.isVerified && <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-blue-700 shadow"><BadgeCheck size={13} /> {hi ? "सत्यापित" : "Verified"}</span>}
                </div>
                <div className="p-4">
                  <h3 className="truncate text-base font-extrabold">{tailor.shopName}</h3>
                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><MapPin size={13} className="text-amber-700" /> {tailor.city} · {tailor.experience} {hi ? "वर्ष" : "yrs"}</p>
                  <div className="mt-3 flex items-end justify-between">
                    <span className="text-xs text-slate-500">{price === null ? (hi ? "सेवाएं देखें" : "View services") : <><b className="text-sm text-slate-900">₹{price.toLocaleString("en-IN")}</b> {hi ? "से शुरू" : "onwards"}</>}</span>
                    <span className="rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs font-bold text-amber-800">{hi ? "देखें" : "View"}</span>
                  </div>
                </div>
              </Link>
            );
          }) : (
            <div className="w-full rounded-3xl bg-white p-6 text-center text-sm text-slate-500 ring-1 ring-slate-200">{hi ? "आपके क्षेत्र में दर्जी जल्द दिखाई देंगे।" : "Tailors near you will appear here soon."}</div>
          )}
        </div>
        {carouselTailors.length > 1 && (
          <div className="mt-1 flex items-center justify-center gap-1.5" aria-label={`${activeTailorIndex + 1} of ${carouselTailors.length}`}>
            {carouselTailors.map((tailor, index) => (
              <button
                key={tailor.id}
                type="button"
                onClick={() => scrollToTailor(index)}
                className={index === activeTailorIndex
                  ? "h-6 min-w-9 rounded-full bg-amber-700 px-2 text-[10px] font-bold text-white shadow-sm transition-all"
                  : "h-2 w-2 rounded-full bg-slate-300 transition-all hover:bg-amber-400"}
                aria-label={`${hi ? "दर्जी" : "Tailor"} ${index + 1}`}
              >
                {index === activeTailorIndex ? `${index + 1}/${carouselTailors.length}` : ""}
              </button>
            ))}
          </div>
        )}
      </section>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200/80 bg-white/95 px-2 pb-[max(.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_30px_rgba(15,23,42,.08)] backdrop-blur-xl" aria-label="Mobile navigation">
        <div className="mx-auto grid max-w-md grid-cols-5">
          {(user?.isTailor ? [
            { label: hi ? "होम" : "Home", href: "/", icon: Home, active: true },
            { label: hi ? "अनुरोध" : "Requests", href: "/tailor-dashboard", icon: Clock3 },
            { label: hi ? "कीमतें" : "Prices", href: "/tailor-dashboard/services", icon: Scissors },
            { label: hi ? "दुकान" : "Shop", href: "/tailor-dashboard", icon: Store },
            { label: hi ? "अकाउंट" : "Account", href: accountHref, icon: UserRound },
          ] : [
            { label: hi ? "होम" : "Home", href: "/", icon: Home, active: true },
            { label: hi ? "सेवाएं" : "Services", href: "/services", icon: Scissors },
            { label: hi ? "दर्जी" : "Tailors", href: "/tailors", icon: Store },
            { label: hi ? "बुकिंग" : "Bookings", href: session ? "/my-bookings" : "/login", icon: Clock3 },
            { label: hi ? "अकाउंट" : "Account", href: accountHref, icon: session ? UserRound : Heart },
          ]).map((item) => {
            const Icon = item.icon;
            return <Link key={item.label} href={item.href} className={`flex min-w-0 flex-col items-center gap-1 rounded-xl py-1 text-[10px] font-semibold ${item.active ? "text-amber-700" : "text-slate-500"}`}><Icon size={20} strokeWidth={item.active ? 2.5 : 2} /><span className="truncate">{item.label}</span></Link>;
          })}
        </div>
      </nav>
    </div>
  );
}
