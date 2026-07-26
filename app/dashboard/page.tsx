import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatsCards from "../components/dashboard/StatsCards";
import TailorCard from "../components/dashboard/TailorCard";
import RecentOrders from "../components/dashboard/RecentOrders";
import { prisma } from "@/lib/prisma";



export default async function DashboardPage() {
  const tailors = await prisma.tailorProfile.findMany({
  where: {
    isVerified: true,
  },
  take: 6,
  orderBy: {
    createdAt: "desc",
  },
});
  return (
    <main className="flex min-h-screen bg-gray-100">
      <DashboardSidebar />

      <section className="flex-1 p-8">
        <DashboardHeader />

        <StatsCards />

        <div className="mt-10">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Recommended Tailors
          </h2>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {tailors.map((tailor) => (
  <TailorCard
    key={tailor.id}
    id={tailor.id}
    shopName={tailor.shopName}
    city={tailor.city}
    experience={tailor.experience}
    description={tailor.description}
    isVerified={tailor.isVerified}
  />
))}
          </div>
        </div>

        <RecentOrders />
      </section>
    </main>
  );
}