"use client";

import {
  SessionProvider,
} from "next-auth/react";
import { LanguageProvider } from "./i18n/LanguageProvider";

type ProvidersProps = {
  children: React.ReactNode;
};

export default function Providers({
  children,
}: ProvidersProps) {
  return (
    <LanguageProvider>
      <SessionProvider>{children}</SessionProvider>
    </LanguageProvider>
  );
}
