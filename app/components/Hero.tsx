"use client";
import { BadgeCheck } from "lucide-react";
import T from "./LocalizedText";
import AnimatedServicesWheel from "./AnimatedServicesWheel";

export default function Hero() {

  
  return (
    <section className="mx-auto max-w-7xl px-6 pb-5 pt-10 lg:pt-12">
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(28rem,.9fr)] lg:gap-12">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-900 ring-1 ring-amber-200/70">
            <BadgeCheck aria-hidden="true" size={16} />
            <T en="Trusted Tailors Across India" hi="भारत भर के भरोसेमंद दर्जी" />
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-gray-950 sm:text-5xl">
            <T en="Find the Perfect Tailor for Every Stitch." hi="हर सिलाई के लिए सही दर्जी खोजें।" />
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-8 text-gray-600">
            <T en="Compare verified ladies’ tailors, upload your design, schedule home measurements, and track your stitching order from start to finish." hi="सत्यापित महिला दर्जियों की तुलना करें, अपना डिज़ाइन अपलोड करें, घर पर माप बुक करें और सिलाई की पूरी स्थिति देखें।" />
          </p>

          
        </div>

        <div className="relative flex min-w-0 justify-center">
          <AnimatedServicesWheel />
        </div>
      </div>
    </section>
  );
}
