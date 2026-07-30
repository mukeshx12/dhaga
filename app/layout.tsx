import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Dhaga",
  description:
    "Dhaga helps you find verified ladies' tailors with home measurement, stitching, and delivery across India.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}