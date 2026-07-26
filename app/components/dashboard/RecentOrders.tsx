"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Booking = {
  id: string;
  bookingDate: string;

  status:
    | "PENDING"
    | "ACCEPTED"
    | "QUOTATION_SENT"
    | "CONFIRMED"
    | "REJECTED"
    | "COMPLETED"
    | "CANCELLED";

  quotationPrice?: string | null;
  quotationNotes?: string | null;

  tailor: {
    shopName: string;
    city: string;
  };
};

export default function RecentOrders() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await fetch("/api/bookings");

        if (!response.ok) return;

        const data = await response.json();
        setBookings(data);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, []);

  async function acceptQuotation(bookingId: string) {

    setBookings((prev) =>
  prev.map((booking) =>
    booking.id === bookingId
      ? {
          ...booking,
          status: "CONFIRMED",
        }
      : booking
  )
);
  try {
    const response = await fetch(
      `/api/bookings/${bookingId}/quotation`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "ACCEPT",
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    alert("Quotation accepted.");

    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingId
          ? {
              ...booking,
              status: "CONFIRMED",
            }
          : booking
      )
    );
  } catch (error) {
    console.error(error);
    alert("Something went wrong.");
  }
}

async function rejectQuotation(bookingId: string) {
  try {
    const response = await fetch(
      `/api/bookings/${bookingId}/quotation`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "REJECT",
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    alert("Quotation rejected.");

    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingId
          ? {
              ...booking,
              status: "CANCELLED",
            }
          : booking
      )
    );
  } catch (error) {
    console.error(error);
    alert("Something went wrong.");
  }
}

  function getStatusColor(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-700";

    case "ACCEPTED":
      return "bg-green-100 text-green-700";

    case "REJECTED":
      return "bg-red-100 text-red-700";

    case "COMPLETED":
      return "bg-blue-100 text-blue-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}





  return (
    <div className="mt-12 rounded-3xl bg-white p-8 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Recent Bookings
        </h2>

        <Link
          href="/my-bookings"
          className="font-medium text-amber-700 hover:underline"
        >
          View All
        </Link>
      </div>

      {loading ? (
        <p className="py-10 text-center text-gray-500">
          Loading bookings...
        </p>
      ) : bookings.length === 0 ? (
        <p className="py-10 text-center text-gray-500">
          No bookings yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="px-6 py-4">Booking ID</th>
                <th className="px-6 py-4">Tailor</th>
                <th className="px-6 py-4">City</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Message</th>
              </tr>
            </thead>

            <tbody>
              {bookings.slice(0, 3).map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium">
                    {booking.id.slice(0, 8)}...
                  </td>

                  <td className="px-6 py-4">
                    {booking.tailor.shopName}
                  </td>

                  <td className="px-6 py-4">
                    {booking.tailor.city}
                  </td>

                  <td className="px-6 py-4">
                    {new Date(
                      booking.bookingDate
                    ).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4">

  <span
    className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
      booking.status
    )}`}
  >
    {
  booking.status === "COMPLETED"
    ? "DELIVERED"
    : booking.status.replace("_", " ")
}
  </span>

  {booking.status === "ACCEPTED" && (
    <p className="mt-2 text-green-600">
      ✅ Your booking has been accepted.
    </p>
  )}

  {booking.status === "REJECTED" && (
    <p className="mt-2 text-red-600">
      ❌ Your booking was rejected.
    </p>
  )}

  {booking.status === "COMPLETED" && (
    <p className="text-green-600 font-medium">
    📦 Order Delivered.
  </p>
  )}

  {booking.status === "CANCELLED" && (
    <p className="mt-2 text-gray-600">
      Booking cancelled.
    </p>
  )}

  {booking.status === "QUOTATION_SENT" && booking.quotationPrice && (
    <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4">

      <h3 className="font-semibold text-green-700">
        💰 Quotation Received
      </h3>

      <p className="mt-3 text-gray-800">
        <strong>Price:</strong> ₹{booking.quotationPrice}
      </p>

      <div className="mt-3 rounded-lg bg-white p-3 shadow-sm">
        <p className="text-sm font-medium text-gray-500">
          Tailor Notes
        </p>

        <p className="mt-1 text-gray-800">
          {booking.quotationNotes || "No notes provided"}
        </p>
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={() => acceptQuotation(booking.id)}
          className="flex-1 rounded-xl bg-green-600 py-3 font-semibold text-white hover:bg-green-700"
        >
          Accept Quotation
        </button>

        <button
          onClick={() => rejectQuotation(booking.id)}
          className="flex-1 rounded-xl bg-red-600 py-3 font-semibold text-white hover:bg-red-700"
        >
          Reject Quotation
        </button>
      </div>

    </div>
  )}

  {booking.status === "CONFIRMED" && (
  <div className="mt-4 rounded-xl bg-green-100 p-3 text-green-700 font-semibold">
    ✅ You have accepted the quotation.
  </div>
)}

{booking.status === "CANCELLED" && (
  <div className="mt-4 rounded-xl bg-red-100 p-3 text-red-700 font-semibold">
    ❌ You rejected the quotation.
  </div>
)}

</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}