"use client";

import Link from "next/link";
import { Scissors } from "lucide-react";
import { useSession } from "next-auth/react";

export default function LegalFooter() {
  const { status } = useSession();

  return (
    <footer className="border-t border-stone-200 bg-stone-950 text-stone-300">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="inline-flex items-center gap-2 font-extrabold text-white">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-700">
            <Scissors size={19} aria-hidden="true" />
          </span>
          Dhaga
        </Link>

        <nav aria-label="Legal information" className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
          <Link href="/privacy" className="transition hover:text-amber-300">Privacy Policy</Link>
          {status === "authenticated" && (
            <Link href="/account-deletion" className="transition hover:text-amber-300">Account Deletion</Link>
          )}
          <Link href="/contact" className="transition hover:text-amber-300">Contact</Link>
        </nav>

        <p className="text-xs text-stone-500">© {new Date().getFullYear()} Dhaga</p>
      </div>
    </footer>
  );
}
