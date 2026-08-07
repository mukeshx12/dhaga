"use client";

import { useLanguage } from "@/app/i18n/LanguageProvider";
import type { AccountType } from "../page";

type Props = {
  accountType: AccountType;
  onBack: () => void;
  onChoosePhone: () => void;
  onChooseEmail: () => void;
};

export default function RegisterChoice({
  accountType,
  onBack,
  onChoosePhone,
  onChooseEmail,
}: Props) {
  const { language } = useLanguage();
  const hi = language === "hi";
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF7F2] px-5 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl sm:p-10">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-semibold text-amber-700 hover:underline"
        >
          ← {hi ? "वापस" : "Back"}
        </button>
        <div className="text-center">
          <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
            {hi ? "Dhaga से जुड़ें" : "Join Dhaga"}
          </span>

          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            {accountType === "tailor"
              ? (hi ? "दर्जी के रूप में जुड़ें" : "Join as a Tailor")
              : (hi ? "ग्राहक खाता बनाएं" : "Create Customer Account")}
          </h1>

          <p className="mt-3 text-gray-600">
            {hi ? "पंजीकरण का तरीका चुनें।" : "Choose how you would like to register."}
          </p>
        </div>

        <button
          type="button"
          onClick={onChoosePhone}
          className="mt-8 w-full rounded-xl bg-amber-700 py-4 font-semibold text-white transition hover:bg-amber-800"
        >
          {hi ? "फोन से जारी रखें" : "Continue with Phone"}
        </button>

        <div className="my-6 flex items-center">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="px-4 text-sm font-medium text-gray-400">
            {hi ? "या" : "OR"}
          </span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <button
          type="button"
          onClick={onChooseEmail}
          className="w-full rounded-xl border-2 border-gray-800 bg-white py-4 font-semibold text-gray-900 transition hover:bg-gray-900 hover:text-white"
        >
          {hi ? "ईमेल से जारी रखें" : "Continue with Email"}
        </button>

        <p className="mt-7 text-center text-sm text-gray-600">
          {hi ? "पहले से खाता है?" : "Already have an account?"}{" "}
          <a
            href="/login"
            className="font-semibold text-amber-700 hover:underline"
          >
            {hi ? "लॉग इन" : "Login"}
          </a>
        </p>
      </div>
    </main>
  );
}
