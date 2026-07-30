import Link from "next/link";
import { CalendarDays, CheckCircle2, Clock3, Scissors, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [customers, tailors, verified, pending, bookings, recentBookings] = await Promise.all([
    prisma.user.count({ where: { role: "CUSTOMER", tailorProfile: null } }),
    prisma.tailorProfile.count(),
    prisma.tailorProfile.count({ where: { isVerified: true, status: "VERIFIED" } }),
    prisma.tailorProfile.count({ where: { status: "PENDING" } }),
    prisma.booking.count(),
    prisma.booking.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        customer: { select: { name: true, email: true } },
        tailor: { select: { shopName: true } },
      },
    }),
  ]);

  const stats = [
    { label: "Total customers", value: customers, icon: Users, color: "bg-blue-100 text-blue-700", href: "/admin/customers" },
    { label: "Total tailors", value: tailors, icon: Scissors, color: "bg-purple-100 text-purple-700", href: "/admin/tailors" },
    { label: "Verified tailors", value: verified, icon: CheckCircle2, color: "bg-green-100 text-green-700", href: "/admin/tailors?status=VERIFIED" },
    { label: "Pending approvals", value: pending, icon: Clock3, color: "bg-amber-100 text-amber-700", href: "/admin/verification" },
    { label: "Total bookings", value: bookings, icon: CalendarDays, color: "bg-rose-100 text-rose-700", href: "/admin/bookings" },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-amber-700">Overview</p>
        <h1 className="mt-1 text-3xl font-bold text-gray-900">Admin dashboard</h1>
        <p className="mt-2 text-gray-600">Monitor Dhaga customers, tailors, approvals and bookings.</p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}><Icon size={22} /></span>
              <p className="mt-5 text-sm text-gray-500">{stat.label}</p>
              <p className="mt-1 text-3xl font-bold text-gray-900">{stat.value}</p>
            </Link>
          );
        })}
      </div>

      <section className="mt-10 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div><p className="text-sm font-semibold text-amber-700">Latest activity</p><h2 className="mt-1 text-xl font-bold text-gray-900">Recent bookings</h2></div>
          <Link href="/admin/bookings" className="text-sm font-semibold text-amber-700 hover:underline">Manage bookings</Link>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b bg-gray-50 text-gray-600"><tr><th className="px-4 py-3">Booking</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Tailor</th><th className="px-4 py-3">Visit date</th><th className="px-4 py-3">Status</th></tr></thead>
            <tbody>
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="border-b last:border-0">
                  <td className="px-4 py-4 font-mono text-xs text-gray-600">{booking.id}</td>
                  <td className="px-4 py-4"><p className="font-medium text-gray-900">{booking.customer.name || "Customer"}</p><p className="text-xs text-gray-500">{booking.customer.email}</p></td>
                  <td className="px-4 py-4 text-gray-700">{booking.tailor.shopName}</td>
                  <td className="px-4 py-4 text-gray-700">{booking.bookingDate.toLocaleDateString("en-IN")}</td>
                  <td className="px-4 py-4"><span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">{booking.status.replace("_", " ")}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
