"use client";

import Link from "next/link";
import { MapPin, Star, Scissors, BadgeCheck } from "lucide-react";

interface TailorCardProps {
  id: string;
  shopName: string;
  city: string;
  experience: number;
  description: string | null;
  isVerified: boolean;
}

export default function TailorCard({
  id,
  shopName,
  city,
  experience,
  description,
  isVerified,
}: TailorCardProps) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-md transition hover:shadow-xl">

      {/* Tailor Icon */}
      <div className="flex justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
          <Scissors size={34} className="text-amber-700" />
        </div>
      </div>

      {/* Shop Name */}
      <div className="mt-5 flex items-center justify-center gap-2">
        <h3 className="text-center text-xl font-bold text-gray-900">
          {shopName}
        </h3>

        {isVerified && (
          <BadgeCheck
            size={20}
            className="text-blue-500"
          />
        )}
      </div>

      {/* City */}
      <div className="mt-2 flex items-center justify-center gap-2 text-gray-500">
        <MapPin size={16} />
        <span>{city}</span>
      </div>

      {/* Rating (Placeholder for now) */}
      <div className="mt-5 flex items-center justify-center gap-2">
        <Star
          size={18}
          className="fill-yellow-400 text-yellow-400"
        />

        <span className="font-semibold text-gray-900">
          4.8
        </span>

        <span className="text-sm text-gray-500">
          New Tailor
        </span>
      </div>

      <hr className="my-5" />

      {/* Experience */}
      <div className="flex items-center justify-between">
        <span className="text-gray-500">
          Experience
        </span>

        <span className="font-semibold text-gray-900">
          {experience} Years
        </span>
      </div>

      {/* About */}
      <div className="mt-4">
        <span className="text-gray-500">
          About
        </span>

        <p className="mt-2 line-clamp-2 text-sm text-gray-700">
          {description || "No description available."}
        </p>
      </div>

      <Link href={`/tailors/${id}`}>
        <button className="mt-8 w-full rounded-xl bg-amber-700 py-3 font-semibold text-white transition hover:bg-amber-800">
          View Profile →
        </button>
      </Link>
    </div>
  );
}