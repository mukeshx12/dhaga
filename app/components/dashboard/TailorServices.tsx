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
    <div className="mt-12 rounded-2xl bg-white p-8 shadow">

      <h2 className="text-2xl font-bold">
        My Services
      </h2>

      <form
        onSubmit={addService}
        className="mt-6 flex gap-3"
      >
        <input
          type="text"
          placeholder="Service Name"
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          className="flex-1 rounded-xl border p-3"
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-40 rounded-xl border p-3"
        />

        <button
          type="submit"
          className="rounded-xl bg-amber-700 px-6 text-white"
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
              className="flex items-center justify-between rounded-xl border p-4"
            >
              <span className="font-medium">
                {service.serviceName}
              </span>

              <span className="font-semibold text-amber-700">
                ₹{service.price}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
