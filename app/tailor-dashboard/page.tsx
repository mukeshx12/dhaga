import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/authOptions";
import { prisma } from "@/lib/prisma";
import TailorDashboardTabs from "@/app/tailor-dashboard/components/TailorDashboardTabs";
import T from "@/app/components/LocalizedText";

export const dynamic = "force-dynamic";

type TailorDashboardPageProps = {
  searchParams: Promise<{ section?: string }>;
};

export default async function TailorDashboardPage({ searchParams }: TailorDashboardPageProps) {
  const session = await getServerSession(authOptions);
  const query = await searchParams;

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
          <T en="Welcome Back" hi="फिर से स्वागत है" /> 👋
        </h1>

        <p className="mt-2 text-gray-600">
          <T en="Manage your tailoring business and customer bookings." hi="अपने सिलाई व्यवसाय और ग्राहक बुकिंग को संभालें।" />
        </p>

        <TailorDashboardTabs
          initialListing={listing}
          initialSection={query.section === "profile" || query.section === "services" ? query.section : "requests"}
        />

      </div>
    </main>
  );
}
