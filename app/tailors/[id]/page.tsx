import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { MapPin, Phone, BadgeCheck, Star } from "lucide-react";
import BookMeasurementButton from "./BookMeasurementButton";
import SaveTailorButton from "./SaveTailorButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";


type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TailorProfilePage({ params }: Props) {
  
  
  const { id } = await params;

console.log("Tailor ID:", id);
  const tailor = await prisma.tailorProfile.findUnique({
    
    where: {
      id,
    },
    include: {
    user: true,
    services: {
    orderBy: {
    createdAt: "asc",
    },
  },
},
  });

  if (!tailor) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  const currentUserTailor = session?.user?.id
    ? await prisma.tailorProfile.findUnique({
        where: { userId: session.user.id },
        select: { id: true },
      })
    : null;
  const savedTailor = session?.user?.id && !currentUserTailor
    ? await prisma.savedTailor.findUnique({
        where: {
          userId_tailorId: { userId: session.user.id, tailorId: tailor.id },
        },
        select: { id: true },
      })
    : null;

  return (
    <main className="min-h-screen bg-[#FAF7F2] px-5 py-10 text-gray-900 sm:px-6 sm:py-12">

      <div className="mx-auto grid max-w-6xl gap-10 rounded-[2rem] bg-white p-5 shadow-sm sm:p-8 lg:grid-cols-2">

        <div className="relative h-[550px] overflow-hidden rounded-3xl">
          <Image
            src={tailor.shopPhoto || "/images/tailor1.png"}
            alt={tailor.shopName}
            fill
            unoptimized={Boolean(tailor.shopPhoto)}
            loading="eager"
            className="object-cover"
          />
        </div>

        <div className="py-2 text-gray-900">

          <div className="flex items-center gap-3">

            <h1 className="text-5xl font-bold text-gray-900">
              {tailor.shopName}
            </h1>

            {tailor.isVerified && (
              <BadgeCheck className="text-blue-500" size={30} />
            )}

          </div>

          <div className="mt-5 flex items-center gap-2 text-gray-700">
            <MapPin size={20} />
            <span>{tailor.city}</span>
          </div>

          <div className="mt-4 flex items-center gap-2 text-gray-700">
            <Phone size={20} />
            <span>{tailor.phone}</span>
          </div>

          <div className="mt-4 flex items-center gap-2 text-gray-700">
            <Star
              fill="#F59E0B"
              className="text-yellow-500"
            />
            <span>4.8 (New Tailor)</span>
          </div>

          <div className="mt-8 rounded-2xl border border-amber-100 bg-amber-50 p-6 text-gray-900">

            <h3 className="text-xl font-semibold text-gray-900">
              Experience
            </h3>

            <p className="mt-2 text-gray-700">
              {tailor.experience} Years
            </p>

          </div>

          <div className="mt-8">

            <h3 className="text-xl font-semibold text-gray-900">
              About
            </h3>

            <p className="mt-3 text-gray-600">
              {tailor.description}
            </p>

          </div>

          <div className="mt-10">
  <h2 className="text-2xl font-bold text-gray-900">
    Services & Pricing
  </h2>

  {tailor.services.length === 0 ? (
    <p className="mt-4 text-gray-500">
      No services added yet.
    </p>
  ) : (
    <div className="mt-6 space-y-4">
      {tailor.services.map((service) => (
        <div
          key={service.id}
          className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4"
        >
          <span className="font-medium text-gray-900">
            {service.serviceName}
          </span>

          <span className="font-semibold text-amber-700">
           ₹{Number(service.price).toFixed(2)}
          </span>
        </div>
      ))}
    </div>
  )}
</div>

          <BookMeasurementButton tailorId={tailor.id} />
          {session?.user?.id && !currentUserTailor && (
            <div className="ml-3 inline-block">
              <SaveTailorButton tailorId={tailor.id} initiallySaved={Boolean(savedTailor)} />
            </div>
          )}

        </div>

      </div>

      {tailor.workPhotos.length > 0 && (
        <section className="mx-auto mt-16 max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-700">
            Portfolio
          </p>
          <h2 className="mt-1 text-3xl font-bold text-gray-900">
            Work and designs
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tailor.workPhotos.map((photo, index) => (
              <div key={`${photo.slice(-24)}-${index}`} className="relative h-72 overflow-hidden rounded-3xl bg-gray-100 shadow-sm">
                <Image
                  src={photo}
                  alt={`${tailor.shopName} work example ${index + 1}`}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}

    </main>
  );
}
