"use client";

import { useState } from "react";
import RegisterChoice from "./components/RegisterChoice";
import PhoneRegister from "./components/PhoneRegister";
import EmailRegister from "./components/EmailRegister";

type RegisterType = "phone" | "email" | null;

export default function RegisterPage() {
  const [registerType, setRegisterType] =
    useState<RegisterType>(null);

  if (registerType === "phone") {
    return (
      <PhoneRegister
        onBack={() => setRegisterType(null)}
      />
    );
  }

  if (registerType === "email") {
    return (
      <EmailRegister
        onBack={() => setRegisterType(null)}
      />
    );
  }

  return (
    <RegisterChoice
      onChoosePhone={() => setRegisterType("phone")}
      onChooseEmail={() => setRegisterType("email")}
    />
  );
}