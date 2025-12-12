import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/layout/ClientProviders";
import BottomNav from "@/components/layout/BottomNav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Finango - Discover Real Assets",
  description: "Discover, understand, and decide on real-world assets. A curated platform for thoughtful investing.",
  keywords: ["investment", "real assets", "curation", "discovery"],
  authors: [{ name: "Finango" }],
  openGraph: {
    title: "Finango - Discover Real Assets",
    description: "Discover, understand, and decide on real-world assets.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#fefefe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ClientProviders>
          <main className="min-h-screen pb-20 md:pb-0 md:pl-64">
            {children}
          </main>
          <BottomNav />
        </ClientProviders>
      </body>
    </html>
  );
}
