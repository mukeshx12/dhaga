import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BookingStatusSelect from "../../../components/BookingStatusSelect";

export default async function BookingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      customer: { select: { id: true, name: true, email: true, phone: true, address: true } },
      tailor: { select: { id: true, shopName: true, phone: true, city: true, address: true } },
    },
  });
  if (!booking) notFound();

  return (
    <div className="mx-auto max-w-5xl">
      <Link href="/admin/bookings" className="text-sm font-semibold text-amber-700 hover:underline">← Back to bookings</Link>
      <div className="mt-5 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="font-mono text-xs text-gray-500">{booking.id}</p><h1 className="mt-2 text-3xl font-bold text-gray-900">Booking details</h1><p className="mt-2 text-gray-600">Created {booking.createdAt.toLocaleString("en-IN")}</p></div><BookingStatusSelect bookingId={booking.id} initialStatus={booking.status} /></div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <section className="rounded-xl bg-gray-50 p-5"><h2 className="font-bold text-gray-900">Customer</h2><p className="mt-3 text-gray-900">{booking.customer.name || "Customer"}</p><p className="text-sm text-gray-600">{booking.customer.email}</p><p className="text-sm text-gray-600">{booking.customer.phone || "No phone"}</p><p className="mt-2 text-sm text-gray-600">{booking.address}</p></section>
          <section className="rounded-xl bg-gray-50 p-5"><h2 className="font-bold text-gray-900">Tailor</h2><Link href={`/admin/tailors/${booking.tailor.id}`} className="mt-3 block font-semibold text-amber-700 hover:underline">{booking.tailor.shopName}</Link><p className="text-sm text-gray-600">{booking.tailor.phone}</p><p className="text-sm text-gray-600">{booking.tailor.city}</p><p className="mt-2 text-sm text-gray-600">{booking.tailor.address}</p></section>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2"><section><h2 className="font-bold text-gray-900">Measurement visit</h2><p className="mt-2 text-gray-600">{booking.bookingDate.toLocaleString("en-IN")}</p><p className="mt-2 text-gray-600">{booking.notes || "No customer notes."}</p></section><section><h2 className="font-bold text-gray-900">Quotation</h2><p className="mt-2 text-gray-600">{booking.quotationPrice ? `₹${Number(booking.quotationPrice).toFixed(2)}` : "No quotation yet."}</p><p className="mt-2 text-gray-600">{booking.quotationNotes}</p></section></div>
      </div>
    </div>
  );
}
