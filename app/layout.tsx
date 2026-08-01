import "./globals.css";
import Providers from "./providers";
import { cookies } from "next/headers";
import { isLanguage, languageCookieName } from "./i18n/config";

export const metadata = {
  title: "Dhaga",
  description:
    "Dhaga helps you find verified ladies' tailors with home measurement, stitching, and delivery across India.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const cookieLanguage = cookieStore.get(languageCookieName)?.value;
  const initialLanguage = isLanguage(cookieLanguage) ? cookieLanguage : "en";

  return (
    <html lang={initialLanguage}>
      <body>
        <Providers initialLanguage={initialLanguage}>{children}</Providers>
      </body>
    </html>
  );
}
