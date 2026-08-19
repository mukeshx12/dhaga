"use client";

import { LoaderCircle, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

import { useLanguage } from "@/app/i18n/LanguageProvider";

type LogoutButtonProps = {
  className?: string;
};

export default function LogoutButton({ className = "" }: LogoutButtonProps) {
  const { language } = useLanguage();
  const [loggingOut, setLoggingOut] = useState(false);

  async function logout() {
    if (loggingOut) return;
    setLoggingOut(true);

    try {
      const result = await signOut({ redirect: false, callbackUrl: "/" });
      window.location.assign(result?.url || "/");
    } catch {
      setLoggingOut(false);
    }
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={loggingOut}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-bold text-red-700 transition hover:bg-red-50 disabled:cursor-wait disabled:opacity-60 ${className}`}
    >
      {loggingOut ? <LoaderCircle className="animate-spin" size={18} /> : <LogOut size={18} />}
      {loggingOut
        ? language === "hi" ? "लॉग आउट हो रहा है…" : "Logging out…"
        : language === "hi" ? "लॉग आउट" : "Logout"}
    </button>
  );
}
