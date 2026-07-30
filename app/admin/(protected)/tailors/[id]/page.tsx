import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import TailorActions from "../../../components/TailorActions";

type Props = { params: Promise<{ id: string }> };

export default async function AdminTailorDetailsPage({ params }: Props) {
  const { id } = await params;
  const tailor = await prisma.tailorProfile.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true, phone: true, createdAt: true } },
      services: { orderBy: { createdAt: "asc" } },
      bookings: { take: 20, orderBy: { createdAt: "desc" }, include: { customer: { select: { name: true, email: true } } } },
    },
  });
  if (!tailor) notFound();

  return (
    <div className="mx-auto max-w-6xl">
      <Link href="/admin/tailors" className="text-sm font-semibold text-amber-700 hover:underline">← Back to tailors</Link>
      <div className="mt-5 flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-sm lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-5 sm:flex-row">
          <div className="relative h-36 w-full overflow-hidden rounded-2xl bg-gray-100 sm:w-48">
            <Image src={tailor.shopPhoto || "/images/tailor1.png"} alt={tailor.shopName} fill sizes="192px" unoptimized={Boolean(tailor.shopPhoto)} className="object-cover" />
          </div>
          <div><p className="text-sm font-semibold text-amber-700">{tailor.status}</p><h1 className="mt-1 text-3xl font-bold text-gray-900">{tailor.shopName}</h1><p className="mt-2 text-gray-600">{tailor.user.name} · {tailor.user.email}</p><p className="mt-2 text-sm text-gray-500">{tailor.phone} · {tailor.city} · {tailor.experience} years</p><p className="mt-1 text-sm text-gray-500">{tailor.address}</p></div>
        </div>
        <TailorActions tailorId={tailor.id} status={tailor.status} allowRemove />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl bg-white p-6 shadow-sm"><h2 className="text-xl font-bold text-gray-900">Profile details</h2><p className="mt-4 text-gray-600">{tailor.description || "No description supplied."}</p><h3 className="mt-6 font-semibold text-gray-900">Services</h3><div className="mt-3 space-y-2">{tailor.services.map((service) => <div key={service.id} className="flex justify-between rounded-lg bg-gray-50 p-3 text-sm"><span>{service.serviceName}</span><span className="font-semibold">₹{Number(service.price).toFixed(2)}</span></div>)}{tailor.services.length === 0 && <p className="text-sm text-gray-500">No services added.</p>}</div></section>
        <section className="rounded-2xl bg-white p-6 shadow-sm"><h2 className="text-xl font-bold text-gray-900">Recent bookings</h2><div className="mt-4 space-y-3">{tailor.bookings.map((booking) => <div key={booking.id} className="rounded-xl border border-gray-200 p-4 text-sm"><p className="font-semibold text-gray-900">{booking.customer.name || "Customer"}</p><p className="text-gray-500">{booking.customer.email}</p><div className="mt-2 flex justify-between text-xs text-gray-600"><span>{booking.bookingDate.toLocaleDateString("en-IN")}</span><span>{booking.status}</span></div></div>)}{tailor.bookings.length === 0 && <p className="text-sm text-gray-500">No bookings for this tailor.</p>}</div></section>
      </div>
    </div>
  );
}
