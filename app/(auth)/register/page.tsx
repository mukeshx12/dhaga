"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";



export default function RegisterPage() {

  const router = useRouter();
const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

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
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    alert(
  "Welcome to Dhaga! Your customer account has been created successfully."
);

    router.push("/login");
  } catch (error) {
    console.error(error);
    alert("Something went wrong.");
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl grid md:grid-cols-2">
        <div className="hidden md:flex flex-col justify-center bg-amber-700 p-10 text-white">
          <h1 className="text-5xl font-bold leading-tight text-white">
  Join India's Trusted Tailoring Marketplace
</h1>

         <p className="mt-6 text-lg leading-8 text-amber-100">
  Create your customer account to explore verified tailors, book home
  measurements, track orders, and upgrade to a tailor account whenever
  you're ready.
</p>

          <div className="mt-10 space-y-4 text-amber-100">
            <p>✓ Verified Tailors</p>
            <p>✓ Home Measurement</p>
            <p>✓ Secure Payments</p>
            <p>✓ Live Order Tracking</p>
          </div>
        </div>

        

        <div className="p-10">
          <h2 className="text-3xl font-bold text-gray-900">
            Create Customer Account
          </h2>

          <p className="mt-2 text-gray-500">
  Create your customer account to discover skilled tailors, book home measurements, and track your orders.
</p>
<div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
  <p className="text-sm text-amber-800 leading-6">
    <span className="font-semibold">
      Want to become a tailor?
    </span>
    <br />
    Every account starts as a <strong>Customer</strong>. After logging in,
    you can click <strong>"Become a Tailor"</strong> from your dashboard to
    create your tailor profile and start receiving bookings.
  </p>
</div>

<div className="mt-4 flex items-center gap-2">
  <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
    Account Type
  </span>
  <span className="font-semibold text-gray-800">
    Customer
  </span>
  </div>
          <form
  onSubmit={handleSubmit}
  className="mt-8 space-y-5"
>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 p-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-amber-700"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 p-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-amber-700"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 p-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-amber-700"
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 p-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-amber-700"
            />

            <button
  type="submit"
  disabled={loading}
  className="w-full rounded-xl bg-amber-700 py-4 font-semibold text-white hover:bg-amber-800 disabled:opacity-50"
>
  {loading ? "Creating Customer Account..." : "Create Customer Account"}
</button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-semibold text-amber-700 hover:underline"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}