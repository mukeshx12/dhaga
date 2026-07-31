"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, MessageCircle, Phone, X } from "lucide-react";
import { useLanguage } from "@/app/i18n/LanguageProvider";

type Props = { tailor: { shopName: string; phone: string } | null };

export default function BookingSuccessToast({ tailor }: Props) {
  const [visible, setVisible] = useState(true);
  const { t } = useLanguage();
  const whatsappNumber = tailor?.phone.replace(/\D/g, "") ?? "";

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 7000);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed right-4 top-4 z-50 flex max-w-md items-start gap-3 rounded-2xl border border-green-200 bg-white p-4 text-green-800 shadow-xl sm:right-6 sm:top-6">
      <CheckCircle2 className="mt-0.5 shrink-0" size={22} />
      <div>
        <p className="font-semibold">{t("bookingSuccess")}</p>
        <p className="mt-1 text-sm text-gray-600">{t("bookingVisible")}</p>
        {tailor && (
          <div className="mt-3 border-t border-green-100 pt-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{t("tailorContact")}</p>
            <p className="mt-1 text-sm font-semibold text-gray-900">{tailor.shopName} · {tailor.phone}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <a href={`tel:${tailor.phone}`} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"><Phone size={15} />{t("callTailor")}</a>
              <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700"><MessageCircle size={15} />{t("chatWhatsApp")}</a>
            </div>
          </div>
        )}
      </div>
      <button type="button" onClick={() => setVisible(false)} aria-label="Dismiss message" className="text-gray-400 hover:text-gray-700">
        <X size={18} />
      </button>
    </div>
  );
}
