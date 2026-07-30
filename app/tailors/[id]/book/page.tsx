import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/authOptions";
import BookingForm from "./BookingForm";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarCheck, MapPin, ShieldCheck } from "lucide-react";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function BookMeasurementPage({ params }: Props) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const currentTailor = await prisma.tailorProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (currentTailor) {
    redirect("/tailor-dashboard");
  }

  const { id } = await params;
  const tailor = await prisma.tailorProfile.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
      services: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!tailor) {
    notFound();
  }
  return (
    <main className="min-h-screen bg-[#FAF7F2] px-5 py-10 text-gray-900 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Link
          href={`/tailors/${tailor.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-amber-800 hover:underline"
        >
          <ArrowLeft size={18} />
          Back to tailor profile
        </Link>

        <div className="mt-6 grid overflow-hidden rounded-3xl bg-white shadow-xl lg:grid-cols-[0.85fr_1.15fr]">
          <aside className="bg-amber-900 p-6 text-white sm:p-8">
            <div className="relative h-64 overflow-hidden rounded-2xl">
              <Image
                src={tailor.shopPhoto || "/images/tailor1.png"}
                alt={tailor.shopName}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                unoptimized={Boolean(tailor.shopPhoto)}
                className="object-cover"
              />
            </div>

            <h2 className="mt-6 text-2xl font-bold">{tailor.shopName}</h2>
            <p className="mt-2 flex items-center gap-2 text-amber-100">
              <MapPin size={18} /> {tailor.city}
            </p>

            <div className="mt-7 space-y-3 text-sm text-amber-50">
              <p className="flex items-center gap-3"><ShieldCheck size={20} /> Secure customer request</p>
              <p className="flex items-center gap-3"><CalendarCheck size={20} /> Choose your preferred visit date</p>
            </div>

            {tailor.services.length > 0 && (
              <div className="mt-8 border-t border-white/20 pt-6">
                <h3 className="font-semibold">Services offered</h3>
                <div className="mt-3 space-y-2">
                  {tailor.services.slice(0, 4).map((service) => (
                    <div key={service.id} className="flex justify-between gap-4 text-sm text-amber-50">
                      <span>{service.serviceName}</span>
                      <span>from ₹{Number(service.price).toFixed(0)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>

          <section className="p-6 sm:p-10">

        <h1 className="text-4xl font-bold text-gray-900">
          Request home measurement
        </h1>

        <p className="mt-3 text-gray-600">
          Select a preferred date and tell {tailor.shopName} where to visit.
        </p>
        <BookingForm tailorId={tailor.id} tailorName={tailor.shopName} />

          </section>
        </div>
      </div>
    </main>
  );
}
