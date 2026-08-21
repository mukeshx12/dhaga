"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/app/i18n/LanguageProvider";

type Service = {
  id: string;
  serviceName: string;
  price: number;
};

export default function TailorServices() {
  const { language } = useLanguage();
  const hi = language === "hi";
  const [services, setServices] = useState<Service[]>([]);
  const [serviceName, setServiceName] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function fetchServices() {
    try {
      const response = await fetch("/api/tailor/services");

      if (!response.ok) return;

      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => void fetchServices(), 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function addService() {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/tailor/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceName,
          price: Number(price),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      setMessage("✅ Service added successfully.");

      setServiceName("");
      setPrice("");

      fetchServices();
    } catch (error) {
      console.error(error);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-8 min-w-0 overflow-hidden rounded-[1.75rem] border border-stone-200/80 bg-white p-4 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:mt-10 sm:p-6">
      <h2 className="text-2xl font-extrabold text-black-950">{hi ? "मेरी सेवाएं" : "My Services"}</h2>

      <p className="mt-2 text-gray-500">
        {hi ? "अपनी सेवाएं और उनकी शुरुआती कीमत जोड़ें।" : "Add the services you provide along with their starting price."}
      </p>

      {message && (
        <div className="mt-4 rounded-lg bg-green-100 p-3 text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg bg-red-100 p-3 text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(7.5rem,0.42fr)_auto] sm:items-stretch">
        <input
          type="text"
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          placeholder={hi ? "सेवा का नाम" : "Service Name"}
          className="min-h-12 min-w-0 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-200"
        />

        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder={hi ? "कीमत" : "Price"}
          className="min-h-12 min-w-0 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none transition placeholder:text-gray-400 focus:border-amber-700 focus:ring-2 focus:ring-amber-200"
        />

        <button
          onClick={addService}
          disabled={loading}
          className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-amber-700 px-6 py-3 font-bold text-white shadow-sm transition hover:bg-amber-800 disabled:opacity-50 sm:w-auto"
        >
          {loading ? (hi ? "जोड़ रहे हैं..." : "Adding...") : (hi ? "सेवा जोड़ें" : "Add Service")}
        </button>
      </div>

      <div className="mt-8 space-y-4">
        {services.length === 0 ? (
          <p className="text-gray-500">{hi ? "अभी कोई सेवा नहीं जोड़ी गई है।" : "No services added yet."}</p>
        ) : (
          services.map((service) => (
            <div
              key={service.id}
              className="flex min-w-0 items-center justify-between gap-4 rounded-xl border p-4"
            >
              <div className="min-w-0">
                <h3 className="break-words font-semibold">{service.serviceName}</h3>

                <p className="text-gray-500">
                  ₹ {service.price}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
