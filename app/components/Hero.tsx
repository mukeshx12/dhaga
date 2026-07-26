"use client";
import Image from "next/image";

export default function Hero() {

  
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <span className="rounded-full bg-amber-100 px-4 py-2 text-sm text-amber-800">
            Trusted Tailors Across India
          </span>

          <h1 className="mt-6 text-5xl font-extrabold leading-tight text-gray-900">
            Find the Perfect Tailor for Every Stitch.
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            Compare verified ladies' tailors, upload your design,
            schedule home measurements, and track your stitching
            order from start to finish.
          </p>

          
        </div>

        <div className="relative flex justify-center">
  <Image
    src="/images/tailoring_women.png"
    alt="Professional ladies tailor stitching ethnic wear"
    width={550}
    height={650}
    priority
    className="rounded-3xl object-cover shadow-2xl"
  />
</div>
      </div>
    </section>
  );
}

