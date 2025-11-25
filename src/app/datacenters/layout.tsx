import { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cf-status.wbfoss.org";

export const metadata: Metadata = {
  title: "Data Centers Status",
  description:
    "Monitor all 300+ Cloudflare data center locations worldwide. Real-time status for each data center including operational state, outages, degraded performance, and scheduled maintenance.",
  keywords: [
    "cloudflare data centers",
    "cloudflare locations",
    "cloudflare POPs",
    "cloudflare edge locations",
    "CDN data centers",
    "cloudflare infrastructure",
    "data center status",
    "cloudflare network locations",
  ],
  alternates: {
    canonical: `${siteUrl}/datacenters`,
  },
  openGraph: {
    title: "Cloudflare Data Centers Status | 300+ Global Locations",
    description:
      "Real-time status monitoring for all Cloudflare data center locations worldwide.",
    url: `${siteUrl}/datacenters`,
  },
  twitter: {
    title: "Cloudflare Data Centers Status",
    description:
      "Real-time status monitoring for all Cloudflare data center locations worldwide.",
  },
};

export default function DatacentersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
