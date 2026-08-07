"use client";

import { FormEvent, use, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/app/i18n/LanguageProvider";

type Props = { params: Promise<{ token: string }> };

export default function ResetPasswordPage({ params }: Props) {
  const { token } = use(params);
  const { language } = useLanguage();
  const hi = language === "hi";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Unable to reset the password.");
        return;
      }
      setSuccess(true);
    } catch {
      setError("Unable to reset the password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF7F2] px-5 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-xl sm:p-10">
        <h1 className="text-3xl font-bold text-gray-900">
          {hi ? "नया पासवर्ड बनाएं" : "Create a new password"}
        </h1>
        {success ? (
          <div className="mt-6">
            <p className="rounded-xl bg-green-50 p-4 text-green-700">
              {hi ? "पासवर्ड सफलतापूर्वक बदल दिया गया है।" : "Your password has been updated successfully."}
            </p>
            <Link href="/login" className="mt-5 block rounded-xl bg-amber-700 px-5 py-3 text-center font-semibold text-white hover:bg-amber-800">
              {hi ? "लॉग इन करें" : "Continue to login"}
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-7 space-y-4">
            <input type="password" required minLength={8} maxLength={128} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder={hi ? "नया पासवर्ड" : "New password"} className="w-full rounded-xl border border-gray-300 p-4 text-gray-900 outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-200" />
            <input type="password" required minLength={8} maxLength={128} autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder={hi ? "पासवर्ड की पुष्टि करें" : "Confirm new password"} className="w-full rounded-xl border border-gray-300 p-4 text-gray-900 outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-200" />
            {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <button disabled={loading} className="w-full rounded-xl bg-amber-700 px-5 py-3 font-semibold text-white hover:bg-amber-800 disabled:opacity-50">
              {loading ? (hi ? "बदल रहे हैं..." : "Updating...") : (hi ? "पासवर्ड बदलें" : "Update password")}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
