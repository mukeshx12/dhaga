"use client";

import { useState } from "react";
import Link from "next/link";
import { ClipboardList, Home, Scissors, Store } from "lucide-react";
import TailorBookings from "./TailorBookings";
import TailorListing from "./TailorListing";
import TailorServices from "@/app/components/dashboard/TailorServices";
import { useLanguage } from "@/app/i18n/LanguageProvider";
import LogoutButton from "@/app/components/LogoutButton";

type Listing = {
  shopName: string;
  phone: string;
  city: string;
  address: string;
  experience: number;
  description: string | null;
  shopPhoto: string | null;
  workPhotos: string[];
  isVerified: boolean;
};

type Props = {
  initialListing: Listing;
  initialSection?: Section;
};

type Section = "requests" | "services" | "profile";

const sections = [
  {
    id: "requests" as const,
    label: "Customer Requests",
    icon: ClipboardList,
  },
  {
    id: "services" as const,
    label: "Services & Prices",
    icon: Scissors,
  },
  {
    id: "profile" as const,
    label: "Tailor Profile",
    icon: Store,
  },
];

export default function TailorDashboardTabs({ initialListing, initialSection = "requests" }: Props) {
  const [activeSection, setActiveSection] = useState<Section>(initialSection);
  const { language } = useLanguage();
  const hi = language === "hi";

  return (
    <>
      <nav aria-label={hi ? "दर्जी डैशबोर्ड नेविगेशन" : "Tailor dashboard navigation"} className="mt-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-2">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800"
            >
              <Home size={18} />
              {hi ? "होम" : "Home"}
            </Link>

            <LogoutButton />
          </div>

          <div className="grid w-full gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm sm:w-auto sm:grid-cols-3">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;

            return (
              <button
                key={section.id}
                type="button"
                onClick={() => {
                  setActiveSection(section.id);
                  window.history.replaceState(null, "", `/tailor-dashboard?section=${section.id}`);
                }}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-amber-700 text-white shadow-sm"
                    : "text-gray-700 hover:bg-amber-50 hover:text-amber-800"
                }`}
              >
                <Icon size={18} />
                {hi ? ({ requests: "ग्राहक अनुरोध", services: "सेवाएं और कीमतें", profile: "दर्जी प्रोफ़ाइल" } as const)[section.id] : section.label}
              </button>
            );
          })}
          </div>
        </div>
      </nav>

      <div key={activeSection} className="animate-[fadeIn_180ms_ease-out]">
        {activeSection === "requests" && <TailorBookings />}
        {activeSection === "services" && <TailorServices />}
        {activeSection === "profile" && (
          <div className="mt-12">
            <TailorListing initialListing={initialListing} />
          </div>
        )}
      </div>
    </>
  );
}
