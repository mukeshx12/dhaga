"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Search } from "lucide-react";
import { useLanguage } from "@/app/i18n/LanguageProvider";

export default function SearchBar() {
  const router = useRouter();
  const { language } = useLanguage();

  const [city, setCity] = useState("");
  const [service, setService] = useState("");

  return (
    <section className="relative z-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="rounded-2xl border border-amber-100/80 bg-white/95 p-3 shadow-[0_14px_38px_rgba(120,53,15,.11)] backdrop-blur-sm sm:p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            {/* City */}
            <div className="flex min-h-14 flex-1 items-center gap-3 rounded-xl border border-stone-200 bg-stone-50/70 px-4 transition focus-within:border-amber-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-amber-100">
              <MapPin className="h-5 w-5 shrink-0 text-amber-700" />

              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                type="text"
                placeholder={language === "hi" ? "अपना शहर दर्ज करें" : "Enter your city"}
                className="w-full bg-transparent text-gray-900 placeholder:text-gray-400 outline-none"
              />
            </div>

            {/* Service */}
            <div className="flex min-h-14 flex-1 items-center gap-3 rounded-xl border border-stone-200 bg-stone-50/70 px-4 transition focus-within:border-amber-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-amber-100">
              <Search className="h-5 w-5 shrink-0 text-amber-700" />

              <input
                value={service}
                onChange={(e) => setService(e.target.value)}
                type="text"
                placeholder={language === "hi" ? "ब्लाउज़, सूट खोजें..." : "Search Blouse, Suit..."}
                className="w-full bg-transparent text-gray-900 placeholder:text-gray-400 outline-none"
              />
            </div>

            {/* Search Button */}
            <button
              onClick={() => {
                const params = new URLSearchParams();

                if (city.trim()) {
                  params.append("city", city.trim());
                }

                if (service.trim()) {
                  params.append("service", service.trim());
                }

                router.push(
                  `/tailors${
                    params.toString() ? `?${params.toString()}` : ""
                  }`
                );
              }}
              className="min-h-14 w-full rounded-xl bg-amber-700 px-10 py-3 font-semibold text-white shadow-sm transition hover:bg-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 lg:w-auto"
            >
              {language === "hi" ? "खोजें" : "Search"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
