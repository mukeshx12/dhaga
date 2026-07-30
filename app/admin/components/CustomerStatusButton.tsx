"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CustomerStatusButton({ customerId, status }: { customerId: string; status: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const next = status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
  async function update() {
    setLoading(true);
    const response = await fetch(`/api/admin/customers/${customerId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ accountStatus: next }) });
    setLoading(false);
    if (!response.ok) return window.alert("Could not update customer.");
    router.refresh();
  }
  return <button disabled={loading} onClick={update} className={`rounded-lg px-3 py-2 text-xs font-semibold disabled:opacity-50 ${next === "SUSPENDED" ? "border border-red-200 text-red-600 hover:bg-red-50" : "border border-green-200 text-green-700 hover:bg-green-50"}`}>{loading ? "Saving..." : next === "SUSPENDED" ? "Suspend" : "Activate"}</button>;
}
