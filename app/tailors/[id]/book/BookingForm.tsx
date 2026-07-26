"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type BookingFormProps = {
  tailorId: string;
};

export default function BookingForm({
  tailorId,
}: BookingFormProps) {
  const [bookingDate, setBookingDate] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  setLoading(true);

  console.log("Booking Tailor ID:", tailorId);

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
      alert(data.message);
      return;
    }

    alert("Booking Created Successfully 🎉");
    

    router.push("/my-bookings");
    
  } catch (error) {
    console.error(error);
    alert("Something went wrong.");
  } finally {
    setLoading(false);
  }
};

  return (
    <form
  onSubmit={handleSubmit}
  className="mt-10 space-y-6"
>

      <div>
        <label className="mb-2 block font-semibold text-gray-900">
          Preferred Date
        </label>

        <input className="w-full rounded-xl border border-gray-300 bg-white p-4 text-gray-900 placeholder:text-gray-400 focus:border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-200"
          type="date"
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
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full rounded-xl border border-gray-300 bg-white p-4 text-gray-900 placeholder:text-gray-400 focus:border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-200"
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
          className="w-full rounded-xl border p-4"
          placeholder="Any special instructions..."
        />
      </div>

      <button
  type="submit"
  disabled={loading}
  className="rounded-xl bg-amber-700 px-8 py-4 font-semibold text-white hover:bg-amber-800 disabled:opacity-50"
>
  {loading ? "Booking..." : "Book Measurement"}
</button>

    </form>
  );
}