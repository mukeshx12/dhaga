"use client";

import { CheckCircle2, X } from "lucide-react";
import { useEffect, useState } from "react";

import { useLanguage } from "@/app/i18n/LanguageProvider";

export const appFlashStorageKey = "dhaga-app-flash";

type FlashType = "logout";

export default function AppFlashMessage() {
  const { language } = useLanguage();
  const [flash, setFlash] = useState<FlashType | null>(null);

  useEffect(() => {
    const value = window.sessionStorage.getItem(appFlashStorageKey);
    window.sessionStorage.removeItem(appFlashStorageKey);

    if (value === "logout") {
      const showTimer = window.setTimeout(() => setFlash(value), 0);
      return () => window.clearTimeout(showTimer);
    }
  }, []);

  useEffect(() => {
    if (!flash) return;
    const timer = window.setTimeout(() => setFlash(null), 5000);
    return () => window.clearTimeout(timer);
  }, [flash]);

  if (!flash) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-4 top-[max(1rem,env(safe-area-inset-top))] z-[100] mx-auto flex max-w-sm items-center gap-3 rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-emerald-900 shadow-xl shadow-emerald-950/10"
    >
      <CheckCircle2 className="shrink-0 text-emerald-600" size={21} />
      <span className="min-w-0 flex-1 text-sm font-bold">
        {language === "hi" ? "सफलतापूर्वक लॉग आउट हो गया।" : "Logged out successfully"}
      </span>
      <button
        type="button"
        onClick={() => setFlash(null)}
        aria-label="Dismiss message"
        className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-emerald-800 hover:bg-emerald-50"
      >
        <X size={16} />
      </button>
    </div>
  );
}
