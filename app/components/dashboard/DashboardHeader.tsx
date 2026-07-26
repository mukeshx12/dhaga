"use client";
import { Bell, Search } from "lucide-react";
import { useSession, signOut  } from "next-auth/react";
import { useEffect, useState } from "react";


export default function DashboardHeader() {

  const { data: session } = useSession();
  const [role, setRole] = useState("Customer");
  useEffect(() => {
  async function fetchUser() {
    const response = await fetch("/api/me");

    if (!response.ok) return;

    const data = await response.json();

    setRole(data.role);
  }

  fetchUser();
}, []);
  

if (!session?.user?.email) {
  return null;
}


  return (
    <header className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome Back 👋
        </h1>

        <p className="mt-2 text-gray-500">
          Find trusted tailors, manage your bookings, and track your orders.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search tailor..."
            className="w-72 rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 outline-none focus:border-amber-700"
          />
        </div>

        <button className="rounded-xl border border-gray-300 bg-white p-3 hover:bg-gray-100 transition">
          <Bell size={20} />
        </button>

        <div className="flex items-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-700 text-white font-bold">
            M
          </div>

          <div>
            <p className="font-semibold text-gray-900">
              {session?.user?.name ?? "Guest"}
            </p>

            <p className="text-sm text-gray-500">
              {role}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}