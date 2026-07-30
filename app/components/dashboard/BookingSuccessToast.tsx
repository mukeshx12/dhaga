"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";

export default function BookingSuccessToast() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 7000);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed right-4 top-4 z-50 flex max-w-md items-start gap-3 rounded-2xl border border-green-200 bg-white p-4 text-green-800 shadow-xl sm:right-6 sm:top-6">
      <CheckCircle2 className="mt-0.5 shrink-0" size={22} />
      <div>
        <p className="font-semibold">Measurement request sent successfully.</p>
        <p className="mt-1 text-sm text-gray-600">The booking is now visible in your dashboard.</p>
      </div>
      <button type="button" onClick={() => setVisible(false)} aria-label="Dismiss message" className="text-gray-400 hover:text-gray-700">
        <X size={18} />
      </button>
    </div>
  );
}
