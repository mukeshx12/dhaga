"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/i18n/LanguageProvider";



export default function BecomeTailorPage() {
  

  const { data: session, status } = useSession();
  const router = useRouter();
  const { language } = useLanguage();
  const hi = language === "hi";
  useEffect(() => {
  if (status === "loading") return;

  if (!session) {
    router.replace("/login");
  }
}, [session, status, router]);

  const [formData, setFormData] = useState({
    shopName: "",
    phone: "",
    city: "",
    address: "",
    experience: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  try {
    const response = await fetch("/api/tailor/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        experience: Number(formData.experience),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    router.push("/tailor-dashboard");

    setFormData({
      shopName: "",
      phone: "",
      city: "",
      address: "",
      experience: "",
      description: "",
    });

  } catch (error) {
    console.error(error);
    alert(hi ? "कुछ गलत हो गया।" : "Something went wrong.");
  }
};

  return (
    <main className="min-h-screen bg-gray-100 py-16">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-10 shadow-lg">

        <h1 className="text-4xl font-bold text-gray-900">
          {hi ? "Dhaga दर्जी बनें" : "Become a Dhaga Tailor"}
        </h1>

        <p className="mt-3 text-gray-600">
          {hi ? "सिलाई ऑर्डर प्राप्त करने के लिए अपने व्यवसाय का विवरण भरें।" : "Fill in your business details to start receiving tailoring orders."}
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 grid gap-6 md:grid-cols-2"
        >

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              {hi ? "दुकान का नाम" : "Shop Name"}
            </label>

            <input
              type="text"
              name="shopName"
              value={formData.shopName}
              onChange={handleChange}
              placeholder="Priya Boutique"
              className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-amber-700"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              {hi ? "फोन नंबर" : "Phone Number"}
            </label>

            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 9876543210"
              className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-amber-700"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              {hi ? "शहर" : "City"}
            </label>

            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Bangalore"
              className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-amber-700"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              {hi ? "अनुभव" : "Experience"}
            </label>

            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="10"
              className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-amber-700"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block font-medium text-gray-700">
              {hi ? "पता" : "Address"}
            </label>

            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder={hi ? "दुकान का पूरा पता" : "Full Shop Address"}
              className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-amber-700"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block font-medium text-gray-700">
              {hi ? "आपके काम के बारे में" : "About Your Work"}
            </label>

            <textarea
              rows={5}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={hi ? "ग्राहकों को अपने सिलाई अनुभव के बारे में बताएं..." : "Tell customers about your tailoring experience..."}
              className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-amber-700"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full rounded-xl bg-amber-700 py-4 font-semibold text-white transition hover:bg-amber-800"
            >
              {hi ? "आवेदन जमा करें" : "Submit Application"}
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}
