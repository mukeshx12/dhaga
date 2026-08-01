export type Language = "en" | "hi";

export const languageCookieName = "dhaga-language";

export function isLanguage(value: unknown): value is Language {
  return value === "en" || value === "hi";
}
