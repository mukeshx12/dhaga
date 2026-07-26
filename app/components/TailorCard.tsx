import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, MapPin, Star } from "lucide-react";

type TailorCardProps = {
  tailor: {
    id: string;
    shopName: string;
    city: string;
    description: string | null;
    experience: number;
    isVerified: boolean;
  };
};

export default function TailorCard({ tailor }: TailorCardProps) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-md transition hover:-translate-y-2 hover:shadow-xl">

      <div className="relative h-72">
        <Image
          src="/images/tailor1.png"
          alt={tailor.shopName}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="p-6">

        <div className="flex items-center justify-between">

          <h2 className="text-2xl font-bold text-gray-900">
            {tailor.shopName}
          </h2>

          {tailor.isVerified && (
            <BadgeCheck className="text-blue-500" size={22} />
          )}

        </div>

        <p className="mt-2 inline-block rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-700">
          {tailor.description || "Professional Tailor"}
        </p>

        <div className="mt-4 flex items-center gap-2">
          <MapPin size={18} />
          <span>{tailor.city}</span>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <Star fill="#F59E0B" className="text-yellow-500" size={18} />
          <span>4.8</span>
          <span className="text-gray-500">(New Tailor)</span>
        </div>

        <div className="mt-6 flex items-center justify-between">

          <span className="font-bold text-amber-700">
            {tailor.experience} Years Exp.
          </span>

          <Link
            href={`/tailors/${tailor.id}`}
            className="rounded-xl bg-amber-700 px-5 py-3 text-white hover:bg-amber-800"
          >
            View Profile
          </Link>

        </div>

      </div>

    </div>
  );
}