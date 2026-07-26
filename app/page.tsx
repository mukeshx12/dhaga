import Link from "next/link";
import { prisma } from "@/lib/prisma";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import SearchBar from "./components/SearchBar";
import Services from "./components/Services";
import WhyChoose from "./components/WhyChoose";
import FeaturedTailors from "./components/FeaturedTailors";
import HowItWorks from "./components/HowItWorks";
import Testimonials from "./components/Testimonials";
import BecomeTailor from "./components/BecomeTailor";
import Stats from "./components/Stats";
import Contact from "./components/Contact";

export const dynamic = "force-dynamic";

export default async function Home() {
  const tailors = await prisma.tailorProfile.findMany({
    where: {
      isVerified: true,
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
    <main className="min-h-screen bg-[#FAF7F2] pt-20">
      <Navbar />

      <Hero />

      <SearchBar />

      {/* CTA Buttons */}
      
      <div className="mx-auto mt-6 mb-14 flex max-w-6xl justify-center gap-5">
        <Link
          href="/tailors"
          className="rounded-xl bg-amber-700 px-10 py-4 text-lg font-semibold text-white transition hover:bg-amber-800"
        >
          Book Measurement
        </Link>

        <Link
          href="/tailors"
          className="rounded-xl border-2 border-amber-700 bg-white px-10 py-4 text-lg font-semibold text-amber-700 transition hover:bg-amber-700 hover:text-white"
        >
          Browse Tailors
        </Link>
      </div>

      <Services />

      <WhyChoose />

      <FeaturedTailors tailors={serializedTailors} />

      <HowItWorks />

      <Testimonials />

      <BecomeTailor />

      <Stats />

      <Contact />
    </main>
  );
}