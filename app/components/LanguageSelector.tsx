"use client";

import { Languages } from "lucide-react";
import { useLanguage } from "@/app/i18n/LanguageProvider";

export default function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">{t("language")}</span>
      <Languages aria-hidden="true" className="pointer-events-none absolute left-3 text-amber-700" size={17} />
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value as "en" | "hi")}
        aria-label={t("language")}
        className={`rounded-lg border border-amber-200 bg-white pl-9 font-semibold text-gray-700 outline-none transition hover:border-amber-400 focus:ring-2 focus:ring-amber-200 ${compact ? "h-10 pr-2 text-xs" : "h-11 pr-3 text-sm"}`}
      >
        <option value="en">English</option>
        <option value="hi">हिन्दी</option>
      </select>
    </label>
  );
}
