import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, MapPin, Scissors } from "lucide-react";

type TailorCardProps = {
  tailor: {
    id: string;
    shopName: string;
    city: string;
    description: string | null;
    experience: number;
    isVerified: boolean;
    shopPhoto: string | null;
    services: Array<{ id: string; serviceName: string; price: number }>;
  };
};

export default function TailorCard({ tailor }: TailorCardProps) {
  const startingPrice = tailor.services.length
    ? Math.min(...tailor.services.map((service) => Number(service.price)))
    : null;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-amber-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-48 overflow-hidden bg-amber-50 sm:h-64">
        <Image
          src={tailor.shopPhoto || "/images/tailor1.png"}
          alt={`${tailor.shopName} shop`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          unoptimized={Boolean(tailor.shopPhoto?.startsWith("data:"))}
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        {tailor.isVerified && (
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-blue-700 shadow-sm">
            <BadgeCheck size={16} /> Verified
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-6">
        <h2 className="line-clamp-1 text-xl font-bold text-gray-950 sm:text-2xl">{tailor.shopName}</h2>
        <div className="mt-2 flex items-center gap-2 text-sm font-medium text-gray-600">
          <MapPin size={17} className="shrink-0 text-amber-700" />
          <span className="truncate">{tailor.city}</span>
          <span aria-hidden="true">•</span>
          <span className="whitespace-nowrap">{tailor.experience} yrs exp.</span>
        </div>

        <p className="mt-4 line-clamp-2 min-h-12 text-sm leading-6 text-gray-600">
          {tailor.description || "Professional tailoring and fitting services made for your style."}
        </p>

        <div className="mt-4 flex min-h-8 flex-wrap gap-2">
          {tailor.services.slice(0, 2).map((service) => (
            <span key={service.id} className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900">
              <Scissors size={13} /> {service.serviceName}
            </span>
          ))}
          {tailor.services.length > 2 && <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">+{tailor.services.length - 2} more</span>}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-gray-100 pt-4 sm:pt-5">
          <div className="min-w-0">
            <p className="text-xs text-gray-500">{startingPrice === null ? "Services" : "Services from"}</p>
            <p className="max-w-28 text-xs font-semibold leading-4 text-amber-800 sm:max-w-36 sm:text-sm sm:leading-5">
              {startingPrice === null
                ? "Services not listed yet"
                : `₹${startingPrice.toLocaleString("en-IN")}`}
            </p>
          </div>
          <Link href={`/tailors/${tailor.id}`} className="inline-flex min-h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-amber-700 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2 sm:min-h-11 sm:gap-2 sm:px-5 sm:py-2.5 sm:text-base">
            View profile <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}
