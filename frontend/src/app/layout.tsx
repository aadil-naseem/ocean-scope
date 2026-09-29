import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "INCOIS Ocean 3D Explorer | OceanScope",
  description:
    "Interactive 3D ocean visualization platform integrating numerical ocean models and in-situ Argo/Glider observations for INCOIS (SIH 2026).",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="h-screen w-screen overflow-hidden bg-[#020712] text-slate-100 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
