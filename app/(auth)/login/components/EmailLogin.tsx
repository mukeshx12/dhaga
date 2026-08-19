"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import T from "@/app/components/LocalizedText";

type EmailLoginProps = {
  onBack: () => void;
};

export default function EmailLogin({
  onBack,
}: EmailLoginProps) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    const normalizedEmail = email
      .toLowerCase()
      .trim();

    if (!normalizedEmail || !password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);

    const requestedCallback = new URLSearchParams(window.location.search).get("callbackUrl");
    const callbackUrl = requestedCallback?.startsWith("/") && !requestedCallback.startsWith("//")
      ? requestedCallback
      : "/dashboard";

    try {
      const result = await signIn(
        "email-password",
        {
          email: normalizedEmail,
          password,
          redirect: false,
          callbackUrl,
        }
      );

      console.log("Email login result:", result);

      if (!result) {
        setError(
          "No response was received from the login service."
        );
        return;
      }

      if (result.error) {
        setError(
          result.error === "CredentialsSignin"
            ? "Invalid email or password."
            : result.error
        );
        return;
      }

      if (!result.ok) {
        setError("Email login failed.");
        return;
      }

      router.replace(
        result.url || callbackUrl
      );

      router.refresh();
    } catch (error) {
      console.error(
        "Email login error:",
        error
      );

      setError(
        "Something went wrong while logging in."
      );
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
          disabled={loading}
          className="text-sm font-semibold text-amber-700 hover:underline disabled:opacity-50"
        >
          ← <T en="Back" hi="वापस" />
        </button>

        <h1 className="mt-5 text-3xl font-bold text-gray-900">
          <T en="Login with Email" hi="ईमेल से लॉग इन करें" />
        </h1>

        <p className="mt-2 text-gray-600">
          <T en="Enter your registered email address and password." hi="अपना पंजीकृत ईमेल और पासवर्ड दर्ज करें।" />
        </p>

        <form
          onSubmit={handleLogin}
          className="mt-8 space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              <T en="Email Address" hi="ईमेल पता" />
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
              }}
              placeholder="you@example.com"
              autoComplete="email"
              disabled={loading}
              required
              className="w-full rounded-xl border border-gray-300 p-4 text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-200 disabled:bg-gray-100"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label className="block text-sm font-semibold text-gray-700">
                <T en="Password" hi="पासवर्ड" />
              </label>
              <Link href="/forgot-password" className="text-sm font-semibold text-amber-700 hover:underline">
                <T en="Forgot password?" hi="पासवर्ड भूल गए?" />
              </Link>
            </div>

            <input
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={loading}
              required
              className="w-full rounded-xl border border-gray-300 p-4 text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-200 disabled:bg-gray-100"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-amber-700 py-4 font-semibold text-white transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? <T en="Logging in..." hi="लॉग इन हो रहा है..." /> : <T en="Login with Email" hi="ईमेल से लॉग इन करें" />}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-gray-600">
          <T en="Don’t have an account?" hi="खाता नहीं है?" />{" "}
          <a
            href="/register"
            className="font-semibold text-amber-700 hover:underline"
          >
            <T en="Register" hi="पंजीकरण करें" />
          </a>
        </p>
      </div>
    </main>
  );
}
