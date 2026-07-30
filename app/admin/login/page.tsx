"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("email-password", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    const response = await fetch("/api/me", { cache: "no-store" });
    const user = response.ok ? await response.json() : null;

    if (user?.accountRole !== "ADMIN" || user?.accountStatus !== "ACTIVE") {
      setError("This account does not have admin access.");
      setLoading(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f4ef] px-5 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl sm:p-10">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
          <ShieldCheck size={30} />
        </div>
        <h1 className="mt-6 text-3xl font-bold text-gray-900">Admin login</h1>
        <p className="mt-2 text-sm text-gray-600">Authorized Dhaga administrators only.</p>

        {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        <form onSubmit={login} className="mt-6 space-y-5">
          <label className="block text-sm font-medium text-gray-700">
            Email
            <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-gray-300 bg-white p-3 text-gray-900 outline-none focus:border-amber-700" />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Password
            <input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-gray-300 bg-white p-3 text-gray-900 outline-none focus:border-amber-700" />
          </label>
          <button disabled={loading} className="w-full rounded-xl bg-gray-900 py-3 font-semibold text-white hover:bg-black disabled:opacity-50">
            {loading ? "Checking access..." : "Login to admin"}
          </button>
        </form>

        <Link href="/" className="mt-6 block text-center text-sm font-semibold text-amber-700 hover:underline">Return to Dhaga</Link>
      </div>
    </main>
  );
}
