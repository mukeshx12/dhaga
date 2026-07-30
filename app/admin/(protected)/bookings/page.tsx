import Link from "next/link";
import { prisma } from "@/lib/prisma";
import BookingStatusSelect from "../../components/BookingStatusSelect";

type Props = { searchParams: Promise<{ search?: string; status?: string }> };
const statuses = ["PENDING", "ACCEPTED", "IN_PROGRESS", "QUOTATION_SENT", "CONFIRMED", "COMPLETED", "REJECTED", "CANCELLED"] as const;

export default async function AdminBookingsPage({ searchParams }: Props) {
  const query = await searchParams;
  const search = query.search?.trim();
  const status = statuses.find((item) => item === query.status);
  const bookings = await prisma.booking.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(search ? { OR: [
        { id: { contains: search, mode: "insensitive" } },
        { customer: { name: { contains: search, mode: "insensitive" } } },
        { customer: { email: { contains: search, mode: "insensitive" } } },
        { tailor: { shopName: { contains: search, mode: "insensitive" } } },
      ] } : {}),
    },
    include: { customer: { select: { name: true, email: true } }, tailor: { select: { shopName: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="mx-auto max-w-7xl">
      <h1 className="text-3xl font-bold text-gray-900">Booking management</h1>
      <p className="mt-2 text-gray-600">Search, inspect and update customer bookings.</p>
      <form className="mt-6 grid gap-3 rounded-2xl bg-white p-4 shadow-sm sm:grid-cols-[1fr_220px_auto]">
        <input name="search" defaultValue={search} placeholder="Customer, tailor or booking ID" className="rounded-xl border border-gray-300 p-3 text-gray-900" />
        <select name="status" defaultValue={status || ""} className="rounded-xl border border-gray-300 bg-white p-3 text-gray-900"><option value="">All statuses</option>{statuses.map((item) => <option key={item} value={item}>{item.replace("_", " ")}</option>)}</select>
        <button className="rounded-xl bg-gray-900 px-5 py-3 font-semibold text-white">Filter</button>
      </form>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="border-b bg-gray-50 text-gray-600"><tr><th className="px-5 py-4">Booking ID</th><th className="px-5 py-4">Customer</th><th className="px-5 py-4">Tailor</th><th className="px-5 py-4">Visit date</th><th className="px-5 py-4">Status</th><th className="px-5 py-4"></th></tr></thead>
          <tbody>{bookings.map((booking) => (
            <tr key={booking.id} className="border-b last:border-0 hover:bg-gray-50">
              <td className="px-5 py-4 font-mono text-xs text-gray-600">{booking.id}</td>
              <td className="px-5 py-4"><p className="font-medium text-gray-900">{booking.customer.name || "Customer"}</p><p className="text-xs text-gray-500">{booking.customer.email}</p></td>
              <td className="px-5 py-4 text-gray-700">{booking.tailor.shopName}</td><td className="px-5 py-4 text-gray-700">{booking.bookingDate.toLocaleDateString("en-IN")}</td>
              <td className="px-5 py-4"><BookingStatusSelect bookingId={booking.id} initialStatus={booking.status} /></td>
              <td className="px-5 py-4"><Link href={`/admin/bookings/${booking.id}`} className="font-semibold text-amber-700 hover:underline">Details</Link></td>
            </tr>
          ))}</tbody>
        </table>
        {bookings.length === 0 && <p className="p-10 text-center text-gray-500">No bookings match these filters.</p>}
      </div>
    </div>
  );
}
