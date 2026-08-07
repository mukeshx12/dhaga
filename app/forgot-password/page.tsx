"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Mail, Smartphone } from "lucide-react";
import { useLanguage } from "@/app/i18n/LanguageProvider";

export default function ForgotPasswordPage() {
  const { language } = useLanguage();
  const hi = language === "hi";
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to send the reset link.");
        return;
      }
      setMessage(data.message);
    } catch {
      setError("Unable to send the reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2] px-5 py-10">
      <div className="mx-auto w-full max-w-2xl rounded-3xl bg-white p-7 shadow-xl sm:p-10">
        <Link href="/login" className="text-sm font-semibold text-amber-700 hover:underline">
          ← {hi ? "लॉग इन पर वापस जाएं" : "Back to login"}
        </Link>
        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          {hi ? "लॉग इन करने में परेशानी?" : "Having trouble signing in?"}
        </h1>
        <p className="mt-2 text-gray-600">
          {hi ? "अपने खाते के अनुसार विकल्प चुनें।" : "Choose the option that matches how you created your account."}
        </p>

        <section className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex gap-4">
            <Smartphone className="shrink-0 text-amber-700" />
            <div>
              <h2 className="font-bold text-gray-900">{hi ? "फोन खाता" : "Phone account"}</h2>
              <p className="mt-1 text-sm text-gray-600">
                {hi ? "फोन से पंजीकरण किया था? पासवर्ड की जरूरत नहीं—OTP से लॉग इन करें।" : "Registered by phone? You do not need a password—sign in with an OTP."}
              </p>
              <Link href="/login" className="mt-3 inline-block text-sm font-semibold text-amber-700 hover:underline">
                {hi ? "फोन OTP से लॉग इन करें →" : "Continue with phone OTP →"}
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-gray-200 p-5">
          <div className="flex gap-4">
            <Mail className="shrink-0 text-amber-700" />
            <div className="min-w-0 flex-1">
              <h2 className="font-bold text-gray-900">{hi ? "ईमेल खाता" : "Email account"}</h2>
              <p className="mt-1 text-sm text-gray-600">
                {hi ? "हम 15 मिनट के लिए मान्य सुरक्षित रीसेट लिंक भेजेंगे।" : "We’ll send a secure reset link that remains valid for 15 minutes."}
              </p>
              <form onSubmit={submit} className="mt-4 space-y-3">
                <input type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={hi ? "पंजीकृत ईमेल" : "Registered email address"} className="w-full rounded-xl border border-gray-300 p-3 text-gray-900 outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-200" />
                {message && <p className="rounded-xl bg-green-50 p-3 text-sm text-green-700">{message}</p>}
                {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
                <button disabled={loading} className="w-full rounded-xl bg-amber-700 px-5 py-3 font-semibold text-white hover:bg-amber-800 disabled:opacity-50">
                  {loading ? (hi ? "भेज रहे हैं..." : "Sending...") : (hi ? "रीसेट लिंक भेजें" : "Send reset link")}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
