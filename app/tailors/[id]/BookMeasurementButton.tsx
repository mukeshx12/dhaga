"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/i18n/LanguageProvider";

type Props = {
  tailorId: string;
  className?: string;
};

export default function BookMeasurementButton({
  tailorId,
  className = "",
}: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const { language } = useLanguage();

  function handleClick() {
    if (!session) {
      router.push(
        `/login?callbackUrl=/tailors/${tailorId}/book`
      );
      return;
    }

    router.push(`/tailors/${tailorId}/book`);
  }

  return (
    <button
      onClick={handleClick}
      className={`inline-flex min-h-12 items-center justify-center rounded-xl bg-amber-700 px-6 py-3 font-bold text-white shadow-sm transition hover:bg-amber-800 ${className}`}
    >
      {language === "hi" ? "माप बुक करें" : "Book Measurement"}
    </button>
  );
}
