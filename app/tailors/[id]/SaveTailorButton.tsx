"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { useLanguage } from "@/app/i18n/LanguageProvider";

type Props = {
  tailorId: string;
  initiallySaved: boolean;
  className?: string;
};

export default function SaveTailorButton({ tailorId, initiallySaved, className = "" }: Props) {
  const { language } = useLanguage();
  const [saved, setSaved] = useState(initiallySaved);
  const [loading, setLoading] = useState(false);

  async function toggleSaved() {
    setLoading(true);
    try {
      const response = await fetch(`/api/saved-tailors/${tailorId}`, {
        method: saved ? "DELETE" : "POST",
      });
      if (response.ok) setSaved((current) => !current);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggleSaved}
      disabled={loading}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-amber-700 bg-white px-5 py-3 font-bold text-amber-800 transition hover:bg-amber-50 disabled:opacity-50 ${className}`}
    >
      <Heart size={20} className={saved ? "fill-current" : ""} />
      {saved ? (language === "hi" ? "सहेजा गया दर्जी" : "Saved tailor") : (language === "hi" ? "दर्जी सहेजें" : "Save tailor")}
    </button>
  );
}
