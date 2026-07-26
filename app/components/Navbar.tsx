"use client";

import Link from "next/link";
import { Scissors } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";


type UserData = {
  id: string;
  name: string;
  email: string;
  role: string;
  isTailor: boolean;
  tailorId: string | null;
};

export default function Navbar() {
  const { data: session } = useSession();

console.log("Session:", session);

  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    async function fetchUser() {
      if (!session) return;

      const response = await fetch("/api/me");

      if (!response.ok) return;

      const data = await response.json();

      setUser(data);
    }

    fetchUser();
  }, [session]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Scissors className="text-amber-700" size={28} />
          <h1 className="text-2xl font-bold text-amber-800">
            Dhaga
          </h1>
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-8 font-medium text-gray-700">
          <Link href="/services" className="hover:text-amber-700">
            Services
          </Link>

          <Link href="/tailors" className="hover:text-amber-700">
            Tailors
          </Link>

          <Link href="/#how-it-works"
            className="text-gray-700 transition hover:text-amber-700">
            How It Works
          </Link>

          <Link href="/#contact" className="hover:text-amber-700">
            Contact
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
  {!session ? (
    <>
      <Link
        href="/login"
        className="rounded-lg border border-amber-700 px-5 py-2 text-amber-700 hover:bg-amber-50"
      >
        Login
      </Link>

      <Link
        href="/register"
        className="rounded-lg bg-amber-700 px-5 py-2 text-white hover:bg-amber-800"
      >
        Sign Up
      </Link>
    </>
  ) : (
  <>
    {user?.isTailor ? (
      <>
        <Link
          href="/tailor-dashboard"
          className="rounded-lg bg-amber-700 px-5 py-2 text-white hover:bg-amber-800"
        >
          Tailor Dashboard
        </Link>

        <Link
          href="/my-profile"
          className="rounded-lg border border-amber-700 px-5 py-2 text-amber-700 hover:bg-amber-50"
        >
          My Profile
        </Link>
      </>
    ) : (
      <>
        <Link
          href="/dashboard"
          className="rounded-lg bg-amber-700 px-5 py-2 text-white hover:bg-amber-800"
        >
          Dashboard
        </Link>

        <Link
          href="/become-tailor"
          className="rounded-lg border border-amber-700 px-5 py-2 text-amber-700 hover:bg-amber-50"
        >
          Become a Tailor
        </Link>
      </>
    )}

    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded-lg border border-red-500 px-5 py-2 text-red-600 hover:bg-red-50"
    >
      Logout
    </button>
  </>
)}
</div>
      </div>
    </nav>
  );
}