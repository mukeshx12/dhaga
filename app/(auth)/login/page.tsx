"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";


export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  setLoading(true);

  try {
    const result = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    if (result?.error) {
      alert("Invalid email or password");
      return;
    }

    alert("Login Successful 🎉");

    // Get logged-in user info
const meResponse = await fetch("/api/me");

if (!meResponse.ok) {
  router.replace("/dashboard");
  router.refresh();
  return;
}

const user = await meResponse.json();

// Redirect based on role
if (user.isTailor) {
  router.replace("/tailor-dashboard");
} else {
  router.replace("/dashboard");
}
    router.refresh();
  } catch (error) {
    console.error(error);
    alert("Something went wrong.");
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="min-h-screen grid lg:grid-cols-2">

      {/* LEFT SECTION */}

      <div className="hidden lg:flex flex-col justify-center bg-amber-700 p-16 text-white">

        <h1 className="text-5xl font-bold">
          Welcome Back 👋
        </h1>

        <p className="mt-6 text-lg leading-8 text-amber-100">
          Login to continue your tailoring journey with Dhaga.
          Manage your orders, upload designs, schedule home
          measurements and track every stitch.
        </p>

        <div className="mt-12 space-y-5 text-lg">

          <div>✔ Verified Tailors</div>

          <div>✔ Live Order Tracking</div>

          <div>✔ Home Measurement</div>

          <div>✔ Secure Payments</div>

          <div>✔ Saved Measurements</div>

        </div>

      </div>

      {/* RIGHT SECTION */}

      <div className="flex items-center justify-center bg-gray-50 p-8">

        <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-2xl">

          <h2 className="text-4xl font-bold text-gray-900">
            Login
          </h2>

          <p className="mt-2 text-gray-500">
            Welcome back to Dhaga.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-300 p-4 text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-200"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-300 p-4 text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-200"
            />

            <div className="flex justify-end">

              <Link
                href="#"
                className="text-sm font-medium text-amber-700 hover:underline"
              >
                Forgot Password?
              </Link>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-amber-700 py-4 text-lg font-semibold text-white transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Logging In..." : "Login"}
            </button>

          </form>

          <div className="my-8 flex items-center">

            <div className="h-px flex-1 bg-gray-300"></div>

            <span className="px-4 text-sm text-gray-400">
              OR
            </span>

            <div className="h-px flex-1 bg-gray-300"></div>

          </div>

          <p className="text-center text-gray-600">

            Don't have an account?{" "}

            <Link
              href="/register"
              className="font-semibold text-amber-700 hover:underline"
            >
              Create Account
            </Link>

          </p>

        </div>

      </div>

    </main>
  );
}