"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const statuses = ["PENDING", "ACCEPTED", "IN_PROGRESS", "QUOTATION_SENT", "CONFIRMED", "COMPLETED", "REJECTED", "CANCELLED"];

export default function BookingStatusSelect({ bookingId, initialStatus }: { bookingId: string; initialStatus: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [saving, setSaving] = useState(false);

  async function update(nextStatus: string) {
    const previous = status;
    setStatus(nextStatus);
    setSaving(true);
    const response = await fetch(`/api/admin/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    setSaving(false);
    if (!response.ok) {
      setStatus(previous);
      window.alert("Could not update booking status.");
      return;
    }
    router.refresh();
  }

  return (
    <select aria-label="Booking status" value={status} disabled={saving} onChange={(event) => update(event.target.value)} className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-800 disabled:opacity-50">
      {statuses.map((item) => <option key={item} value={item}>{item.replace("_", " ")}</option>)}
    </select>
  );
}
