import Link from "next/link";
import {
  Shirt,
  Scissors,
  Ruler,
  Sparkles,
  House,
  BadgeCheck,
} from "lucide-react";

const services = [
  {
    title: "Blouse Stitching",
    search: "Blouse Stitching",
    icon: Shirt,
    desc: "Designer & bridal blouse stitching.",
  },
  {
    title: "Suit Stitching",
    search: "Suit Extra Design",
    icon: Sparkles,
    desc: "Custom salwar suit stitching.",
  },
  {
    title: "Lehenga Stitching",
    search: "Lehenga Stitching", // when you add it to DB
    icon: BadgeCheck,
    desc: "Wedding & festive lehengas.",
  },
  {
    title: "Alterations",
    search: "Alterations",
    icon: Scissors,
    desc: "Perfect fitting for existing dresses.",
  },
  {
    title: "Home Measurement",
    search: "Home Measurement",
    icon: House,
    desc: "Book a tailor at your home.",
  },
  {
    title: "Fall & Pico",
    search: "Saare Fall",
    icon: Ruler,
    desc: "Quick saree finishing service.",
  },
];
export default function Services() {
  return (
    <section id="popular-services" className="scroll-mt-20 bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-center text-4xl font-bold text-gray-900">
          Popular Services
        </h2>

        <p className="mt-4 text-center text-gray-600">
          Everything you need for women&apos;s tailoring in one place.
        </p>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.title}
                className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-amber-500 hover:shadow-xl"
              >
                <div className="mb-6 inline-flex rounded-xl bg-amber-100 p-4">
                  <Icon className="h-8 w-8 text-amber-700" />
                </div>

                <h3 className="text-2xl font-semibold">
                  {service.title}
                </h3>

                <p className="mt-3 text-gray-600">
                  {service.desc}
                </p>

                <Link
  href={`/tailors?service=${encodeURIComponent(service.search)}`}
  className="mt-6 inline-flex items-center font-semibold text-amber-700 transition hover:gap-3"
>
  Book Now →
</Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
