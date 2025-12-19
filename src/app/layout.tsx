import type { Metadata, Viewport } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/layout/ClientProviders";
import BottomNav from "@/components/layout/BottomNav";
import MainContent from "@/components/layout/MainContent";

// Display font - Bold, distinctive headings
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

// Body font - Clean, readable
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
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
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${dmSans.variable} font-sans antialiased`}>
        <ClientProviders>
          <MainContent>
            {children}
          </MainContent>
          <BottomNav />
        </ClientProviders>
      </body>
    </html>
  );
}
