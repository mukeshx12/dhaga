import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BookingStatusSelect from "../../../components/BookingStatusSelect";
import T from "@/app/components/LocalizedText";

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
      <Link href="/admin/bookings" className="text-sm font-semibold text-amber-700 hover:underline">← <T en="Back to bookings" hi="बुकिंग पर वापस जाएं" /></Link>
      <div className="mt-5 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="font-mono text-xs text-gray-500">{booking.id}</p><h1 className="mt-2 text-3xl font-bold text-gray-900"><T en="Booking details" hi="बुकिंग विवरण" /></h1><p className="mt-2 text-gray-600"><T en="Created" hi="बनाया गया" /> {booking.createdAt.toLocaleString("en-IN")}</p></div><BookingStatusSelect bookingId={booking.id} initialStatus={booking.status} /></div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <section className="rounded-xl bg-gray-50 p-5"><h2 className="font-bold text-gray-900"><T en="Customer" hi="ग्राहक" /></h2><p className="mt-3 text-gray-900">{booking.customer.name || <T en="Customer" hi="ग्राहक" />}</p><p className="text-sm text-gray-600">{booking.customer.email}</p><p className="text-sm text-gray-600">{booking.customer.phone || <T en="No phone" hi="फोन उपलब्ध नहीं" />}</p><p className="mt-2 text-sm text-gray-600">{booking.address}</p></section>
          <section className="rounded-xl bg-gray-50 p-5"><h2 className="font-bold text-gray-900"><T en="Tailor" hi="दर्जी" /></h2><Link href={`/admin/tailors/${booking.tailor.id}`} className="mt-3 block font-semibold text-amber-700 hover:underline">{booking.tailor.shopName}</Link><p className="text-sm text-gray-600">{booking.tailor.phone}</p><p className="text-sm text-gray-600">{booking.tailor.city}</p><p className="mt-2 text-sm text-gray-600">{booking.tailor.address}</p></section>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2"><section><h2 className="font-bold text-gray-900"><T en="Measurement visit" hi="माप की यात्रा" /></h2><p className="mt-2 text-gray-600">{booking.bookingDate.toLocaleString("en-IN")}</p><p className="mt-2 text-gray-600">{booking.notes || <T en="No customer notes." hi="ग्राहक के कोई नोट नहीं।" />}</p></section><section><h2 className="font-bold text-gray-900"><T en="Quotation" hi="मूल्य प्रस्ताव" /></h2><p className="mt-2 text-gray-600">{booking.quotationPrice ? `₹${Number(booking.quotationPrice).toFixed(2)}` : <T en="No quotation yet." hi="अभी कोई मूल्य प्रस्ताव नहीं।" />}</p><p className="mt-2 text-gray-600">{booking.quotationNotes}</p></section></div>
      </div>
    </div>
  );
}
