"use client";

import {
  SessionProvider,
} from "next-auth/react";
import { LanguageProvider } from "./i18n/LanguageProvider";
import type { Language } from "./i18n/config";
import MobileNativeBridge from "./components/MobileNativeBridge";
import MobileBottomNav from "./components/MobileBottomNav";
import AppFlashMessage from "./components/AppFlashMessage";

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
        <AppFlashMessage />
        <MobileNativeBridge />
        <MobileBottomNav />
      </SessionProvider>
    </LanguageProvider>
  );
}
