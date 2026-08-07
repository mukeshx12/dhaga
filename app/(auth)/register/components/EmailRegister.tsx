"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useLanguage } from "@/app/i18n/LanguageProvider";
import type { AccountType } from "../page";

type Props = {
  accountType: AccountType;
  onBack: () => void;
};

export default function EmailRegister({ accountType, onBack }: Props) {
  const router = useRouter();
  const { language } = useLanguage();
  const hi = language === "hi";
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password
    ) {
      alert("Please complete all fields.");
      return;
    }

    if (formData.password.length < 8) {
      alert("Password must contain at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Registration failed.");
        return;
      }

      const loginResult = await signIn("email-password", {
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        redirect: false,
      });

      if (!loginResult?.ok) {
        router.push(accountType === "tailor" ? "/login?next=/become-tailor" : "/login");
        return;
      }

      router.replace(accountType === "tailor" ? "/become-tailor" : "/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Email registration error:", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF7F2] px-5 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl sm:p-10">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-semibold text-amber-700 hover:underline"
        >
          ← Back
        </button>

        <h1 className="mt-5 text-3xl font-bold text-gray-900">
          {accountType === "tailor" ? "Create Your Tailor Account" : "Register with Email"}
        </h1>

        <p className="mt-2 text-gray-600">
          {accountType === "tailor"
            ? "Create your login, then complete your tailor shop profile."
            : "Create your customer account using email and password."}
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
          <input
            type="text"
            name="name"
            placeholder={hi ? "पूरा नाम" : "Full Name"}
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-gray-300 p-4 text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-200"
          />

          <input
            type="email"
            name="email"
            placeholder={hi ? "ईमेल पता" : "Email Address"}
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-gray-300 p-4 text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-200"
          />

          <input
            type="password"
            name="password"
            placeholder={hi ? "पासवर्ड — कम से कम 8 अक्षर" : "Password — at least 8 characters"}
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
            className="w-full rounded-xl border border-gray-300 p-4 text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-200"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder={hi ? "पासवर्ड की पुष्टि करें" : "Confirm Password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength={8}
            className="w-full rounded-xl border border-gray-300 p-4 text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-200"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-amber-700 py-4 font-semibold text-white transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (hi ? "खाता बनाया जा रहा है..." : "Creating Account...") : (hi ? "ईमेल खाता बनाएं" : "Create Email Account")}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-gray-600">
          {hi ? "पहले से पंजीकृत हैं?" : "Already registered?"}{" "}
          <a
            href="/login"
            className="font-semibold text-amber-700 hover:underline"
          >
            {hi ? "लॉग इन" : "Login"}
          </a>
        </p>
      </div>
    </main>
  );
}
