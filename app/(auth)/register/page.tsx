"use client";

import { useState } from "react";
import { Scissors, UserRound } from "lucide-react";
import { useLanguage } from "@/app/i18n/LanguageProvider";
import RegisterChoice from "./components/RegisterChoice";
import PhoneRegister from "./components/PhoneRegister";
import EmailRegister from "./components/EmailRegister";

type RegisterType = "phone" | "email" | null;
export type AccountType = "customer" | "tailor";

export default function RegisterPage() {
  const { language } = useLanguage();
  const hi = language === "hi";
  const [accountType, setAccountType] =
    useState<AccountType | null>(null);
  const [registerType, setRegisterType] =
    useState<RegisterType>(null);

  const returnToAccountType = () => {
    setRegisterType(null);
    setAccountType(null);
  };

  if (registerType === "phone" && accountType) {
    return (
      <PhoneRegister
        accountType={accountType}
        onBack={() => setRegisterType(null)}
      />
    );
  }

  if (registerType === "email" && accountType) {
    return (
      <EmailRegister
        accountType={accountType}
        onBack={() => setRegisterType(null)}
      />
    );
  }

  if (accountType) {
    return (
      <RegisterChoice
        accountType={accountType}
        onBack={returnToAccountType}
        onChoosePhone={() => setRegisterType("phone")}
        onChooseEmail={() => setRegisterType("email")}
      />
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF7F2] px-5 py-10">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-7 shadow-2xl sm:p-10">
        <div className="text-center">
          <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
            {hi ? "Dhaga से जुड़ें" : "Join Dhaga"}
          </span>
          <h1 className="mt-6 text-3xl font-bold text-gray-900 sm:text-4xl">
            {hi ? "आप Dhaga का उपयोग कैसे करना चाहते हैं?" : "How would you like to use Dhaga?"}
          </h1>
          <p className="mt-3 text-gray-600">
            {hi ? "आप इसे बाद में भी बदल सकते हैं।" : "You can still become a tailor later if you start as a customer."}
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setAccountType("customer")}
            className="group rounded-2xl border-2 border-gray-200 p-6 text-left transition hover:border-amber-600 hover:bg-amber-50"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <UserRound size={25} />
            </span>
            <span className="mt-5 block text-xl font-bold text-gray-900">
              {hi ? "मुझे दर्जी चाहिए" : "I need a tailor"}
            </span>
            <span className="mt-2 block text-sm leading-6 text-gray-600">
              {hi ? "दर्जी खोजें, सेवाएं देखें और माप बुक करें।" : "Find local tailors, compare services and book measurements."}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setAccountType("tailor")}
            className="group rounded-2xl border-2 border-gray-200 p-6 text-left transition hover:border-amber-600 hover:bg-amber-50"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-700 text-white">
              <Scissors size={25} />
            </span>
            <span className="mt-5 block text-xl font-bold text-gray-900">
              {hi ? "मैं एक दर्जी हूं" : "I am a tailor"}
            </span>
            <span className="mt-2 block text-sm leading-6 text-gray-600">
              {hi ? "अपनी दुकान सूचीबद्ध करें, कीमतें जोड़ें और अनुरोध प्राप्त करें।" : "List your shop, add services and receive customer requests."}
            </span>
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-gray-600">
          {hi ? "पहले से खाता है?" : "Already have an account?"}{" "}
          <a href="/login" className="font-semibold text-amber-700 hover:underline">
            {hi ? "लॉग इन" : "Login"}
          </a>
        </p>
      </div>
    </main>
  );
}
