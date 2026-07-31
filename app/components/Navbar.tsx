"use client";

import Link from "next/link";
import { Menu, Scissors, X } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import LanguageSelector from "./LanguageSelector";
import { useLanguage } from "@/app/i18n/LanguageProvider";


type UserData = {
  id: string;
  name: string;
  email: string;
  role: string;
  isTailor: boolean;
  tailorId: string | null;
};

export default function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();

  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    async function fetchUser() {
      if (!session) return;

      const response = await fetch("/api/me");

      if (!response.ok) return;

      const data = await response.json();

      setUser(data);
    }

    fetchUser();
  }, [session]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Scissors className="text-amber-700" size={28} />
          <h1 className="text-2xl font-bold text-amber-800">
            Dhaga
          </h1>
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-8 font-medium text-gray-700">
          {!user?.isTailor && (
            <>
              <Link href="/#popular-services" className="hover:text-amber-700">
                {t("services")}
              </Link>

              <Link href="/tailors" className="hover:text-amber-700">
                {t("tailors")}
              </Link>
            </>
          )}

          <Link href="/#how-it-works"
            className="text-gray-700 transition hover:text-amber-700">
            {t("howItWorks")}
          </Link>

          <Link href="/#contact" className="hover:text-amber-700">
            {t("contact")}
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          <LanguageSelector compact />
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-gray-200 text-gray-700 transition hover:bg-gray-100 md:hidden"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="hidden md:flex items-center gap-3">
            {!session ? (
              <>
                <Link
                  href="/login"
                  className="rounded-lg border border-amber-700 px-5 py-2 text-amber-700 hover:bg-amber-50"
                >
                  {t("login")}
                </Link>

                <Link
                  href="/register"
                  className="rounded-lg bg-amber-700 px-5 py-2 text-white hover:bg-amber-800"
                >
                  {t("signUp")}
                </Link>
              </>
            ) : (
              <>
                {user?.isTailor ? (
                  <>
                    <Link
                      href="/tailor-dashboard"
                      className="rounded-lg bg-amber-700 px-5 py-2 text-white hover:bg-amber-800"
                    >
                      {t("tailorDashboard")}
                    </Link>

                  </>
                ) : (
                  <>
                    <Link
                      href="/dashboard"
                      className="rounded-lg bg-amber-700 px-5 py-2 text-white hover:bg-amber-800"
                    >
                      {t("dashboard")}
                    </Link>

                    <Link
                      href="/become-tailor"
                      className="rounded-lg border border-amber-700 px-5 py-2 text-amber-700 hover:bg-amber-50"
                    >
                      {t("becomeTailor")}
                    </Link>
                  </>
                )}

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="rounded-lg border border-red-500 px-5 py-2 text-red-600 hover:bg-red-50"
                >
                  {t("logout")}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-[#FAF7F2] px-6 py-5 shadow-lg">
          <div className="space-y-4">
            <div className="flex flex-col gap-3 border-b border-gray-100 pb-4">
              {!user?.isTailor && (
                <>
                  <Link href="/#popular-services" className="text-gray-700 hover:text-amber-700" onClick={() => setIsMenuOpen(false)}>
                    {t("services")}
                  </Link>
                  <Link href="/tailors" className="text-gray-700 hover:text-amber-700" onClick={() => setIsMenuOpen(false)}>
                    {t("tailors")}
                  </Link>
                </>
              )}
              <Link href="/#how-it-works" className="text-gray-700 hover:text-amber-700" onClick={() => setIsMenuOpen(false)}>
                {t("howItWorks")}
              </Link>
              <Link href="/#contact" className="text-gray-700 hover:text-amber-700" onClick={() => setIsMenuOpen(false)}>
                {t("contact")}
              </Link>
            </div>

            {!session ? (
              <div className="flex flex-col gap-3">
                <Link
                  href="/login"
                  className="rounded-lg border border-amber-700 px-5 py-3 text-center text-amber-700 hover:bg-amber-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t("login")}
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-amber-700 px-5 py-3 text-center text-white hover:bg-amber-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t("signUp")}
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {user?.isTailor ? (
                  <>
                    <Link
                      href="/tailor-dashboard"
                      className="rounded-lg bg-amber-700 px-5 py-3 text-center text-white hover:bg-amber-800"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t("tailorDashboard")}
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/dashboard"
                      className="rounded-lg bg-amber-700 px-5 py-3 text-center text-white hover:bg-amber-800"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t("dashboard")}
                    </Link>
                    <Link
                      href="/become-tailor"
                      className="rounded-lg border border-amber-700 px-5 py-3 text-center text-amber-700 hover:bg-amber-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t("becomeTailor")}
                    </Link>
                  </>
                )}
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="rounded-lg border border-red-500 px-5 py-3 text-center text-red-600 hover:bg-red-50"
                >
                  {t("logout")}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
