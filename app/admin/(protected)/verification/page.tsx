import Link from "next/link";
import { prisma } from "@/lib/prisma";
import TailorActions from "../../components/TailorActions";

export const dynamic = "force-dynamic";

export default async function VerificationPage() {
  const tailors = await prisma.tailorProfile.findMany({
    where: { status: "PENDING" },
    include: { user: { select: { name: true, email: true, createdAt: true } }, services: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="mx-auto max-w-7xl">
      <p className="text-sm font-semibold uppercase tracking-wider text-amber-700">Tailor verification</p>
      <h1 className="mt-1 text-3xl font-bold text-gray-900">Pending applications</h1>
      <p className="mt-2 text-gray-600">Review business details before approving a public listing.</p>

      <div className="mt-8 grid gap-5">
        {tailors.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-600">No pending tailor applications.</div>
        ) : tailors.map((tailor) => (
          <article key={tailor.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{tailor.shopName}</h2>
                <p className="mt-1 text-sm text-gray-600">{tailor.user.name || "Tailor"} · {tailor.user.email}</p>
                <p className="mt-2 text-sm text-gray-500">{tailor.city} · {tailor.experience} years · {tailor.services.length} services</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href={`/admin/tailors/${tailor.id}`} className="rounded-lg border border-amber-300 px-4 py-2 text-center text-sm font-semibold text-amber-800 hover:bg-amber-50">View full details</Link>
                <TailorActions tailorId={tailor.id} status={tailor.status} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
