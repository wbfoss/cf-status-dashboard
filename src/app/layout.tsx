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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cf-status.wbfoss.org";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Cloudflare Status Dashboard | Real-Time Global Network Monitor",
    template: "%s | Cloudflare Status Dashboard",
  },
  description:
    "Monitor Cloudflare's global infrastructure in real-time. NOC-style dashboard featuring interactive world map, 300+ data center status, incident tracking, and maintenance schedules. Open source by wbfoss.org.",
  keywords: [
    "cloudflare status",
    "cloudflare outage",
    "cloudflare down",
    "cloudflare monitoring",
    "cloudflare data centers",
    "cloudflare incidents",
    "network status",
    "NOC dashboard",
    "infrastructure monitoring",
    "CDN status",
    "cloudflare maintenance",
    "real-time status",
    "global network monitor",
  ],
  authors: [{ name: "wbfoss.org", url: "https://wbfoss.org" }],
  creator: "wbfoss.org",
  publisher: "wbfoss.org",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
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
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Cloudflare Status Dashboard | Real-Time Global Network Monitor",
    description:
      "Real-time 3D globe visualization of 330+ Cloudflare data centers. Monitor status, incidents, and maintenance schedules.",
    siteName: "Cloudflare Status Dashboard",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cloudflare Status Dashboard | Real-Time Monitor",
    description:
      "Real-time 3D globe visualization of 330+ Cloudflare data centers worldwide.",
    creator: "@wbfoss",
  },
  category: "technology",
  classification: "Network Monitoring Tool",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Cloudflare Status Dashboard",
  description:
    "Real-time NOC-style dashboard for monitoring Cloudflare's global infrastructure status with interactive world map",
  url: siteUrl,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Organization",
    name: "wbfoss.org",
    url: "https://wbfoss.org",
  },
  publisher: {
    "@type": "Organization",
    name: "wbfoss.org",
    url: "https://wbfoss.org",
  },
  isAccessibleForFree: true,
  browserRequirements: "Requires JavaScript",
  softwareVersion: "1.0.0",
  featureList: [
    "Real-time Cloudflare status monitoring",
    "Interactive 3D globe with 330+ data center locations",
    "2D world map view option",
    "Incident tracking and history",
    "Maintenance schedule notifications",
    "Mobile responsive design",
    "Auto-refresh every 30 minutes",
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} antialiased bg-[#0a0e14] min-h-screen touch-manipulation`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
