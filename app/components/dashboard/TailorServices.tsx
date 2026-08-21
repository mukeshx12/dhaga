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

  async function fetchServices() {
    const response = await fetch("/api/tailor/services");

    if (!response.ok) {
      setLoading(false);
      return;
    }

    const data = await response.json();
    setServices(data);
    setLoading(false);
  }

  useEffect(() => {
    // The request synchronizes this client view with the server-owned service list.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchServices();
  }, []);

  async function addService(e: React.FormEvent) {
    e.preventDefault();

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
      alert(data.message);
      return;
    }

    setServices((prev) => [...prev, data]);

    setServiceName("");
    setPrice("");
  }

  return (
    <section className="mt-8 min-w-0 overflow-hidden rounded-[1.75rem] border border-stone-200/80 bg-white p-4 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:mt-10 sm:p-6 lg:p-8">

      <h2 className="text-2xl font-bold">
        My Services
      </h2>

      <form
        onSubmit={addService}
        className="mt-5 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(7.5rem,0.42fr)_auto] sm:items-stretch"
      >
        <input
          type="text"
          placeholder="Service Name"
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          className="min-h-12 min-w-0 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none transition placeholder:text-slate-400 focus:border-amber-700 focus:ring-2 focus:ring-amber-200"
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="min-h-12 min-w-0 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none transition placeholder:text-slate-400 focus:border-amber-700 focus:ring-2 focus:ring-amber-200"
        />

        <button
          type="submit"
          className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-amber-700 px-6 py-3 font-bold text-white shadow-sm transition hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 sm:w-auto"
        >
          Add
        </button>
      </form>

      {loading ? (
        <p className="mt-6">Loading...</p>
      ) : services.length === 0 ? (
        <p className="mt-6 text-gray-500">
          No services added yet.
        </p>
      ) : (
        <div className="mt-8 space-y-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex min-w-0 items-center justify-between gap-4 rounded-xl border border-stone-200 p-4"
            >
              <span className="min-w-0 break-words font-medium">
                {service.serviceName}
              </span>

              <span className="shrink-0 font-semibold text-amber-700">
                ₹{service.price}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
