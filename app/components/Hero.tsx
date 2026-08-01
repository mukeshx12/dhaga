"use client";
import Image from "next/image";
import T from "./LocalizedText";

export default function Hero() {

  
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <span className="rounded-full bg-amber-100 px-4 py-2 text-sm text-amber-800">
            <T en="Trusted Tailors Across India" hi="भारत भर के भरोसेमंद दर्जी" />
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl">
            <T en="Find the Perfect Tailor for Every Stitch." hi="हर सिलाई के लिए सही दर्जी खोजें।" />
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            <T en="Compare verified ladies’ tailors, upload your design, schedule home measurements, and track your stitching order from start to finish." hi="सत्यापित महिला दर्जियों की तुलना करें, अपना डिज़ाइन अपलोड करें, घर पर माप बुक करें और सिलाई की पूरी स्थिति देखें।" />
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
