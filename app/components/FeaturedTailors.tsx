import { MapPin, Star, BadgeCheck } from "lucide-react";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import TailorCard from "./TailorCard";



export default async function FeaturedTailors() {

  const tailors = await prisma.tailorProfile.findMany({
  include: {
    user: true,
  },
  orderBy: {
    createdAt: "desc",
  },
});
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">
          <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
            Featured Tailors
          </span>

          <h2 className="mt-5 text-4xl font-bold">
            Meet Our Top Rated Tailors
          </h2>

          <p className="mt-4 text-gray-600">
            Skilled professionals trusted by hundreds of happy customers.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {tailors.map((tailor) => (
            <TailorCard
              key={tailor.id}
              tailor={tailor}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
