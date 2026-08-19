import { Database, Eye, LockKeyhole, MapPin, ShieldCheck, UserRoundX } from "lucide-react";
import Link from "next/link";

import LegalFooter from "@/app/components/LegalFooter";
import Navbar from "@/app/components/Navbar";

export const metadata = {
  title: "Privacy Policy | Dhaga",
  description: "Learn how Dhaga collects, uses, protects and deletes personal data.",
};

const sections = [
  {
    title: "Information we collect",
    icon: Database,
    content: (
      <ul className="list-disc space-y-2 pl-5">
        <li>Account information such as your name, email address, phone number, password hash and account role.</li>
        <li>Profile and marketplace information, including addresses, tailor shop details, service prices, experience and uploaded shop or work photographs.</li>
        <li>Booking information such as the selected tailor, measurement date, service address, notes, quotation and booking status.</li>
        <li>Location information only when you choose to use location features. Dhaga uses an area-level location lookup to display a useful locality, city or state.</li>
        <li>Basic technical and security information needed to operate the service, prevent abuse and diagnose failures.</li>
      </ul>
    ),
  },
  {
    title: "How we use information",
    icon: Eye,
    content: (
      <p>We use this information to create and secure accounts, connect customers with tailors, process booking requests, display nearby professionals, enable calls or WhatsApp after booking, send authentication or account messages, provide support, prevent misuse and improve Dhaga.</p>
    ),
  },
  {
    title: "When information is shared",
    icon: ShieldCheck,
    content: (
      <p>We share only what is needed to provide the service. A booked customer and tailor may receive the contact and booking details needed to fulfil that booking. We also use service providers for hosting, database storage, authentication messages, transactional email and area-level address lookup. We do not sell personal information.</p>
    ),
  },
  {
    title: "Location privacy",
    icon: MapPin,
    content: (
      <p>Location access is optional and requested when you use a nearby-location feature. Coordinates sent for address lookup are reduced to area-level precision. You can deny or revoke location permission in your device settings and enter a city or area manually instead.</p>
    ),
  },
  {
    title: "Retention and security",
    icon: LockKeyhole,
    content: (
      <p>We retain account and booking information while your account is active and as needed to operate Dhaga. We use access controls, encrypted connections and password hashing to protect data. No internet service can guarantee absolute security. Limited records may be retained when required for fraud prevention, dispute resolution or applicable law, and will be isolated from normal product use.</p>
    ),
  },
  {
    title: "Your choices and deletion rights",
    icon: UserRoundX,
    content: (
      <p>You can review or update profile information from your account. You can permanently delete your account through the profile deletion option or the public account-deletion page. Account deletion removes the account and associated Dhaga data, subject to any retention required by law.</p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] pt-20 text-stone-800">
      <Navbar />
      <section className="border-b border-amber-100 bg-gradient-to-b from-amber-50 to-[#FAF7F2]">
        <div className="mx-auto max-w-4xl px-5 py-14 text-center sm:py-20">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-[.16em] text-amber-800 shadow-sm ring-1 ring-amber-100">
            <ShieldCheck size={16} /> Your privacy matters
          </span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-stone-950 sm:text-5xl">Dhaga Privacy Policy</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-stone-600 sm:text-lg">This policy explains what Dhaga collects, why we use it and the controls available to customers and tailors.</p>
          <p className="mt-4 text-sm font-medium text-stone-500">Effective: 13 August 2026</p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl space-y-5 px-5 py-10 sm:py-14">
        <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold text-stone-950">About this policy</h2>
          <p className="mt-3 leading-7 text-stone-600">Dhaga operates the Dhaga tailoring marketplace available at <Link href="/" className="font-semibold text-amber-800 underline decoration-amber-300 underline-offset-4">joindhaga.com</Link> and through the Dhaga Android app. This policy applies to both experiences.</p>
        </section>

        {sections.map(({ title, icon: Icon, content }) => (
          <section key={title} className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-amber-100 text-amber-800"><Icon size={21} aria-hidden="true" /></span>
              <div>
                <h2 className="text-xl font-bold text-stone-950 sm:text-2xl">{title}</h2>
                <div className="mt-3 leading-7 text-stone-600">{content}</div>
              </div>
            </div>
          </section>
        ))}

        <section className="rounded-3xl bg-amber-800 p-6 text-amber-50 shadow-lg sm:p-8">
          <h2 className="text-2xl font-bold text-white">Questions or privacy requests</h2>
          <p className="mt-3 max-w-2xl leading-7 text-amber-100">Use the Dhaga contact page for privacy questions, or start a verified account-deletion request using the link below.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/account-deletion" className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-amber-900 transition hover:bg-amber-50">Delete an account</Link>
            <Link href="/contact" className="rounded-xl border border-amber-300/50 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10">Contact Dhaga</Link>
          </div>
        </section>
      </div>
      <LegalFooter />
    </main>
  );
}
