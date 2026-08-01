import {
  Users,
  Scissors,
  MapPin,
  Star,
} from "lucide-react";
import T from "./LocalizedText";

const stats = [
  {
    icon: Users,
    value: "5,000+",
    label: "Happy Customers",
    labelHi: "संतुष्ट ग्राहक",
  },
  {
    icon: Scissors,
    value: "1,200+",
    label: "Verified Tailors",
    labelHi: "सत्यापित दर्जी",
  },
  {
    icon: MapPin,
    value: "50+",
    label: "Cities Covered",
    labelHi: "शहरों में उपलब्ध",
  },
  {
    icon: Star,
    value: "25,000+",
    label: "Orders Completed",
    labelHi: "पूरे हुए ऑर्डर",
  },
];

export default function Stats() {
  return (
    <section className="bg-amber-700 py-20">
      <div className="mx-auto max-w-7xl px-6">

        <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-2 lg:grid-cols-4">

          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div key={stat.label}>
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                  <Icon className="h-8 w-8 text-white" />
                </div>

                <h2 className="text-4xl font-bold text-white">
                  {stat.value}
                </h2>

                <p className="mt-2 text-amber-100">
                  <T en={stat.label} hi={stat.labelHi} />
                </p>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}
