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

          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl">
            Find the Perfect Tailor for Every Stitch.
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            Compare verified ladies&apos; tailors, upload your design,
            schedule home measurements, and track your stitching
            order from start to finish.
          </p>

          
        </div>

        <div className="relative flex justify-center">
          <div className="w-full max-w-[550px]">
            <Image
              src="/images/tailoring_women.png"
              alt="Professional ladies tailor stitching ethnic wear"
              width={550}
              height={650}
              priority
              sizes="(max-width: 768px) 100vw, 550px"
              className="w-full rounded-3xl object-cover shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

