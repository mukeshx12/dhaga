import { Users, Scissors, MapPin, CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import T from "./LocalizedText";

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
    { icon: MapPin, value: cities.length, label: "Cities Covered", labelHi: "शहरों में उपलब्ध" },
    { icon: CheckCircle2, value: completedOrders, label: "Orders Completed", labelHi: "पूरे हुए ऑर्डर" },
  ];

  return (
    <section className="bg-amber-700 py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 text-center lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label}>
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                <Icon className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-white">{stat.value}</h2>
              <p className="mt-2 text-amber-100"><T en={stat.label} hi={stat.labelHi} /></p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
