import {
  ShieldCheck,
  Ruler,
  Truck,
  Star,
} from "lucide-react";

const features = [
  {
    title: "Verified Tailors",
    description:
      "Every tailor is verified before joining Dhaga to ensure quality and trust.",
    icon: ShieldCheck,
  },
  {
    title: "Home Measurement",
    description:
      "Book a tailor to visit your home for accurate measurements and convenience.",
    icon: Ruler,
  },
  {
    title: "Doorstep Pickup & Delivery",
    description:
      "Get your fabric picked up and your stitched outfit delivered to your doorstep.",
    icon: Truck,
  },
  {
    title: "Top Rated Service",
    description:
      "Compare ratings, reviews, and pricing before choosing the perfect tailor.",
    icon: Star,
  },
];

export default function WhyChoose() {
  return (
    <section className="bg-[#FAF7F2] py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
            Why Choose Dhaga?
          </span>

          <h2 className="mt-6 text-4xl font-bold text-gray-900">
            Tailoring Made Simple & Trusted
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            From home measurements to doorstep delivery, Dhaga connects you
            with skilled ladies' tailors for a seamless stitching experience.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-2xl bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                  <Icon className="h-8 w-8 text-amber-700" />
                </div>

                <h3 className="text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>

                <p className="mt-3 text-gray-600 leading-7">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}