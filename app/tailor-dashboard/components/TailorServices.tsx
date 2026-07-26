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
    fetchServices();
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
    <div className="mt-10 rounded-2xl bg-white p-6 shadow">
      <h2 className="text-2xl font-extrabold text-black-950">My Services</h2>

      <p className="mt-2 text-gray-500">
        Add the services you provide along with their starting price.
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

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <input
          type="text"
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          placeholder="Service Name"
          className="rounded-xl border border-gray-900 p-3 outline-none focus:border-amber-700"
        />

        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          className="rounded-xl border border-gray-900 p-3 outline-none focus:border-amber-700 placeholder:text-gray-400 "
        />

        <button
          onClick={addService}
          disabled={loading}
          className="rounded-xl bg-amber-700 px-6 py-3 font-semibold text-white hover:bg-amber-800 disabled:opacity-50 placeholder:text-gray-400 "
        >
          {loading ? "Adding..." : "Add Service"}
        </button>
      </div>

      <div className="mt-8 space-y-4">
        {services.length === 0 ? (
          <p className="text-gray-500">No services added yet.</p>
        ) : (
          services.map((service) => (
            <div
              key={service.id}
              className="flex items-center justify-between rounded-xl border p-4"
            >
              <div>
                <h3 className="font-semibold">{service.serviceName}</h3>

                <p className="text-gray-500">
                  ₹ {service.price}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}