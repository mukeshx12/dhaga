import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CustomerStatusButton from "../../components/CustomerStatusButton";
import T from "@/app/components/LocalizedText";

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
    <div className="mx-auto max-w-7xl"><h1 className="text-3xl font-bold text-gray-900"><T en="Customer management" hi="ग्राहक प्रबंधन" /></h1><p className="mt-2 text-gray-600"><T en="Search customers, review booking activity and control account access." hi="ग्राहक खोजें, बुकिंग गतिविधि देखें और खाते की पहुंच नियंत्रित करें।" /></p>
      <form className="mt-6 flex gap-3 rounded-2xl bg-white p-4 shadow-sm"><input name="search" defaultValue={search} placeholder="Name, email or phone" className="min-w-0 flex-1 rounded-xl border border-gray-300 p-3 text-gray-900" /><button className="rounded-xl bg-gray-900 px-5 font-semibold text-white"><T en="Search" hi="खोजें" /></button></form>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm"><table className="w-full min-w-[780px] text-left text-sm"><thead className="border-b bg-gray-50 text-gray-600"><tr><th className="px-5 py-4"><T en="Customer" hi="ग्राहक" /></th><th className="px-5 py-4"><T en="Phone" hi="फोन" /></th><th className="px-5 py-4"><T en="Bookings" hi="बुकिंग" /></th><th className="px-5 py-4"><T en="Status" hi="स्थिति" /></th><th className="px-5 py-4"><T en="Actions" hi="कार्रवाई" /></th></tr></thead><tbody>{customers.map((customer) => <tr key={customer.id} className="border-b last:border-0"><td className="px-5 py-4"><p className="font-semibold text-gray-900">{customer.name || "Customer"}</p><p className="text-xs text-gray-500">{customer.email}</p></td><td className="px-5 py-4 text-gray-600">{customer.phone || "—"}</td><td className="px-5 py-4">{customer._count.bookings}</td><td className="px-5 py-4">{customer.accountStatus}</td><td className="px-5 py-4"><div className="flex items-center gap-3"><Link href={`/admin/customers/${customer.id}`} className="font-semibold text-amber-700 hover:underline"><T en="History" hi="इतिहास" /></Link><CustomerStatusButton customerId={customer.id} status={customer.accountStatus} /></div></td></tr>)}</tbody></table>{customers.length === 0 && <p className="p-10 text-center text-gray-500"><T en="No customers found." hi="कोई ग्राहक नहीं मिला।" /></p>}</div>
    </div>
  );
}
