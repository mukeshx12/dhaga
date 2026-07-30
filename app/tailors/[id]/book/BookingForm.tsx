"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type BookingFormProps = {
  tailorId: string;
  tailorName: string;
};

export default function BookingForm({
  tailorId,
  tailorName,
}: BookingFormProps) {
  const [bookingDate, setBookingDate] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const response = await fetch("/api/bookings", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        tailorId,
        bookingDate,
        address,
        notes,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message ?? "Could not create your booking.");
      return;
    }

    router.replace("/dashboard?booking=success#recent-bookings");
    
  } catch (error) {
    console.error(error);
    setError("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">

      {error && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      )}

      <div>
        <label className="mb-2 block font-semibold text-gray-900">
          Preferred Date
        </label>

        <input className="w-full rounded-xl border border-gray-300 bg-white p-4 text-gray-900 placeholder:text-gray-400 focus:border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-200"
          type="date"
          required
          min={new Date().toISOString().split("T")[0]}
          value={bookingDate}
          onChange={(e) => setBookingDate(e.target.value)}
        />
      </div>

      <div>
        <label className="mb-2 block font-semibold text-gray-900">
          Measurement Address
        </label>

        <textarea
          rows={4}
          required
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full rounded-xl border border-gray-300 bg-white p-4 text-gray-900 placeholder:text-gray-400 focus:border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-200"
          placeholder="Enter the complete address for your measurement visit"
        />
      </div>

      <div>
        <label className="mb-2 block font-semibold text-gray-900">
          Notes
        </label>

        <textarea
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full rounded-xl border border-gray-300 bg-white p-4 text-gray-900 placeholder:text-gray-400 focus:border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-200"
          placeholder="Garment type, preferred time or any special instructions"
        />
      </div>

      <button
  type="submit"
  disabled={loading}
  className="w-full rounded-xl bg-amber-700 px-8 py-4 font-semibold text-white hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-50"
>
  {loading ? "Confirming booking..." : `Confirm booking with ${tailorName}`}
</button>

      <p className="text-center text-xs text-gray-500">
        The tailor will review your request before sending a quotation.
      </p>

    </form>
  );
}
