"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  LoaderCircle,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from "lucide-react";
import TailorCard from "@/app/components/TailorCard";
import { useLanguage } from "@/app/i18n/LanguageProvider";

type Tailor = {
  id: string;
  shopName: string;
  city: string;
  description: string | null;
  experience: number;
  isVerified: boolean;
  shopPhoto: string | null;
  services: Array<{ id: string; serviceName: string; price: number }>;
};

type Props = { initialTailors: Tailor[] };

export default function TailorsClient({ initialTailors }: Props) {
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const hi = language === "hi";
  const [tailors, setTailors] = useState(initialTailors);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [service, setService] = useState(searchParams.get("service") || "");
  const [sort, setSort] = useState("newest");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const initialLoad = useRef(true);

  useEffect(() => {
    // The server already supplied the initial result set. Avoid immediately
    // downloading the same records (and large portfolio images) a second time.
    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError("");

      const query = new URLSearchParams({
        search: search.trim(),
        city: city.trim(),
        service: service.trim(),
        sort,
        verified: String(verifiedOnly),
      });

      try {
        const response = await fetch(`/api/tailors?${query}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Unable to load tailors");
        const data: unknown = await response.json();
        setTailors(Array.isArray(data) ? data : []);
      } catch (fetchError) {
        if (fetchError instanceof DOMException && fetchError.name === "AbortError") return;
        setError(hi ? "दर्जी अभी लोड नहीं हो सके। कृपया फिर प्रयास करें।" : "We could not load tailors right now. Please try again.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 300);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [search, city, service, sort, verifiedOnly, hi]);

  const hasFilters = Boolean(search || city || service || verifiedOnly || sort !== "newest");
  const clearFilters = () => {
    setSearch("");
    setCity("");
    setService("");
    setSort("newest");
    setVerifiedOnly(false);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#FAF7F2] px-3 pb-12 pt-4 sm:px-6 sm:pb-16 sm:pt-8">
      <div className="mx-auto max-w-7xl">
        <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-amber-900 via-amber-800 to-orange-700 px-5 pb-12 pt-7 text-white shadow-xl sm:rounded-3xl sm:px-10 sm:py-14 lg:px-14">
          <span className="inline-flex rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold ring-1 ring-white/25 sm:px-4 sm:py-2 sm:text-sm">
            {hi ? "भरोसेमंद स्थानीय पेशेवर" : "Trusted local professionals"}
          </span>
          <h1 className="mt-4 max-w-3xl text-[1.75rem] font-bold leading-tight tracking-tight sm:mt-5 sm:text-5xl lg:text-6xl">
            {hi ? "अपनी सही फिटिंग के लिए सही दर्जी खोजें" : "Find the right tailor for your perfect fit"}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-amber-50 sm:mt-4 sm:text-lg sm:leading-7">
            {hi ? "स्थानीय दर्जियों, सेवाओं और कीमतों की तुलना करें, फिर सुविधानुसार माप बुक करें।" : "Compare local tailors, services and prices, then book a measurement at your convenience."}
          </p>
        </section>

        <section className="relative z-10 mx-2 mt-4 max-w-6xl rounded-2xl border border-amber-100 bg-white p-3.5 shadow-lg sm:mx-auto sm:mt-6 sm:p-6">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700 sm:mb-4">
            <SlidersHorizontal size={18} className="text-amber-700" />
            {hi ? "खोज और फ़िल्टर" : "Search and filters"}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="relative sm:col-span-2 lg:col-span-1">
              <span className="sr-only">{hi ? "दुकान का नाम खोजें" : "Search shop name"}</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={19} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={hi ? "दुकान का नाम खोजें" : "Search shop name"}
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-500 focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-100 sm:h-12 sm:text-base"
              />
            </label>

            <label className="relative">
              <span className="sr-only">{hi ? "शहर" : "City"}</span>
              <MapPin className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={19} />
              <input
                value={city}
                onChange={(event) => setCity(event.target.value)}
                placeholder={hi ? "शहर या क्षेत्र" : "City or area"}
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-500 focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-100 sm:h-12 sm:text-base"
              />
            </label>

            <input
              value={service}
              onChange={(event) => setService(event.target.value)}
              placeholder={hi ? "सेवा, जैसे ब्लाउज़" : "Service, e.g. blouse"}
              className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-500 focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-100 sm:h-12 sm:text-base"
            />

            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              aria-label={hi ? "दर्जी क्रमबद्ध करें" : "Sort tailors"}
              className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 outline-none transition focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-100 sm:h-12 sm:text-base"
            >
              <option value="newest">{hi ? "नए पहले" : "Newest first"}</option>
              <option value="experience_desc">{hi ? "सबसे अनुभवी" : "Most experienced"}</option>
              <option value="experience_asc">{hi ? "अनुभव: कम से अधिक" : "Experience: low to high"}</option>
              <option value="name">{hi ? "दुकान का नाम: अ–ज्ञ" : "Shop name: A–Z"}</option>
            </select>
          </div>

          <div className="mt-3 flex flex-col gap-3 border-t border-gray-100 pt-3 sm:mt-4 sm:flex-row sm:items-center sm:justify-between sm:pt-4">
            <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-gray-700">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(event) => setVerifiedOnly(event.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-amber-700 focus:ring-amber-600"
              />
              <ShieldCheck size={19} className="text-amber-700" />
              {hi ? "केवल सत्यापित दर्जी" : "Verified tailors only"}
            </label>
            {hasFilters && (
              <button onClick={clearFilters} className="inline-flex items-center gap-1.5 self-start text-sm font-semibold text-amber-800 hover:text-amber-950 sm:self-auto">
                <X size={17} /> {hi ? "फ़िल्टर हटाएं" : "Clear filters"}
              </button>
            )}
          </div>
        </section>

        <div className="mt-8 flex items-end justify-between gap-4 sm:mt-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 sm:text-sm">{hi ? "उपलब्ध दर्जी" : "Available tailors"}</p>
            <h2 className="mt-1 text-xl font-bold text-gray-950 sm:text-3xl">
              {loading ? (hi ? "मिलान खोज रहे हैं…" : "Finding matches…") : hi ? `${tailors.length} दर्जी मिले` : `${tailors.length} ${tailors.length === 1 ? "tailor" : "tailors"} found`}
            </h2>
          </div>
          {loading && <LoaderCircle className="animate-spin text-amber-700" aria-label={hi ? "दर्जी लोड हो रहे हैं" : "Loading tailors"} />}
        </div>

        {tailors.length > 0 ? (
          <>
            {error && <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-center text-sm font-medium text-amber-900">{error}</div>}
            <div className={`mt-7 grid gap-6 transition-opacity md:grid-cols-2 xl:grid-cols-3 ${loading ? "opacity-60" : "opacity-100"}`}>
              {tailors.map((tailor) => <TailorCard key={tailor.id} tailor={tailor} />)}
            </div>
          </>
        ) : error ? (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-8 text-center font-medium text-red-700">{error}</div>
        ) : !loading ? (
          <div className="mt-8 rounded-3xl border border-amber-100 bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-800"><Search size={25} /></div>
            <h2 className="mt-5 text-2xl font-bold text-gray-950">{hi ? "कोई मेल खाता दर्जी नहीं मिला" : "No matching tailors found"}</h2>
            <p className="mx-auto mt-2 max-w-md text-gray-600">{hi ? "पास का शहर या अलग सेवा आज़माएं, या सभी दर्जी देखने के लिए फ़िल्टर हटाएं।" : "Try a nearby city, a different service, or clear your filters to see all available tailors."}</p>
            {hasFilters && <button onClick={clearFilters} className="mt-6 rounded-xl bg-amber-700 px-5 py-3 font-semibold text-white transition hover:bg-amber-800">{hi ? "सभी दर्जी दिखाएं" : "Show all tailors"}</button>}
          </div>
        ) : null}
      </div>
    </main>
  );
}
