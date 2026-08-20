export function normalizeIndianPhone(value: string): string | null {
  const digits = value.replace(/\D/g, "");

  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;

  return null;
}

export function indianSubscriberDigits(value: string): string {
  const digits = value.replace(/\D/g, "");

  if (digits.length >= 12 && digits.startsWith("91")) {
    return digits.slice(2, 12);
  }

  return digits.slice(0, 10);
}
