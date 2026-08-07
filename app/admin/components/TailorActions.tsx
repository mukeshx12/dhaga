"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/i18n/LanguageProvider";

type Action = "APPROVE" | "REJECT" | "SUSPEND" | "REACTIVATE";
type Props = { tailorId: string; status: string; allowRemove?: boolean };

export default function TailorActions({ tailorId, status, allowRemove = false }: Props) {
  const router = useRouter();
  const { language } = useLanguage();
  const hi = language === "hi";
  const [loading, setLoading] = useState<string | null>(null);

  async function update(action: Action) {
    setLoading(action);
    const response = await fetch(`/api/admin/tailors/${tailorId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setLoading(null);
    if (!response.ok) return window.alert("Could not update tailor.");
    router.refresh();
  }

  async function remove() {
    if (!window.confirm("Archive this tailor? Their profile will be hidden, while booking history remains saved.")) return;
    setLoading("REMOVE");
    const response = await fetch(`/api/admin/tailors/${tailorId}`, { method: "DELETE" });
    setLoading(null);
    if (!response.ok) return window.alert("Could not remove tailor.");
    router.replace("/admin/tailors");
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-2">
      {status !== "VERIFIED" && <button disabled={Boolean(loading)} onClick={() => update("APPROVE")} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50">{loading === "APPROVE" ? (hi ? "स्वीकृत कर रहे हैं..." : "Approving...") : (hi ? "स्वीकृत करें" : "Approve")}</button>}
      {status === "PENDING" && <button disabled={Boolean(loading)} onClick={() => update("REJECT")} className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50">{hi ? "अस्वीकार करें" : "Reject"}</button>}
      {status !== "SUSPENDED" && <button disabled={Boolean(loading)} onClick={() => update("SUSPEND")} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50">{hi ? "निलंबित करें" : "Suspend"}</button>}
      {status === "SUSPENDED" && <button disabled={Boolean(loading)} onClick={() => update("REACTIVATE")} className="rounded-lg border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-50">{hi ? "फिर सक्रिय करें" : "Reactivate"}</button>}
      {allowRemove && <button disabled={Boolean(loading)} onClick={remove} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">{hi ? "संग्रहित करें" : "Archive"}</button>}
    </div>
  );
}
