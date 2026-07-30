import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/authOptions";
import { prisma } from "@/lib/prisma";
import TailorDashboardTabs from "@/app/tailor-dashboard/components/TailorDashboardTabs";

export const dynamic = "force-dynamic";

export default async function TailorDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const listing = await prisma.tailorProfile.findUnique({
    where: { userId: session.user.id },
    select: {
      shopName: true,
      phone: true,
      city: true,
      address: true,
      experience: true,
      description: true,
      shopPhoto: true,
      workPhotos: true,
      isVerified: true,
    },
  });

  if (!listing) {
    redirect("/become-tailor");
  }

  return (
    <main className="min-h-screen bg-[#f7f4ef]">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">

        <h1 className="font-semibold text-black text-4xl">
          Welcome Back 👋
        </h1>

        <p className="mt-2 text-gray-600">
          Manage your tailoring business and customer bookings.
        </p>

        <TailorDashboardTabs initialListing={listing} />

      </div>
    </main>
  );
}
