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

function formatIndianPhone(phone: string) {
  const cleaned = phone.replace(/\s+/g, "").trim();

  if (cleaned.startsWith("+")) {
    return cleaned;
  }

  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }

  return cleaned;
}

export default function PhoneRegister({ accountType, onBack }: Props) {
  const router = useRouter();
  const { language } = useLanguage();
  const hi = language === "hi";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [challenge, setChallenge] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    const formattedPhone = formatIndianPhone(phone);

    if (!name.trim()) {
      alert("Please enter your full name.");
      return;
    }

    if (!/^\+91\d{10}$/.test(formattedPhone)) {
      alert("Enter a valid 10-digit Indian phone number.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: formattedPhone,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || "Failed to send OTP.");
        return;
      }

      setPhone(formattedPhone);
      setChallenge(data.challenge);
      setOtpSent(true);
      alert("OTP sent successfully.");
    } catch (error) {
      console.error("Send OTP error:", error);
      alert("Unable to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const createAccount = async () => {
    const formattedPhone = formatIndianPhone(phone);

    if (!otp.trim()) {
      alert("Please enter the OTP.");
      return;
    }

    setLoading(true);

    try {
      const result = await signIn("phone-otp", {
        phone: formattedPhone,
        otp: otp.trim(),
        challenge,
        action: "register",
        name: name.trim(),
        redirect: false,
      });

      if (!result?.ok) {
        alert(result?.error || "Registration failed.");
        return;
      }

      router.replace(accountType === "tailor" ? "/become-tailor" : "/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Phone registration error:", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const changePhoneNumber = () => {
    setOtp("");
    setChallenge("");
    setOtpSent(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF7F2] px-5 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl sm:p-10">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-semibold text-amber-700 hover:underline"
        >
          ← {hi ? "वापस" : "Back"}
        </button>

        <h1 className="mt-5 text-3xl font-bold text-gray-900">
          {accountType === "tailor"
            ? (hi ? "दर्जी के रूप में पंजीकरण करें" : "Register as a Tailor")
            : (hi ? "फोन से पंजीकरण करें" : "Register with Phone")}
        </h1>

        <p className="mt-2 text-gray-600">
          {hi ? "आपका नंबर सत्यापित करने के लिए हम एक OTP भेजेंगे।" : "We will send a one-time password to verify your number."}
        </p>

        <div className="mt-8 space-y-5">
          <input
            type="text"
            placeholder={hi ? "पूरा नाम" : "Full Name"}
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={otpSent}
            className="w-full rounded-xl border border-gray-300 p-4 text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-200 disabled:bg-gray-100"
          />

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
                value={phone.replace("+91", "")}
                onChange={(event) =>
                  setPhone(event.target.value.replace(/\D/g, ""))
                }
                disabled={otpSent}
                className="w-full rounded-r-xl p-4 text-gray-900 placeholder:text-gray-400 outline-none disabled:bg-gray-100"
              />
            </div>
          </div>

          {!otpSent ? (
            <button
              type="button"
              onClick={sendOtp}
              disabled={loading}
              className="w-full rounded-xl bg-amber-700 py-4 font-semibold text-white transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (hi ? "OTP भेज रहे हैं..." : "Sending OTP...") : (hi ? "OTP भेजें" : "Send OTP")}
            </button>
          ) : (
            <>
              <div className="rounded-xl bg-green-50 p-4 text-sm text-green-800">
                {hi ? "OTP भेजा गया:" : "OTP sent to"} {phone}.
                <button
                  type="button"
                  onClick={changePhoneNumber}
                  className="ml-2 font-semibold underline"
                >
                  {hi ? "बदलें" : "Change"}
                </button>
              </div>

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder={hi ? "4–6 अंकों का OTP दर्ज करें" : "Enter 4–6 digit OTP"}
                value={otp}
                onChange={(event) =>
                  setOtp(event.target.value.replace(/\D/g, ""))
                }
                className="w-full rounded-xl border border-gray-300 p-4 text-center text-xl font-semibold tracking-[0.4em] text-gray-900 placeholder:text-base placeholder:tracking-normal placeholder:text-gray-400 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-200"
              />

              <button
                type="button"
                onClick={createAccount}
                disabled={loading || otp.length < 4}
                className="w-full rounded-xl bg-amber-700 py-4 font-semibold text-white transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (hi ? "सत्यापन हो रहा है..." : "Verifying...") : (hi ? "सत्यापित करें और खाता बनाएं" : "Verify & Create Account")}
              </button>

              <button
                type="button"
                onClick={sendOtp}
                disabled={loading}
                className="w-full text-sm font-semibold text-amber-700 hover:underline disabled:opacity-50"
              >
                {hi ? "OTP दोबारा भेजें" : "Resend OTP"}
              </button>
            </>
          )}
        </div>

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
