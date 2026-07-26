import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, BadgeCheck, Star } from "lucide-react";
import BookMeasurementButton from "./BookMeasurementButton";


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
  console.log(tailor);

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">

      <div className="grid gap-10 lg:grid-cols-2">

        <div className="relative h-[550px] overflow-hidden rounded-3xl">
          <Image
            src="/images/tailor1.png"
            alt={tailor.shopName}
            fill
            loading="eager"
            className="object-cover"
          />
        </div>

        <div>

          <div className="flex items-center gap-3">

            <h1 className="text-5xl font-bold text-gray-900">
              {tailor.shopName}
            </h1>

            {tailor.isVerified && (
              <BadgeCheck className="text-blue-500" size={30} />
            )}

          </div>

          <p className="mt-3 text-xl text-gray-600">
            by {tailor.user.name}
          </p>

          <div className="mt-8 flex items-center gap-2">
            <MapPin size={20} />
            <span>{tailor.city}</span>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Phone size={20} />
            <span>{tailor.phone}</span>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Star
              fill="#F59E0B"
              className="text-yellow-500"
            />
            <span>4.8 (New Tailor)</span>
          </div>

          <div className="mt-8 rounded-2xl bg-amber-50 p-6">

            <h3 className="text-xl font-semibold">
              Experience
            </h3>

            <p className="mt-2">
              {tailor.experience} Years
            </p>

          </div>

          <div className="mt-8">

            <h3 className="text-xl font-semibold">
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

        </div>

      </div>

    </main>
  );
}