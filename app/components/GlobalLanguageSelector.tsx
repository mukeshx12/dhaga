"use client";

import { usePathname } from "next/navigation";
import LanguageSelector from "./LanguageSelector";

export default function GlobalLanguageSelector() {
  const pathname = usePathname();
  const alreadyInHeader = pathname === "/" || pathname === "/dashboard" || pathname.startsWith("/admin");
  if (alreadyInHeader) return null;

  return (
    <div className="fixed bottom-24 right-4 z-[60] rounded-xl bg-white p-1 shadow-lg ring-1 ring-gray-200 sm:bottom-6 sm:right-6">
      <LanguageSelector compact />
    </div>
  );
}
