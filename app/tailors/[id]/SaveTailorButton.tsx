"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { useLanguage } from "@/app/i18n/LanguageProvider";

type Props = {
  tailorId: string;
  initiallySaved: boolean;
};

export default function SaveTailorButton({ tailorId, initiallySaved }: Props) {
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
      className="mt-10 inline-flex items-center gap-2 rounded-xl border border-amber-700 px-6 py-4 font-semibold text-amber-800 hover:bg-amber-50 disabled:opacity-50"
    >
      <Heart size={20} className={saved ? "fill-current" : ""} />
      {saved ? (language === "hi" ? "सहेजा गया दर्जी" : "Saved tailor") : (language === "hi" ? "दर्जी सहेजें" : "Save tailor")}
    </button>
  );
}
