import { CheckCircle2, LogIn, ShieldCheck, Trash2 } from "lucide-react";
import Link from "next/link";

import LegalFooter from "@/app/components/LegalFooter";
import Navbar from "@/app/components/Navbar";

export const metadata = {
  title: "Account Deletion | Dhaga",
  description: "Request permanent deletion of your Dhaga account and associated data.",
};

type AccountDeletionPageProps = {
  searchParams: Promise<{ deleted?: string }>;
};

export default async function AccountDeletionPage({ searchParams }: AccountDeletionPageProps) {
  const { deleted } = await searchParams;

  return (
    <main className="min-h-screen bg-[#FAF7F2] pt-20">
      <Navbar />
      <div className="mx-auto max-w-4xl px-5 py-12 sm:py-20">
        {deleted === "1" && (
          <div role="status" className="mb-6 flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900">
            <CheckCircle2 className="mt-0.5 shrink-0" size={21} />
            <div><p className="font-bold">Your Dhaga account has been deleted.</p><p className="mt-1 text-sm text-emerald-800">You have been signed out and can close the app or this browser window.</p></div>
          </div>
        )}

        <section className="overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-[0_24px_70px_rgba(120,53,15,.10)]">
          <div className="bg-gradient-to-br from-amber-800 to-orange-700 px-6 py-10 text-white sm:px-10 sm:py-12">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold uppercase tracking-[.14em] ring-1 ring-white/20"><ShieldCheck size={15} /> Privacy control</span>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">Delete your Dhaga account</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-amber-50 sm:text-lg">This public page lets customers and tailors start account deletion from the web, even after uninstalling the Android app.</p>
          </div>

          <div className="grid gap-8 px-6 py-8 sm:px-10 sm:py-10 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-2xl font-bold text-stone-950">What will be deleted?</h2>
              <ul className="mt-4 space-y-3 text-stone-600">
                {[
                  "Your customer or tailor account and profile details",
                  "Saved tailors, services, photographs and password-reset records",
                  "Bookings and quotations associated with your account",
                ].map((item) => <li key={item} className="flex gap-3"><CheckCircle2 className="mt-0.5 shrink-0 text-amber-700" size={19} /><span>{item}</span></li>)}
              </ul>
            </div>
            <div className="flex justify-center"><span className="grid h-24 w-24 place-items-center rounded-full bg-red-50 text-red-700 ring-8 ring-red-50/60"><Trash2 size={39} /></span></div>
          </div>

          <div className="border-t border-stone-200 bg-stone-50 px-6 py-8 sm:px-10">
            <h2 className="text-lg font-bold text-stone-950">Verify ownership before deletion</h2>
            <p className="mt-2 max-w-2xl leading-7 text-stone-600">Sign in to the account you want to delete. Password accounts must enter the current password. Phone accounts are protected by their verified signed-in session.</p>
            <Link href="/account/delete" className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-red-700 px-6 py-3 font-bold text-white transition hover:bg-red-800">
              <LogIn size={19} /> Sign in and continue
            </Link>
            <p className="mt-4 text-xs leading-5 text-stone-500">Some limited information may be retained only where required for fraud prevention, dispute handling or applicable law, as described in the <Link href="/privacy" className="font-semibold text-amber-800 underline">Privacy Policy</Link>.</p>
          </div>
        </section>
      </div>
      <LegalFooter />
    </main>
  );
}
