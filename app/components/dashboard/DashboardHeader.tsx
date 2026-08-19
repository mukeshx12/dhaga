"use client";

import Link from "next/link";
import LanguageSelector from "../LanguageSelector";
import LogoutButton from "../LogoutButton";
import { useLanguage } from "@/app/i18n/LanguageProvider";

type Props = {
  name: string;
  email: string | null;
};

export default function DashboardHeader({ name, email }: Props) {
  const initial = name.trim().charAt(0).toUpperCase() || "C";
  const { t } = useLanguage();

  return (
    <header className="flex flex-col gap-5 rounded-2xl bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-amber-700">{t("customerDashboard")}</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">{t("welcomeBack")}, {name}</h1>
      </div>

      <div className="flex items-center gap-3">
        <LanguageSelector compact />
        <Link
          href="/profile"
          aria-label="Open customer profile"
          className="flex min-w-0 items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2 transition hover:border-amber-300 hover:bg-amber-50"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-700 text-lg font-bold text-white">
            {initial}
          </span>
          <span className="hidden min-w-0 text-left sm:block">
            <span className="block truncate text-sm font-semibold text-gray-900">{name}</span>
            <span className="block max-w-48 truncate text-xs text-gray-500">{email || "Customer profile"}</span>
          </span>
        </Link>

        <LogoutButton className="px-3 sm:px-4" />
      </div>
    </header>
  );
}
