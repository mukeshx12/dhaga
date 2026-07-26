import {
  Search,
  CalendarCheck,
  Scissors,
  Truck,
} from "lucide-react";

const steps = [
  {
    title: "Find a Tailor",
    description:
      "Search verified ladies' tailors near you by city, service, ratings, and price.",
    icon: Search,
  },
  {
    title: "Book Home Measurement",
    description:
      "Choose a convenient date and time for home measurement or visit the boutique.",
    icon: CalendarCheck,
  },
  {
    title: "Tailoring Begins",
    description:
      "Upload your design, discuss requirements, and track stitching progress.",
    icon: Scissors,
  },
  {
    title: "Delivery & Review",
    description:
      "Receive your outfit, try it on, and rate your tailoring experience.",
    icon: Truck,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">
          <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
            How It Works
          </span>

          <h2 className="mt-5 text-4xl font-bold text-gray-900">
            Get Your Outfit Stitched in 4 Easy Steps
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            From selecting a tailor to doorstep delivery, Dhaga makes
            ladies' tailoring simple, transparent, and hassle-free.
          </p>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="relative rounded-3xl bg-white p-8 shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="absolute -top-5 left-8 flex h-12 w-12 items-center justify-center rounded-full bg-amber-700 text-lg font-bold text-white">
                  {index + 1}
                </div>

                <div className="mt-8 mb-6 inline-flex rounded-2xl bg-amber-100 p-4">
                  <Icon className="h-8 w-8 text-amber-700" />
                </div>

                <h3 className="text-xl font-bold text-gray-900">
                  {step.title}
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  {step.description}
                </p>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}