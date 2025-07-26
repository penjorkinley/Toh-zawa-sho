import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import { SessionProvider } from "next-auth/react"

export const metadata: Metadata = {
  title: "Toh Zawa Sho",
  description: "Elite ordering system for your restaurant",
};

const poppins = Poppins({
  weight: ["500"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} bg-screen`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
