import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CustomerStatusButton from "../../../components/CustomerStatusButton";

export default async function CustomerDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await prisma.user.findFirst({ where: { id, role: "CUSTOMER", tailorProfile: null }, include: { bookings: { orderBy: { createdAt: "desc" }, include: { tailor: { select: { shopName: true } } } } } });
  if (!customer) notFound();
  return <div className="mx-auto max-w-5xl"><Link href="/admin/customers" className="text-sm font-semibold text-amber-700 hover:underline">← Back to customers</Link><section className="mt-5 rounded-2xl bg-white p-6 shadow-sm"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><h1 className="text-3xl font-bold text-gray-900">{customer.name || "Customer"}</h1><p className="mt-2 text-gray-600">{customer.email} · {customer.phone || "No phone"}</p><p className="mt-2 text-sm text-gray-500">{customer.address || "No saved address"}</p></div><CustomerStatusButton customerId={customer.id} status={customer.accountStatus} /></div></section><section className="mt-6 rounded-2xl bg-white p-6 shadow-sm"><h2 className="text-xl font-bold text-gray-900">Booking history</h2><div className="mt-4 space-y-3">{customer.bookings.map((booking) => <Link key={booking.id} href={`/admin/bookings/${booking.id}`} className="flex flex-col justify-between gap-2 rounded-xl border border-gray-200 p-4 hover:border-amber-300 sm:flex-row"><div><p className="font-semibold text-gray-900">{booking.tailor.shopName}</p><p className="text-xs text-gray-500">{booking.id}</p></div><div className="text-sm text-gray-600"><p>{booking.bookingDate.toLocaleDateString("en-IN")}</p><p>{booking.status}</p></div></Link>)}{customer.bookings.length === 0 && <p className="text-gray-500">No bookings.</p>}</div></section></div>;
}
