import { Mail, ShieldCheck, Trash2 } from "lucide-react";
import Link from "next/link";

import LegalFooter from "../components/LegalFooter";
import T from "../components/LocalizedText";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] pt-16">
      <section className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-4xl font-extrabold text-stone-950 sm:text-5xl"><T en="Contact Us" hi="हमसे संपर्क करें" /></h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-stone-600">Questions about your account, a booking or privacy? Contact the Dhaga support team.</p>

        <div className="mt-10 rounded-3xl border border-stone-200 bg-white p-7 shadow-sm sm:p-9">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-100 text-amber-800"><Mail size={23} /></span>
          <h2 className="mt-5 text-2xl font-bold text-stone-950">Email support</h2>
          <a href="mailto:support@joindhaga.com" className="mt-2 inline-block font-semibold text-amber-800 underline decoration-amber-300 underline-offset-4">support@joindhaga.com</a>
          <p className="mt-3 text-sm leading-6 text-stone-500">Include the phone number or email associated with your account, but never send your password or OTP.</p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Link href="/privacy" className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-5 font-semibold text-stone-800 transition hover:border-amber-300"><ShieldCheck className="text-amber-700" size={20} /> Privacy Policy</Link>
          <Link href="/account-deletion" className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-5 font-semibold text-stone-800 transition hover:border-red-300"><Trash2 className="text-red-700" size={20} /> Account Deletion</Link>
        </div>
      </section>
      <LegalFooter />
    </main>
  );
}
