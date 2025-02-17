import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Toh Zawa Sho",
  description: "Elite ordering system for your restaurant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
