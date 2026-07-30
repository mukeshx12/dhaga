"use client";

import { useEffect, useState } from "react";

type Service = {
  id: string;
  serviceName: string;
  price: number;
};

export default function TailorServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [serviceName, setServiceName] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    fetch("/api/tailor/services")
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Could not load services");
        }
        return response.json();
      })
      .then((data) => {
        if (active) {
          setServices(data);
        }
      })
      .catch((loadError) => {
        console.error(loadError);
        if (active) {
          setError("Could not load your services.");
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  async function addService(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
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
        setError(data.message ?? "Could not add this service.");
        return;
      }

      setServices((prev) => [...prev, data]);

      setServiceName("");
      setPrice("");
    } catch (requestError) {
      console.error(requestError);
      setError("Could not add this service.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-12 rounded-3xl bg-white p-6 text-gray-900 shadow-sm sm:p-8">

      <p className="text-sm font-semibold uppercase tracking-wider text-amber-700">
        Services and prices
      </p>

      <h2 className="mt-1 text-2xl font-bold text-gray-900">
        My Services
      </h2>

      <p className="mt-2 text-sm text-gray-600">
        Add each tailoring service customers can order and its starting price.
      </p>

      {error && (
        <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <form
        onSubmit={addService}
        className="mt-6 grid gap-4 sm:grid-cols-[minmax(0,1fr)_180px_auto]"
      >
        <input
          type="text"
          placeholder="Service Name"
          aria-label="Service name"
          required
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          className="min-w-0 rounded-xl border border-gray-300 bg-white p-3 text-gray-900 placeholder:text-gray-500 outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-100"
        />

        <input
          type="number"
          placeholder="Price"
          aria-label="Starting price"
          required
          min="1"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full rounded-xl border border-gray-300 bg-white p-3 text-gray-900 placeholder:text-gray-500 outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-100"
        />

        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-amber-700 px-6 py-3 font-semibold text-white hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Adding..." : "Add service"}
        </button>
      </form>

      {loading ? (
        <p className="mt-6 text-gray-600">Loading services...</p>
      ) : services.length === 0 ? (
        <p className="mt-6 text-gray-500">
          No services added yet.
        </p>
      ) : (
        <div className="mt-8 space-y-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4"
            >
              <span className="font-medium text-gray-900">
                {service.serviceName}
              </span>

              <span className="font-semibold text-amber-700">
                ₹{service.price}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
