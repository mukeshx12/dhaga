import { ArrowLeft, LockKeyhole, ShieldCheck } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

import Navbar from "@/app/components/Navbar";
import { authOptions } from "@/lib/auth/authOptions";
import { prisma } from "@/lib/prisma";
import DeleteAccountForm from "./DeleteAccountForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Delete Account | Dhaga",
  description: "Permanently delete your Dhaga account and associated data.",
};

export default async function DeleteAccountPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/account/delete");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true, phone: true, password: true, role: true },
  });

  if (!user) redirect("/login");

  return (
    <main className="min-h-screen bg-[#FAF7F2] pt-20">
      <Navbar />
      <div className="mx-auto max-w-2xl px-5 py-12 sm:py-16">
        <Link href="/profile" className="inline-flex items-center gap-2 text-sm font-semibold text-amber-800 hover:text-amber-950">
          <ArrowLeft size={17} /> Back to profile
        </Link>

        <section className="mt-5 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-[0_20px_60px_rgba(120,53,15,.09)]">
          <div className="border-b border-stone-200 bg-gradient-to-br from-amber-50 to-orange-50 px-6 py-7 sm:px-9">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[.14em] text-amber-800 shadow-sm">
              <ShieldCheck size={15} /> Account privacy
            </span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-stone-950 sm:text-4xl">Delete your account</h1>
            <p className="mt-3 max-w-xl leading-7 text-stone-600">
              You are signed in as <strong className="text-stone-800">{user.email ?? user.phone ?? "a Dhaga user"}</strong>.
              Review the consequences before continuing.
            </p>
          </div>

          <div className="px-6 py-7 sm:px-9 sm:py-9">
            {user.role === "ADMIN" ? (
              <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950">
                <LockKeyhole className="mt-0.5 shrink-0" size={21} />
                <p className="leading-6">Administrator accounts cannot be deleted from this page. Use an authorised administrative process.</p>
              </div>
            ) : (
              <DeleteAccountForm hasPassword={Boolean(user.password)} />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
