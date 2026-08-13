"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  House,
  Ruler,
  Search,
  Scissors,
  Shirt,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useLanguage } from "@/app/i18n/LanguageProvider";

const serviceCatalog = [
  {
    name: "Blouse Stitching",
    nameHi: "ब्लाउज़ सिलाई",
    aliases: ["blouse", "bridal blouse", "designer blouse", "ब्लाउज़"],
    query: "Blouse",
    icon: Shirt,
    color: "bg-rose-100 text-rose-700",
    note: "Daily wear, designer and bridal",
    noteHi: "डेली वियर, डिज़ाइनर और ब्राइडल",
  },
  {
    name: "Suit Stitching",
    nameHi: "सूट सिलाई",
    aliases: ["suit", "salwar", "kurta", "punjabi suit", "सूट"],
    query: "Suit",
    icon: Sparkles,
    color: "bg-violet-100 text-violet-700",
    note: "Salwar suits, kurtas and coordinated sets",
    noteHi: "सलवार सूट, कुर्ते और मैचिंग सेट",
  },
  {
    name: "Clothing Alterations",
    nameHi: "कपड़ों में सुधार",
    aliases: ["alteration", "alter", "fitting", "resize", "repair", "अल्टरेशन"],
    query: "Alteration",
    icon: Scissors,
    color: "bg-sky-100 text-sky-700",
    note: "Resize, repair and improve fitting",
    noteHi: "आकार, मरम्मत और फिटिंग सुधारें",
  },
  {
    name: "Lehenga Stitching",
    nameHi: "लहंगा सिलाई",
    aliases: ["lehenga", "wedding", "bridal", "लहंगा"],
    query: "Lehenga",
    icon: BadgeCheck,
    color: "bg-amber-100 text-amber-700",
    note: "Wedding and festive tailoring",
    noteHi: "शादी और त्योहार की सिलाई",
  },
  {
    name: "Fall & Pico",
    nameHi: "फॉल और पिको",
    aliases: ["fall", "pico", "saree", "saaree", "साड़ी", "फॉल"],
    query: "Fall",
    icon: Ruler,
    color: "bg-emerald-100 text-emerald-700",
    note: "Quick and neat saree finishing",
    noteHi: "त्वरित और साफ साड़ी फिनिशिंग",
  },
  {
    name: "Home Measurement",
    nameHi: "घर पर माप",
    aliases: ["home", "measurement", "visit", "measure", "घर", "माप"],
    query: "Home",
    icon: House,
    color: "bg-orange-100 text-orange-700",
    note: "A tailor visits at your preferred time",
    noteHi: "दर्जी आपके चुने हुए समय पर घर आएगा",
  },
];

const trending = ["Blouse Stitching", "Suit Stitching", "Alterations", "Home Measurement"];

export default function SearchServicesPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const hi = language === "hi";
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLocaleLowerCase();

  const results = useMemo(() => {
    if (!normalizedQuery) return [];
    return serviceCatalog.filter((service) =>
      [service.name, service.nameHi, ...service.aliases]
        .join(" ")
        .toLocaleLowerCase()
        .includes(normalizedQuery)
    );
  }, [normalizedQuery]);

  const chooseSearch = (value: string) => {
    setQuery(value);
    inputRef.current?.focus();
  };

  return (
    <main className="min-h-screen bg-[#fbf8f3] pb-28 text-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 px-4 pb-4 pt-[max(1rem,env(safe-area-inset-top))] backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center gap-2 rounded-2xl border-2 border-amber-600 bg-white px-3 shadow-sm focus-within:ring-4 focus-within:ring-amber-100">
          <button type="button" onClick={() => router.back()} className="grid h-11 w-9 shrink-0 place-items-center text-slate-700" aria-label="Go back">
            <ArrowLeft size={21} />
          </button>
          <input
            ref={inputRef}
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={hi ? "सिलाई सेवा खोजें" : "Search tailoring services"}
            className="h-13 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-slate-400"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-600" aria-label="Clear search">
              <X size={17} />
            </button>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-6">
        {!normalizedQuery ? (
          <>
            <section>
              <div className="flex items-center gap-2">
                <TrendingUp size={19} className="text-amber-700" />
                <h1 className="text-lg font-extrabold">{hi ? "लोकप्रिय खोजें" : "Trending searches"}</h1>
              </div>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {trending.map((item) => (
                  <button key={item} type="button" onClick={() => chooseSearch(item)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm active:scale-95">
                    <TrendingUp size={14} className="text-amber-700" /> {item}
                  </button>
                ))}
              </div>
            </section>

            <section className="mt-8 border-t border-slate-200 pt-7">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-700">{hi ? "जल्दी खोजें" : "Quick discovery"}</p>
              <h2 className="mt-1 text-xl font-extrabold">{hi ? "सभी सेवाएं" : "Browse all services"}</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {serviceCatalog.map((service) => {
                  const Icon = service.icon;
                  return (
                    <button key={service.name} type="button" onClick={() => chooseSearch(service.name)} className="rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-slate-200/70 active:scale-[.98]">
                      <span className={`grid h-11 w-11 place-items-center rounded-xl ${service.color}`}><Icon size={21} /></span>
                      <span className="mt-3 block text-sm font-extrabold">{hi ? service.nameHi : service.name}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          </>
        ) : (
          <>
            <section>
              <p className="text-sm font-bold text-slate-500">{hi ? "सुझाव" : "Suggestions"}</p>
              <div className="mt-2 divide-y divide-slate-100 rounded-2xl bg-white px-4 shadow-sm ring-1 ring-slate-200/70">
                {(results.length ? results : serviceCatalog.slice(0, 3)).map((service) => (
                  <button key={service.name} type="button" onClick={() => chooseSearch(service.name)} className="flex w-full items-center gap-3 py-3 text-left text-sm font-semibold">
                    <Search size={16} className="shrink-0 text-slate-500" />
                    <span>{hi ? service.nameHi : service.name}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="mt-7">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-700">{hi ? "सेवाएं" : "Services"}</p>
                  <h2 className="mt-1 text-xl font-extrabold">
                    {results.length ? (hi ? `${results.length} परिणाम` : `${results.length} result${results.length === 1 ? "" : "s"}`) : (hi ? "कोई सटीक परिणाम नहीं" : "No exact match")}
                  </h2>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {(results.length ? results : serviceCatalog).map((service) => {
                  const Icon = service.icon;
                  return (
                    <article key={service.name} className="flex items-center gap-3 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70">
                      <span className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl ${service.color}`}><Icon size={27} /></span>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-extrabold">{hi ? service.nameHi : service.name}</h3>
                        <p className="mt-1 text-xs leading-5 text-slate-500">{hi ? service.noteHi : service.note}</p>
                        <p className="mt-1 text-[11px] font-semibold text-emerald-700">{hi ? "कीमतों की तुलना करें" : "Compare local prices"}</p>
                      </div>
                      <Link href={`/tailors?service=${encodeURIComponent(service.query)}`} className="shrink-0 rounded-xl border border-amber-600 px-3 py-2 text-xs font-extrabold text-amber-700 active:bg-amber-50">
                        {hi ? "दर्जी" : "Find"}
                      </Link>
                    </article>
                  );
                })}
              </div>

              {!results.length && (
                <Link href={`/tailors?service=${encodeURIComponent(query.trim())}`} className="mt-5 flex items-center justify-between rounded-2xl bg-slate-900 p-4 text-sm font-bold text-white">
                  <span>{hi ? `“${query}” के लिए सभी दर्जी खोजें` : `Search all tailors for “${query}”`}</span>
                  <ArrowUpRight size={18} className="text-amber-300" />
                </Link>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
