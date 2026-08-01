"use client";

import {
  SessionProvider,
} from "next-auth/react";
import { LanguageProvider } from "./i18n/LanguageProvider";
import type { Language } from "./i18n/config";
import GlobalLanguageSelector from "./components/GlobalLanguageSelector";

type ProvidersProps = {
  children: React.ReactNode;
  initialLanguage: Language;
};

export default function Providers({
  children,
  initialLanguage,
}: ProvidersProps) {
  return (
    <LanguageProvider initialLanguage={initialLanguage}>
      <SessionProvider>
        {children}
        <GlobalLanguageSelector />
      </SessionProvider>
    </LanguageProvider>
  );
}
