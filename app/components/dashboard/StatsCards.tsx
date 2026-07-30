import Link from "next/link";
import { CalendarDays, CircleCheckBig, Heart, PackageCheck } from "lucide-react";

type Props = {
  bookingCount: number;
  deliveredCount: number;
  activeCount: number;
  savedCount: number;
};

export default function StatsCards({ bookingCount, deliveredCount, activeCount, savedCount }: Props) {
  const stats = [
    { title: "Bookings", value: bookingCount, icon: CalendarDays, color: "bg-blue-100 text-blue-700", href: "#recent-bookings" },
    { title: "Delivered orders", value: deliveredCount, icon: PackageCheck, color: "bg-green-100 text-green-700", href: "#recent-bookings" },
    { title: "Active orders", value: activeCount, icon: CircleCheckBig, color: "bg-amber-100 text-amber-700", href: "#recent-bookings" },
    { title: "Saved tailors", value: savedCount, icon: Heart, color: "bg-pink-100 text-pink-700", href: "#saved-tailors" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Link key={stat.title} href={stat.href} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}><Icon size={24} /></span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
