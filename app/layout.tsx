import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  UnifrakturMaguntia,
  Spectral,
} from "next/font/google";
import "./globals.css";
import CapsuleHeader from "./components/CapsuleHeader";
import ScrollIndicator from "./components/ScrollIndicator";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const unifrakturMaguntia = UnifrakturMaguntia({
  variable: "--font-gothic",
  subsets: ["latin"],
  weight: "400",
});

const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin"],
  weight: "300", // Light weight
});

export const metadata: Metadata = {
  title: "Hollow Princess",
  description:
    "Clothing of a fallen house, preserved out of duty rather than sentiment. Hollow Princess SS26 is defined by discipline, structure, and the absence of indulgence.",
  keywords: [
    "Hollow Princess",
    "SS26",
    "fashion",
    "capsule",
    "couture",
    "soulslike",
    "austere",
  ],
  authors: [{ name: "NE-S" }],
  openGraph: {
    title: "Hollow Princess",
    description:
      "Attire of a lost bloodline, maintained only to honor a dead lineage. Hollow Princess SS26 rejects ornament and embraces disciplined austerity.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${unifrakturMaguntia.variable} ${spectral.variable} antialiased`}
      >
        <CapsuleHeader />
        <ScrollIndicator />
        {children}
      </body>
    </html>
  );
}
