import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Annadata Procure-Connect",
  description: "Digital procurement for a stronger Bharat.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
