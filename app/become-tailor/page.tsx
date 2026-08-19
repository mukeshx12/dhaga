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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.replace("/login?callbackUrl=/become-tailor");
      return;
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
  if (submitting) return;

  const digits = formData.phone.replace(/\D/g, "");
  const normalizedPhone = digits.length === 10
    ? `+91${digits}`
    : digits.length === 12 && digits.startsWith("91")
      ? `+${digits}`
      : formData.phone.trim();

  if (!/^\+91\d{10}$/.test(normalizedPhone)) {
    setError(hi ? "मान्य 10 अंकों का भारतीय फोन नंबर दर्ज करें।" : "Enter a valid 10-digit Indian phone number.");
    return;
  }

  setSubmitting(true);
  setError("");

  try {
    const response = await fetch("/api/tailor/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        phone: normalizedPhone,
        experience: Number(formData.experience),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || (hi ? "आवेदन जमा नहीं हो सका।" : "Could not submit your application."));
      return;
    }

    router.replace("/tailor-dashboard?section=profile");
    router.refresh();

  } catch (error) {
    console.error(error);
    setError(hi ? "नेटवर्क से कनेक्ट नहीं हो सका। फिर प्रयास करें।" : "Could not connect to Dhaga. Please try again.");
  } finally {
    setSubmitting(false);
  }
};

  if (status === "loading") {
    return <main className="grid min-h-screen place-items-center bg-gray-100"><p className="font-semibold text-amber-800">{hi ? "खाता लोड हो रहा है…" : "Loading your account…"}</p></main>;
  }

  if (!session) return null;

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

          {error && (
            <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 md:col-span-2">
              {error}
            </p>
          )}

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
              required
              minLength={2}
              className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-amber-700"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              {hi ? "फोन नंबर" : "Phone Number"}
            </label>

            <input
              type="tel"
              inputMode="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 9876543210"
              required
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
              required
              minLength={2}
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
              required
              min={0}
              max={80}
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
              required
              minLength={5}
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
              disabled={submitting}
              className="w-full rounded-xl bg-amber-700 py-4 font-semibold text-white transition hover:bg-amber-800 disabled:cursor-wait disabled:opacity-60"
            >
              {submitting
                ? (hi ? "आवेदन जमा हो रहा है…" : "Submitting application…")
                : (hi ? "आवेदन जमा करें" : "Submit Application")}
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}
