"use client";

import { useEffect, useState } from "react";

type Booking = {
  id: string;
  bookingDate: string;
  address: string;
  notes: string | null;
  status: string;
  quotationPrice?: string | null;
  quotationNotes?: string | null;
  customer: {
  name: string;
  email: string;
  };
};

export default function TailorBookings() {

  const [quotationPrice, setQuotationPrice] = useState("");
const [quotationNotes, setQuotationNotes] = useState("");

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  async function updateBookingStatus(
  bookingId: string,
  status: "ACCEPTED" | "REJECTED" | "COMPLETED"
  )  
  {
  try {
    const response = await fetch(
      `/api/tailor/bookings/${bookingId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
        }),
      }
    );

    if (!response.ok) {
      alert("Failed to update booking.");
      return;
    }

    // Update UI instantly
    setBookings((prev) =>
      prev.map((booking) =>
     booking.id === bookingId
      ? {
          ...booking,
          quotationPrice,
          quotationNotes,
          status: "QUOTATION_SENT",
        }
      : booking
  )
    );

  } catch (error) {
    console.error(error);
    alert("Something went wrong.");
  }
}
async function sendQuotation(
  bookingId: string
) {
  try {
    const response = await fetch(
      `/api/tailor/bookings/${bookingId}/quotation`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quotationPrice,
          quotationNotes,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    alert("Quotation sent successfully.");

    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingId
          ? {
              ...booking,
              quotationPrice,
              quotationNotes,
            }
          : booking
      )
    );

    setQuotationPrice("");
    setQuotationNotes("");
  } catch (error) {
    console.error(error);
    alert("Something went wrong.");
  }
}

  useEffect(() => {

    async function fetchBookings() {

      const response = await fetch("/api/tailor/bookings");

      if (!response.ok) {
        setLoading(false);
        return;
      }

      const data = await response.json();

      setBookings(data);
      setLoading(false);
    }

    fetchBookings();

  }, []);

  if (loading) {
    return (
      <p className="mt-10 text-gray-500">
        Loading bookings...
      </p>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="mt-10 rounded-2xl bg-white p-10 text-center shadow">
        <h2 className="text-2xl font-semibold">
          No Bookings Yet
        </h2>

        <p className="mt-3 text-gray-500">
          Customer bookings will appear here.
        </p>
      </div>
    );
  }

  return (

    <div className="mt-10 grid gap-6">

      {bookings.map((booking) => (

        <div
          key={booking.id}
          className="rounded-2xl bg-white p-6 shadow"
        >

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-xl font-semibold">
                {booking.customer.name}
              </h2>

              <p className="text-gray-500">
                {booking.customer.email}
              </p>

            </div>

            <span
  className={`rounded-full px-4 py-2 text-sm font-semibold ${
    booking.status === "PENDING"
      ? "bg-yellow-100 text-yellow-700"
      : booking.status === "ACCEPTED"
      ? "bg-green-100 text-green-700"
      : booking.status === "REJECTED"
      ? "bg-red-100 text-red-700"
      : booking.status === "COMPLETED"
? "bg-blue-100 text-blue-700"
: "bg-gray-100 text-gray-700"
  }`}
>
  {booking.status}
</span>

          </div>

          <div className="mt-6 space-y-2 text-gray-700">

            <p>
              <strong>Measurement Date:</strong>{" "}
              {new Date(booking.bookingDate).toLocaleDateString()}
            </p>

            <p>
              <strong>Address:</strong>{" "}
              {booking.address}
            </p>

            <p>
              <strong>Notes:</strong>{" "}
              {booking.notes || "No notes provided"}
            </p>

            {booking.status === "ACCEPTED" &&
             !booking.quotationPrice && (
           <div className="mt-6 rounded-xl border p-4">

    <h3 className="font-semibold">
      Send Quotation
    </h3>

    <input
      type="number"
      placeholder="Quotation Price"
      value={quotationPrice}
      onChange={(e) =>
        setQuotationPrice(e.target.value)
      }
      className="mt-3 w-full rounded-xl border p-3"
    />

    <textarea
      rows={3}
      placeholder="Quotation Notes"
      value={quotationNotes}
      onChange={(e) =>
        setQuotationNotes(e.target.value)
      }
      className="mt-3 w-full rounded-xl border p-3"
    />

    <button
      onClick={() =>
        sendQuotation(booking.id)
      }
      className="mt-3 rounded-xl bg-amber-700 px-5 py-2 text-white"
    >
      Send Quotation
    </button>

  </div>
)}

{booking.quotationPrice && (
  <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4">

    <h3 className="font-semibold text-green-700">
      Quotation Sent
    </h3>

    <p className="mt-2 text-gray-800">
      <strong>Price:</strong> ₹
      {Number(booking.quotationPrice).toFixed(2)}
    </p>

    <p className="mt-2 text-gray-800">
      <strong>Notes:</strong>{" "}
      {booking.quotationNotes || "No notes"}
    </p>

  </div>
)}

          </div>

          <div className="mt-6 flex gap-3">
  {booking.status === "PENDING" && (
    <>
      <button
        onClick={() =>
          updateBookingStatus(booking.id, "ACCEPTED")
        }
        className="rounded-xl bg-green-600 px-5 py-2 text-white hover:bg-green-700"
      >
        Accept
      </button>

      <button
        onClick={() =>
          updateBookingStatus(booking.id, "REJECTED")
        }
        className="rounded-xl bg-red-600 px-5 py-2 text-white hover:bg-red-700"
      >
        Reject
      </button>
    </>
  )}

      {booking.status === "CONFIRMED" && (
  <button
    onClick={() =>
      updateBookingStatus(booking.id, "COMPLETED")
    }
    className="rounded-xl bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
  >
    Mark as Completed
  </button>
)}
       </div>

      </div>

      ))}

    </div>

  );
}