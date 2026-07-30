"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";

type BookingStatus = "PENDING" | "ACCEPTED" | "QUOTATION_SENT" | "CONFIRMED" | "REJECTED" | "COMPLETED" | "CANCELLED";

type Booking = {
  id: string;
  bookingDate: string;
  status: BookingStatus;
  quotationPrice?: string | null;
  quotationNotes?: string | null;
  tailor: { id: string; shopName: string; city: string };
};

const statusStyles: Record<BookingStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  ACCEPTED: "bg-blue-100 text-blue-800",
  QUOTATION_SENT: "bg-purple-100 text-purple-800",
  CONFIRMED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-700",
  COMPLETED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-gray-100 text-gray-700",
};

export default function RecentOrders() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/bookings", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : []))
      .then((data) => { if (active) setBookings(data); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function respondToQuotation(bookingId: string, action: "ACCEPT" | "REJECT") {
    const response = await fetch(`/api/bookings/${bookingId}/quotation`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    const data = await response.json();
    if (!response.ok) {
      window.alert(data.message ?? "Could not update the quotation.");
      return;
    }
    setBookings((current) => current.map((booking) =>
      booking.id === bookingId
        ? { ...booking, status: action === "ACCEPT" ? "CONFIRMED" : "CANCELLED" }
        : booking
    ));
  }

  if (loading) return <p className="py-10 text-center text-gray-500">Loading your bookings...</p>;

  if (bookings.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
        <p className="font-semibold text-gray-900">No bookings yet</p>
        <Link href="/tailors" className="mt-3 inline-block text-sm font-semibold text-amber-700 hover:underline">Find a tailor</Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {bookings.slice(0, 5).map((booking) => (
        <article key={booking.id} className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <Link href={`/tailors/${booking.tailor.id}`} className="text-lg font-bold text-gray-900 hover:text-amber-700 hover:underline">
                {booking.tailor.shopName}
              </Link>
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1.5"><MapPin size={16} />{booking.tailor.city}</span>
                <span className="flex items-center gap-1.5"><CalendarDays size={16} />{new Date(booking.bookingDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
              </div>
            </div>
            <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[booking.status]}`}>
              {booking.status === "COMPLETED" ? "DELIVERED" : booking.status.replace("_", " ")}
            </span>
          </div>

          {booking.status === "QUOTATION_SENT" && booking.quotationPrice && (
            <div className="mt-5 rounded-xl border border-purple-200 bg-white p-4">
              <p className="font-semibold text-gray-900">Quotation: ₹{Number(booking.quotationPrice).toFixed(2)}</p>
              <p className="mt-1 text-sm text-gray-600">{booking.quotationNotes || "No quotation notes provided."}</p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <button type="button" onClick={() => respondToQuotation(booking.id, "ACCEPT")} className="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700">Accept quotation</button>
                <button type="button" onClick={() => respondToQuotation(booking.id, "REJECT")} className="rounded-xl border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50">Reject quotation</button>
              </div>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
