import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CustomerStatusButton from "../../components/CustomerStatusButton";

export default async function CustomersPage({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  const { search: rawSearch } = await searchParams;
  const search = rawSearch?.trim();
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER", tailorProfile: null, ...(search ? { OR: [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
    ] } : {}) },
    include: { _count: { select: { bookings: true } } },
    orderBy: { createdAt: "desc" },
  });
  return (
    <div className="mx-auto max-w-7xl"><h1 className="text-3xl font-bold text-gray-900">Customer management</h1><p className="mt-2 text-gray-600">Search customers, review booking activity and control account access.</p>
      <form className="mt-6 flex gap-3 rounded-2xl bg-white p-4 shadow-sm"><input name="search" defaultValue={search} placeholder="Name, email or phone" className="min-w-0 flex-1 rounded-xl border border-gray-300 p-3 text-gray-900" /><button className="rounded-xl bg-gray-900 px-5 font-semibold text-white">Search</button></form>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm"><table className="w-full min-w-[780px] text-left text-sm"><thead className="border-b bg-gray-50 text-gray-600"><tr><th className="px-5 py-4">Customer</th><th className="px-5 py-4">Phone</th><th className="px-5 py-4">Bookings</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Actions</th></tr></thead><tbody>{customers.map((customer) => <tr key={customer.id} className="border-b last:border-0"><td className="px-5 py-4"><p className="font-semibold text-gray-900">{customer.name || "Customer"}</p><p className="text-xs text-gray-500">{customer.email}</p></td><td className="px-5 py-4 text-gray-600">{customer.phone || "—"}</td><td className="px-5 py-4">{customer._count.bookings}</td><td className="px-5 py-4">{customer.accountStatus}</td><td className="px-5 py-4"><div className="flex items-center gap-3"><Link href={`/admin/customers/${customer.id}`} className="font-semibold text-amber-700 hover:underline">History</Link><CustomerStatusButton customerId={customer.id} status={customer.accountStatus} /></div></td></tr>)}</tbody></table>{customers.length === 0 && <p className="p-10 text-center text-gray-500">No customers found.</p>}</div>
    </div>
  );
}
