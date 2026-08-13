"use client";

import {
  SessionProvider,
} from "next-auth/react";
import { LanguageProvider } from "./i18n/LanguageProvider";
import type { Language } from "./i18n/config";
import MobileNativeBridge from "./components/MobileNativeBridge";
import MobileBottomNav from "./components/MobileBottomNav";

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
        <MobileNativeBridge />
        <MobileBottomNav />
      </SessionProvider>
    </LanguageProvider>
  );
}
