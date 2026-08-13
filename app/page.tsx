import Link from "next/link";
import { CalendarCheck, Search } from "lucide-react";
import { prisma } from "@/lib/prisma";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import SearchBar from "./components/SearchBar";
import Services from "./components/Services";
import WhyChoose from "./components/WhyChoose";
import FeaturedTailors from "./components/FeaturedTailors";
import HowItWorks from "./components/HowItWorks";
import BecomeTailor from "./components/BecomeTailor";
import Stats from "./components/Stats";
import Contact from "./components/Contact";
import T from "./components/LocalizedText";
import MobileAppHome from "./components/MobileAppHome";

export const dynamic = "force-dynamic";

export default async function Home() {
  const tailors = await prisma.tailorProfile.findMany({
    where: {
      isVerified: true,
      status: "VERIFIED",
      user: { accountStatus: "ACTIVE" },
    },
    include: {
      user: true,
      services: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 6,
  });

  const serializedTailors = tailors.map((tailor) => ({
    ...tailor,
    services: tailor.services.map((service) => ({
      ...service,
      price: Number(service.price),
    })),
  }));

  return (
    <main className="min-h-screen bg-[#FAF7F2] md:pt-20">
      <Navbar hideOnMobile />

      <div className="md:hidden">
        <MobileAppHome tailors={serializedTailors} />
      </div>

      <div className="hidden md:block">

      <Hero />

      <SearchBar />

      {/* CTA Buttons */}
      
      <div className="mx-auto mb-12 mt-4 flex max-w-xl flex-col gap-3 px-5 sm:max-w-none sm:flex-row sm:justify-center sm:px-6">
        <Link
          href="/tailors"
          className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-amber-700 px-6 py-3 text-center text-base font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-800 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2 sm:w-auto sm:min-w-56"
        >
          <CalendarCheck aria-hidden="true" size={21} />
          <T en="Book Measurement" hi="माप बुक करें" />
        </Link>
 
        <Link
          href="/tailors"
          className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-xl border border-amber-700 bg-white px-6 py-3 text-center text-base font-semibold text-amber-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2 sm:w-auto sm:min-w-56"
        >
          <Search aria-hidden="true" size={21} />
          <T en="Browse Tailors" hi="दर्जी खोजें" />
        </Link>
      </div>

      <Services />

      <WhyChoose />

      <FeaturedTailors tailors={serializedTailors} />

      <HowItWorks />

      <BecomeTailor />

      </div>

      <Stats />

      <div className="hidden md:block">
        <Contact />
      </div>
    </main>
  );
}
