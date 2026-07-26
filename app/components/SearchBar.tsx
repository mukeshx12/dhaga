"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Search } from "lucide-react";

export default function SearchBar() {
  const router = useRouter();

  const [city, setCity] = useState("");
  const [service, setService] = useState("");

  return (
    <section className="relative z-20 -mt-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="rounded-3xl bg-white p-6 shadow-2xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            {/* City */}
            <div className="flex flex-1 items-center gap-3 rounded-xl border p-4">
              <MapPin className="h-6 w-6 text-amber-700" />

              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                type="text"
                placeholder="Enter your city"
                className="w-full bg-transparent text-gray-900 placeholder:text-gray-400 outline-none"
              />
            </div>

            {/* Service */}
            <div className="flex flex-1 items-center gap-3 rounded-xl border p-4">
              <Search className="h-6 w-6 text-amber-700" />

              <input
                value={service}
                onChange={(e) => setService(e.target.value)}
                type="text"
                placeholder="Search Blouse, Suit..."
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
              className="rounded-xl bg-amber-700 px-10 py-4 text-white transition hover:bg-amber-800"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}