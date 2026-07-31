"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import TailorCard from "@/app/components/TailorCard";

type Tailor = {
  id: string;
  shopName: string;
  city: string;
  description: string | null;
  experience: number;
  isVerified: boolean;
};

type Props = {
  initialTailors: Tailor[];
};

export default function TailorsClient({
  initialTailors,
}: Props) {
  const [tailors, setTailors] = useState(initialTailors);
const searchParams = useSearchParams();

const [search, setSearch] = useState("");

const [city, setCity] = useState(
  searchParams.get("city") || ""
);
const [sort, setSort] = useState("newest");
const [service, setService] = useState(searchParams.get("service") ?? "");
const [verifiedOnly, setVerifiedOnly] = useState(false);
useEffect(() => {
  async function fetchTailors() {
    const url = `/api/tailors?search=${encodeURIComponent(search)}
&city=${encodeURIComponent(city)}
&service=${encodeURIComponent(service)}
&sort=${sort}
&verified=${verifiedOnly}`;


   const response = await fetch(
  `/api/tailors?search=${encodeURIComponent(search.trim())}&city=${encodeURIComponent(city.trim())}&service=${encodeURIComponent(service.trim())}&sort=${sort}&verified=${verifiedOnly}`
);

const data = await response.json();

  console.log("API Response:", data);

  if (Array.isArray(data)) {
    setTailors(data);
  } else {
    console.error("API Error:", data);
    setTailors([]);
  }

  }

  fetchTailors();
}, [search,city,sort,verifiedOnly,service]);

  return (
    <main className="min-h-screen bg-[#FAF7F2] px-6 py-12">

      <div className="mx-auto max-w-7xl">

  {/* Heading */}
  <div className="text-center">
    <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
      Browse Tailors
    </span>

    <h1 className="mt-5 text-5xl font-bold text-gray-900">
      Find Your Perfect Tailor
    </h1>

    <p className="mt-4 text-lg text-gray-700">
      Browse verified tailoring professionals near you.
    </p>
  </div>

  {/* Verified Checkbox */}
  <div className="mt-8 flex items-center gap-3">
    <input
      id="verified"
      type="checkbox"
      checked={verifiedOnly}
      onChange={(e) => setVerifiedOnly(e.target.checked)}
      className="h-5 w-5 rounded border-gray-300 text-amber-700 focus:ring-amber-600"
    />

    <label
      htmlFor="verified"
      className="cursor-pointer text-base font-semibold text-gray-800"
    >
      Verified Tailors Only
    </label>
  </div>

  {/* Search & Filters */}
  <div className="mx-auto mt-10 flex max-w-5xl gap-4">

    <input
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search by shop name..."
      className="flex-1 rounded-xl border border-gray-300 bg-white p-4 text-gray-900 placeholder:text-gray-500 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-200"
    />

    <select
      value={city}
      onChange={(e) => setCity(e.target.value)}
      className="rounded-xl border border-gray-300 bg-white px-5 text-gray-900 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-200"
    >
      <option value="">All Cities</option>
<option value="Delhi">Delhi</option>
<option value="New Delhi">New Delhi</option>
<option value="Noida">Noida</option>
<option value="Lucknow">Lucknow</option>
<option value="Pune">Pune</option>
<option value="Raipur">Raipur</option>
    </select>

    <select
      value={sort}
      onChange={(e) => setSort(e.target.value)}
      className="rounded-xl border border-gray-300 bg-white px-5 text-gray-900 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-200"
    >
      <option value="newest">Newest</option>
      <option value="experience">Experience</option>
      <option value="name">A-Z</option>
    </select>

  </div>

  {/* Tailor Cards */}
  <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
    {tailors.map((tailor) => (
      <TailorCard
        key={tailor.id}
        tailor={tailor}
      />
    ))}
  </div>

</div>

    </main>
  );
}