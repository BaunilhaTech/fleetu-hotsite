import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Sansita } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sansita = Sansita({
  variable: "--font-logo",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  title: {
    default: "Fleetu - Where intent becomes system",
    template: "%s | Fleetu",
  },
  description: "Engineering governance platform that transforms organizational decisions into executable systems.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning className="overflow-x-hidden dark">
      <body className={`${geistSans.variable} ${geistMono.variable} ${sansita.variable} antialiased font-sans bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
