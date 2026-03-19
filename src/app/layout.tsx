import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import AuthGuard from "@/components/AuthGuard";
import Layout from "@/components/Layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GymPro Management Suite",
  description: "Advanced dashboard for gym facility management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-[#c8f65d]/30 selection:text-[#c8f65d] bg-[#0d0d0d]`}
      >
        <Providers>
          <AuthGuard>
            <Layout>{children}</Layout>
          </AuthGuard>
        </Providers>
      </body>
    </html>
  );
}
