import { Users, Scissors, MapPin, CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import T from "./LocalizedText";
import StatsAnimator from "./StatsAnimator";

export default async function Stats() {
  const [customers, verifiedTailors, completedOrders, cities] = await Promise.all([
    prisma.user.count({ where: { role: "CUSTOMER", tailorProfile: null, accountStatus: "ACTIVE" } }),
    prisma.tailorProfile.count({ where: { status: "VERIFIED", isVerified: true, user: { accountStatus: "ACTIVE" } } }),
    prisma.booking.count({ where: { status: "COMPLETED" } }),
    prisma.tailorProfile.findMany({
      where: { status: "VERIFIED", isVerified: true, user: { accountStatus: "ACTIVE" } },
      distinct: ["city"],
      select: { city: true },
    }),
  ]);
  const stats = [
    { icon: Users, value: customers, label: "Active Customers", labelHi: "सक्रिय ग्राहक" },
    { icon: Scissors, value: verifiedTailors, label: "Verified Tailors", labelHi: "सत्यापित दर्जी" },
    { icon: MapPin, value: cities.length, label: "Cities Served", labelHi: "सेवा वाले शहर" },
    { icon: CheckCircle2, value: completedOrders, label: "Completed Bookings", labelHi: "पूरी हुई बुकिंग" },
  ];

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-amber-900 via-amber-700 to-orange-600 py-14 sm:py-18 lg:py-22">
      <div className="stats-float-slow pointer-events-none absolute -right-24 -top-32 h-72 w-72 rounded-full bg-orange-300/25 blur-3xl" aria-hidden="true" />
      <div className="stats-float-reverse pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-amber-950/30 blur-3xl" aria-hidden="true" />
      <div className="stats-float-slow pointer-events-none absolute left-[42%] top-8 h-32 w-32 rounded-full bg-yellow-200/10 blur-2xl" aria-hidden="true" />

      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-20" viewBox="0 0 1440 560" preserveAspectRatio="none" aria-hidden="true">
        <path className="stats-thread-line" d="M-30 112 C220 20 330 215 570 125 S920 20 1110 125 1390 210 1490 80" fill="none" stroke="rgba(255,255,255,.75)" strokeWidth="2" strokeDasharray="8 13" />
        <path className="stats-thread-line stats-thread-line-delayed" d="M-60 455 C180 340 370 535 610 430 S980 345 1170 455 1400 495 1500 400" fill="none" stroke="rgba(253,230,138,.7)" strokeWidth="2" strokeDasharray="6 15" />
      </svg>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <StatsAnimator>
        <div className="stats-heading mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-bold text-amber-50 shadow-sm backdrop-blur-sm sm:text-sm">
            <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-70" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-300 ring-2 ring-emerald-100/30" />
            </span>
            <T en="Live platform statistics" hi="लाइव प्लेटफ़ॉर्म आंकड़े" />
          </div>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            <T en="Dhaga at a glance" hi="एक नज़र में Dhaga" />
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-amber-100 sm:text-base sm:leading-7">
            <T
              en="A live view of the customers, professionals and bookings growing across the Dhaga community."
              hi="Dhaga समुदाय में बढ़ते ग्राहकों, पेशेवरों और बुकिंग का लाइव दृश्य।"
            />
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <article
                key={stat.label}
                data-stat-card
                className="stats-card group relative overflow-hidden rounded-3xl border border-white/20 bg-white/[.12] px-3 py-5 text-center shadow-[0_22px_55px_rgba(69,26,3,.22)] backdrop-blur-md transition-[transform,background-color,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/[.17] hover:shadow-[0_26px_65px_rgba(69,26,3,.28)] sm:px-5 sm:py-7 lg:px-6 lg:py-8"
              >
                <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" aria-hidden="true" />
                <div className="stats-icon-shell mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-white to-amber-50 text-amber-700 shadow-[0_0_28px_rgba(254,243,199,.32)] ring-4 ring-white/10 transition-transform duration-500 group-hover:scale-105 sm:h-15 sm:w-15">
                  <Icon className="h-5 w-5 sm:h-7 sm:w-7" strokeWidth={2.2} aria-hidden="true" />
                </div>
                <p className="mt-4 text-3xl font-black tabular-nums tracking-tight text-white sm:mt-5 sm:text-4xl lg:text-5xl">
                  <span data-stat-value={stat.value} aria-label={stat.value.toLocaleString("en-IN")}>
                    {stat.value.toLocaleString("en-IN")}
                  </span>
                </p>
                <p className="mt-1.5 text-xs font-semibold leading-5 text-amber-100 sm:mt-2 sm:text-sm lg:text-base">
                  <T en={stat.label} hi={stat.labelHi} />
                </p>
              </article>
            );
          })}
        </div>

        <p className="mt-6 text-center text-[11px] font-medium text-amber-100/80 sm:mt-8 sm:text-xs">
          <T en="Updated automatically from Dhaga activity" hi="Dhaga गतिविधि से अपने आप अपडेट होता है" />
        </p>
        </StatsAnimator>
      </div>
    </section>
  );
}
