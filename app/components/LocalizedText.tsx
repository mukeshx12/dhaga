"use client";

import { useLanguage } from "@/app/i18n/LanguageProvider";

export default function LocalizedText({ en, hi }: { en: React.ReactNode; hi: React.ReactNode }) {
  const { language } = useLanguage();
  return <>{language === "hi" ? hi : en}</>;
}
