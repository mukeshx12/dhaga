"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/app/i18n/LanguageProvider";

type Booking = {
  id: string;
  bookingDate: string;
  address: string;
  notes: string | null;
  status: string;
  quotationPrice?: string | null;
  quotationNotes?: string | null;
  customer: {
    name: string | null;
    email: string | null;
    phone: string | null;
  };
};

export default function TailorBookings() {
  const { language } = useLanguage();
  const hi = language === "hi";

  const [quotationPrice, setQuotationPrice] = useState("");
const [quotationNotes, setQuotationNotes] = useState("");

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  async function updateBookingStatus(
  bookingId: string,
  status: "ACCEPTED" | "REJECTED" | "IN_PROGRESS" | "COMPLETED"
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

    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingId
          ? { ...booking, status }
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
              status: "QUOTATION_SENT",
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
        {hi ? "बुकिंग लोड हो रही हैं..." : "Loading bookings..."}
      </p>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="mt-10 rounded-2xl bg-white p-10 text-center shadow">
        <h2 className="text-2xl font-semibold">
          {hi ? "अभी कोई बुकिंग नहीं" : "No Bookings Yet"}
        </h2>

        <p className="mt-3 text-gray-500">
          {hi ? "ग्राहक बुकिंग यहां दिखाई देंगी।" : "Customer bookings will appear here."}
        </p>
      </div>
    );
  }

  return (

    <section className="mt-12">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-amber-700">
          {hi ? "ग्राहक अनुरोध" : "Customer requests"}
        </p>
        <h2 className="mt-1 text-2xl font-bold text-gray-900">
          {hi ? "आपको किसने बुक किया" : "Who booked you"}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {hi ? "ग्राहक विवरण, माप की यात्रा और मूल्य प्रस्ताव की स्थिति देखें।" : "Review customer details, measurement visits and quotation status."}
        </p>
      </div>

      <div className="mt-6 grid gap-6">

      {bookings.map((booking) => (

        <div
          key={booking.id}
          className="rounded-2xl bg-white p-6 shadow"
        >

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-xl font-semibold">
                {booking.customer.name || (hi ? "ग्राहक" : "Customer")}
              </h2>

              <p className="text-gray-500">
                {booking.customer.email || (hi ? "ईमेल उपलब्ध नहीं" : "No email provided")}
              </p>

              {booking.customer.phone && (
                <p className="text-gray-500">{booking.customer.phone}</p>
              )}

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
              <strong>{hi ? "माप की तारीख:" : "Measurement Date:"}</strong>{" "}
              {new Date(booking.bookingDate).toLocaleDateString(hi ? "hi-IN" : "en-IN")}
            </p>

            <p>
              <strong>{hi ? "पता:" : "Address:"}</strong>{" "}
              {booking.address}
            </p>

            <p>
              <strong>{hi ? "नोट्स:" : "Notes:"}</strong>{" "}
              {booking.notes || (hi ? "कोई नोट उपलब्ध नहीं" : "No notes provided")}
            </p>

            {booking.status === "ACCEPTED" &&
             !booking.quotationPrice && (
           <div className="mt-6 rounded-xl border p-4">

    <h3 className="font-semibold">
      {hi ? "मूल्य प्रस्ताव भेजें" : "Send Quotation"}
    </h3>

    <input
      type="number"
      placeholder={hi ? "प्रस्तावित कीमत" : "Quotation Price"}
      value={quotationPrice}
      onChange={(e) =>
        setQuotationPrice(e.target.value)
      }
      className="mt-3 w-full rounded-xl border p-3"
    />

    <textarea
      rows={3}
      placeholder={hi ? "प्रस्ताव के नोट्स" : "Quotation Notes"}
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
      {hi ? "मूल्य प्रस्ताव भेजें" : "Send Quotation"}
    </button>

  </div>
)}

{booking.quotationPrice && (
  <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4">

    <h3 className="font-semibold text-green-700">
      {hi ? "मूल्य प्रस्ताव भेजा गया" : "Quotation Sent"}
    </h3>

    <p className="mt-2 text-gray-800">
      <strong>{hi ? "कीमत:" : "Price:"}</strong> ₹
      {Number(booking.quotationPrice).toFixed(2)}
    </p>

    <p className="mt-2 text-gray-800">
      <strong>{hi ? "नोट्स:" : "Notes:"}</strong>{" "}
      {booking.quotationNotes || (hi ? "कोई नोट नहीं" : "No notes")}
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
        {hi ? "स्वीकार करें" : "Accept"}
      </button>

      <button
        onClick={() =>
          updateBookingStatus(booking.id, "REJECTED")
        }
        className="rounded-xl bg-red-600 px-5 py-2 text-white hover:bg-red-700"
      >
        {hi ? "अस्वीकार करें" : "Reject"}
      </button>
    </>
  )}

      {booking.status === "CONFIRMED" && (
  <button
    onClick={() =>
      updateBookingStatus(booking.id, "IN_PROGRESS")
    }
    className="rounded-xl bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
  >
    {hi ? "काम शुरू करें" : "Start Work"}
  </button>
)}
      {booking.status === "IN_PROGRESS" && (
        <button
          onClick={() => updateBookingStatus(booking.id, "COMPLETED")}
          className="rounded-xl bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
        >
          {hi ? "पूरा हुआ चिह्नित करें" : "Mark as Completed"}
        </button>
      )}
       </div>

      </div>

      ))}

      </div>
    </section>

  );
}
