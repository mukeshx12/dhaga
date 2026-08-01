"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/i18n/LanguageProvider";

type PhoneLoginProps = {
  onBack: () => void;
};

function formatIndianPhone(
  phoneNumber: string
) {
  const cleaned = phoneNumber
    .replace(/\D/g, "")
    .trim();

  if (
    cleaned.length === 12 &&
    cleaned.startsWith("91")
  ) {
    return `+${cleaned}`;
  }

  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }

  return phoneNumber.trim();
}

export default function PhoneLogin({
  onBack,
}: PhoneLoginProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const hi = language === "hi";

  const [phone, setPhone] =
    useState("");

  const [otp, setOtp] =
    useState("");

  const [otpSent, setOtpSent] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  /*
   * Sends OTP through your existing API.
   */
  const sendOtp = async () => {
    setError("");
    setMessage("");

    const formattedPhone =
      formatIndianPhone(phone);

    if (
      !/^\+91\d{10}$/.test(
        formattedPhone
      )
    ) {
      setError(
        "Enter a valid 10-digit phone number."
      );

      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            phone: formattedPhone,
          }),
        }
      );

      const data = await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        setError(
          data.message ||
            "Unable to send OTP."
        );

        return;
      }

      setPhone(formattedPhone);
      setOtpSent(true);

      setMessage(
        `OTP sent to ${formattedPhone}`
      );
    } catch (error) {
      console.error(
        "Send login OTP error:",
        error
      );

      setError(
        "Something went wrong while sending OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * NextAuth verifies the OTP, finds the user,
   * creates the JWT session and returns a result.
   */
  const loginWithOtp = async () => {
    setError("");
    setMessage("");

    const formattedPhone =
      formatIndianPhone(phone);

    if (!otp.trim()) {
      setError("Please enter the OTP.");
      return;
    }

    setLoading(true);

    try {
      const result = await signIn(
        "phone-otp",
        {
          phone: formattedPhone,
          otp: otp.trim(),

          /*
           * Keep redirect false so we can
           * handle errors and navigation ourselves.
           */
          redirect: false,
        }
      );

      console.log(
        "Phone login result:",
        result
      );

      if (!result) {
        setError(
          "No response was received from the login service."
        );

        return;
      }

      if (
        result.error ||
        !result.ok
      ) {
        setError(
          result.error ||
            "OTP verification failed."
        );

        return;
      }

      /*
       * NextAuth session is now created.
       */
      setMessage(
        "Login successful. Redirecting..."
      );

      /*
       * Replace /dashboard if your customer
       * dashboard uses a different route.
       */
      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      console.error(
        "Phone login error:",
        error
      );

      setError(
        "Something went wrong during login."
      );
    } finally {
      setLoading(false);
    }
  };

  const changePhone = () => {
    setOtp("");
    setOtpSent(false);
    setError("");
    setMessage("");
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
          ← {hi ? "वापस" : "Back"}
        </button>

        <h1 className="mt-5 text-3xl font-bold text-gray-900">
          {hi ? "फोन से लॉग इन करें" : "Login with Phone"}
        </h1>

        <p className="mt-2 text-gray-600">
          {hi ? "अपना पंजीकृत फोन नंबर दर्ज करें और OTP सत्यापित करें।" : "Enter your registered phone number and verify the OTP."}
        </p>

        <div className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              {hi ? "फोन नंबर" : "Phone Number"}
            </label>

            <div className="flex rounded-xl border border-gray-300 bg-white focus-within:border-amber-700 focus-within:ring-2 focus-within:ring-amber-200">
              <span className="flex items-center border-r border-gray-300 px-4 font-semibold text-gray-700">
                +91
              </span>

              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="9876543210"
                value={phone.replace(
                  "+91",
                  ""
                )}
                onChange={(event) => {
                  const value =
                    event.target.value.replace(
                      /\D/g,
                      ""
                    );

                  setPhone(value);
                  setError("");
                }}
                disabled={
                  otpSent || loading
                }
                className="w-full rounded-r-xl p-4 text-gray-900 placeholder:text-gray-400 outline-none disabled:bg-gray-100"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {message && (
            <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
              {message}
            </div>
          )}

          {!otpSent ? (
            <button
              type="button"
              onClick={sendOtp}
              disabled={loading}
              className="w-full rounded-xl bg-amber-700 py-4 font-semibold text-white transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? (hi ? "OTP भेज रहे हैं..." : "Sending OTP...")
                : (hi ? "OTP भेजें" : "Send OTP")}
            </button>
          ) : (
            <>
              <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
                {hi ? "OTP भेजा गया:" : "OTP was sent to"}{" "}
                <strong>{phone}</strong>.

                <button
                  type="button"
                  onClick={changePhone}
                  disabled={loading}
                  className="ml-2 font-semibold text-amber-700 underline disabled:opacity-50"
                >
                  {hi ? "बदलें" : "Change"}
                </button>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  {hi ? "सत्यापन कोड" : "Verification Code"}
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  placeholder={hi ? "6 अंकों का OTP दर्ज करें" : "Enter 6-digit OTP"}
                  value={otp}
                  onChange={(event) => {
                    const value =
                      event.target.value.replace(
                        /\D/g,
                        ""
                      );

                    setOtp(value);
                    setError("");
                  }}
                  disabled={loading}
                  className="w-full rounded-xl border border-gray-300 p-4 text-center text-xl font-semibold tracking-[0.4em] text-gray-900 placeholder:text-base placeholder:tracking-normal placeholder:text-gray-400 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-200 disabled:bg-gray-100"
                />
              </div>

              <button
                type="button"
                onClick={loginWithOtp}
                disabled={
                  loading ||
                  otp.length !== 6
                }
                className="w-full rounded-xl bg-amber-700 py-4 font-semibold text-white transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Verifying OTP..."
                  : "Verify OTP & Login"}
              </button>

              <button
                type="button"
                onClick={sendOtp}
                disabled={loading}
                className="w-full py-2 text-sm font-semibold text-amber-700 hover:underline disabled:opacity-50"
              >
                Resend OTP
              </button>
            </>
          )}
        </div>

        <p className="mt-7 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <a
            href="/register"
            className="font-semibold text-amber-700 hover:underline"
          >
            Register
          </a>
        </p>
      </div>
    </main>
  );
}
