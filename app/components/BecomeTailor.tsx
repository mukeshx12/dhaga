import Image from "next/image";
import NextLink from "next/link";
import { BadgeCheck, CalendarCheck, IndianRupee,  Users } from "lucide-react";

const benefits = [
  {
    icon: IndianRupee,
    title: "Earn More",
    description: "Accept tailoring orders from customers across your city.",
  },
  {
    icon: CalendarCheck,
    title: "Manage Bookings",
    description: "Control your schedule and accept orders at your convenience.",
  },
  {
    icon: Users,
    title: "Grow Your Business",
    description: "Reach thousands of customers without spending on marketing.",
  },
  {
    icon: BadgeCheck,
    title: "Verified Professional",
    description: "Build trust with a verified tailor badge and customer reviews.",
  },
];

export default function BecomeTailor() {
  return (
    <section className="bg-gradient-to-r from-amber-50 via-white to-orange-50 py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">

        {/* Left Side */}
        <div>
          <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
            Become a Dhaga Partner
          </span>

          <h2 className="mt-6 text-5xl font-extrabold leading-tight text-gray-900">
            Turn Your Tailoring Skill into a
            <span className="text-amber-700"> Growing Business</span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            Join Dhaga to receive online stitching orders, manage appointments,
            showcase your portfolio, and grow your tailoring business with
            customers across your city.
          </p>

          <div className="mt-10 space-y-6">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div key={benefit.title} className="flex gap-4">
                  <div className="rounded-xl bg-amber-100 p-3">
                    <Icon className="h-6 w-6 text-amber-700" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {benefit.title}
                    </h3>

                    <p className="text-gray-600">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
          <NextLink
  href="/become-tailor"
  className="rounded-xl bg-amber-700 px-8 py-4 font-semibold text-white transition hover:bg-amber-800"
>
  Register as Tailor
</NextLink>

          <button className="rounded-xl border-2 border-gray-200 bg-white px-8 py-4 font-semibold text-gray-900 transition hover:bg-gray-900 hover:text-white">
  Learn More
</button>
          </div>
        </div>

        {/* Right Side */}
        <div className="relative flex justify-center">
 
          <div className="relative overflow-hidden rounded-3xl shadow-2xl w-full max-w-[550px]">
 
            <Image
              src="/images/tailoring_women.png"
              alt="Become a Dhaga Tailor"
              width={550}
              height={700}
              className="w-full object-cover"
            />
          </div>
 
          {/* Floating Card 1 */}
          <div className="absolute left-0 top-10 hidden rounded-2xl bg-white p-5 shadow-xl lg:block">
            <p className="text-sm text-gray-500">
              Monthly Earnings
            </p>
 
            <h3 className="mt-2 text-3xl font-bold text-amber-700">
              ₹50K+
            </h3>
          </div>
 
          {/* Floating Card 2 */}
          <div className="absolute bottom-10 right-0 hidden rounded-2xl bg-white p-5 shadow-xl lg:block">
            <p className="text-sm text-gray-500">
              Active Tailors
            </p>
 
            <h3 className="mt-2 text-3xl font-bold text-amber-700">
              1200+
            </h3>
          </div>
 
        </div>
      </div>
    </section>
  );
}