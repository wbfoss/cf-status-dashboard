import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap", // Improve font loading performance
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#0a0e14",
};

export const metadata: Metadata = {
  title: "Cloudflare Status | NOC Dashboard",
  description: "Real-time Cloudflare infrastructure status monitoring dashboard with interactive world map",
  keywords: ["cloudflare", "status", "dashboard", "monitoring", "infrastructure", "NOC"],
  authors: [{ name: "wbfoss.org", url: "https://wbfoss.org" }],
  creator: "wbfoss.org",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CF Status",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    title: "Cloudflare Status Dashboard",
    description: "Real-time NOC-style dashboard for monitoring Cloudflare infrastructure",
    siteName: "Cloudflare Status Dashboard",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cloudflare Status Dashboard",
    description: "Real-time NOC-style dashboard for monitoring Cloudflare infrastructure",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://www.cloudflarestatus.com" />
        <link rel="dns-prefetch" href="https://www.cloudflarestatus.com" />
      </head>
      <body className={`${inter.variable} antialiased bg-[#0a0e14] min-h-screen touch-manipulation`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
