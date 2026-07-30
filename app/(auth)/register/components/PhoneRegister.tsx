"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
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

export default function PhoneRegister({ onBack }: Props) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);
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
      const response = await fetch("/api/auth/register-phone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: formattedPhone,
          otp: otp.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || "Registration failed.");
        return;
      }

      alert("Phone account created successfully.");
      router.push("/login");
    } catch (error) {
      console.error("Phone registration error:", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const changePhoneNumber = () => {
    setOtp("");
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
          ← Back
        </button>

        <h1 className="mt-5 text-3xl font-bold text-gray-900">
          Register with Phone
        </h1>

        <p className="mt-2 text-gray-600">
          We will send a one-time password to verify your number.
        </p>

        <div className="mt-8 space-y-5">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={otpSent}
            className="w-full rounded-xl border border-gray-300 p-4 text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-200 disabled:bg-gray-100"
          />

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Phone Number
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
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          ) : (
            <>
              <div className="rounded-xl bg-green-50 p-4 text-sm text-green-800">
                OTP sent to {phone}.
                <button
                  type="button"
                  onClick={changePhoneNumber}
                  className="ml-2 font-semibold underline"
                >
                  Change
                </button>
              </div>

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter 6-digit OTP"
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
                {loading ? "Verifying..." : "Verify & Create Account"}
              </button>

              <button
                type="button"
                onClick={sendOtp}
                disabled={loading}
                className="w-full text-sm font-semibold text-amber-700 hover:underline disabled:opacity-50"
              >
                Resend OTP
              </button>
            </>
          )}
        </div>

        <p className="mt-7 text-center text-sm text-gray-600">
          Already registered?{" "}
          <a
            href="/login"
            className="font-semibold text-amber-700 hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </main>
  );
}