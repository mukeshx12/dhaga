export const dynamic = "force-dynamic";

import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatsCards from "../components/dashboard/StatsCards";
import TailorCard from "../components/dashboard/TailorCard";
import RecentOrders from "../components/dashboard/RecentOrders";
import BookingSuccessToast from "../components/dashboard/BookingSuccessToast";
import T from "../components/LocalizedText";

type DashboardProps = {
  searchParams: Promise<{ booking?: string; bookingId?: string }>;
};

export default async function DashboardPage({ searchParams }: DashboardProps) {
  const session = await getServerSession(authOptions);
  const query = await searchParams;

  if (!session?.user) {
    redirect("/login");
  }

  const tailorAccount = await prisma.tailorProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (tailorAccount) {
    redirect("/tailor-dashboard");
  }

  const [customer, bookings, allTailors, savedTailors] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true, address: true },
    }),
    prisma.booking.findMany({
      where: { customerId: session.user.id },
      select: { status: true },
    }),
    prisma.tailorProfile.findMany({
      orderBy: [{ isVerified: "desc" }, { createdAt: "desc" }],
      take: 30,
    }),
    prisma.savedTailor.findMany({
      where: { userId: session.user.id },
      include: {
        tailor: {
          select: { id: true, shopName: true, city: true, shopPhoto: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!customer) redirect("/login");

  const confirmedBooking = query.booking === "success" && query.bookingId
    ? await prisma.booking.findFirst({
        where: { id: query.bookingId, customerId: session.user.id },
        select: {
          tailor: { select: { shopName: true, phone: true } },
        },
      })
    : null;

  const location = customer.address?.toLowerCase().trim() ?? "";
  const locationWords = location.split(/[^a-z0-9]+/).filter((word) => word.length > 2);
  const tailors = allTailors
    .map((tailor) => {
      const place = `${tailor.city} ${tailor.address}`.toLowerCase();
      const locationScore = locationWords.reduce(
        (score, word) => score + (place.includes(word) ? 1 : 0),
        0
      );
      return { tailor, locationScore };
    })
    .sort((a, b) => b.locationScore - a.locationScore || Number(b.tailor.isVerified) - Number(a.tailor.isVerified))
    .slice(0, 6)
    .map(({ tailor }) => tailor);

  const deliveredCount = bookings.filter((booking) => booking.status === "COMPLETED").length;
  const activeStatuses = new Set(["PENDING", "ACCEPTED", "QUOTATION_SENT", "CONFIRMED"]);
  const activeCount = bookings.filter((booking) => activeStatuses.has(booking.status)).length;
  const customerName = customer.name?.trim() || "Customer";

  return (
    <main className="min-h-screen bg-[#f7f4ef]">
        <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
          <DashboardHeader name={customerName} email={customer.email} />

          {query.booking === "success" && (
            <BookingSuccessToast tailor={confirmedBooking?.tailor ?? null} />
          )}

          {/* Welcome section */}
          <section className="mt-6 overflow-hidden rounded-3xl bg-gradient-to-r from-amber-800 via-amber-700 to-orange-600 px-5 py-8 text-white shadow-lg sm:px-8 sm:py-10">
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-100">
                  <T en="Customer Dashboard" hi="ग्राहक डैशबोर्ड" />
                </p>

                <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
                  <T en="Welcome back" hi="फिर से स्वागत है" />, {session.user.name || "Customer"} 👋
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-amber-50 sm:text-base">
                  <T en="Discover trusted tailors, book tailoring services and manage all your bookings from one place." hi="भरोसेमंद दर्जी खोजें, सिलाई सेवाएं बुक करें और अपनी सभी बुकिंग एक ही स्थान पर संभालें।" />
                </p>
              </div>

              <div>
                <Link
                  href="/tailors"
                  className="rounded-xl bg-white px-6 py-3 text-center text-sm font-semibold text-amber-800 transition hover:bg-amber-50"
                >
                  <T en="Explore Tailors" hi="दर्जी खोजें" />
                </Link>
              </div>
            </div>
          </section>

          <div className="mt-8">
            <StatsCards
              bookingCount={bookings.length}
              deliveredCount={deliveredCount}
              activeCount={activeCount}
              savedCount={savedTailors.length}
            />
          </div>

          {/* Recent bookings */}
          <section id="recent-bookings" className="mt-10 scroll-mt-6 overflow-hidden rounded-3xl bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-5">
              <p className="text-sm font-semibold text-amber-700">
                <T en="Your activity" hi="आपकी गतिविधि" />
              </p>

              <h2 className="mt-1 text-2xl font-bold text-gray-900">
                <T en="Recent Bookings" hi="हाल की बुकिंग" />
              </h2>
            </div>

            <RecentOrders />
          </section>

          {/* Recommended tailors */}
          <section className="mt-12">
            <div className="mb-6">
              <div>
                <p className="text-sm font-semibold text-amber-700">
                  <T en="Near you" hi="आपके पास" />
                </p>

                <h2 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
                  <T en="Recommended Tailors" hi="सुझाए गए दर्जी" />
                </h2>

                <p className="mt-2 text-sm text-gray-600">
                  {customer.address
                    ? `Prioritized using your saved address: ${customer.address}`
                    : "Add your address in your profile to receive location-based recommendations."}
                </p>
              </div>
            </div>

            {tailors.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
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
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">
                  <T en="No tailors available" hi="कोई दर्जी उपलब्ध नहीं" />
                </h3>

                <p className="mt-2 text-sm text-gray-600">
                  <T en="Tailors will appear here once they are available." hi="उपलब्ध होने पर दर्जी यहां दिखाई देंगे।" />
                </p>
              </div>
            )}
          </section>

          <section id="saved-tailors" className="mt-12 scroll-mt-6">
            <p className="text-sm font-semibold text-amber-700"><T en="Your favourites" hi="आपके पसंदीदा" /></p>
            <h2 className="mt-1 text-2xl font-bold text-gray-900"><T en="Saved Tailors" hi="सहेजे गए दर्जी" /></h2>

            {savedTailors.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600">
                <T en="Save a tailor from their profile to find them here quickly." hi="किसी दर्जी को जल्दी खोजने के लिए उसकी प्रोफ़ाइल से सहेजें।" />
              </div>
            ) : (
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {savedTailors.map(({ tailor }) => (
                  <Link key={tailor.id} href={`/tailors/${tailor.id}`} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-amber-300 hover:shadow-md">
                    <p className="font-bold text-gray-900">{tailor.shopName}</p>
                    <p className="mt-1 text-sm text-gray-500">{tailor.city}</p>
                    <p className="mt-4 text-sm font-semibold text-amber-700"><T en="Open tailor profile →" hi="दर्जी प्रोफ़ाइल खोलें →" /></p>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
    </main>
  );
}
