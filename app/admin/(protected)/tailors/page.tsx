import Link from "next/link";
import { prisma } from "@/lib/prisma";

type Props = { searchParams: Promise<{ status?: string; search?: string }> };

export default async function AdminTailorsPage({ searchParams }: Props) {
  const query = await searchParams;
  const allowed = ["PENDING", "VERIFIED", "REJECTED", "SUSPENDED"];
  const status = allowed.includes(query.status || "") ? query.status as "PENDING" | "VERIFIED" | "REJECTED" | "SUSPENDED" : undefined;
  const search = query.search?.trim();
  const tailors = await prisma.tailorProfile.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(search ? { OR: [
        { shopName: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
      ] } : {}),
    },
    include: { user: { select: { name: true, email: true } }, _count: { select: { bookings: true, services: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl">
      <h1 className="text-3xl font-bold text-gray-900">Tailor management</h1>
      <p className="mt-2 text-gray-600">Review, verify, suspend or remove tailor listings.</p>
      <form className="mt-6 grid gap-3 rounded-2xl bg-white p-4 shadow-sm sm:grid-cols-[1fr_220px_auto]">
        <input name="search" defaultValue={search} placeholder="Search shop, tailor, email or city" className="rounded-xl border border-gray-300 p-3 text-gray-900" />
        <select name="status" defaultValue={status || ""} className="rounded-xl border border-gray-300 bg-white p-3 text-gray-900">
          <option value="">All statuses</option><option value="VERIFIED">Verified</option><option value="PENDING">Pending</option><option value="REJECTED">Rejected</option><option value="SUSPENDED">Suspended</option>
        </select>
        <button className="rounded-xl bg-gray-900 px-5 py-3 font-semibold text-white">Filter</button>
      </form>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="border-b bg-gray-50 text-gray-600"><tr><th className="px-5 py-4">Shop</th><th className="px-5 py-4">Owner</th><th className="px-5 py-4">Location</th><th className="px-5 py-4">Services</th><th className="px-5 py-4">Bookings</th><th className="px-5 py-4">Status</th><th className="px-5 py-4"></th></tr></thead>
          <tbody>{tailors.map((tailor) => (
            <tr key={tailor.id} className="border-b last:border-0 hover:bg-gray-50">
              <td className="px-5 py-4 font-semibold text-gray-900">{tailor.shopName}</td>
              <td className="px-5 py-4"><p className="text-gray-900">{tailor.user.name}</p><p className="text-xs text-gray-500">{tailor.user.email}</p></td>
              <td className="px-5 py-4 text-gray-700">{tailor.city}</td><td className="px-5 py-4">{tailor._count.services}</td><td className="px-5 py-4">{tailor._count.bookings}</td>
              <td className="px-5 py-4"><span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">{tailor.status}</span></td>
              <td className="px-5 py-4"><Link href={`/admin/tailors/${tailor.id}`} className="font-semibold text-amber-700 hover:underline">Details</Link></td>
            </tr>
          ))}</tbody>
        </table>
        {tailors.length === 0 && <p className="p-10 text-center text-gray-500">No tailors match these filters.</p>}
      </div>
    </div>
  );
}
