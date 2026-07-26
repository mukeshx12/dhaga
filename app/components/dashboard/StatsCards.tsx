"use client";

import {
  Package,
  CalendarDays,
  Heart,
  Star,
} from "lucide-react";

const stats = [
  {
    title: "Orders",
    value: "12",
    icon: Package,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Bookings",
    value: "4",
    icon: CalendarDays,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Saved Tailors",
    value: "8",
    icon: Heart,
    color: "bg-pink-100 text-pink-600",
  },
  {
    title: "Reviews",
    value: "6",
    icon: Star,
    color: "bg-yellow-100 text-yellow-600",
  },
];

export default function StatsCards() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">
                  {stat.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold text-gray-900">
                  {stat.value}
                </h2>
              </div>

              <div
                className={`flex h-14 w-14 items-center justify-center rounded-xl ${stat.color}`}
              >
                <Icon size={28} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}