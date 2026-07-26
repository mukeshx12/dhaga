"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
  tailorId: string;
};

type User = {
  isTailor: boolean;
};

export default function BookMeasurementButton({
  tailorId,
}: Props) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const response = await fetch("/api/me");

      // Not logged in
      if (!response.ok) {
        setUser(null);
        return;
      }

      const data = await response.json();
      setUser(data);
    }

    fetchUser();
  }, []);

  // Hide button for tailors
  if (user?.isTailor) {
    return null;
  }

  return (
    <Link href={`/tailors/${tailorId}/book`}>
      <button className="mt-10 rounded-xl bg-amber-700 px-8 py-4 text-lg font-semibold text-white hover:bg-amber-800">
        Book Measurement
      </button>
    </Link>
  );
}